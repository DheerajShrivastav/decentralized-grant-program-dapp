'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Proposal } from '../../../../../types'
import { useRouter } from 'next/navigation'

const WinnerPage = () => {
  const params = useParams() // Get the event ID from the URL
  const router = useRouter()
  const [winnerData, setWinnerData] = useState<{
    eventTitle: string
    winner: Proposal
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const handleclick = async () => {
    router.push(`/event/${params.id}/distributeGrant`)
  }

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const response = await fetch(`/api/event/${params.id}/winner`)
        if (!response.ok) {
          throw new Error('Winner not found')
        }
        const data = await response.json()
        setWinnerData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWinner()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading winner data...
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    )
  }

  if (!winnerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No winner data available
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt -6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Event Winner</h1>
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Winner Proposal: {winnerData.winner.title}
          </h2>
          <p className="mt-2">Description: {winnerData.winner.description}</p>
          <p className="mt-2">
            Requested Amount: ${winnerData.winner.requestedAmount}
          </p>
          <p className="mt-2">Event Title: {winnerData.eventTitle}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Distribute Grant</h3>
          <p className="mt-2">
            You can distribute the grant amount to the winner proposal.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => handleclick()}
          >
            Distribute Grant
          </button>
        </div>
      </div>
    </div>
  )
}

export default WinnerPage
