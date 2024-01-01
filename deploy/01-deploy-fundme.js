const { networkConfig } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  console.log("the chainId is", chainId)
  let ethUsdPriceFeedAddress

  if (chainId == "31337") {
    const ethUsdAggregator = await get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
  }
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  console.log("------------------------------")

  if (chainId != 31337) {
    await verify(fundMe.address, args)
  }
}

module.exports.tags = ["all", "fundme"]
