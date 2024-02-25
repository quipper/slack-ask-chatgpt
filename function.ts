import {
  DefineFunction,
  Schema,
  SlackAPI,
  SlackFunction,
} from "deno-slack-sdk/mod.ts";

export const ChatGPTFunction = DefineFunction({
  callback_id: "chatgpt_function",
  title: "Ask ChatGPT",
  description: "Ask questions to ChatGPT",
  source_file: "function.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user ID",
      },
      question: {
        type: Schema.types.string,
        description: "question to chatgpt",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "channel ID",
      },
      message_ts: {
        type: Schema.slack.types.message_ts,
        description: "message_ts",
      },
      thread_ts: {
        type: Schema.slack.types.message_ts,
        description: "thread ts",
      },
    },
    required: ["question", "user_id", "channel_id", "message_ts"],
  },
});

export default SlackFunction(
  ChatGPTFunction,
  async ({ inputs, env, token }) => {
    const botUserId = env.BOT_USER_ID;
    const regex = new RegExp("<@" + botUserId + ">", "g");
    if (!inputs.question.match(regex)) {
      // Botへのメンションで無ければ終了
      console.log(`${inputs.question} does not match with ${botUserId}`);
      return await { outputs: {} };
    }

    const role = "user";
    const content = inputs.question.replaceAll(regex, " ");
    const apiKey = env.OPENAI_API_KEY;
    const client = SlackAPI(token);
    const MAX_CONVERSATIONS = 20;

    const historyResponse = await client.apps.datastore.get({
      datastore: "talkHistories",
      id: inputs.thread_ts ? inputs.thread_ts : inputs.message_ts,
    });

    const history = (historyResponse?.item?.history || []).map(
      (json: string) => {
        // 参照元と同様、object型だとうまくいかずJSON文字列形式で保存している
        return JSON.parse(json);
      }
    );

    const messages = [
      // チャット履歴と最新の発言を混ぜる
      ...history,
      // {
      //   role: 'system',
      //   content:
      //     'この会話では、すべての返答について、以下の法則に従うこと。あなたは「初音ミク」というキャラクターとして振る舞う。一人称は僕、二人称はあなたとする。返答は必ず日本語にする。です・ます・します・できます・されます・なります・はい などの敬語は禁止し、だね・だよ・するよ・できるよ・されるよ・なるよ・うん などの口語を使用する。可愛らしい女の子のような口調、例えば「〜だよ♪」「〜してるね！」「〜かな？」「〜なんだ！」といった話し方をする。',
      // },
      { role: role, content: content },
    ];

    const answer = await requestAzureOpenAI(apiKey, messages);

    if (answer.outputs) {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        thread_ts: inputs.thread_ts ? inputs.thread_ts : inputs.message_ts,
        reply_broadcast: !inputs.thread_ts, // 初回のChatGPT回答だけチャンネルにも送信する
        text: answer.outputs.answer,
      });

      const newHistories = [
        ...history,
        { role: "user", content },
        { role: "assistant", content: answer.outputs.answer },
      ].slice(MAX_CONVERSATIONS * -1);

      const thread_ts = inputs.thread_ts ? inputs.thread_ts : inputs.message_ts;
      await client.apps.datastore.update({
        datastore: "talkHistories",
        item: {
          id: thread_ts,
          history: newHistories.map((v) => JSON.stringify(v)),
        },
      });
    } else {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        thread_ts: inputs.thread_ts ? inputs.thread_ts : inputs.message_ts,
        reply_broadcast: !inputs.thread_ts,
        text: answer.error,
      });
    }

    return await { outputs: {} };
  }
);

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function requestAzureOpenAI(apiKey: string, messages: Message[]) {
  const OPENAI_RESOURCE_ID = "ask-chatgpt";
  const DEPLOYMENT_ID = "gpt-4";
  const API_VERSION = "2024-02-15-preview";
  const res = await fetch(
    `https://${OPENAI_RESOURCE_ID}.openai.azure.com/openai/deployments/${DEPLOYMENT_ID}/chat/completions?api-version=${API_VERSION}`,
    {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-0613",
        messages: messages,
      }),
    }
  );
  if (res.status != 200) {
    const body = await res.text();
    return {
      error: `Failed to call OpenAPI AI. status:${res.status} body:${body}`,
    };
  }
  const body = await res.json();
  console.log("chatgpt api response", { messages }, body);
  if (body.choices && body.choices.length >= 0) {
    const answer = body.choices[0].message.content as string;
    return { outputs: { answer } };
  }
  return {
    error: `No choices provided. body:${JSON.stringify(body)}`,
  };
}
