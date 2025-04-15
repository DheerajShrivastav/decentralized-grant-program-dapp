import Navbar from '@/components/Navbar'
import React from 'react'

const EventsListingPage = () => {
    return (
        <>


            <div className="pt-1 h-screen bg-gradient-to-r from-blue-600 to-purple-600 ">

                <div className="foreground mx-[58px]">
                    <Navbar />



                    <div className="main-section flex gap-14 mt-6 ">
                        {/* sidebar */}

                        <div className="sidebar w-1/4 rounded-xl bg-[#ffd166] px-5 py-4 h-96">

                            <p className="text-xl">Filters</p>



                        </div>


                        <div className="listing-section w-3/4  rounded-xl">





                        </div>


                    </div>


                </div>



            </div>
        </>
    )
}

export default EventsListingPage