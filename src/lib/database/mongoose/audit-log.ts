import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import type AuditLogZodSchema from '../zod/audit-log';

const { Schema, model, models } = mongoose;

const AuditLogSchema = new Schema<z.infer<typeof AuditLogZodSchema>>({
  guildId: {
    required: true,
    type: Schema.Types.String,
  },
  after: Schema.Types.Mixed,
  authorId: Schema.Types.String,
  before: Schema.Types.Mixed,
  reason: Schema.Types.String,
  createAt: { type: Schema.Types.Date, default: Date.now },
});

export default models?.auditLog
  ? (models.auditLog as Model<typeof AuditLogZodSchema>)
  : model('auditLog', AuditLogSchema);
