import React, { Component } from 'react';
import LoginModalContainer from 'containers/modal/LoginModalContainer';
import RewardsModalContainer from 'containers/modal/RewardsModalContainer';
import Spinner from 'components/common/Spinner'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import * as caverActions from 'store/modules/caver';
// import Loader from 'react-loader-spinner'
// import { RotateSpinner } from 'react-spinners-kit'

class Base extends Component {
    caverInitialize = async () => {
        const { CaverActions } = this.props
        await CaverActions.initialize()
        CaverActions.checkLogin()
    }

    componentDidMount() {
        this.caverInitialize()
    }
    
    render() {
        const { spinner } = this.props
        return (
            <div>
                {/* 전역적으로 사용하는 컴포넌트들이 있다면
                    여기에서 렌더링 한다. */}
                <LoginModalContainer />
                <RewardsModalContainer />
                <Spinner spinner={spinner} />
            </div>
        );
    }
}

export default connect(
    (state) => ({
        spinner: state.base.get('spinner'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(Base);
