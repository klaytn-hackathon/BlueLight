import React, { Component } from 'react';
import Footer from 'components/common/Footer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import * as caverActions from 'store/modules/caver';

class FooterContainer extends Component {
    handleLoginClick = async () => {
        const { BaseActions, CaverActions, logged } = this.props;
        if (logged) {
            // logout
            try {
                await CaverActions.logout()
                window.location.reload(); // 페이지 새로고침
            } catch (e) {
                console.warn(e);
            }
            return;
        }

        // login
        BaseActions.showModal('login');
        BaseActions.initializeLoginModal();
    };

    render() {
        const { handleLoginClick } = this;
        const { logged } = this.props;
        return <Footer onLoginClick={handleLoginClick} logged={logged} />;
    }
}

export default connect(
    state => ({
        logged: state.caver.get('logged'),
    }),
    dispatch => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(FooterContainer);
