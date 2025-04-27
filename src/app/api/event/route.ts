import { PrismaClient } from '@prisma/client'
import { Event } from '../../../../types/index' // Import the Event type
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
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

    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, description, startDate, and endDate are required.' },
        { status: 400 }
      )
    }

    // Convert maxParticipants to an integer
    const maxParticipantsInt = maxParticipants ?? null

    const newEvent = await prisma.event.create({
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
        website: website || '',
        location: location || '', // Optional field
        maxParticipants: maxParticipantsInt, // Use the converted integer
        eligibility,
        rulesAndGuidelines,
        registeredParticipants,
        timeline: {
          create: timeline.map((t) => ({
            date: new Date(t.date),
            // description: t.description, // Include description if needed
          })),
        },
        prizes: {
          create: prizes.map((prize) => ({
            title: prize.title,
            amount: prize.amount,
          })),
        },
      },
      include: {
        prizes: true,
        timeline: true,
      },
    })

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event', details: error },
      { status: 500 }
    )
  }
}

// View all events
export async function GET(req: Request) {
  try {
    const events = await prisma.event.findMany({
      include: {
        prizes: true,
        timeline: true,
      },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
