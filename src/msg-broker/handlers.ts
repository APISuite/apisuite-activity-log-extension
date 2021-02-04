import DB from '../db'
import { Database } from '../db/types'

const db: Database = DB()

const handleLogEntry = async (event: string, msg: any): Promise<void> => {
  if (!msg.timestamp) return

  await db.writeEntry({
    type: event,
    userID: msg.user_id,
    appID: msg.app_id,
    organizationID: msg.organization_id,
    log: msg.log,
    timestamp: msg.timestamp,
  })
}

export default { handleLogEntry }