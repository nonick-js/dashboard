import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { guildId, messageOptionSchema } from './lib/util';
import { BaseConfigSchema } from '../zod/lib/util';
import { LeaveMessageZodSchema } from '../zod';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(LeaveMessageZodSchema);

const leaveMessageSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  channel: Schema.Types.String,
  enabled: Schema.Types.Boolean,
  ignoreBot: Schema.Types.Boolean,
  message: messageOptionSchema,
});

export default models?.leaveMessageConfig
  ? (models.leaveMessageConfig as Model<z.infer<typeof zodSchema>>)
  : model('leaveMessageConfig', leaveMessageSchema);
