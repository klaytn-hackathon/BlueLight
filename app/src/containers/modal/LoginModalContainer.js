import React, { Component } from 'react';
import LoginModal from 'components/modal/LoginModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class LoginModalContainer extends Component {
    handleLogin = async () => {
        const { BaseActions, password } = this.props;
        try {
            // 로그인 시도, 성공하면 모달 닫기
            await BaseActions.login(password);
            BaseActions.hideModal('login');
            localStorage.logged = 'true';
        } catch (e) {
            console.warn(e);
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
        // 파일 선택 시 호출
        // TODO: 구현
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0]);
        console.log("PBW e.tartget.files", e.target.files)
        console.log("PBW e.tartget.result", e.target.result)
        fileReader.onload = (e) => {
            try {
                console.log("PBW e.tartget.result", e.target.result)
                if (!this.checkValidKeystore(e.target.result)) {
                    // $('#message').text('유효하지 않은 keystore 파일입니다.');
                    console.log("유효하지 않은 keystore 파일입니다. (if)")
                    return;
                }
                // this.auth.keystore = e.target.result;
                // TODO: this.auth 대신 store에 저장하기
                // $('#message').text('keystore 통과. 비밀번호를 입력하세요.');
                console.log("keystore 통과. 비밀번호를 입력하세요.")
                // TODO: password인풋 칸에 focus 줄 수 있음 하기
                // document.querySelector('#input-password').focus();
            } catch (e) {
                // $('#message').text('유효하지 않은 keystore 파일입니다.');
                console.log("유효하지 않은 keystore 파일입니다. (catch)")
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
        const { visible, error, password } = this.props;

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
            />
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['modal', 'login']), // boolean
        password: state.base.getIn(['loginModal', 'password']),
        error: state.base.getIn(['loginModal', 'error']),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
    })
)(LoginModalContainer);
