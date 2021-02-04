import express from 'express'
import { Database, LogEntry } from '../db/types'

class LogsRouter {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  public getRoutes(): express.Router {
    const router = express.Router()
    router.get('/', this.getLogs)
    return router
  }

  private getLogs = async (req: express.Request, res: express.Response) => {
    const logs: LogEntry[] = await this.db.getEntries()
    res.send(logs)
  }
}

export default LogsRouter