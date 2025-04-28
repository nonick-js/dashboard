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
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { APIUser } from 'discord-api-types/v10';
import { useEffect, useMemo, useState } from 'react';
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const pages = Math.ceil(auditLogs.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return auditLogs.slice(start, end);
  }, [page, auditLogs, rowsPerPage]);

  const renderCell = (entry: z.infer<typeof auditLogSelectSchema.db>, columnKey: React.Key) => {
    switch (columnKey) {
      case 'user':
        return <TableRowUser authors={authors} authorId={entry.authorId} />;
      case 'content':
        return <TableRowContent actionType={entry.actionType} targetName={entry.targetName} />;
      case 'time':
        return <TableRowTime time={entry.createdAt} />;
      default:
        return <span className='text-default-500'>unknown</span>;
    }
  };

  return (
    <div className='flex flex-col gap-6 pb-6'>
      <Table aria-label='auditlog table'>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent='表示する監査ログがありません' items={items}>
          {(entry) => (
            <TableRow key={entry.id}>
              {(columnKey) => <TableCell>{renderCell(entry, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex w-full justify-between items-center gap-6'>
        <div className='flex gap-3 items-center'>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='flat'
                endContent={<Icon icon='solar:alt-arrow-down-outline' className='text-base' />}
              >
                {rowsPerPage}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label='Single selection example'
              selectedKeys={[String(rowsPerPage)]}
              onSelectionChange={(keys) => {
                setRowsPerPage(Number(Array.from(keys)[0]));
                setPage(1);
              }}
              selectionMode='single'
              variant='flat'
            >
              <DropdownItem key='20'>20</DropdownItem>
              <DropdownItem key='50'>50</DropdownItem>
              <DropdownItem key='100'>100</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <p className='text-default-500 text-sm'>件表示</p>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          isDisabled={pages < 1}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}

function TableRowUser({ authors, authorId }: { authors: APIUser[]; authorId: string }) {
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

function TableRowContent({
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

function TableRowTime({ time }: { time: Date }) {
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
