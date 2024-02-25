import { Trigger } from "deno-slack-api/types.ts";
import { ChatGPTWorkflow } from "../workflow.ts";

const threadMessageTrigger: Trigger<typeof ChatGPTWorkflow.definition> = {
  type: "event",
  name: "Trigger workflow with thread message posted",
  workflow: `#/workflows/${ChatGPTWorkflow.definition.callback_id}`,
  event: {
    event_type: "slack#/events/message_posted",
    channel_ids: [
      "C04VA2NC4AC", // #ask-chatgpt-ja
    ],
    filter: {
      version: 1,
      root: {
        operator: "AND",
        inputs: [
          {
            operator: "NOT",
            inputs: [{ statement: "{{data.user_id}} == null" }],
          },
          {
            operator: "NOT",
            inputs: [{ statement: "{{data.thread_ts}} == null" }],
          },
        ],
      },
    },
  },
  inputs: {
    channel_id: { value: "{{data.channel_id}}" },
    user_id: { value: "{{data.user_id}}" },
    message_ts: { value: "{{data.message_ts}}" },
    thread_ts: { value: "{{data.thread_ts}}" },
    question: { value: "{{data.text}}" },
  },
};

export default threadMessageTrigger;
