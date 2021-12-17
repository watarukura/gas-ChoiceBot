const slack_token = '***';
const cmd_token = '***';

function doPost(e) {
    if (!e) {
        //for Test. Slackからは以下のパラメータで飛んできます。
        e = {
            parameter: {
                team_id: "T0001",
                channel_id: "Cxxxxxxx",
                channel_name: "aso_bot",
                timestamp: "1355517523.000005",
                user_id: "Uxxxxxxxx",
                user_name: "kurashima",
                text: "a,b,c,d",
                trigger_word: "MyFirstBot:",
                command: "/.choice",
                token: cmd_token
            }
        };
    }

    if (cmd_token !== e.parameter.token) {
        Logger.log('error');
        throw new Error("invalid token.");
    }

    const member = choice(e.parameter.text);
    const post_message = `厳正な抽選の結果、${e.parameter.text}の中から「${member}」が選ばれました！`;
    postSlack(e.parameter.channel_id, post_message);
    return ContentService.createTextOutput(null);
}

/**
 * @param {string} text
 */
function choice(text) {
    const members = [...new Set(text.split(',').map((member) => member.trim()))];
    return members[Math.floor(Math.random() * members.length)];
}

function postSlack(channel_id, text) {
    const url = "https://slack.com/api/chat.postMessage";

    const payload = {
        "token": slack_token,
        "channel": channel_id,
        "text": text,
        "username": "ChoiceBot",
        "icon_emoji": ":point_right:",
        "link_names": 1,
        "unfurl_media": true
    };

    const params = {
        "method": "post",
        "payload": payload
    };

    // Slackに投稿する
    const response = UrlFetchApp.fetch(url, params);
    Logger.log(response);
}
