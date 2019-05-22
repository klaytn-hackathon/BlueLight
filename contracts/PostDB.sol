pragma solidity 0.4.24;

// TODO: 파일 분리하기
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
    function removeOwner(address _owner) public onlySuperOwner {
        require(owners[_owner], "_owner is not owner");
        owners[_owner] = false;
        emit DeleteOwner(_owner);
    }
}

contract PostDB is OwnerShip {

    struct Post {
        uint256 _id; // post의 id
        address author; // post 작성자
        string title; // 제목
        string body; // 내용
        string tags; // 태그(콤마로 구분)
        uint256 publishedDate; // 작성한 시간
        uint256 modifiedDate; // 최근 수정 시간
        bool removed; // 삭제되었는지 여부
    }
    
    // mapping(uint256 => post) public posts;
    Post[] public posts;

    constructor() public {
        superOwner = msg.sender;
        owners[msg.sender] = true;
    }

    modifier onlyAuthorOrOwner(uint256 postId) {
        require(
            msg.sender == posts[postId].author ||
            owners[msg.sender],
            "onlyAuthorOrOwner"
        );
        _;
    }
    modifier onlyActivePost(uint256 postId) {
        require(postId < posts.length, "post undefined");
        require(!posts[postId].removed, "this post was removed");
        _;
    }

    event AddPost(uint256 indexed postId, address indexed author, string indexed title, string body, string tags, uint256 publishedDate);
    event ModifyPost(uint256 indexed postId, address indexed author, string indexed title, string body, string tags, uint256 modifiedDate);
    event DisablePost(uint256 postId);
    event EnablePost(uint256 postId);
    
    // TODO: 포스트 수정기능 구현필요
    /**
        @dev 포스트 생성
        @param title 타이틀
        @param body 바디
        @param tags 태그
    */
    function addPost(string memory title, string memory body, string memory tags) public returns(bool) {
        uint256 postId = posts.length;
        address author = msg.sender;
        uint256 publishedDate = now;
        bool removed = false;
        posts.push(Post(
            postId,
            author,
            title,
            body,
            tags,
            publishedDate,
            publishedDate, // modifiedDate
            removed
        ));
        emit AddPost(postId, author, title, body, tags, publishedDate);
        return true;
    }

    /**
        @dev 삭제되지 않은 포스트만 수정 가능
        @param postId 수정할 post의 id
        @param title 수정된 tilte
        @param body 수정된 body
        @param tags 수정된 tags
    */
    function modifyPost(uint256 postId, string memory title, string memory body, string memory tags)
    public onlyActivePost(postId) onlyAuthorOrOwner(postId) 
    returns(bool) {
        address author = posts[postId].author;
        uint256 publishedDate = posts[postId].publishedDate;
        uint256 modifiedDate = now;
        bool removed = false;
        posts[postId] = Post(
            postId,
            author,
            title,
            body,
            tags,
            publishedDate,
            modifiedDate,
            removed
        );
        emit ModifyPost(postId, author, title, body, tags, modifiedDate);
        return true;
    }

    /**
        @dev post를 비활성화한다.
        @param postId 비활성화할 post의 id
    */
    function removePost(uint postId) public onlyActivePost(postId) onlyAuthorOrOwner(postId) returns(bool) {
        posts[postId].removed = true;
        emit DisablePost(postId);
        return true;
    }

    function getPostLen() public view returns(uint256) {
        return posts.length;
    }
}