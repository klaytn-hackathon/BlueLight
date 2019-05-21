import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import * as postActions from 'store/modules/post';
import AskRemoveModal from 'components/modal/AskRemoveModal';
import { withRouter } from 'react-router-dom';

class AskRemoveModalContainer extends Component {
    handleCancel = () => {
        const { BaseActions } = this.props;
        BaseActions.hideModal('remove');
    }
    handleConfirm = async () => {
        console.log("삭제 클릭")
        const { BaseActions, PostActions, match, history, postDB, walletInstance, gas } = this.props;
        const { id } = match.params;

        // 포스트 삭제 후 모달을 닫고 메인 페이지로 이동
        try {
            // await PostActions.removePost(id);
            await postDB.methods.disablePost(id).send({
                from: walletInstance.address,
                gas
            })
            .then((receipt) => {
                BaseActions.hideModal('remove');
                // TODO: Can't perform a React state update on an unmounted component 에러가 뜨네
                history.push('/');
            })
        }
        catch (e) {
            console.error(e);
        }
    }

    render() {
        const { visible } = this.props;
        const { handleCancel, handleConfirm } = this;

        return (
            <AskRemoveModal
                visible={visible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['modal', 'remove']),
        postDB: state.caver.get('postDB'),
        walletInstance: state.caver.get('walletInstance'),
        gas: state.caver.get('gas'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        PostActions: bindActionCreators(postActions, dispatch)
    })
)(withRouter(AskRemoveModalContainer));