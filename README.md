# gas-ChoiceBot

引数として渡したカンマ区切りの値からランダムに一つを選択するBot。

## 準備

1. GASのメニューから「公開」→「Webアプリケーションとして導入」を選択。「現在のウェブ アプリケーションの URL」をコピーしておく
1. SlackでOutgoing Webhookを設定する Trigger Wordに「ChoiceBot」を指定
1. SlackでSlash Commandを設定する。コマンドは「/.choice」とする
1. GASにSlackAppをインストールする [link](https://qiita.com/soundTricker/items/43267609a870fc9c7453)
1. SlackのAPIトークンをGASの「ファイル」→「プロジェクトのプロパティ」→「スクリプトのプロパティ」にプロパティ名:token、値:APIトークンの値で指定する
使ったことないけどOAuth対応の新しいAPIトークン使うほうがセキュア。
1. 同様に、プロパティ名「webhook_token」に2.で設定したOutgoing Webhookのトークンを値として設定する。
1. 同様に、プロパティ名「slash_command_token」に3.で設定したSlash Commandのトークンを値として設定する。
