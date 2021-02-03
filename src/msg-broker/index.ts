import amqp from 'amqp-connection-manager'
import amqplib from 'amqplib'
import config from '../config'
import log from '../log'
import handlers from './handlers'

enum routingKeys {
  APP_CREATED = 'api.app.created',
  APP_UPDATED = 'api.app.updated',
  APP_DELETED = 'api.app.deleted',
  APP_REQUESTED = 'api.app.requested',
  ORG_CREATED = 'api.organization.created',
  ORG_UPDATED = 'api.organization.updated',
  ORG_USER_ROLE = 'api.organization.userRoleChanged',
  ORG_USER_INVITED = 'api.organization.userInvited',
  USER_PASSWORD = 'api.user.password',
  USER_DELETED = 'api.user.deleted',
}

const onMessage = (data: amqplib.ConsumeMessage | null): void => {
  if (!data || !data.fields || !data.fields.routingKey) {
    log.error('invalid rabbitmq msg', '[msg broker onMessage]')
    return
  }

  try {
    const msg = JSON.parse(data.content.toString())

    switch (data.fields.routingKey) {
      case routingKeys.APP_CREATED:
      case routingKeys.APP_UPDATED:
      case routingKeys.APP_DELETED:
      case routingKeys.APP_REQUESTED:
      case routingKeys.ORG_CREATED:
      case routingKeys.ORG_UPDATED:
      case routingKeys.ORG_USER_ROLE:
      case routingKeys.ORG_USER_INVITED:
      case routingKeys.USER_PASSWORD:
      case routingKeys.USER_DELETED:
        return handlers.handleLogEntry(msg)
    }
  } catch(err) {
    log.error(err, '[msg broker onMessage]')
  }
}

const setupMsgBroker = () => {
  const connection = amqp.connect([config.get('msgBroker.url')])
  connection.on('connect', () => log.info('Connected to Message Broker'))
  connection.on('disconnect', (err) => log.error(err, '[msg broker]'))

  connection.createChannel({
    setup: (channel: amqplib.ConfirmChannel) => (
      Promise.all([
        channel.assertQueue(config.get('msgBroker.queue'), { exclusive: true, autoDelete: true }),
        channel.assertExchange(config.get('msgBroker.eventsExchange'), 'topic'),
        channel.bindQueue(config.get('msgBroker.queue'), config.get('msgBroker.eventsExchange'), '#'),
        channel.consume(config.get('msgBroker.queue'), onMessage),
      ])
    ),
  })
}

export default setupMsgBroker