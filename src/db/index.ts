import config from '../config'
import { Database } from './db'
import Postgres from './postgres'



export default (): Database => {
  switch (config.get('dbType')) {
    case 'postgres': return new Postgres()
  }
  throw new Error('database adapted not implemented')
}