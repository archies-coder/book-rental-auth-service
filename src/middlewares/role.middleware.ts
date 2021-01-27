import { NextFunction, Response } from 'express'
import HttpException from '../exceptions/HttpException'
import { RequestWithUser } from './../interfaces/auth.interface'
import { Roles } from './../models/users.model'

export default function roleMiddleware(role: Roles) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      next(new HttpException(401, 'User not allowed'))
    }
    next()
  }
}
