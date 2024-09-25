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

contract SmartTokens_copy is ERC1155, Ownable {
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

   /* function setApprovalForAll(address operator, bool approved) public override {
    require(msg.sender != operator, "ERC1155: setting approval status for self");
        
        // Adicione aqui a lógica personalizada, se necessário

        super.setApprovalForAll(operator, approved);
    }*/

   /* function setApprovalForAll(address operator, bool approved) public override {
   // require(owner() != operator, "ERC1155: setting approval status for self1");
        
        // Adicione aqui a lógica personalizada, se necessário
        
        super.setApprovalForAll(operator, approved);
    }*/

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
}
