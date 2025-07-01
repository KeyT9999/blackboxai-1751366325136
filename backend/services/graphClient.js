const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

function getAuthenticatedClient(accessToken) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
  return client;
}

async function getEmails(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  try {
    const messages = await client.api('/me/messages')
      .top(25)
      .select('subject,from,receivedDateTime,bodyPreview')
      .orderby('receivedDateTime DESC')
      .get();
    return messages.value;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getEmails
};
