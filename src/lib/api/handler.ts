import 'server-only';

import { eq } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { type ZodSchema, z } from 'zod';
import { auth } from '../auth';
import { auditLog, type targetNameEnumSchema } from '../database/src/schema/audit-log';
import { snowflake } from '../database/src/utils/zod/discord';
import { db } from '../drizzle';
import rateLimit from '../rate-limit';
import { hasDashboardAccessPermission } from './utils';

type AuditLogMetadata = {
  targetName: z.infer<typeof targetNameEnumSchema>;
};

const limiter = rateLimit({
  interval: 10 * 1000, // 10秒
});

/**
 * 有効なセッションを所持しているか検証するラップ関数。
 * @param handler 検証済みのセッションを引数として受け取り、Promiseを返すハンドラー関数。
 */
export async function withAuth<T>(
  handler: (session: Session) => Promise<T>,
): Promise<T | NextResponse> {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await limiter.check(5, session.user.id);
    return handler(session);
  } catch {
    return NextResponse.json({ message: 'Too Many Requests' }, { status: 429 });
  }
}

/**
 * 有効なセッション、及び`guildId`に対応したダッシュボードへのアクセス権限を所持しているか検証するラップ関数。
 * @param handler 検証済みのセッションを引数として受け取り、Promiseを返すハンドラー関数。
 */
export async function withGuildAccess<T>(
  guildId: string,
  handler: (session: Session, guildId: string) => Promise<T>,
) {
  return withAuth(async (session) => {
    if (!snowflake.safeParse(guildId).success) {
      return NextResponse.json({ message: 'Invalid Guild ID' }, { status: 400 });
    }

    const hasPermission = await hasDashboardAccessPermission(guildId, session);
    if (!hasPermission) {
      return NextResponse.json({ message: 'Missing Permission' }, { status: 403 });
    }

    return handler(session, guildId);
  });
}

/**
 * {@link GuildDatabaseAdapter} を作成する関数
 * @param options {@link CreateGuildDatabaseAdapterOptions}
 */
export function createGuildDatabaseAdapter<
  FormSchema extends ZodSchema,
  DbSchema extends ZodSchema,
>(
  options: CreateGuildDatabaseAdapterOptions<FormSchema, DbSchema>,
): GuildDatabaseAdapter<FormSchema, DbSchema> {
  return {
    dbSchema: options.dbSchema,
    formSchema: options.formSchema,
    metadata: options.metadata,
    fetchOldValue: async (guildId) => {
      const res = await db.select().from(options.table).where(eq(options.guildIdColumn, guildId));
      return res[0] ?? null;
    },
    upsertNewValue: async (guildId, data) => {
      const res = await db
        .insert(options.table)
        .values({ guildId, ...data })
        .onConflictDoUpdate({ target: options.guildIdColumn, set: data })
        .returning();
      return res[0];
    },
  };
}

type GuildDatabaseAdapter<FormSchema extends ZodSchema, DbSchema extends ZodSchema> = {
  dbSchema: DbSchema;
  formSchema: FormSchema;
  metadata: AuditLogMetadata;
  fetchOldValue: (guildId: string) => Promise<z.infer<DbSchema> | null>;
  upsertNewValue: (guildId: string, data: z.infer<FormSchema>) => Promise<z.infer<DbSchema>>;
};

type CreateGuildDatabaseAdapterOptions<FormSchema extends ZodSchema, DbSchema extends ZodSchema> = {
  table: PgTable;
  guildIdColumn: PgColumn;
  metadata: AuditLogMetadata;
  dbSchema: DbSchema;
  formSchema: FormSchema;
};

/**
 * サーバーの設定を更新する
 * @param req {@link https://developer.mozilla.org/ja/docs/Web/API/Request}
 * @param params {@link https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes}
 * @param options {@link GuildDatabaseAdapter}
 */
export async function updateGuildSetting<FormSchema extends ZodSchema, DbSchema extends ZodSchema>(
  req: Request,
  guildId: string,
  options: GuildDatabaseAdapter<FormSchema, DbSchema>,
) {
  return withGuildAccess(guildId, async (session, guildId) => {
    try {
      const body = await req.json().catch(() => null);
      const parsedBody = options.formSchema.parse(body);

      const oldValue = await options.fetchOldValue(guildId);
      const newValue = await options.upsertNewValue(guildId, parsedBody);

      // 監査ログに変更履歴を追加
      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: session.user.id,
        targetName: options.metadata.targetName,
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });

      return NextResponse.json({ message: 'Update Successful!' }, { status: 200 });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return NextResponse.json(
          { message: 'Invalid Form Body', zodError: e.errors },
          { status: 400 },
        );
      }
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  });
}
