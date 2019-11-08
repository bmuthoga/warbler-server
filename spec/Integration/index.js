const authIntegrationTests = require('./AuthSpec')
const messagesIntegrationTests = require('./AllMessagesSpec')
const miscellaneousIntegrationTests = require('./MiscellaneousSpec')
const postUserMessagesIntegrationTests = require('./PostUserMessagesSpec')
const getUserMessagesIntegrationTests = require('./GetUserMessagesSpec')
const deleteUserMessagesIntegrationTests = require('./DeleteUserMessagesSpec')

module.export = {
  authIntegrationTests,
  messagesIntegrationTests,
  miscellaneousIntegrationTests,
  postUserMessagesIntegrationTests,
  getUserMessagesIntegrationTests,
  deleteUserMessagesIntegrationTests
}
