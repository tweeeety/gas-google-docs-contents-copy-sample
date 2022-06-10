# gas-google-docs-contents-copy-sample

## これはなにか？
- Google Docsの議事録に、テンプレートからコンテンツを追加するサンプルです

## もっと詳細に
- Google Docsは2つ登場します
    - 1. Main Docs: 議事録の想定。日付ごとに追加する
    - 2. Template Docs: 1日分の議事録フォーマット
- Template Docsの内容を読み込み、日付部分を翌日にreplaceしてMain DocsにInsertします
- その後、Main DocsのURLをSlack ChannelにPostします
