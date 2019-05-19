import React, { Component } from 'react';
import LoginModal from 'components/modal/LoginModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import * as caverActions from 'store/modules/caver';

class LoginModalContainer extends Component {
    state = {
        message: '',
    }

    handleLogin = async () => {
        const { BaseActions, CaverActions, password, cav } = this.props;
        console.log("로그인 클릭", cav)

        try {
            CaverActions.login({ password })
            BaseActions.hideModal('login');
        } catch (e) {

        }
        return

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
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0]);
        console.log("PBW e.tartget.files", e.target.files)
        console.log("PBW e.tartget.result", e.target.result)
        fileReader.onload = (e) => {
            try {
                console.log("PBW e.tartget.result", e.target.result)
                if (!this.checkValidKeystore(e.target.result)) {
                    this.setState({
                        message: '유효하지 않은 keystore 파일입니다.'
                    })
                    return;
                }
                this.props.CaverActions.setKeyStore(e.target.result)
                this.setState({
                    message: 'keystore 통과. 비밀번호를 입력하세요.'
                })
                document.querySelector('#input-password').focus();
            } catch (e) {
                // $('#message').text('유효하지 않은 keystore 파일입니다.');
                console.log("유효하지 않은 keystore 파일입니다. (catch)")
                this.setState({
                    message: '오류발생'
                })
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
                message={this.state.message}
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
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(LoginModalContainer);
