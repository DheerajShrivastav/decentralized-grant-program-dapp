'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const WinnerPage = () => {
  const { id } = useParams() // Get the event ID from the URL
  // Dummy winner data
  const winnerData = {
    name: 'John Doe',
    prize: '$1000',
    eventId: id, // Fallback to a dummy event ID
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Event Winner</h1>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Winner: {winnerData.name}</h2>
          <p className="mt-2">Prize: {winnerData.prize}</p>
          <p className="mt-2">Event ID: {winnerData.eventId}</p>
        </div>
      </div>
    </div>
  )
}

export default WinnerPage
