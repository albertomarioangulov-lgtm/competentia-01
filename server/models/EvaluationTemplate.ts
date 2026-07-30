import { Schema, model } from 'mongoose';

const itemSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const sectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  weight: { type: Number, required: true, min: 0, max: 100 },
  items: [itemSchema],
}, { _id: false });

const evaluationTemplateSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  positionId: { type: Schema.Types.ObjectId, ref: 'Position', required: true },
  sections: [sectionSchema],
  active: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

// Ensure only one active template per position
evaluationTemplateSchema.index({ positionId: 1, active: 1 }, { unique: true, partialFilterExpression: { active: true } });

export const EvaluationTemplate = model('EvaluationTemplate', evaluationTemplateSchema);