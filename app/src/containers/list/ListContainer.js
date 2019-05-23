import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as caverActions from 'store/modules/caver';

class ListContainer extends Component {
    state = {
        posts: [],
        page: 0,
        tag: [],
        lastPage: 0,
    }

    cavGetPostList = async () => {
        const { postDB, page, tag } = this.props

        const postLen = await postDB.methods.getPostLen().call()
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
            posts.push(post)
        }
        this.setState({
            posts,
            lastPage: Math.ceil(postLen / 10) // lastPage 소수점 올림
        })
    }

    componentDidMount() {
        if (this.props.loading === false) {
            this.cavGetPostList()
        }
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

        // 페이지/태그가 바뀔 때 리스트를 다시 불러온다.
        if (
            prevProps.page !== this.props.page ||
            prevProps.tag !== this.props.tag
        ) {
            this.cavGetPostList()
            // 스크롤바를 맨 위로 올린다.
            document.documentElement.scrollTop = 0;
        }
    }

    render() {
        const { loading, page, tag } = this.props;
        const { posts, lastPage } = this.state

        if (loading) return null; // 로딩중이면 아무것도 보이지 않는다.
        if (loading === undefined) return null

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
        postDB: state.caver.get('postDB'),
        loading: state.pender.pending['caver/INITIALIZE'],
    }),
    (dispatch) => ({
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(ListContainer);
