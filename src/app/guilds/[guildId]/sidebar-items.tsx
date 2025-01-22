import { Chip } from '@heroui/chip';
import type { SidebarItem } from './sidebar-navigation';

export const sectionItems: SidebarItem[] = [
  {
    key: 'overview',
    title: 'ホーム',
    items: [
      {
        key: 'home',
        href: (guildId) => `/guilds/${guildId}`,
        icon: 'solar:widget-2-outline',
        title: 'ダッシュボード',
      },
      {
        key: 'audit-log',
        href: (guildId) => `/guilds/${guildId}/audit-log`,
        icon: 'solar:sort-by-time-outline',
        title: '監査ログ',
        endContent: (
          <Chip size='sm' color='primary' variant='flat'>
            Coming soon
          </Chip>
        ),
      },
    ],
  },
  {
    key: 'features',
    title: '機能',
    items: [
      {
        key: 'join-message',
        href: (guildId) => `/guilds/${guildId}/join-message`,
        icon: 'solar:user-plus-rounded-outline',
        title: '入室メッセージ',
      },
      {
        key: 'leave-message',
        href: (guildId) => `/guilds/${guildId}/leave-message`,
        icon: 'solar:user-minus-rounded-outline',
        title: '退室メッセージ',
      },
      {
        key: 'report',
        href: (guildId) => `/guilds/${guildId}/report`,
        icon: 'solar:flag-outline',
        title: 'サーバー内通報',
      },
      {
        key: 'event-log',
        href: (guildId) => `/guilds/${guildId}/event-log`,
        icon: 'solar:clipboard-list-outline',
        title: 'イベントログ',
      },
      {
        key: 'message-expand',
        href: (guildId) => `/guilds/${guildId}/message-expand`,
        icon: 'solar:link-round-outline',
        title: 'メッセージURL展開',
      },
      {
        key: 'auto-change-verification-level',
        href: (guildId) => `/guilds/${guildId}/auto-change-verification-level`,
        icon: 'solar:shield-check-outline',
        title: '自動認証レベル変更',
      },
      {
        key: 'auto-public',
        href: (guildId) => `/guilds/${guildId}/auto-public`,
        icon: 'solar:mailbox-outline',
        title: '自動アナウンス公開',
      },
      {
        key: 'auto-create-thread',
        href: (guildId) => `/guilds/${guildId}/auto-create-thread`,
        icon: 'solar:hashtag-chat-outline',
        title: '自動スレッド作成',
      },
      {
        key: 'automod-plus',
        href: (guildId) => `/guilds/${guildId}/automod-plus`,
        icon: 'solar:sledgehammer-outline',
        title: 'AutoMod Plus',
      },
    ],
  },
];
