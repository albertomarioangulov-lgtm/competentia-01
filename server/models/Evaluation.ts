import { Schema, model } from 'mongoose';

const habilidadSchema = new Schema({
  habilidad: { type: String, required: true },
  puntaje: { type: Number, default: null },
}, { _id: false })

const desempenoSchema = new Schema({
  criterio: { type: String, required: true },
  puntaje: { type: Number, default: null },
}, { _id: false })

const evaluationSchema = new Schema({
  empleadoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  evaluadorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  cargo: String,
  habilidades: {
    metahabilidades: [habilidadSchema],
    betahabilidades: [habilidadSchema],
    habilidadesOperativas: [habilidadSchema],
    habilidadesInterpersonales: [habilidadSchema],
    habilidadesDirectivas: [habilidadSchema],
  },
  desempeno: [desempenoSchema],
  recomendaciones: String,
}, { timestamps: true })

export const Evaluation = model('Evaluation', evaluationSchema)