<<<<<<< HEAD
# google-docs-sample

## 何をするか
- 翌日のScrum Eventに応じて

## 課題はなにか
- 

##
- 当日の曜日からカレンダーのイベントを取得する: getEventsForDay
  - 月-木: 1日後のイベントを取得
  - 金　 : 3日後のイベントを取得
- 取得したイベントに以下の文字列が含まれてなかったら処理をやめる
  - Planning
  - Daily
  - Refinement
  - Review
- 上記の文字列が含まれている場合、上記の文字にマッピングしたテンプレートを取得
- 取得したテンプレを元にメインdocsに差し込み
=======
# gas-google-docs-contents-copy-sample

## これはなにか？
- Google Docsの議事録に、テンプレートからコンテンツを追加するサンプルです

## もっと詳細に
- Google Docsは2つ登場します
    - 1. Main Docs: 議事録の想定。日付ごとに追加する
    - 2. Template Docs: 1日分の議事録フォーマット
- Template Docsの内容を読み込み、日付部分を翌日にreplaceしてMain DocsにInsertします
- その後、Main DocsのURLをSlack ChannelにPostします
>>>>>>> d1d98dafdc2f4c4fc23577cbe57e67b04d3e4584
