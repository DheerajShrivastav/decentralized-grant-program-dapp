import { ethers, Signer } from 'ethers'
import GrantDistributionJSON from '../../smartContract/out/GrantDistribution.sol/GrantDistribution.json'

const contractAddress = 'YOUR_CONTRACT_ADDRESS' // Replace with your deployed contract address
type ProviderOrSigner = ethers.Provider | Signer
const GrantDistributionABI = GrantDistributionJSON.abi
export const getContract = (providerOrSigner: ProviderOrSigner) => {
  return new ethers.Contract(
    contractAddress,
    GrantDistributionABI,
    providerOrSigner
  )
}

export const submitProposal = async (
  signer: Signer,
  title: string,
  description: string,
  requestedAmount: ethers.Numeric
) => {
  try {
    const contract = getContract(signer)
    const tx = await contract.submitProposal(
      title,
      description,
      requestedAmount
    )
    await tx.wait()
    console.log('Proposal submitted successfully:', tx.hash)
    return true
  } catch (error) {
    console.error('Error submitting proposal:', error)
    return false
  }
}

export const approveProposal = async (signer: Signer, proposalId: Number) => {
  try {
    const contract = getContract(signer)
    const tx = await contract.approveProposal(proposalId)
    await tx.wait()
    console.log(`Proposal ${proposalId} approved successfully:`, tx.hash)
    return true
  } catch (error) {
    console.error(`Error approving proposal ${proposalId}:`, error)
    return false
  }
}

export const distributeGrant = async (signer: Signer, proposalId: Number) => {
  try {
    const contract = getContract(signer)
    const tx = await contract.distributeGrant(proposalId)
    await tx.wait()
    console.log(
      `Grant for proposal ${proposalId} distributed successfully:`,
      tx.hash
    )
    return true
  } catch (error) {
    console.error(`Error distributing grant for proposal ${proposalId}:`, error)
    return false
  }
}

export const getAdmin = async (provider: ethers.Provider) => {
  try {
    const contract = getContract(provider)
    const adminAddress = await contract.admin()
    return adminAddress
  } catch (error) {
    console.error('Error fetching admin address:', error)
    return null
  }
}

export const getProposalCount = async (provider: ethers.Provider) => {
  try {
    const contract = getContract(provider)
    const count = await contract.proposalCount()
    return count.toNumber()
  } catch (error) {
    console.error('Error fetching proposal count:', error)
    return 0
  }
}

export const getProposal = async (
  provider: ethers.Provider,
  proposalId: Number
) => {
  try {
    const contract = getContract(provider)
    const proposal = await contract.proposals(proposalId)
    return proposal
  } catch (error) {
    console.error(`Error fetching proposal ${proposalId}:`, error)
    return null
  }
}
