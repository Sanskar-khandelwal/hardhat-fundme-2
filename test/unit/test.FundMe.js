const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
  let fundMe, deployer, MockV3Aggregator
  const sendValue = ethers.parseEther("1")
  beforeEach(async () => {
    // const accounts = await ethers.getSigners()
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture("all")
    fundMe = await ethers.getContract("FundMe", deployer)
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })

  describe("constructor", async function () {
    it("sets the aggregator addresses correctly", async function () {
      const response = await fundMe.priceFeed()
      assert.equal(response, MockV3Aggregator.target)
    })
  })

  describe("fund", async function () {
    it("fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.reverted
    })

    it("updates the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.addressToAmountFunded(deployer)
      assert.equal(response.toString(), sendValue.toString())
    })

    it("updates the funders array", async function () {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.funders(0)
      assert.equal(response, deployer)
    })
  })
})
