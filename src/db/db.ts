export interface LogEntry {
  userID?: string
  appID?: string
  organizationID?: string
  log?: string
  timestamp: string
}

export abstract class Database {
  abstract writeEntry(entry: LogEntry): Promise<void>
}
