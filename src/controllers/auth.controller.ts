import { LoginDto } from './../dtos/users.dto'
import { RequestWithUser } from './../interfaces/auth.interface'
import { User } from './../interfaces/users.interface'
import { NextFunction, Request, Response } from 'express'
import { CreateUserDto } from '../dtos/users.dto'
import AuthService from '../services/auth.service'
import axios from 'axios'

class AuthController {
  public authService = new AuthService()

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body

    try {
      const { role, ...bodyForBookService } = userData
      const { data } = await axios.post(
        'http://localhost:5000/signup',
        bodyForBookService,
      )
      debugger
      userData.userId = data.data.userId
      const signUpUserData: User = await this.authService.signup(userData)
      res.status(201).json({ data: signUpUserData, message: 'signup' })
    } catch (error) {
      next(error)
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: LoginDto = req.body
    try {
      const { cookie, findUser } = await this.authService.login(userData)
      res.setHeader('Set-Cookie', [cookie])

      res.status(200).json({ data: findUser, message: 'login' })
    } catch (error) {
      next(error)
    }
  }

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const userData: User = req.user

    try {
      const logOutUserData: User = await this.authService.logout(userData)
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
      res.status(200).json({ data: logOutUserData, message: 'logout' })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController