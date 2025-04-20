'use client'
import Navbar from '@/components/Navbar'
import EventCard from '@/components/EventCard'
import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

const EventsListingPage = () => {
  const [events, setEvents] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/event')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        setError('error fetching events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }
  if (error || !events) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The event you're looking for doesn't exist or has been removed."}
          </p>
          Events not found
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="pt-1  bg-gradient-to-r from-blue-600 to-purple-600 pb-24 ">
        <div className="foreground mx-[58px]">
          <Navbar />
          <div className="main-section flex gap-14 mt-6">
            {/* Sidebar */}
            <div className="sidebar flex-shrink-0 w-1/4 h-[calc(100vh-100px)] overflow-y-auto rounded-xl bg-[#ffd166] px-5 py-4">
              <p className="text-xl font-bold mb-4">Filters</p>

              <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Status</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Live</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Upcoming</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Completed</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Technologies</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Blockchain</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>DeFi</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Web3</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>AI/ML</span>
                  </label>
                </div>
              </div>

              <button className="w-full bg-[#1d3557] text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                Apply Filters
              </button>
            </div>

            {/* Listing Section */}
            <div className="listing-section w-3/4 grid grid-cols-1 md:grid-cols-2 gap-10">
              {events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventsListingPage
