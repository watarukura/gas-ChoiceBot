var prop = PropertiesService.getScriptProperties().getProperties();
var slackApp = SlackApp.create(prop.token);
var cmd_token = prop.slash_command_token;
var hook_token = prop.incoming_webhook_token;

function doGet(e) {
  doPost(e);
}
function doPost(e) {

  if (!e) {

    //for Test. Slackからは以下のパラメータで飛んできます。
    e = {
      parameter : {
        team_id : "T0001",
        channel_id : "Cxxxxxxx",
        channel_name : "aso_bot",
        timestamp : "1355517523.000005",
        user_id : "Uxxxxxxxx",
        user_name : "kurashima",
        text : "a,b,c,d",
        trigger_word : "MyFirstBot:",
        command : "/.choice",
        token : "xxxxxxxxxxxxx"
      }
    };
  }

  //slackのスラッシュコマンドのtoken。ここに含まれていない場合はErrorにする。
  var slashtoken = [cmd_token, hook_token];
  if (!slashtoken.some(function(v){ return v === e.parameter.token })) {
    throw new Error("invalid token.");
  }

  var post_message = "";
  var command = e.parameter.command;
  if (command === '/.choice') {
    var text = e.parameter.text;
    post_message += text + "の中から"
  } else {
    var text = e.parameter.text.substring(9);
  }
  
  var choice_targets = pre_choice(text, e.parameter.user_name, e.parameter.channel_name);
  
  var choiced_member = choice(choice_targets);
  post_message +=  "厳正な抽選の結果、「"+choiced_member+"」が選ばれました！"
  postSlack(e.parameter.channel_id, post_message);
  return null;
}

function pre_choice(text, me, channel) {
  var members = [];
  var cases = text.trim();
  switch (cases){
  case "channel":
    //channelに参加しているメンバーを取得;
    var member_array = slackApp.channelsJoin(channel).channel.members;
    for (var i in member_array) {
      var member = slackApp.usersInfo(member_array[i]).user;
      if (member.deleted == 'true' || member.is_bot == 'true') {
        continue;
      }
      members.push(member.name);
    }
    break;
    
  default :
    //空白区切りテキストに含まれるユーザ;
    var member_array = text.split(",");
    var member = "";
    for (var i in member_array) {
      member = member_array[i].trim();
      members.push(member);
    }
    break;
  }
  
  //重複を除外する
  var members_uniq = members.filter(function(elements, index, selfArr) {
    return selfArr.indexOf(elements) === index;
  });

//  //自分を除外する
//  var index_of_me = members_uniq.indexOf(me);
//  if (index_of_me != -1) {
//    members_uniq.splice(index_of_me, 1);
//  }
  
  return members_uniq;

}

/** 
* randAry
* 配列内からランダムに値を取得する
* @param {array} i_ary 配列
* @return {object} 配列内の値
*/
function choice(i_ary){
  //添字を全て取得
  var aryKeys = Object.keys(i_ary);
  //対象の添字をランダムに取得
  var index = aryKeys[Math.floor(Math.random() * aryKeys.length)];
  return i_ary[index];
}

function postSlack(channel_id, text) {
  var postChannelId = channel_id //"C0GCLUTSN"; // #aso_bot
  var option = {
    username: "ChoiceBot",
    icon_emoji: ":point_right:",
    link_names: 1,
    unfurl_media: true
  };

  var response = slackApp.postMessage(postChannelId, text, option);
  Logger.log(response);

}