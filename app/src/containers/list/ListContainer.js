import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as listActions from 'store/modules/list';
// import list from '../../store/modules/list';

class ListContainer extends Component {
    getPostList = () => {
        // 페이지와 태그 값을 부모에게서 받아 온다.
        const { tag, page, ListActions } = this.props;
        ListActions.getPostList({ page, tag });
    };

    cavGetPostList = async () => {
        var { cav, postDB } = this.props
        // console.log("this props?", this.props)
        // console.log("list cav? ", cav)
        // console.log("list postDB? ", postDB)

        const postLen = await postDB.methods.getPostLen().call()
        console.log("postLen? ", postLen)
        const posts = []
        for(let i=0; i<postLen; i++) {
            const post = await postDB.methods.posts(i).call()
            posts.push(post)
        }
        console.log("posts? ", posts)
        console.log("posts type? ", typeof posts)
        console.dir(posts)
    }

    componentDidMount() {
        console.log("didmount")
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.loading === false) {
            console.log("Cav 로딩 완료")
            this.cavGetPostList()
        }
        // 페이지/태그가 바뀔 때 리스트를 다시 불러온다.
        if (
            prevProps.page !== this.props.page ||
            prevProps.tag !== this.props.tag
        ) {
            this.getPostList();
            // 스크롤바를 맨 위로 올린다.
            document.documentElement.scrollTop = 0;
        }
    }

    render() {
        const { loading, posts, page, lastPage, tag } = this.props;

        if (loading) return null; // 로딩중이면 아무것도 보이지 않는다.
        if (loading === undefined) return null

        return (
            <div>
                <div>
                    <hr />
                    {this.props.cav.klay.currentProvider.host}<br/>
                    {this.props.postDB.currentProvider.host}
                    <hr />
                </div>
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
