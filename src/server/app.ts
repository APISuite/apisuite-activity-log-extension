import express from 'express'
import morgan from 'morgan'
import LogsRouter from './logs.routes'
import { Database } from '../db/types'
import DB from '../db'

export default class App {
  public app: express.Application
  private readonly db: Database

  constructor() {
    this.app = express()
    this.db = DB()
    this.setupMiddleware(this.app)
    this.setupRoutes(this.app)
  }

  private setupMiddleware(app: express.Application) {
    app.use(express.json())

    morgan.token('body', (req: express.Request, res: express.Response) => JSON.stringify(req.body))
    app.use(morgan(':method :url :status - :body'))
  }

  private setupRoutes(app: express.Application) {
    const logsRouter = new LogsRouter(this.db)

    app.use('/logs', logsRouter.getRoutes())

    app.use('/', (req: express.Request, res: express.Response) => {
      res.send({
        version: 'v1.0.0',
      })
    })
  }
}
