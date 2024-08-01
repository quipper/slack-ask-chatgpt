import { Manifest } from "deno-slack-sdk/mod.ts";
import { ChatGPTWorkflow } from "./workflow.ts";
import { TalkHistoriesDatastore } from "./talk_histories_datastore.ts";

export default Manifest({
  name: "chatgpt",
  description: "workflow",
  icon: "assets/chatgpt.png",
  workflows: [ChatGPTWorkflow],
  outgoingDomains: ["ask-chatgpt-east-us.openai.azure.com"],
  datastores: [TalkHistoriesDatastore],
  botScopes: [
    "commands",
    "app_mentions:read",
    "chat:write",
    "chat:write.public",
    "channels:read",
    "channels:history",
    "datastore:read",
    "datastore:write",
  ],
});
