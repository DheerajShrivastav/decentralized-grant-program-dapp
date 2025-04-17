"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'


const EventCard = ({ event }) => {

    const router = useRouter()
    const handleView = function () {
        router.push('/event/id')



    }
    return (
        <>
            <div
                // key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >

                <div className="relative h-40">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                </div>


                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.date}</p>
                    <div className="flex items-center  mt-4">
                        <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === "Live"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                                }`}
                        >
                            {event.status}
                        </span>
                        <span className='px-3 text-xs font-semibold rounded-full bg-gray-200 py-1 ml-2'>{event.mode}</span>
                    </div>
                    <button onClick={handleView} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                        Apply Now
                    </button>


                </div>
            </div>
        </>
    )
}

export default EventCard