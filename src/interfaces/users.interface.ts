import { Roles } from './../models/users.model'
export interface User {
  _id: string
  email: string
  password: string
  role: Roles
}
