'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  PlusCircle,
  Calendar,
  Users,
  Award,
  Filter,
  Search,
} from 'lucide-react'
import { Event } from '../../../../types/index' // Adjust the import path as necessary
import { formatDate } from '@/utils/formatDate' // Adjust the import path as necessary

const HostDashboard = () => {
  const [events, setEvents] = useState<Event[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/event')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // No events state
  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          No events found. Create a new event to get started.
        </p>
      </div>
    )
  }

  // Filter events based on search query and filter selection
  const filteredEvents = events.filter((event) => {
    // Filter by search query
    if (
      searchQuery &&
      !event.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    // Additional filtering logic can be added here based on the `filter` state

    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Event Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/events"
                className="px-3 py-1 text-sm rounded-md bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Events
              </Link>
              <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center">
                <span className="font-semibold">OU</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb -8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-1">
              Manage all your hosted events in one place
            </p>
          </div>
          <Link
            href="/host/new"
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={18} />
            Create New Event
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">
              No events found. Try adjusting your filters or create a new event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Event Image */}
                <div className="h-48 relative">
                  <Image
                    src={event.banner}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      {formatDate(event.startDate)} -{' '}
                      {formatDate(event.endDate)}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-1" />
                      <span>{event.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Award size={16} className="mr-1" />
                      <span>{event.prizes.length} prizes</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <Link
                    href={`/host/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Manage Event
                  </Link>
                  <Link
                    href={`/event/${event.id}`}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    View Public Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HostDashboard
