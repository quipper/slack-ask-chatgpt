import { DefineDatastore, Schema } from 'deno-slack-sdk/mod.ts'

export const TalkHistoriesDatastore = DefineDatastore({
  name: 'talkHistories',
  primary_key: 'id',
  attributes: {
    id: { type: Schema.types.string },
    history: {
      type: Schema.types.array,
      items: {
        // object 型だと何故かうまく格納できなかったため、 string 型にして JSON 文字列を格納している
        type: Schema.types.string,
      },
    },
  },
})
