pragma solidity 0.4.24;

import './OwnerShip.sol';

contract Blacklist is OwnerShip {

    mapping(address => bool) blacklist;

    event AddBlacklist(address _node);
    event DeleteBlacklist(address _node);

    modifier whoPermitted() {
        require(!blacklist[msg.sender], "you are blacklist");
        _;
    }

    function addBlacklist(address _node) public onlyOwner returns(bool) {
        require(blacklist[_node] == false, "_node is already blacklist");
        blacklist[_node] = true;
        emit AddBlacklist(_node);
    }
    function deleteBlacklist(address _node) public onlyOwner returns(bool) {
        require(blacklist[_node] == true, "_node is not blacklist");
        blacklist[_node] = false;
        emit DeleteBlacklist(_node);
    }
}