import { GuildVerificationLevel } from 'discord-api-types/v10';
import { type Model, Schema, model, models } from 'mongoose';
import type { z } from 'zod';
import type { GuildZodSchema } from '../zod';
import { guildId } from './lib/util';

const guildSchema = new Schema<z.infer<typeof GuildZodSchema>>({
  guildId,
  beforeVerifyLevel: {
    type: Schema.Types.Number,
    enum: GuildVerificationLevel,
  },
  createAt: { type: Schema.Types.Date, default: Date.now },
});

export default models?.guild
  ? (models.guild as Model<z.infer<typeof GuildZodSchema>>)
  : model('guild', guildSchema);
