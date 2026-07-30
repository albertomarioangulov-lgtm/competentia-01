import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Opcional para usuarios de Google
  name: String,
  avatar: { type: Schema.Types.Mixed, default: null },
  googleId: String,
  roles: { type: [String] },
  bossId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

userSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export const User = model('User', userSchema);