import React, { Component } from 'react';
import styles from './EditorTemplate.scss';
import classNames from 'classnames/bind';

import { drizzleConnect } from 'drizzle-react'

const cx = classNames.bind(styles);

class EditorTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftPercentage: 0.5
    }
  }

  // separator 클릭 후 마우스를 움직이면 그에 따라 leftPercentage 업데이트
  handleMouseMove = (e) => {
    this.setState({
      leftPercentage: e.clientX / window.innerWidth
    });
  }

  // 마우스를 뗐을 때 등록한 이벤트 제거
  handleMouseUp = (e) => {
    document.body.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  // separator 클릭할 때
  handleSeparatorMouseDown = (e) => {
    document.body.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentDidMount() {
    console.log("pbw this.props", this.props)
  }

  render() {
    const { header, editor, preview } = this.props;
    const { leftPercentage } = this.state;
    const { handleSeparatorMouseDown } = this;

    // 각 영역에 flex값 적용
    const leftStyle = {
      flex: leftPercentage
    };
    const rightStyle = {
      flex: 1 - leftPercentage
    };

    // separator 위치 설정
    const separatorStyle = {
      left: `${leftPercentage * 100}%`
    };

    return (
      <div className={cx('editor-template')}>
        {header}
        <div className={cx('panes')}>
          <div className={cx('pane', 'editor')} style={leftStyle}>
            {editor}
          </div>
          <div className={cx('pane', 'preview')} style={rightStyle}>
            {preview}
          </div>
          <div
            className={cx('separator')}
            style={separatorStyle}
            onMouseDown={handleSeparatorMouseDown}
          />
        </div>
      </div>
    );
  }
}

const drizzleEditorTemplate = drizzleConnect(
  EditorTemplate,
  (state) => {
    console.log('pbw drizzle List', state)
    return {
      accounts: state.accounts,
      SimpleStorage: state.contracts.SimpleStorage,
      PostDB: state.contracts.PostDB,
      TutorialToken: state.contracts.TutorialToken,
      drizzleStatus: state.drizzleStatus,
    }
  }
)

export default drizzleEditorTemplate;