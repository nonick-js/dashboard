﻿import { auth } from '@/auth';
import chalk from 'chalk';
import { DEFAULT_SERVER_ERROR_MESSAGE, createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { Snowflake } from './database/zod/lib/discord';
import { hasAccessDashboardPermission } from './discord';
import { wait } from './utils';

export class ActionClientError extends Error {}

export enum ActionType {
  updateSetting = 'update-setting',
}

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(chalk.red('Action error:'), e.message);
    if (e instanceof ActionClientError) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema: () => {
    return z.object({ actionType: z.nativeEnum(ActionType) });
  },
}).use(async ({ next, metadata, clientInput }) => {
  console.groupCollapsed(chalk.bold('🚀 Server Action Log'));

  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();

  const session = await auth();

  console.log(chalk.bold.underline.green('Result:'), result);
  console.log(chalk.bold.underline.green('Client Input:'), clientInput);
  console.log(chalk.bold.underline.green('Metadata:'), metadata);
  console.log(chalk.bold.underline.green('Session UserID:'), session?.user.id);
  console.log(chalk.bold.underline.yellow(`Action time: ${Math.floor(endTime - startTime)} ms`));
  console.groupEnd();

  return result;
});

export const dashboardActionClient = actionClient
  .schema(z.object({ guildId: Snowflake }))
  .use(async ({ next, clientInput }) => {
    await wait(1000); // Cooldown

    const res = await hasAccessDashboardPermission((clientInput as { guildId: string }).guildId);
    if (!res) throw new ActionClientError('Missing Permission');

    return next();
  });
