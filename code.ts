const slackToken: string = '***'
const cmdToken: string = '***'

// eslint-disable-next-line no-unused-vars,no-undef
function doPost (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  if (cmdToken !== e.parameter.token) {
    // eslint-disable-next-line no-undef
    Logger.log('error')
    throw new Error('invalid token.')
  }

  const member = choice(e.parameter.text)
  const postMessage = `厳正な抽選の結果、${e.parameter.text}の中から「${member}」が選ばれました！`
  postSlack(e.parameter.channel_id, postMessage)
  // eslint-disable-next-line no-undef
  return ContentService.createTextOutput('')
}

function choice (text: string) {
  const members = [...new Set(text.split(',').map((member) => member.trim()))]
  return members[Math.floor(Math.random() * members.length)]
}

function postSlack (channelId: string, text: string) {
  const url = 'https://slack.com/api/chat.postMessage'

  const payload = {
    token: slackToken,
    channel: channelId,
    text: text,
    username: 'ChoiceBot',
    icon_emoji: ':point_right:',
    link_names: 1,
    unfurl_media: true
  }

  // eslint-disable-next-line no-undef,camelcase
  const post: GoogleAppsScript.URL_Fetch.HttpMethod = 'post'
  const params = {
    method: post,
    payload: payload
  }

  // eslint-disable-next-line no-undef
  const response = UrlFetchApp.fetch(url, params)
  // eslint-disable-next-line no-undef
  Logger.log(response)
}
