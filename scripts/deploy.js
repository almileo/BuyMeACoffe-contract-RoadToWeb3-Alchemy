// const 
const hre = require("hardhat");

async function main() {

    //Get the contract to and deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACofee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log('BuyMeACofee deployed to: ', buyMeACoffee.address);

} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });