import { PrismaClient } from '@prisma/client'
import { Event } from '../../../../../types/index' // Import the Event type
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// Get event by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        timeline: true,
        prizes: true,
      },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
// Update event by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const {
    title,
    description,
    startDate,
    endDate,
    mode,
    type,
    tags,
    prizes, // Array of prizes
    banner,
    contactName,
    contactEmail,
    website,
    location,
    maxParticipants,
    eligibility,
    rulesAndGuidelines,
    registeredParticipants,
    timeline,
  }: Event = body

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        mode,
        type,
        tags,
        banner,
        contactName,
        contactEmail,
        website,
        location,
        maxParticipants,
        eligibility,
        rulesAndGuidelines,
        registeredParticipants,
        timeline: {
          createMany: {
            data: timeline.map((item) => ({
              date: new Date(item.date),
              event: item.event,
            })),
          },
        },
        prizes: {
          createMany: {
            data: prizes.map((item) => ({
              title: item.title,
              amount: item.amount,
            })),
          },
        },
      },
      include: {
        timeline: true, // Include the timeline in the response
      },
    })
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}
