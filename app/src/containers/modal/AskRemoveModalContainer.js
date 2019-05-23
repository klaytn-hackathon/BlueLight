import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import AskRemoveModal from 'components/modal/AskRemoveModal';
import { withRouter } from 'react-router-dom';

class AskRemoveModalContainer extends Component {
    handleCancel = () => {
        const { BaseActions } = this.props;
        BaseActions.hideModal('remove');
    }
    handleConfirm = async () => {
        const { BaseActions, match, history, postDB, walletInstance, gas } = this.props;
        const { id } = match.params;

        // 포스트 삭제 후 모달을 닫고 메인 페이지로 이동
        try {
            // TODO: remove로 변경
            await postDB.methods.removePost(id).send({
                from: walletInstance.address,
                gas
            })
            await BaseActions.hideModal('remove');
            history.push('/');
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
    })
)(withRouter(AskRemoveModalContainer));