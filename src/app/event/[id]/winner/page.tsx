'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import React, { useEffect, useState } from 'react';


const WinnerPage = () => {
  const { id } = useParams() // Get the event ID from the URL
  const [winnerData, setWinnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const response = await fetch(`/api/events/${id}/winner`);
        if (!response.ok) {
          throw new Error('Failed to fetch winner data');
        }
        const data = await response.json();
        setWinnerData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWinner();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading winner data...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  if (!winnerData) {
    return <div className="min-h-screen flex items-center justify-center">No winner data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Event Winner</h1>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Winner: {winnerData.name}</h2>
          <h2 className="text-xl font-semibold">Winner Proposal: {winnerData.winner.title}</h2>
          <p className="mt-2">Description: {winnerData.winner.description}</p>
          <p className="mt-2">Requested Amount: ${winnerData.winner.requestedAmount}</p>
          <p className="mt-2">Votes: {winnerData.winner.votes}</p>
          <p className="mt-2">Event Title: {winnerData.eventTitle}</p>
        </div>
      </div>
    </div>
  )
}

export default WinnerPage
