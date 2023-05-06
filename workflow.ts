import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { ChatGPTFunction } from './function.ts'

export const ChatGPTWorkflow = DefineWorkflow({
  callback_id: 'example-workflow',
  title: 'Example Workflow',
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      message_ts: {
        type: Schema.slack.types.message_ts,
      },
      thread_ts: {
        type: Schema.slack.types.message_ts,
      },
      question: {
        type: Schema.types.string,
      },
    },
    required: ['channel_id', 'question'],
  },
})

// OpenAI をコールする Step
ChatGPTWorkflow.addStep(ChatGPTFunction, {
  user_id: ChatGPTWorkflow.inputs.user_id,
  question: ChatGPTWorkflow.inputs.question,
  channel_id: ChatGPTWorkflow.inputs.channel_id,
  message_ts: ChatGPTWorkflow.inputs.message_ts,
  thread_ts: ChatGPTWorkflow.inputs.thread_ts,
})
