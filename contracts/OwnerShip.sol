pragma solidity 0.4.24;

contract OwnerShip {
    address public superOwner;
    mapping(address => bool) public owners;

    event ChangeSuperOwner(address _superOwner);
    event AddOwner(address _owner);
    event DeleteOwner(address _owner);

    modifier onlySuperOwner() {
        require(msg.sender == superOwner, "onlySuperOwner");
        _;
    }
    modifier onlyOwner() {
        require(owners[msg.sender], "onlyOwner");
        _;
    }

    function changeSuperOwner(address _superOwner) public onlySuperOwner {
        superOwner = _superOwner;
        emit ChangeSuperOwner(_superOwner);
    }
    function addOwner(address _owner) public onlySuperOwner {
        require(!owners[_owner], "_owner is already owner");
        owners[_owner] = true;
        emit AddOwner(_owner);
    }
    function deleteOwner(address _owner) public onlySuperOwner {
        require(owners[_owner], "_owner is not owner");
        owners[_owner] = false;
        emit DeleteOwner(_owner);
    }
}