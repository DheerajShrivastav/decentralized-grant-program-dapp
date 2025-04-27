import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Groq from 'groq-sdk'

const prisma = new PrismaClient()
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Function to fetch proposals from the database related to a specific event
async function fetchProposals(eventId: string) {
  return await prisma.proposal.findMany({
    where: { eventId },
    select: {
      id: true,
      title: true,
      description: true,
      requestedAmount: true,
      votes: true,
    },
  })
}

async function fetchEventDetails(eventId: string) {
  return await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      title: true,
      description: true,
    },
  })
}

async function getGroqChatCompletion(eventId: string) {
  const proposals = await fetchProposals(eventId)
  const event = await fetchEventDetails(eventId)

  if (!event) {
    throw new Error('Event not found')
  }

  const eventDetails = `Event Title: ${event.title}\nDescription: ${event.description}\n`
  const proposalSummaries = proposals
    .map(
      (p, index) =>
        `Proposal ${index + 1}:\nTitle: ${p.title}\nDescription: ${
          p.description
        }\nRequested Amount: $${p.requestedAmount}\nVotes: ${p.votes || 0}\n`
    )
    .join('\n')
  const content = `Analyze the following event and proposals. Based on the event's title and description, determine which proposal aligns most closely with the event and has the highest votes:\n\n${eventDetails}\nProposals:\n${proposalSummaries}`

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

function extractWinnerFromAnalysis(analysis: string, proposals: any[]) {
  const match = analysis.match(/Proposal (\d+)/)
  if (match) {
    const proposalIndex = parseInt(match[1], 10) - 1 // Convert to zero-based index
    if (proposalIndex >= 0 && proposalIndex < proposals.length) {
      return proposals[proposalIndex].id // Return the actual ID
    }
  }

  // If no match found, determine the proposal with the highest votes
  const validProposals = proposals.filter((p) => typeof p.votes === 'number')
  if (validProposals.length === 0) {
    return null // No valid proposals with numeric votes
  }

  // Find the proposal with the highest votes
  const winnerProposal = validProposals.reduce((prev, current) => {
    return prev.votes > current.votes ? prev : current
  })

  return winnerProposal.id // Return the ID of the proposal with the highest votes
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const chatCompletion = await getGroqChatCompletion(id)
    const analysis =
      chatCompletion.choices[0]?.message?.content || 'No response'
    console.log('Groq AI Analysis:', analysis)

    const proposals = await fetchProposals(id) // Fetch proposals again to pass to the function
    const winnerId = extractWinnerFromAnalysis(analysis, proposals)
    console.log('Winner Proposal ID:', winnerId)

    if (winnerId) {
      await prisma.event.update({
        where: { id },
        data: { winnerProposal: winnerId }, // Update with the actual proposal ID
      })
    }

    return NextResponse.json({ winnerId })
  } catch (error) {
    console.error('Error analyzing proposals:', error)
    return NextResponse.json(
      { error: 'Failed to analyze proposals' },
      { status: 500 }
    )
  }
}
