import React, { Component } from 'react';
import LoginModal from 'components/modal/LoginModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import * as caverActions from 'store/modules/caver';

class LoginModalContainer extends Component {
    handleLogin = async () => {
        const { BaseActions, CaverActions, password, cav, logged } = this.props;
        console.log("로그인 클릭", cav)

        try {
            CaverActions.login({ password })
            // TODO: 로그인 후 logged 여부 확인하는 것 구현하기
            BaseActions.hideModal('login');
            // console.log("result? ", result)
            // setTimeout(() => {
            //     console.log("logged? ", logged)
            //     if (logged) {
            //         BaseActions.hideModal('login');
            //     }
            // }, 1000)
        } catch (e) {

        }
    };
    handleCancel = () => {
        const { BaseActions } = this.props;
        BaseActions.hideModal('login');
    };
    handleChange = (e) => {
        const { BaseActions } = this.props;
        BaseActions.changePasswordInput(e.target.value);
    };
    handleKeyPress = (e) => {
        // 엔터 키를 누르면 로그인 호출
        if (e.key === 'Enter') {
            this.handleLogin();
        }
    };
    handleFileChange = (e) => {
        const { CaverActions } = this.props;

        // 파일 선택 시 호출
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0]);
        fileReader.onload = (e) => {
            try {
                if (!this.checkValidKeystore(e.target.result)) {
                    CaverActions.setMessage("유효하지 않은 keystore 파일입니다.")
                    return;
                }
                CaverActions.setKeyStore(e.target.result)
                CaverActions.setMessage("keystore 통과. 비밀번호를 입력하세요.")
                document.querySelector('#input-password').focus();
            } catch (e) {
                CaverActions.setMessage("오류발생")
                return;
            }
        }
    }
    checkValidKeystore = (keystore) => {
        const parsedKeystore = JSON.parse(keystore);
        const isValidKeystore = parsedKeystore.version &&
            parsedKeystore.id &&
            parsedKeystore.address &&
            parsedKeystore.crypto;

        return isValidKeystore;
    }

    render() {
        const {
            handleLogin,
            handleCancel,
            handleChange,
            handleKeyPress,
        } = this;
        const { visible, error, password, message } = this.props;

        return (
            <LoginModal
                onLogin={handleLogin}
                onCancel={handleCancel}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                onFileChange={this.handleFileChange}
                visible={visible}
                error={error}
                password={password}
                message={message}
            />
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['modal', 'login']), // boolean
        password: state.base.getIn(['loginModal', 'password']),
        error: state.base.getIn(['loginModal', 'error']),

        // TODO: auth 나중ㅇ ㅔ제거
        auth: state.caver.get('auth'),
        cav: state.caver.get('cav'),
        message: state.caver.get('message'),
        logged: state.caver.get('logged'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(LoginModalContainer);
