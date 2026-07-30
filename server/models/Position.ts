import { Schema, model } from 'mongoose';

const positionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Position = model('Position', positionSchema);