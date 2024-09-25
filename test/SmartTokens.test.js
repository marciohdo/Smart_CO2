// SmartTokens.test.js

const SmartTokens = artifacts.require("SmartTokens");

contract("SmartTokens", (accounts) => {
  let smartTokens;

  beforeEach(async () => {
    smartTokens = await SmartTokens.new();
  });

  it("tokens mintados", async () => {
    const CCT = 100; // quantidade de tokens
    const projectName = "TestProject";
    const startDate = Math.floor(Date.now() / 1000); // data de início (agora)
    const endDate = startDate + 86400; // data de término (um dia depois)
    const ipfsHash = "QmVeNDxGwFNgF4JB6LSK2GvWFv9M8FskrDTmf1c99LV2Zx";

    await smartTokens.mint(CCT, projectName, startDate, endDate, ipfsHash);

    const lastTokenId = await smartTokens.getLastMintedTokenId();
    console.log('teste lastTokenId',lastTokenId);
    const tokenDetails = await smartTokens.getMintedTokenInfo(lastTokenId);
    console.log('teste tokenDetails',tokenDetails);

    assert.equal(tokenDetails.CCT, CCT, "Incorrect token quantity");
    assert.equal(tokenDetails.projectName, projectName, "Incorrect project name");
    assert.equal(tokenDetails.startDate, startDate, "Incorrect start date");
    assert.equal(tokenDetails.endDate, endDate, "Incorrect end date");
    assert.equal(tokenDetails.ipfsHash, ipfsHash, "Incorrect IPFS hash");
    assert.equal(tokenDetails.creatorContract, accounts[0], "Incorrect creator contract");
  });
});
