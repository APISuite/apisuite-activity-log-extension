import { Pool } from 'pg'
import log from '../log'
import config from '../config'
import { Database, LogEntry } from './types'

export default class Postgres implements Database {
  private pool: Pool

  constructor() {
    this.pool = new Pool ({
      max: 20,
      connectionString: config.get('dbURI'),
      idleTimeoutMillis: 30000
    })
  }

  async writeEntry(entry: LogEntry): Promise<void> {
    try {
      const client = await this.pool.connect()

      const sql = `INSERT INTO logs (user_id, app_id, organization_id, log, timestamp) 
        VALUES ($1, $2, $3, $4, $5)`
      await client.query(sql, [
        entry.userID,
        entry.appID,
        entry.organizationID,
        entry.log,
        entry.timestamp,
      ])

      client.release()
    } catch (error) {
      log.error(error)
    }
  }

  // @ts-ignore
  async getEntries(): Promise<LogEntry[]> {
    try {
      const client = await this.pool.connect()

      const sql = `SELECT * FROM logs;`
      const { rows } = await client.query(sql)
      client.release()

      return rows
    } catch (error) {
      log.error(error)
    }
  }
}
