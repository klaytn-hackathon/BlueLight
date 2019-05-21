import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import * as postActions from 'store/modules/post';
import * as caverActions from 'store/modules/caver';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import removeMd from 'remove-markdown';
import { Helmet } from 'react-helmet';

class Post extends Component {
    state = {
        post: null,
    }
    initialize = async () => {
        const { PostActions, CaverActions, id, cav, postDB } = this.props;
        try {
            const post = await postDB.methods.posts(id).call()
            this.setState({ post })
        } catch (e) {
            if(e) throw e
        }
    }

    componentDidMount() {
        if (this.props.loading === false) {
            this.initialize();
        }
    }

    componentDidUpdate(prevProps, prevState) {
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
        post: state.post.get('post'),
        // loading: state.pender.pending['post/GET_POST'], // 로딩 상태 (boolean)
        loading: state.pender.pending['caver/INITIALIZE'],
        cav: state.caver.get('cav'),
        postDB: state.caver.get('postDB'),
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(Post);