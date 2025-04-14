import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY ||
    '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',
})

async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || '')
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Explain the importance of fast language models',
      },
    ],
    model: 'llama-3.3-70b-versatile',
  })
}
main()
