import type { DashboardConfig } from '@/@types/config';

const dashboardConfig: DashboardConfig = {
  sidebar: [
    {
      items: [
        {
          label: 'ダッシュボード',
          icon: 'solar:widget-5-bold',
          href: '/',
        },
        {
          label: '監査ログ',
          icon: 'solar:list-check-bold',
          href: '/audit-log',
        },
      ],
    },
    {
      label: '機能',
      items: [
        {
          label: '入室メッセージ',
          icon: 'solar:users-group-rounded-bold',
          href: '/join-message',
        },
        {
          label: '退室メッセージ',
          icon: 'solar:users-group-rounded-bold',
          href: '/leave-message',
        },
        {
          label: 'サーバー内通報',
          icon: 'solar:flag-bold',
          href: '/report',
        },
        {
          label: 'イベントログ',
          icon: 'solar:clipboard-list-bold',
          href: '/event-log',
        },
        {
          label: 'メッセージURL展開',
          icon: 'solar:link-round-bold',
          href: '/message-expand',
        },
        {
          label: '自動認証レベル変更',
          icon: 'solar:shield-check-bold',
          href: '/auto-change-verification-level',
        },
        {
          label: '自動アナウンス公開',
          icon: 'solar:mailbox-bold',
          href: '/auto-public',
        },
        {
          label: '自動スレッド作成',
          icon: 'solar:hashtag-chat-bold',
          href: '/auto-create-thread',
          badge: 'New',
        },
        {
          label: 'AutoMod Plus',
          icon: 'solar:sledgehammer-bold',
          href: '/automod-plus',
        },
      ],
    },
  ],
};

export default dashboardConfig;
