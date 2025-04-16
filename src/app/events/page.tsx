"use client"
import Navbar from '@/components/Navbar'
import React from 'react'
import EventCard from '@/components/EventCard'

const EventsListingPage = () => {

    const events = [
        {
            title: "Bio x AI Virtual Hackathon",
            date: "Apr 1 - May 11, 2025",
            status: "Live",
            mode: "Offline",
            prize: "$90,000",
            image: "/images/861.webp",

        },
        {
            title: "Sui Overflow 2025",
            date: "Apr 1 - May 11, 2025",
            status: "Upcoming",
            mode: "Online",
            prize: "$50,000",
            image: "/images/835.webp",
        },
        {
            title: "Sui Overflow 2025",
            date: "Apr 1 - May 11, 2025",
            status: "Upcoming",
            mode: "Online",
            prize: "$50,000",
            image: "/images/835.webp",
        },


    ];
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