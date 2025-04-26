import Groq from 'groq-sdk'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

async function testDatabaseConnection() {
  try {
    const proposals = await prisma.proposal.findMany()
    console.log('Fetched Proposals:', proposals)
  } catch (error) {
    console.error('Error fetching proposals:', error)
  }
}
testDatabaseConnection()
// Function to fetch proposals from the database
async function fetchProposals() {
  return await prisma.proposal.findMany({
    select: {
      title: true,
      description: true,
      requestedAmount: true,
      votes: true,
    },
  })
}

async function fetchEventDetails(eventId) {
  return await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      title: true,
      description: true,
    },
  });
}
async function main() {
  try {
    const eventId = 'your-event-id'
    const chatCompletion = await getGroqChatCompletion()
    // Print the completion returned by the LLM
    console.log('Groq AI Analysis:')
    const analysis =
      chatCompletion.choices[0]?.message?.content || 'No response'
    console.log(analysis)
    // Extract the winner from the analysis (you can customize this logic)
    const winner = extractWinnerFromAnalysis(analysis)
    console.log('Winner Proposal:', winner)

    if (winner) {
      await prisma.event.update({
        where: { id: eventId },
        data: { winnerProposal: winner },
      })
    }
  } catch (error) {
    console.error('Error analyzing proposals:', error)
  }
}
function extractWinnerFromAnalysis(analysis) {
  // Implement logic to extract the winner from the Groq AI response
  const match = analysis.match(/Proposal (\d+)/)
  return match ? `Proposal ${match[1]}` : null
}
export async function getGroqChatCompletion() {
  const proposals = await fetchProposals()
  const event = await fetchEventDetails(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

 // Format event details and proposals into a readable string for Groq AI
 const eventDetails = `Event Title: ${event.title}\nDescription: ${event.description}\n`;
 const proposalSummaries = proposals
   .map(
     (p, index) =>
       `Proposal ${index + 1}:\nTitle: ${p.title}\nDescription: ${p.description}\nRequested Amount: $${p.requestedAmount}\nVotes: ${p.votes || 0}\n`
   )
   .join('\n');
  const content = `Analyze the following event and proposals. Based on the event's title and description, determine which proposal aligns most closely with the event and has the highest votes:\n\n${eventDetails}\nProposals:\n${proposalSummaries}`;

  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    model: 'llama-3.3-70b-versatile',
  })
}
main()
