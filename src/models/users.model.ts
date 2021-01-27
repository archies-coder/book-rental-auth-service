import { model, Schema, Document } from 'mongoose'
import { User } from '../interfaces/users.interface'

export enum Roles {
  ADMIN = 'admin',
  BUYER = 'buyer',
  OWNER = 'owner',
  AUTHOR = 'author',
  BASIC = 'basic',
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Roles,
    default: Roles.BASIC,
  },
  userId: {
    type: Number,
    unique: true,
  },
})

const userModel = model<User & Document>('User', userSchema)

export default userModel
