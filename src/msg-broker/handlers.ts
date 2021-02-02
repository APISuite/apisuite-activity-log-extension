import log from '../log'

const handleLogEntry = (msg: object): void => {
  log.debug('GOT EVENT')
  log.debug(msg)
  return
}

export default { handleLogEntry }