import { Roles } from './models/users.model'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Response, Request } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import compression from 'compression'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { connect, set } from 'mongoose'
import { dbConnection } from './database'
import Routes from './interfaces/routes.interface'
import errorMiddleware from './middlewares/error.middleware'
import { logger, stream } from './utils/logger'
import proxy from 'express-http-proxy'
import AuthRoute from './routes/auth.route'
import IndexRoute from './routes/index.route'
import authMiddleware from './middlewares/auth.middleware'
import roleMiddleware from './middlewares/role.middleware'

class App {
  public app: express.Application
  public port: string | number
  public env: string

  public static bookProxy = proxy('http://localhost:5000')

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.env = process.env.NODE_ENV || 'development'

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`)
    })
  }

  public getServer() {
    return this.app
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true)
    }

    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        logger.info('🟢 The database is connected.')
      })
      .catch((error: Error) => {
        logger.error(`🔴 Unable to connect to the database: ${error}.`)
      })
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }))
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }))
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }))
      this.app.use(cors({ origin: true, credentials: true }))
    }

    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    // this.app.use(this.bookProxy)
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
  }

  private initializeRoutes(routes: Routes[]) {
    this.app.use('/api/auth', new AuthRoute().router)

    routes.forEach(route => {
      this.app.use(
        '/',
        // authMiddleware,
        // roleMiddleware(Roles.ADMIN),
        // (req: Request, res: Response, next: NextFunction) => {
        //   App.bookProxy(req, res, next)
        // },
        route.router,
      )
    })
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    }

    const specs = swaggerJSDoc(options)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
}

export default App
