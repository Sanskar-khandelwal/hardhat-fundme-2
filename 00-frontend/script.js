import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.querySelector("#connect-button")
const fundButton = document.querySelector("#fund-button")
const fundInput = document.querySelector("#fund-input")
const getBalancebtn = document.querySelector("#get-balance-button")
const withdrawButton = document.querySelector("#withdraw-button")

connectButton.onclick = connect
getBalancebtn.onclick = getBalance
withdrawButton.onclick = withdraw

fundButton.onclick = fund

async function connect() {
  console.log("i am clicked")
  console.log(ethers)
  {
    if (typeof window.ethereum != "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      connectButton.innerHTML = "Connected Woola!"
    } else {
      connectButton.innerHTML = "Install MetaMask"
    }
  }
}

async function getBalance() {
  if (window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)

    console.log(ethers.utils.formatEther(balance))
  }
}

async function fund() {
  const ethAmount = fundInput.value
  console.log("the input value is", ethAmount)
  if (typeof window.ethereum != "undefined") {
    console.log("funding contract with..", ethAmount)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })

      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done Wolla !! 🥳🥳")
    } catch (error) {
      console.log(error.message)
    }

    //1. Provider a connection to blockchain
    //2. A signer to sign the contract
    //3. ABI to interact with the code & address
    //4. a contract
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log("Mining", transactionResponse.hash)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed transaction with ${transactionReceipt.confirmations} confirmations`,
      )
      resolve()
    })
  })
}
