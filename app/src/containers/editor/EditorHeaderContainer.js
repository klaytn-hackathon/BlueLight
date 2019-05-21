import React, { Component } from 'react';
import EditorHeader from 'components/editor/EditorHeader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

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
        const { title, markdown, tags, EditorActions, history, location } = this.props;
        const post = {
            title,
            body: markdown,
            // 태그 텍스트를 ,로 분리시키고 앞뒤 공백을 지운 후 중복되는 값을 제거한다. // filter로 공백 태그도 제거한다.
            // tags: tags === "" ? [] : [...new Set(tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))]
            tags
        };

        try {
            // id가 존재하면 editPost 호출
            const { id } = queryString.parse(location.search);
            if (id) {
                // await EditorActions.editPost({ id, ...post });
                await this.modifyPost(id, post)
                .then((receipt) => {
                    // TODO: Loading 보여줘야하나
                    console.log("then receipt? ", receipt)
                    history.push(`/post/${id}`);
                })
                return;
            }

            // await EditorActions.writePost(post);
            await this.addPost(post)
            history.push('/')
            return

            // 페이지를 이동시킨다.
            // 주의: postId는 위쪽에서 레퍼런스를 만들지 않고 이 자리에서 this.props.postId를 조회해야 한다.(현재 값을 불러오기 위해)
            history.push(`/post/${this.props.postId}`);
        } catch (e) {
            if(e) throw e
        }
    }

    modifyPost = async (id, post) => {
        const { postDB, walletInstance, gas } = this.props
        console.log("gas? ", gas)
        const {title, body, tags} = post
        return postDB.methods.modifyPost(id, title, body, tags).send({
            from: walletInstance.address,
            gas,
        })
    }

    addPost = async (post) => {
        const { postDB, walletInstance, gas } = this.props
        const {title, body, tags} = post
        postDB.methods.addPost(title, body, tags).send({
            from: walletInstance.address,
            gas,
        })
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
        EditorActions: bindActionCreators(editorActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(withRouter(EditorHeaderContainer));