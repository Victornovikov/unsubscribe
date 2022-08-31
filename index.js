const fs = require('fs').promises
const path = require('path')
const process = require('process')
const {authenticate} = require('@google-cloud/local-auth')
const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = [
  // 'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.readonly'
]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'creds.json')

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth})
  const res = await gmail.users.labels.list({
    userId: 'me',
  })
  const labels = res.data.labels
  if (!labels || labels.length === 0) {
    console.log('No labels found.')
    return
  }
  console.log('Labels:')
  labels.forEach((label) => {
    console.log(`- ${label.name}`)
  })
}

/**
 * Lists the messages in the user's account.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} userId The user's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param {number} maxResults The maximum number of messages to return.
 * @param {string} labelIds Only return messages with labels that match all of
 * these labels.
 * @param {string} q Only return messages matching this query.
 * @param {string} fields Selector specifying which fields to include in a partial
 * response.
 * @param {string} pageToken Page token to start listing from.
*/
async function listMessages(auth, userId, maxResults, labelIds, q, fields, pageToken) {
  const gmail = google.gmail({version: 'v1', auth})
  const res = await gmail.users.messages.list({
    userId: userId,
    maxResults: maxResults,
    labelIds: labelIds,
    q: q,
    fields: fields,
    pageToken: pageToken,
  })
  const messages = res.data.messages
  if (!messages || messages.length === 0) {
    console.log('No messages found.')
    return
  }
  console.log('Messages:')
  messages.forEach((message) => {
    console.log(`- ${message.id}`)
  })
  return res.data.nextPageToken
}

// authorize().then(listLabels).catch(console.error)
const auth = authorize()
const token = listMessages(auth, 'me', 10, 'INBOX', '', 'id', '').catch(console.error)
console.log(token)