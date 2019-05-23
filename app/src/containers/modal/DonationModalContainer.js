import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import DonationModal from 'components/modal/DonationModal';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications'

class DonationModalContainer extends Component {
    state = {
        donationAmount: 1,
    }

    onChangeInput = (e) => {
        this.setState({
            donationAmount: e.target.value,
        })
    }

    handleCancel = () => {
        const { BaseActions } = this.props;
        BaseActions.hideModal('donation');
        this.setState({
            donationAmount: 1
        })
    }
    handleConfirm = async () => {
        const { BaseActions, postDB, walletInstance, gas, cav } = this.props;
        const { donationAmount } = this.state
        if(donationAmount <= 0) {
            NotificationManager.warning("0KLAY 이하는 기부할 수 없습니다.",
                "Warning")
            return
        }

        // 기부하기
        try {
            BaseActions.showSpinner()
            await postDB.methods.deposit().send({
                from: walletInstance.address,
                gas,
                value: cav.utils.toPeb(donationAmount, 'KLAY'),
            })
            NotificationManager.success(`${donationAmount}KLAY를 기부하였습니다.`,
                "감사합니다!")
        } catch(err) {
            if(err) throw err
        } finally {
            BaseActions.hideModal('donation')
            BaseActions.hideSpinner()
        }
    }

    componentWillUnmount() {
        this.props.BaseActions.hideModal('donation')
    }

    render() {
        const { visible } = this.props;
        const { handleCancel, handleConfirm, onChangeInput } = this;
        const { donationAmount } = this.state

        return (
            <DonationModal
                visible={visible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                donationAmount={donationAmount}
                onChangeInput={onChangeInput}
            />
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['modal', 'donation']),
        postDB: state.caver.get('postDB'),
        walletInstance: state.caver.get('walletInstance'),
        gas: state.caver.get('gas'),
        cav: state.caver.get('cav'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
    })
)(withRouter(DonationModalContainer));