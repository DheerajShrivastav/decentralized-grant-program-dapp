import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Proposal } from '../../../../../../types/index'

const prisma = new PrismaClient()
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const proposals = await prisma.proposal.findMany({
      where: { eventId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(proposals)
  } catch (error) {
    console.error('Error retrieving proposals:', error)
    return NextResponse.json(
      { message: 'Error retrieving proposals' },
      { status: 500 }
    )
  }
}
