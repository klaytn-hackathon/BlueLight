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

    donation = async () => {
        this.props.BaseActions.showModal('donation')
    }

    componentWillUnmount() {
        this.props.BaseActions.hideModal('remove');
    }

    render() {
        const { handleRemove, donation } = this;
        const { match, logged } = this.props;

        const { id } = match.params;

        return <Header postId={id} logged={logged} onRemove={handleRemove} donation={donation} />;
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
