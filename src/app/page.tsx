'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const navigateToDashboard = function () {
    router.push('/host/dashboard')
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Decentralized Grant Program
            </h1>
            <p className="text-lg mt-4 font-medium">
              Empowering innovation through hackathons and competitive events.
            </p>
            <div className="mt-6">
              <Link
                href={'/event'}
                className=" px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                  🚀
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Fast Innovation
                </h3>
                <p className="text-gray-600 mt-2">
                  Participate in hackathons to build cutting-edge blockchain
                  solutions.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 text-purple-600 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                  💡
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Creative Challenges
                </h3>
                <p className="text-gray-600 mt-2">
                  Compete in events designed to spark innovation in Web3 and
                  DeFi.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                  🌐
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Global Community
                </h3>
                <p className="text-gray-600 mt-2">
                  Join a network of developers, creators, and innovators
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Innovate?</h2>
            <p className="text-lg mb-6">
              Join our community and start building the future of decentralized
              technology.
            </p>
            <button
              onClick={navigateToDashboard}
              className="cursor-pointer px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Join Now
            </button>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-6">
          <p className="text-center text-sm">
            © Lazy Coders. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  )
}
