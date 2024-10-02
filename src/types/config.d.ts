export type DashboardConfigType = {
  navigation: {
    label?: string;
    key: string;
    items: NavigationItemConfig[];
  }[];
};

export type NavigationItemConfig = {
  /** 表示名 */
  label: string;
  /** `iconify-icon`のアイコン名 */
  icon: string;
  /** パスに使用する一意の文字列 */
  segment: string | null;
  /** Chipコンポーネントに表示する文字列 */
  chipLabel?: string;
};
