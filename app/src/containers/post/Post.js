import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import removeMd from 'remove-markdown';
import { Helmet } from 'react-helmet';
// import * as caverActions from 'store/modules/caver';

class Post extends Component {
    state = {
        post: null,
    }
    initialize = async () => {
        const { id, postDB } = this.props;
        try {
            const post = await postDB.methods.posts(id).call()
            console.log("Post.js init? ", post)
            this.setState({ post })
        } catch (e) {
            if(e) throw e
        }
    }

    componentDidMount() {
        console.log("Post.js 마운트")
        if (this.props.loading === false) {
            this.initialize();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("Post.js 업데이트")
        // 로딩이 true -> false로 변경시에만
        if (
            this.props.loading === false &&
            prevProps.loading !== this.props.loading
        ) {
            this.initialize();
        }
    }

    render() {
        const { post } = this.state

        if(!!!post) return null // post가 없으면 보여주지 않음

        // const { title, body, publishedDate, tags } = post.toJS();
        const { title, body, publishedDate, tags } = post;

        return (
            <div>
                {/* body 값이 있을 때만 Helmet 설정 */}
                {body && (
                    <Helmet>
                        <title>{title}</title>
                        {/* description이 너무 길면 안되니까 200자 제한 */}
                        <meta name="description" content={removeMd(body).slice(0, 200)} />
                    </Helmet>
                )}
                <PostInfo title={title} publishedDate={publishedDate} tags={tags} />
                <PostBody body={body} />
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
        // CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(Post);