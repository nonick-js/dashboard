import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { guildId, messageOptionSchema } from './lib/util';
import { BaseConfigSchema } from '../zod/lib/util';
import { JoinMessageZodSchema } from '../zod';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(JoinMessageZodSchema);

const joinMessageSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  channel: Schema.Types.String,
  enabled: Schema.Types.Boolean,
  ignoreBot: Schema.Types.Boolean,
  message: messageOptionSchema,
});

export default models?.joinMessageConfig
  ? (models.joinMessageConfig as Model<z.infer<typeof zodSchema>>)
  : model('joinMessageConfig', joinMessageSchema);
