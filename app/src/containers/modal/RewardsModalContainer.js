import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import RewardsModal from 'components/modal/RewardsModal';
import { withRouter } from 'react-router-dom';

class RewardsModalContainer extends Component {
    state = {
        rewardsAmount: 1,
    }

    onChangeInput = (e) => {
        this.setState({
            rewardsAmount: e.target.value,
        })
    }

    handleCancel = () => {
        const { BaseActions } = this.props;
        BaseActions.hideModal('rewards');
    }
    handleConfirm = async () => {
        const { BaseActions, match, history, postDB, walletInstance, gas, cav } = this.props;
        const { id } = match.params;

        // 기부하기
        try {
            await postDB.methods.deposit().send({
                from: walletInstance.address,
                gas,
                value: cav.utils.toPeb(this.state.rewardsAmount, 'KLAY'),
            })
        } catch(err) {
            if(err) throw err
        } finally {
            BaseActions.hideModal('rewards')
        }
    }

    componentWillUnmount() {
        this.props.BaseActions.hideModal('rewards')
    }

    render() {
        const { visible } = this.props;
        const { handleCancel, handleConfirm, onChangeInput } = this;
        const { rewardsAmount } = this.state

        return (
            <RewardsModal
                visible={visible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                rewardsAmount={rewardsAmount}
                onChangeInput={onChangeInput}
            />
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['modal', 'rewards']),
        postDB: state.caver.get('postDB'),
        walletInstance: state.caver.get('walletInstance'),
        gas: state.caver.get('gas'),
        cav: state.caver.get('cav'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
    })
)(withRouter(RewardsModalContainer));