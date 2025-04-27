// app/events/[eventId]/page.tsx
'use client' // This component needs client-side rendering for hooks like useState, useEffect, useWeb3React

import EventDetails from '../../../../components/EventDetails' // Adjust the import path based on your file structure

interface EventDetailPageProps {
  params: {
    eventId: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = params

  return (
    <div>
      <h1>Event Details Page</h1>
      <EventDetails eventId={eventId} />
    </div>
  )
}
