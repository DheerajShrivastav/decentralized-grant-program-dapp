'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  Tag,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Event } from '../../../../types/index' // Import the Event type
const ViewEventsPage = () => {
  const params = useParams()
  const router = useRouter() // Initialize the router
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)

        // In a real application, you would fetch data from your API
        // For now, we'll simulate a fetch with mock data
        const response = await fetch(`/api/events/${params.id}`)
        const data: Event = await response.json()

        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }

        setTimeout(() => {
          setEvent(data)
          setLoading(false)
        }, 500) // Simulating network delay
      } catch (err) {
        setError('Failed to load event details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  // Format date to more readable form
  const formatDate = (date: Date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
    return date.toLocaleDateString('en-US', options)
  }

  const handleApply = () => {
    // In a real app, this would submit an application or redirect to an application form
    router.push(`/submitProposal`)
    //alert("Application submitted successfully!");
  }

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

  if (error || !event) {
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
          <Link
            href="/events"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse All Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="mx-10">
        <Navbar />
      </div>
      {/* Banner */}
      <div className="mx-10 mt-10 relative h-80 ">
        <Image
          src={event.banner || '/images/862.webp'}
          alt={event.title}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    event.type === 'hackathon'
                      ? 'bg-blue-100 text-blue-800'
                      : event.type === 'ideathon'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  } mb-3 inline-block`}
                >
                  {event.type}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center text-white/80">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>

                  <span className="mx-3">•</span>

                  {event.mode === 'online' ? (
                    <div className="flex items-center">
                      <Globe size={16} className="mr-1" />
                      <span>Online Event</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleApply}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
              >
                Apply for this Event
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center"
                  >
                    <Tag size={14} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Event Timeline
              </h2>
              <div className="space-y-4">
                {event.timeline.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 relative">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                      {index < event.timeline.length - 1 && (
                        <div className="absolute top-3 bottom-0 left-1.5 w-0.5 -ml-px bg-blue-200"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      <p className="font-medium">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules & Guidelines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Rules & Guidelines
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.rulesAndGuidelines}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Event Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm uppercase text-gray-500 font-medium">
                    Date & Time
                  </h3>
                  <p className="flex items-center mt-1">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm uppercase text-gray-500 font-medium">
                    Location
                  </h3>
                  <p className="flex items-center mt-1">
                    {event.mode === 'online' ? (
                      <>
                        <Globe size={16} className="mr-2 text-gray-400" />
                        Online Event
                      </>
                    ) : (
                      <>
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        {event.location}
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm uppercase text-gray-500 font-medium">
                    Participants
                  </h3>
                  <p className="flex items-center mt-1">
                    <Users size={16} className="mr-2 text-gray-400" />
                    {event.registeredParticipants} /{' '}
                    {event.maxParticipants || 'Unlimited'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm uppercase text-gray-500 font-medium">
                    Eligibility
                  </h3>
                  <p className="mt-1 text-sm">{event.eligibility}</p>
                </div>

                {event.website && (
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium">
                      Website
                    </h3>
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
                    >
                      <Globe size={16} className="mr-2" />
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
            {/* Prizes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Prizes</h2>

              <div className="space-y-4">
                {event.prizes.map((prize, index) => (
                  <div
                    key={prize.id} // Use the prize ID as the key for better performance
                    className={`flex items-center justify-between py-3 px-4 rounded-lg border ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                        : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : 'bg-amber-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{prize.title}</span>{' '}
                      {/* Display the prize title */}
                    </div>
                    <span className="text-lg font-bold">{prize.amount}</span>{' '}
                    {/* Display the prize amount */}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact</h2>
              <p className="font-medium">{event.contactName}</p>
              <a
                href={`mailto:${event.contactEmail}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {event.contactEmail}
              </a>
            </div>

            {/* Apply Button (Mobile) */}
            <div className="lg:hidden">
              <button
                onClick={handleApply}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Apply for this Event
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewEventsPage
