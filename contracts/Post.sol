pragma solidity >=0.4.21 <0.6.0;

contract Post {

    struct post {
        string title;
        string content;
        string tag;
    }
    
    mapping(uint256 => post) posts;

    constructor() public {

    }
}
