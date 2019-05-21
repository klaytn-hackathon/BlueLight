import React, { Component } from 'react';
import Header from 'components/common/Header';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class HeaderContainer extends Component {
    handleRemove = () => {
        this.props.BaseActions.showModal('remove');
    };

    componentWillUnmount() {
        console.log("header will unmount")
        this.props.BaseActions.hideModal('remove');
    }

    render() {
        const { handleRemove } = this;
        const { match, logged } = this.props;

        const { id } = match.params;

        return <Header postId={id} logged={logged} onRemove={handleRemove} />;
    }
}

export default connect(
    (state) => ({
        logged: state.caver.get('logged'),
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
    })
)(withRouter(HeaderContainer));
