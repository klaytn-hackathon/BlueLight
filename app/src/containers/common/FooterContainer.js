import React, { Component } from 'react';
import Footer from 'components/common/Footer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class FooterContainer extends Component {

    render() {
        return <Footer />;
    }
}

export default connect(
    state => ({
        logged: state.base.get('logged'),
    }),
    dispatch => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
    })
)(FooterContainer);
