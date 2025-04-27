// components/EventDetails.tsx
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getContract } from '../utils/grantDistribution' // Assuming your contract utils are here
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { Event, Proposal, Prize } from '../../types/index' // Import your types

const injected = new InjectedConnector({
  supportedChainIds: [11155111], // Replace with the chain IDs you want to support
})

interface EventDetailsProps {
  eventId: string
}

// Replace with your actual admin private key (STORED SECURELY IN BACKEND!)
const ADMIN_PRIVATE_KEY = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY
// Replace with your RPC provider URL
const RPC_PROVIDER_URL = process.env.NEXT_PUBLIC_RPC_PROVIDER_URL
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS // Ensure this is in your env
import GrantDistributionABI from '../../smartContract/out/GrantDistribution.sol/GrantDistribution.json' // Adjust path as needed

const EventDetails: React.FC<EventDetailsProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null)
  const [winnerProposalDetails, setWinnerProposalDetails] =
    useState<Proposal | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [distributionStatusFrontend, setDistributionStatusFrontend] =
    useState<string>('')
  const [distributionStatusBackend, setDistributionStatusBackend] =
    useState<string>('')
  const [fetchingWinnerProposal, setFetchingWinnerProposal] =
    useState<boolean>(false)
  const [winnerProposalError, setWinnerProposalError] = useState<string | null>(
    null
  )
  const { account, provider, connector, hooks } = useWeb3React()
  const { usePriorityConnector } = hooks
  const priorityConnector = usePriorityConnector()
  const activate = priorityConnector?.activate

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) {
          const message = `An error occurred: ${response.status}`
          throw new Error(message)
        }
        const data: Event = await response.json()
        setEvent(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEventDetails()
    }
  }, [eventId])

  useEffect(() => {
    const fetchWinnerProposalDetails = async () => {
      if (event?.winnerProposal) {
        setFetchingWinnerProposal(true)
        setWinnerProposalError(null)
        try {
          const response = await fetch(`/api/proposals/${event.winnerProposal}`)
          if (!response.ok) {
            const message = `Error fetching winner proposal: ${response.status}`
            throw new Error(message)
          }
          const data: Proposal = await response.json()
          setWinnerProposalDetails(data)
        } catch (err: any) {
          setWinnerProposalError(err.message)
        } finally {
          setFetchingWinnerProposal(false)
        }
      } else {
        setWinnerProposalDetails(null)
      }
    }

    if (event?.winnerProposal) {
      fetchWinnerProposalDetails()
    }
  }, [event?.winnerProposal])

  const connectWallet = async () => {
    if (activate && connector) {
      try {
        await activate(connector)
      } catch (error: any) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      console.warn('activate function or connector is not available.')
    }
  }

  const handleDistributeGrantFrontend = async () => {
    if (!account || !provider?.getSigner() || !winnerProposalDetails?.id) {
      setDistributionStatusFrontend(
        'Please connect your wallet and ensure a winner proposal is loaded.'
      )
      return
    }

    setDistributionStatusFrontend('Initiating grant distribution (frontend)...')
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS!,
        GrantDistributionABI.abi,
        signer as any
      )
      const proposalId = parseInt(winnerProposalDetails.id)
      const tx = await contract.distributeGrant(proposalId)
      setDistributionStatusFrontend(`Transaction submitted: ${tx.hash}`)
      await tx.wait()
      setDistributionStatusFrontend(
        'Grant distributed successfully (frontend)!'
      )
      // Optionally update UI
    } catch (error: any) {
      console.error('Error distributing grant (frontend):', error)
      setDistributionStatusFrontend(
        `Grant distribution failed (frontend): ${error.message}`
      )
    }
  }

  const handleDistributeGrantBackend = async () => {
    if (
      !winnerProposalDetails?.id ||
      !ADMIN_PRIVATE_KEY ||
      !RPC_PROVIDER_URL ||
      !CONTRACT_ADDRESS
    ) {
      setDistributionStatusBackend(
        'Configuration missing (Proposal ID, Admin Key, RPC URL, or Contract Address).'
      )
      return
    }

    setDistributionStatusBackend('Initiating grant distribution (backend)...')

    try {
      const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)
      const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GrantDistributionABI.abi,
        adminWallet
      )

      const proposalId = parseInt(winnerProposalDetails.id)
      const tx = await contract.distributeGrant(proposalId)
      setDistributionStatusBackend(`Transaction submitted: ${tx.hash}`)
      await tx.wait()
      setDistributionStatusBackend(
        'Grant distributed successfully (via backend)!'
      )
      // Optionally update UI
    } catch (error: any) {
      console.error('Error distributing grant (backend):', error)
      setDistributionStatusBackend(
        `Grant distribution failed (backend): ${error.message}`
      )
    }
  }

  if (loading) {
    return <p>Loading event details...</p>
  }

  if (error) {
    return <p>Error loading event details: {error}</p>
  }

  if (!event) {
    return <p>Event not found.</p>
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      {winnerProposalDetails && event.prizes && event.prizes.length > 0 ? (
        <div>
          <h2>Winner Information</h2>
          <p>Winner Proposal Title: {winnerProposalDetails.title}</p>
          {winnerProposalDetails.stellarAddress && (
            <p>Winner Wallet Address: {winnerProposalDetails.stellarAddress}</p>
          )}
          {event.prizes.length > 0 && (
            <p>Prize Amount: {event.prizes[0].amount}</p>
          )}

          {!account ? (
            <button onClick={connectWallet}>
              Connect Wallet to Distribute Grant
            </button>
          ) : (
            <button
              onClick={handleDistributeGrantFrontend}
              disabled={distributionStatusFrontend.startsWith('Initiating')}
            >
              Distribute Grant (Frontend)
            </button>
          )}
          {distributionStatusFrontend && <p>{distributionStatusFrontend}</p>}

          {ADMIN_PRIVATE_KEY && RPC_PROVIDER_URL && CONTRACT_ADDRESS && (
            <button
              onClick={handleDistributeGrantBackend}
              disabled={distributionStatusBackend.startsWith('Initiating')}
            >
              Distribute Grant (Backend - Admin Only)
            </button>
          )}
          {distributionStatusBackend && <p>{distributionStatusBackend}</p>}

          {fetchingWinnerProposal && <p>Fetching winner proposal details...</p>}
          {winnerProposalError && (
            <p className="error">
              Error fetching winner proposal: {winnerProposalError}
            </p>
          )}
        </div>
      ) : (
        <p>
          {event.winnerProposal
            ? fetchingWinnerProposal
              ? 'Fetching winner proposal details...'
              : winnerProposalError
              ? `Error fetching winner proposal: ${winnerProposalError}`
              : 'No prize information available.'
            : 'No winner has been selected for this event yet.'}
        </p>
      )}
    </div>
  )
}

export default EventDetails
