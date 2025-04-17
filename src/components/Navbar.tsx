"use client"
import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';


const Navbar = () => {
    // const { connect } = useConnect({
    //     connector: new InjectedConnector(),
    // });
    const { connect } = useConnect()
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();

    return (
        <>
            <div className="navbarbox flex justify-between bg-[#ffd166] mt-6 rounded-xl items-center shadow-lg">
                <Link href={'/'} className="py-[15px] px-[30px] text-2xl font-semibold text-black">
                    HackZy
                </Link>
                <div className="flex items-center gap-4">
                    {/* Connect Wallet Button */}
                    {!isConnected ? (
                        <button
                            onClick={() => connect({ connector: injected() })}
                            className="bg-[#1d3557] font-semibold px-4 rounded-md py-1.5 text-[#f1faee] shadow-md hover:shadow-lg hover:bg-[#457b9d] transition-all cursor-pointer"
                        >
                            Connect Wallet
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-black">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                            <button
                                onClick={() => disconnect()}
                                className="bg-red-600 font-semibold px-4 rounded-md py-1.5 text-white shadow-md hover:shadow-lg hover:bg-red-700 transition-all cursor-pointer"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}

                    {/* Clerk Authentication */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-[#e63946] font-semibold px-4 mr-5 rounded-md py-1.5 text-white shadow-md hover:shadow-lg hover:bg-[#d62828] transition-all cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <div className="mr-4">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox:
                                            'shadow-md hover:shadow-lg transition-shadow bg-[#2a9d8f] hover:bg-[#21867a]',
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </>
    );
};

export default Navbar;