//Import necessary modules from Hardhat and SwisstronikJS

const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

//Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
   //Address of the deployed contract

  const contractAddress = "0x80e494f85bf03237cE3aFd61b801ED697defd5a8";

  //Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  //Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory('TestToken');
  const contract = contractFactory.attach(contractAddress);

  //Send a shielded transaction to execute a transaction in the contract
  const replace_functionName = "transfer";
  //Default wallet + amount
  const replace_functionArgs = ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1", "1"];
  const transaction = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData(replace_functionName, replace_functionArgs), 0);

  await transaction.wait();

  console.log("Transaction hash:", `https://explorer-evm.testnet.swisstronik.com/tx/${transaction.hash}`);
}

//Using asyncawait pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});