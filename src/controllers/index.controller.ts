import { NextFunction, Request, Response } from 'express'

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    debugger
    try {
      res.sendStatus(200).json({ message: 'OK' })
    } catch (error) {
      next(error)
    }
  }
}

export default IndexController
