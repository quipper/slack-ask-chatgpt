# slack-ask-chatgpt

Slack bot for new Slack Platform (deno)

Refer to the followings:

- [ChatGPT Bot を new Slack Platform で動かしてみた - LayerX エンジニアブログ](https://tech.layerx.co.jp/entry/2023/03/06/chatgpt-on-slack-new-platform)
- [Slack で ChatGPT との会話履歴をスレッドごとに分けて運用する](https://zenn.dev/lazy/articles/slack-chatgpt-with-thread)
- [Slack に初音ミクを召喚した(new Slack Platform + ChatGPT API)](https://zenn.dev/leaner_dev/articles/20230309-slack-miku-chatgpt)

## Local development

1. Set Channel ID in trigger files
1. Create trigger
1. Prepare .env file

.env
```
BOT_USER_ID="U01AAAAAA" # Channel ID
OPENAI_API_KEY="open-api-key"
```

```
slack run
```
