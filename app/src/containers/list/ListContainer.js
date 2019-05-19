import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as listActions from 'store/modules/list';
// import list from '../../store/modules/list';

class ListContainer extends Component {
    state = {
        posts: [],
        page: 0,
        tag: [],
        lastPage: false,
    }

    getPostList = () => {
        // 페이지와 태그 값을 부모에게서 받아 온다.
        const { tag, page, ListActions } = this.props;
        ListActions.getPostList({ page, tag });
    };

    cavGetPostList = async () => {
        console.log("this.state? ", this.state)
        var { cav, postDB } = this.props
        // console.log("this props?", this.props)
        // console.log("list cav? ", cav)
        // console.log("list postDB? ", postDB)

        const postLen = await postDB.methods.getPostLen().call()
        console.log("postLen? ", postLen)
        const posts = []
        for (let i = 0; i < postLen; i++) {
            const post = await postDB.methods.posts(i).call()
            // TODO: 나중에 ID나 body를 post객체 변경 말고 PostList.js의 넘겨주는 값을 바꾸기
            post._id = i
            post.body = post.content
            post.tags = ["tagA", "tagB"]
            posts.push(post)
        }
        console.log("cavGetPostList posts? ", posts)
        console.log("posts type? ", typeof posts)
        console.dir(posts)

        this.setState({
            posts
        })
    }

    componentDidMount() {
        console.log("didmount")
    }

    componentDidUpdate(prevProps, prevState) {
        // 로딩이 true -> false로 변경시에만
        if (
            this.props.loading === false &&
            prevProps.loading !== this.props.loading
        ) {
            console.log("Cav 로딩 완료")
            this.cavGetPostList()
        }

        // TODO: 나중에 맞게 구현
        /*
        // 페이지/태그가 바뀔 때 리스트를 다시 불러온다.
        if (
            prevProps.page !== this.props.page ||
            prevProps.tag !== this.props.tag
        ) {
            this.getPostList();
            // 스크롤바를 맨 위로 올린다.
            document.documentElement.scrollTop = 0;
        }
        */
    }

    render() {
        // const { loading, posts, page, lastPage, tag } = this.props;
        const { loading, page, lastPage, tag } = this.props;
        const { posts } = this.state

        if (loading) return null; // 로딩중이면 아무것도 보이지 않는다.
        if (loading === undefined) return null

        console.log("posts? ", posts)
        console.log("this.state!!!", this.state)

        return (
            <div>
                <PostList posts={posts} />
                <Pagination page={page} lastPage={lastPage} tag={tag} />
            </div>
        );
    }
}

export default connect(
    (state) => ({
        posts: state.list.get('posts'),
        lastPage: state.list.get('lastPage'),
        cav: state.caver.get('cav'),
        postDB: state.caver.get('postDB'),
        // loading: state.pender.pending['list/GET_POST_LIST'],
        loading: state.pender.pending['caver/INITIALIZE'],
        // loading: state.caver.loading,
    }),
    (dispatch) => ({
        ListActions: bindActionCreators(listActions, dispatch),
    })
)(ListContainer);
