"use client"
import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar = () => {
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const [error, setError] = useState<string | null>(null);
    const [hasWallet, setHasWallet] = useState<boolean | null>(null);

    // Check if wallet is available on component mount
    useEffect(() => {
        setHasWallet(typeof window !== 'undefined' && window.ethereum !== undefined);
    }, []);

    const handleConnect = async () => {
        try {
            if (typeof window !== 'undefined' && !window.ethereum) {
                setError('No wallet extension detected. Please install MetaMask or another wallet extension.');
                // Error message will disappear after 5 seconds
                setTimeout(() => setError(null), 5000);
                return;
            }

            await connect({ connector: injected() });
        } catch (err) {
            console.error('Connection error:', err);
            setError('Failed to connect wallet. Please try again.');
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <>
            <div className="navbarbox flex justify-between bg-[#ffd166] mt-6 rounded-xl items-center shadow-lg relative">
                <Link href={'/'} className="py-[15px] px-[30px] text-2xl font-semibold text-black">
                    HackZy
                </Link>
                <div className="flex items-center gap-4">


                    {/* Connect Wallet Button */}
                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            className={`font-semibold px-4 rounded-md py-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 
                                ${hasWallet === false
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-[#1d3557] text-[#f1faee] hover:bg-[#457b9d]"}`}
                        >
                            {hasWallet === false && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-red-600 font-bold">!</span>
                            )}
                            {hasWallet === false ? "No Wallet" : "Connect Wallet"}
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