'use client';

import { Icon } from '@/components/icon';
import type {
  actionTypeEnumSchema,
  auditLogSelectSchema,
  targetNameEnumSchema,
} from '@/lib/database/src/schema/audit-log';
import { DiscordEndPoints } from '@/lib/discord/constants';
import {
  Avatar,
  Code,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { APIUser } from 'discord-api-types/v10';
import { useEffect, useState } from 'react';
import type { z } from 'zod';

const columns = [
  {
    key: 'user',
    label: 'ユーザー',
  },
  {
    key: 'content',
    label: '内容',
  },
  {
    key: 'time',
    label: '時間',
  },
];

const translateTargetName = (targetName: z.infer<typeof targetNameEnumSchema>): string => {
  const targetMap: Record<z.infer<typeof targetNameEnumSchema>, string> = {
    join_message: '入室メッセージ',
    leave_message: '退室メッセージ',
    report: 'サーバー内通報',
    timeout_log: 'タイムアウトログ',
    kick_log: 'キックログ',
    ban_log: 'BANログ',
    voice_log: 'ボイスチャンネルログ',
    message_delete_log: 'メッセージ削除ログ',
    message_edit_log: 'メッセージ編集ログ',
    message_expand: 'メッセージURL展開',
    auto_change_verify_level: '自動認証レベル変更',
    auto_public: '自動アナウンス公開',
    auto_create_thread: '自動スレッド作成',
    auto_mod: 'AutoMod Plus',
    guild: 'サーバー',
  };

  return targetMap[targetName] || targetName;
};

export function AuditLogTable({
  auditLogs,
  authors,
}: { auditLogs: z.infer<typeof auditLogSelectSchema.db>[]; authors: APIUser[] }) {
  const renderCell = (entry: z.infer<typeof auditLogSelectSchema.db>, columnKey: React.Key) => {
    switch (columnKey) {
      case 'user':
        return <AuditLogUser authors={authors} authorId={entry.authorId} />;
      case 'content':
        return <AuditLogContent actionType={entry.actionType} targetName={entry.targetName} />;
      case 'time':
        return <AuditLogTime time={entry.createdAt} />;
      default:
        return <span className='text-default-500'>unknown</span>;
    }
  };

  return (
    <Table aria-label='auditlog table' className='pb-6'>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent='表示する監査ログがありません' items={auditLogs}>
        {(entry) => (
          <TableRow key={entry.id}>
            {(columnKey) => <TableCell>{renderCell(entry, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function AuditLogUser({ authors, authorId }: { authors: APIUser[]; authorId: string }) {
  const user = authors.find((author) => author.id === authorId);

  return (
    <div className='flex items-center gap-4'>
      <Avatar
        size='sm'
        src={`${DiscordEndPoints.CDN}/avatars/${user?.id}/${user?.avatar}.webp`}
        name={user?.username}
      />
      <div className='max-sm:hidden'>
        <p className='text-sm'>{user?.username || 'Unknown User'}</p>
      </div>
    </div>
  );
}

function AuditLogContent({
  actionType,
  targetName,
}: {
  actionType: z.infer<typeof actionTypeEnumSchema>;
  targetName: z.infer<typeof targetNameEnumSchema>;
}) {
  if (actionType === 'update_guild_setting') {
    return (
      <div className='flex gap-3 items-center text-default-500'>
        <Icon icon='solar:settings-outline' className='text-xl text-warning' />
        <p>
          <span className='text-foreground'>{translateTargetName(targetName)} </span>
          に変更を加えました
        </p>
      </div>
    );
  }
  return <span className='text-default-500'>不明なアクション</span>;
}

function AuditLogTime({ time }: { time: Date }) {
  const [formattedTime, setFormattedTime] = useState<string | null>(null);

  useEffect(() => {
    const formatTime = (date: Date) => {
      const yy = date.getFullYear().toString();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${yy}/${mm}/${dd} ${hh}:${min}`;
    };

    setFormattedTime(formatTime(time));
  }, [time]);

  return <p className='text-default-500'>{formattedTime}</p>;
}
