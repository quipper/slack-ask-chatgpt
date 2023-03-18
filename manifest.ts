import { Manifest } from 'deno-slack-sdk/mod.ts'
import { ChatGPTWorkflow } from './workflow.ts'

export default Manifest({
  name: 'chatgpt',
  description: 'workflow',
  icon: 'assets/chatgpt.png',
  workflows: [ChatGPTWorkflow],
  outgoingDomains: ['api.openai.com'],
  botScopes: [
    'commands',
    'app_mentions:read',
    'chat:write',
    'chat:write.public',
    'channels:read',
  ],
})
