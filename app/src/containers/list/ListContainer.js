import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as listActions from 'store/modules/list';
import * as caverActions from 'store/modules/caver';
// import list from '../../store/modules/list';

class ListContainer extends Component {
    state = {
        posts: [],
        page: 0,
        tag: [],
        lastPage: 0,
    }

    getPostList = () => {
        // 페이지와 태그 값을 부모에게서 받아 온다.
        const { tag, page, ListActions } = this.props;
        ListActions.getPostList({ page, tag });
    };

    cavGetPostList = async () => {
        console.log("this.state? ", this.state)
        const { cav, postDB, page, tag } = this.props
        console.log("cavGetPostList tag? ", tag)

        const postLen = await postDB.methods.getPostLen().call()
        console.log("postLen? ", postLen)
        console.log("page? ", page)
        if(postLen <= (page-1)*10) {
            return
        }
        const posts = []
        ////////////////////
        // page 1 => 0~9
        // page 2 => 10~19
        ////////////////////
        let size = (page*10)
        for (let i = (page-1) * 10; (i < size && i < postLen); i++) {
            const post = await postDB.methods.posts(i).call()
            if(post.removed === true) {
                // 삭제된 post는 포함시키지 않기
                size++
                continue
            }
            post.tags = post.tags.split(',').map((tag) => {
                return tag.trim()
            })
            if(tag && !post.tags.includes(tag)) {
                size++
                continue
            }
            console.log("tag 일치하는 Post? ", post)
            posts.push(post)
        }
        console.log("cavGetPostList posts? ", posts)
        console.log("posts type? ", typeof posts)
        console.dir(posts)

        console.log("lastPage? ", Math.ceil(postLen / 10))

        this.setState({
            posts,
            lastPage: Math.ceil(postLen / 10) // lastPage 소수점 올림
        })
    }

    componentDidMount() {
        console.log("ListContainer didmount")
        if (this.props.loading === false) {
            this.cavGetPostList()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("ListContainer DidUpdate")
        // 로딩이 true -> false로 변경시에만
        if (
            // this.props.loading === false
            this.props.loading === false &&
            prevProps.loading !== this.props.loading
        ) {
            console.log("Cav 로딩 완료")
            this.cavGetPostList()
        }

        // TODO: 나중에 맞게 구현
        // 페이지/태그가 바뀔 때 리스트를 다시 불러온다.
        if (
            prevProps.page !== this.props.page ||
            prevProps.tag !== this.props.tag
        ) {
            console.log("page나 tag가 바뀜")
            // this.getPostList();
            this.cavGetPostList()
            // 스크롤바를 맨 위로 올린다.
            document.documentElement.scrollTop = 0;
        }
    }

    render() {
        // const { loading, posts, page, lastPage, tag } = this.props;
        // const { loading, page, lastPage, tag } = this.props;
        const { loading, page, tag } = this.props;
        const { posts, lastPage } = this.state

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
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(ListContainer);
