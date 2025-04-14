// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AidogDynamicNFT is ERC721, Ownable {
    using Strings for uint256;
    
    // Base URI for metadata (just the IPFS CID)
    string private _baseTokenURI;
    
    // NFT metadata version tracking
    mapping(uint256 => uint256) private _tokenVersions;
    
    // Total supply tracking
    uint256 private _tokenIdCounter;

    // Events
    event MetadataUpdated(uint256 indexed tokenId, uint256 version);
    event BaseURIUpdated(string newBaseURI);

    constructor(string memory initialBaseURI) ERC721("AidogDynamicNFT", "ADNFT") Ownable(msg.sender) {
        _baseTokenURI = initialBaseURI;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        
        // Set initial version
        _tokenVersions[tokenId] = 1;
        
        return tokenId;
    }

    function updateMetadata(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        
        // Increment the version
        _tokenVersions[tokenId]++;
        
        emit MetadataUpdated(tokenId, _tokenVersions[tokenId]);
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function getTokenVersion(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenVersions[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Override tokenURI to build the full URI with parameters
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        string memory baseURI = _baseURI();
        return string(
            abi.encodePacked(
                baseURI,
                "?tokenId=",
                tokenId.toString(),
                "&version=",
                _tokenVersions[tokenId].toString()
            )
        );
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}