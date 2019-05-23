import React, { Component } from 'react';
import EditorHeader from 'components/editor/EditorHeader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications'

import * as baseActions from 'store/modules/base';
import * as editorActions from 'store/modules/editor';
import * as caverActions from 'store/modules/caver';


class EditorHeaderContainer extends Component {
    async componentDidMount() {
        if (this.props.loading === false) {
            this.initialize();
        }
    }
    
    initialize = async () => {
        const { EditorActions, location } = this.props;
        EditorActions.initialize(); // 에디터를 초기화한다.

        // 쿼리 파싱
        const { id } = queryString.parse(location.search);

        if (id) {
            // id가 존재하면 포스트 불러오기

            const post = await this.props.postDB.methods.posts(id).call()
            // EditorActions.getPost(id);
            EditorActions.setPost(post)
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

    handleGoBack = () => {
        const { history } = this.props;
        history.goBack();
    }

    handleSubmit = async () => {
        const { title, markdown, tags, history, location, BaseActions } = this.props;
        const post = {
            title,
            body: markdown,
            tags
        };

        try {
            BaseActions.showSpinner()
            // id가 존재하면 editPost 호출
            const { id } = queryString.parse(location.search);
            if (id) {
                await this.modifyPost(id, post)
                .then((receipt) => {
                    history.push(`/post/${id}`);
                    NotificationManager.success("Post 수정", "Success")
                })
                return;
            }

            await this.addPost(post)
            history.push('/')
        } catch (e) {
            NotificationManager.error("", "Error!")
            if(e) throw e
        }
        finally {
            BaseActions.hideSpinner()
        }
    }

    modifyPost = async (id, post) => {
        const { postDB, walletInstance, gas } = this.props
        const {title, body, tags} = post
        return postDB.methods.modifyPost(id, title, body, tags).send({
            from: walletInstance.address,
            gas,
        })
    }

    addPost = async (post) => {
        const { postDB, walletInstance, gas } = this.props
        const {title, body, tags} = post
        await postDB.methods.addPost(title, body, tags).send({
            from: walletInstance.address,
            gas,
        })
        const rewardsAmount = await postDB.methods.rewardsAmount().call()
        NotificationManager.success(`Post 생성\n${rewardsAmount}Peb가 지급되었습니다.`, "Success")
    }

    render() {
        const { handleGoBack, handleSubmit } = this;
        const { id } = queryString.parse(this.props.location.search);

        return (
            <EditorHeader
                onGoBack={handleGoBack}
                onSubmit={handleSubmit}
                isEdit={id ? true : false}
            />
        );
    }
}

export default connect(
    (state) => ({
        title: state.editor.get('title'),
        markdown: state.editor.get('markdown'),
        tags: state.editor.get('tags'),
        postId: state.editor.get('postId'),
        postDB: state.caver.get('postDB'),
        walletInstance: state.caver.get('walletInstance'),
        loading: state.pender.pending['caver/INITIALIZE'],
        gas: state.caver.get('gas'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        EditorActions: bindActionCreators(editorActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(withRouter(EditorHeaderContainer));