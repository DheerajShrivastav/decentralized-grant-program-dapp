import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// Get winner proposal by event ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params // Correctly access params.id
  try {
    // Fetch the event with the winner proposal
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        proposals: true, // Include proposals to access the winner proposal
      },
    })

    if (!event || !event.winnerProposal) {
      return NextResponse.json({ error: 'Winner not found' }, { status: 404 })
    }

    // Fetch the winner proposal details
    const winnerProposal = await prisma.proposal.findUnique({
      where: { id: event.winnerProposal },
    })

    if (!winnerProposal) {
      return NextResponse.json(
        { error: 'Winner proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      eventTitle: event.title,
      winner: winnerProposal,
    })
  } catch (error) {
    console.error('Error fetching winner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch winner' },
      { status: 500 }
    )
  }
}
