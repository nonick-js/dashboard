export type href = `${'http' | 'https'}:/${string}` | `/${string}`;

export type MetadataConfig = {
  name: string;
  description: string;
  url: URL;
  twitter: {
    site: string;
    creator: string;
  };
};

export type DashboardConfig = {
  sidebar: {
    label?: string;
    items: {
      label: string;
      icon: string;
      href: href;
      badge?: string;
    }[];
  }[];
};
