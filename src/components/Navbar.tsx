import React from 'react'
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const Navbar = () => {
    return (
        <>
            <div className="navbarbox flex justify-between bg-[#ffd166] mt-6 rounded-xl items-center shadow-lg">
                <Link href={'/'} className="py-[15px] px-[30px] text-2xl font-semibold text-black">HackZy</Link>
                <div className="flex items-center gap-4">

                    {/* Connect Wallet Button */}
                    <button className="bg-[#1d3557] font-semibold px-4 rounded-md py-1.5 text-[#f1faee] shadow-md hover:shadow-lg hover:bg-[#457b9d] transition-all cursor-pointer">
                        Connect Wallet
                    </button>

                    {/* Sign In Button (when signed out) */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-[#e63946] font-semibold px-4 mr-5 rounded-md py-1.5 text-white shadow-md hover:shadow-lg hover:bg-[#d62828] transition-all cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>

                    {/* User Button (when signed in) */}
                    <SignedIn>
                        <div className="mr-4">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: 'shadow-md hover:shadow-lg transition-shadow bg-[#2a9d8f] hover:bg-[#21867a]',
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </>
    )
}

export default Navbar