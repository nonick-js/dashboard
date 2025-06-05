import 'server-only';

import { DEFAULT_SERVER_ERROR_MESSAGE, createSafeActionClient } from 'next-safe-action';
import pc from 'picocolors';
import { type ZodString, z } from 'zod';
import { authMiddleware, guildPermissionMiddleware, logMiddleware } from './middleware';

export class ActionClientError extends Error {}

export const guildActionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(pc.red('Server Action Error:'), e.message);
    if (e instanceof ActionClientError) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
})
  .bindArgsSchemas<[guildId: ZodString]>([z.string()])
  .use(logMiddleware)
  .use(authMiddleware)
  .use(guildPermissionMiddleware);

export const userActionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(pc.red('Server Action Error:'), e.message);
    if (e instanceof ActionClientError) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
})
  .bindArgsSchemas<[guildId: ZodString]>([z.string()])
  .use(logMiddleware)
  .use(authMiddleware);
