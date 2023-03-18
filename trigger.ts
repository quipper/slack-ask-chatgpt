import { Trigger } from 'deno-slack-api/types.ts'
import { ChatGPTWorkflow } from './workflow.ts'

/**
 * Triggers determine when Workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const Trigger: Trigger<typeof ChatGPTWorkflow.definition> = {
  type: 'event',
  event: {
    event_type: 'slack#/events/app_mentioned',
    channel_ids: ['YOUR-ID'],
  },
  name: 'app mentioned trigger',
  description: 'Send message to channel',
  workflow: `#/workflows/${ChatGPTWorkflow.definition.callback_id}`,
  inputs: {
    channel_id: { value: '{{data.channel_id}}' },
    user_id: { value: '{{data.user_id}}' },
    question: { value: '{{data.text}}' },
  },
}

export default Trigger
