import React, { Component } from 'react';

import styles from './ModalWrapper.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

let timerId = null

class ModalWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false
    }
  }

  startAnimation = () => {
    // animate 값을 true로 설정 후
    this.setState({
      animate: true
    });

    // 250ms 이후 다시 false로 설정
    timerId = setTimeout(() => {
      this.setState({
        animate: false
      })
      timerId = null
    }, 250);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      this.startAnimation();
    }
  }

  componentWillUnmount() {
    if(timerId) {
      clearTimeout(timerId)
    }
  }

  render() {
    const { children, visible } = this.props;
    const { animate } = this.state;

    // visible과 animate 값이 둘 다 false일 때만 null을 리턴
    if (!visible && !animate) return null;

    // 상태에 따라 애니메이션 설정
    const animation = animate && (visible ? 'enter' : 'leave');

    return (
      <div>
        <div className={cx('gray-background', animation)} />
        <div className={cx('modal-wrapper')}>
          <div className={cx('modal', animation)}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}


export default ModalWrapper;