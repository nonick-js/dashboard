export enum DiscordEndPoints {
	API = "https://discord.com/api/v10",
	CDN = "https://cdn.discordapp.com",
	OAuth2 = "https://discord.com/oauth2",
}

/** 特定の権限が含まれていれば`true`を返す */
export function hasPermission(permissions: string, permission: bigint) {
	return (
		(Number.parseInt(permissions) & Number(permission)) === Number(permission)
	);
}
