import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { AutoCreateThreadZodSchema } from '../zod';
import { BaseConfigSchema } from '../zod/lib/util';
import { guildId } from './lib/util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(AutoCreateThreadZodSchema);

const autoCreateThreadSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  channels: [Schema.Types.String],
  enabled: Schema.Types.Boolean,
});

export default models?.autoCreateThreadConfig
  ? (models.autoCreateThreadConfig as Model<z.infer<typeof zodSchema>>)
  : model('autoCreateThreadConfig', autoCreateThreadSchema);
