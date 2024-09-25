// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//IPFS            QmVeNDxGwFNgF4JB6LSK2GvWFv9M8FskrDTmf1c99LV2Zx
//startedate  1695257200000 = Wed 20 September 2023 21:46:40 (data-type is "Number")
//Endedate    1675257200000 = Wed  1 February  2023 10:13:20 (data-type is "Number")
// A variavel "amount" eu subistui pela var = CCT para indicar a quantide de Tokens de que contrato vai disponibilidar.

contract SmartTokens_copy2 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;
    address authorizer;
    mapping(uint256 => address) private mintedTokenAccounts;
    mapping(uint256 => uint256) private mintedTokenAmounts; 
    mapping(uint256 => string)  public mintedTokenProjectNames;
    mapping(uint256 => uint256) public mintedTokenStartDates;
    mapping(uint256 => uint256) public mintedTokenEndDates;
    mapping(uint256 => string)  public mintedTokenIPFSHashes;   
    uint256 public operatorSharePercentage = 80;
    uint256 public ownerSharePercentage = 20;
    uint256 private lastMintedTokenId = 0;

    struct Purchase { //usado em getTokensPurchasedByContract 
        address contractAddress;
        uint256 tokenId;
        uint256 amount;
        address minterContract; // Contrato que fez o mint
    }
    Purchase[] private purchases;

    constructor() ERC1155("https://myapi/token/{id}.json") { 
        authorizer = _msgSender();
    }

    function mint(uint256 CCT, 
                  string memory projectName,
                  uint256 startDate,
                  uint256 endDate,
                  string memory ipfsHash,
                  bytes memory data) public {
                  lastMintedTokenId = lastMintedTokenId + 1;
                  tokenIdCounter.increment();
                  uint256 tokenId = tokenIdCounter.current();        
                  mintedTokenAccounts[tokenId] = msg.sender;
                  mintedTokenAmounts[tokenId] = CCT;
                  mintedTokenProjectNames[tokenId] = projectName;
                  mintedTokenStartDates[tokenId] = startDate;
                  mintedTokenEndDates[tokenId] = endDate;
                  mintedTokenIPFSHashes[tokenId] = ipfsHash;        
        _mint(msg.sender, tokenId, CCT, data);
    }

    function getLastMintedTokenId() public view returns (uint256) {
        return lastMintedTokenId;
    }
 
    function getLastMintedTokenDetails() public view returns (address account, uint256 CCT, uint256 tokenId) {
        require(lastMintedTokenId > 0, "No tokens minted yet");
        return (mintedTokenAccounts[lastMintedTokenId], mintedTokenAmounts[lastMintedTokenId], lastMintedTokenId);  
    }

    function setShares(uint256 _operatorSharePercentage, uint256 _ownerSharePercentage) public onlyOwner {
        require(_operatorSharePercentage + _ownerSharePercentage <= 100, "Invalid shares");
        operatorSharePercentage = _operatorSharePercentage;
        ownerSharePercentage = _ownerSharePercentage;
    }

    function getMinterOfToken(uint256 tokenId) public view returns (address) {
        return mintedTokenAccounts[tokenId];
    }  

    function setApprovalForAll(address operator, bool approved) public override{
        super._setApprovalForAll(authorizer,operator, approved );
    }

      //remover depois
    function executeSetApprovalForAll() public {
    setApprovalForAll(msg.sender, true);
    }

   /* function approveOperator(address operator) public onlyOwner {
    setApprovalForAll(operator, true);
    }*/ 
    // A função retorna as informações do Token criado usando o tokenID 17/09/2023
    function getMintedTokenInfo(uint256 tokenId) public view returns (
        uint256 CCT,
        string memory projectName,
        uint256 startDate,
        uint256 endDate,
        string memory ipfsHash,
        address creatorContract
    )    {
        require(tokenId <= lastMintedTokenId && tokenId > 0, "Invalid token ID");    
        CCT = mintedTokenAmounts[tokenId];
        projectName = mintedTokenProjectNames[tokenId];
        startDate = mintedTokenStartDates[tokenId];
        endDate = mintedTokenEndDates[tokenId];
        ipfsHash = mintedTokenIPFSHashes[tokenId];
        creatorContract = mintedTokenAccounts[tokenId];
    }

    //retorna várias matrizes contendo informações sobre todos os tokens criados. 17/09/2023
    function getMintedTokenInfoAll() public view returns (
            uint256[] memory tokenIds,
            uint256[] memory CCTs,
            string[] memory projectNames,
            uint256[] memory startDates,
            uint256[] memory endDates,
            string[] memory ipfsHashes,
            address[] memory creatorContracts
        ) {
            tokenIds = new uint256[](lastMintedTokenId);
            CCTs = new uint256[](lastMintedTokenId);
            projectNames = new string[](lastMintedTokenId);
            startDates = new uint256[](lastMintedTokenId);
            endDates = new uint256[](lastMintedTokenId);
            ipfsHashes = new string[](lastMintedTokenId);
            creatorContracts = new address[](lastMintedTokenId);

            for (uint256 i = 1; i <= lastMintedTokenId; i++) {
                tokenIds[i - 1] = i;
                CCTs[i - 1] = mintedTokenAmounts[i];
                projectNames[i - 1] = mintedTokenProjectNames[i];
                startDates[i - 1] = mintedTokenStartDates[i];
                endDates[i - 1] = mintedTokenEndDates[i];
                ipfsHashes[i - 1] = mintedTokenIPFSHashes[i];
                creatorContracts[i - 1] = mintedTokenAccounts[i];
            }
        }    

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(
           owner() != to,
            "ERC1155: caller is not token owner or approved"
        );
        super._safeTransferFrom(from, to, id, amount, data);
    }

    function buyTokens(uint256 tokenId, uint256 amount) public payable {
     require(mintedTokenAmounts[tokenId] >= amount, "Insufficient balance");
    
     uint256 price = amount * 1 ether;
     uint256 operatorCommission = price * operatorSharePercentage / 100;
     uint256 ownerCommission = price * ownerSharePercentage / 100;
     //uint256 sellerShare = price - operatorShare - ownerShare;

     require(msg.value >= price, "Insufficient payment");
    
     mintedTokenAmounts[tokenId] -= amount;
    
     //liberar a aprovação 
     setApprovalForAll(msg.sender,true);

     address tokenOwner = mintedTokenAccounts[tokenId]; // Get the current token owner
     emit TransferSingle(tokenOwner, address(0), msg.sender, tokenId, amount); // Emit TransferSingle event

    // Transfer tokens from tokenOwner to the buyer
     safeTransferFrom(tokenOwner, msg.sender, tokenId, amount, "");

    // Transfer Ether to the tokenOwner
    // payable(tokenOwner).transfer(price); //para receber 100% sem comissaõ.
     payable(owner()).transfer(ownerCommission);
     payable(tokenOwner).transfer(operatorCommission);
    }

function getMintedTokenInfoByContract(address contractAddress) public view returns (
    uint256[] memory tokenIds,
    uint256[] memory CCTs,
    string[] memory projectNames,
    uint256[] memory startDates,
    uint256[] memory endDates,
    string[] memory ipfsHashes,
    address[] memory creatorContracts
) {
    uint256[] memory matchingTokenIds = new uint256[](lastMintedTokenId);
    uint256 matchCount = 0;

    for (uint256 i = 1; i <= lastMintedTokenId; i++) {
        if (mintedTokenAccounts[i] == contractAddress) {
            matchingTokenIds[matchCount] = i;
            matchCount++;
        }
    }

    tokenIds = new uint256[](matchCount);
    CCTs = new uint256[](matchCount);
    projectNames = new string[](matchCount);
    startDates = new uint256[](matchCount);
    endDates = new uint256[](matchCount);
    ipfsHashes = new string[](matchCount);
    creatorContracts = new address[](matchCount);

    for (uint256 j = 0; j < matchCount; j++) {
        uint256 tokenId = matchingTokenIds[j];
        tokenIds[j] = tokenId;
        CCTs[j] = mintedTokenAmounts[tokenId];
        projectNames[j] = mintedTokenProjectNames[tokenId];
        startDates[j] = mintedTokenStartDates[tokenId];
        endDates[j] = mintedTokenEndDates[tokenId];
        ipfsHashes[j] = mintedTokenIPFSHashes[tokenId];
        creatorContracts[j] = mintedTokenAccounts[tokenId];
    }
}

    
}