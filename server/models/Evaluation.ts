import { Schema, model } from 'mongoose';

const habilidadSchema = new Schema({
  habilidad: { type: String, required: true },
  puntaje: { type: Number, default: null },
}, { _id: false })

const desempenoSchema = new Schema({
  criterio: { type: String, required: true },
  puntaje: { type: Number, default: null },
}, { _id: false })

const dynamicScoreItemSchema = new Schema({
  itemId: { type: String, required: true },
  itemDescription: { type: String, default: '' },
  score: { type: Number, default: null },
}, { _id: false })

const dynamicScoreSectionSchema = new Schema({
  sectionId: { type: String, required: true },
  sectionTitle: { type: String, default: '' },
  sectionWeight: { type: Number, default: 0 },
  items: [dynamicScoreItemSchema],
}, { _id: false })

const evaluationSchema = new Schema({
  empleadoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  evaluadorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  cargo: String,
  templateId: { type: Schema.Types.ObjectId, ref: 'EvaluationTemplate', default: null },
  positionId: { type: Schema.Types.ObjectId, ref: 'Position', default: null },
  habilidades: {
    metahabilidades: [habilidadSchema],
    betahabilidades: [habilidadSchema],
    habilidadesOperativas: [habilidadSchema],
    habilidadesInterpersonales: [habilidadSchema],
    habilidadesDirectivas: [habilidadSchema],
  },
  desempeno: [desempenoSchema],
  dynamicScores: [dynamicScoreSectionSchema],
  recomendaciones: String,
}, { timestamps: true })

export const Evaluation = model('Evaluation', evaluationSchema)