import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { guildId } from './lib/util';
import { BaseConfigSchema } from '../zod/lib/util';
import { ReportZodSchema } from '../zod';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(ReportZodSchema);

const reportSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  channel: Schema.Types.String,
  includeModerator: Schema.Types.Boolean,
  progressButton: Schema.Types.Boolean,
  mention: {
    enabled: Schema.Types.Boolean,
    roles: [Schema.Types.String],
  },
});

export default models?.reportConfig
  ? (models.reportConfig as Model<z.infer<typeof zodSchema>>)
  : model('reportConfig', reportSchema);
