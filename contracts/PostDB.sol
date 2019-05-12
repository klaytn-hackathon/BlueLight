pragma solidity >=0.4.21 <0.6.0;

contract PostDB {

    struct Post {
        string title;
        string content;
        string tag;
        uint256 publishedDate;
        bool removed;
    }
    
    // mapping(uint256 => post) public posts;
    Post[] public posts;

    constructor() public {

    }

    event SetPost(string indexed title, string content, string tag, uint256 publishedDate);
    
    // TODO: 포스트 수정기능 구현필요
    function setPost(string memory title, string memory content, string memory tag) public {
        posts.push(Post(
            title,
            content,
            tag,
            now,
            false
        ));
    }

    function getPostLen() public view returns(uint256) {
        return posts.length;
    }

}