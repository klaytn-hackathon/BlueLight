import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import removeMd from 'remove-markdown';
import { Helmet } from 'react-helmet';
import { NotificationManager } from 'react-notifications'

class Post extends Component {
    state = {
        post: null,
    }
    initialize = async () => {
        const { id, postDB, history } = this.props;
        try {
            const post = await postDB.methods.posts(id).call()
            if(post.removed) {
                // 삭제된 포스트는 출력하지 않는다.
                NotificationManager.warning("열람 불가", "삭제된 포스트입니다.")
                history.push('/')
                return
            }
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
    })
)(withRouter(Post));