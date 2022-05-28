// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//Contract deploy 0x0eBe746f7e4F92b5b055d38D31938DEC568D4959

//Return the ETH balance of the address passed
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//LOg the ETH balance of a list of addreses
async function printBalances(addreses) {
  let i = 0;
  for (const address of addreses) {
    console.log(`Address ${i} balance: `, await getBalance(address));
    i++
  }
}


//Log the memos stores on-chain
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message}`);

  }
}

async function main() {
  //Get exaample account
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  //Get the contract to and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACofee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log('BuyMeACofee deployed to: ', buyMeACoffee.address);

  //Check balances before the coffee tip
  const addreses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log('=== start ===');
  await printBalances(addreses);

  //Buy hte owner a few coffees
  const tip = { value: hre.ethers.utils.parseEther("0.001") };
  console.log('tip: ', tip);
  await buyMeACoffee.connect(tipper).buyCoffee("Chris", "Huija rendija", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Eze", "Vamo' que no' vamo'", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Fer", "No me rompan las pel...", tip);

  //Check balances after coffee purchase
  console.log('=== after coffee purchase ===');
  await printBalances(addreses);

  //Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  //Check balance after withdraw
  console.log('=== after withdraw tips ===');
  await printBalances(addreses);

  //Read all the memos
  console.log('=== memos ===');
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
