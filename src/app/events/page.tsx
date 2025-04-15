import Navbar from '@/components/Navbar'
import React from 'react'

const EventsListingPage = () => {

    const events = [
        {
            title: "Bio x AI Virtual Hackathon",
            date: "Apr 1 - May 11, 2025",
            status: "Upcoming",
            prize: "$90,000",
            image: "/images/861.webp",
        },
        {
            title: "Sui Overflow 2025",
            date: "Apr 1 - May 11, 2025",
            status: "Upcoming",
            prize: "$50,000",
            image: "/images/835.webp",
        },
    ];
    return (
        <>


            <div className="pt-1  bg-gradient-to-r from-blue-600 to-purple-600 pb-24 ">

                <div className="foreground mx-[58px]">
                    <Navbar />
                    <div className="main-section flex gap-14 mt-6 ">
                        {/* sidebar */}
                        <div className="sidebar w-1/4 rounded-xl bg-[#ffd166] px-5 py-4 ">
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

                            <button className="w-full bg-[#1d3557] text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                Apply Filters
                            </button>
                        </div>
                        <div className="listing-section w-3/4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">

                            {events.map((event, index) => (
                                <div
                                    key={index}
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
                                        <div className="flex items-center justify-between mt-4">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === "Live"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                            >
                                                {event.status}
                                            </span>
                                            <span className="text-sm font-bold text-red-500">{event.prize}</span>
                                        </div>
                                        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>


                </div>



            </div>
        </>
    )
}

export default EventsListingPage