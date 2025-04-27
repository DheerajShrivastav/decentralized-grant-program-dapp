import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        proposals: true,
      },
    })

    if (!event || !event.winnerProposal) {
      return NextResponse.json({ error: 'Winner not found' }, { status: 404 })
    }

    // Check if winnerProposal is a valid UUID
    if (typeof event.winnerProposal !== 'string') {
      return NextResponse.json(
        { error: 'Winner proposal ID is invalid' },
        { status: 400 }
      )
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
