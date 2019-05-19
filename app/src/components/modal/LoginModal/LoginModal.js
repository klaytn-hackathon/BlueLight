import React from 'react';

import styles from './LoginModal.scss';
import classNames from 'classnames/bind';
import ModalWrapper from 'components/modal/ModalWrapper';

const cx = classNames.bind(styles);


const LoginModal = ({
  visible, password, error, onCancel, onLogin, onChange, onKeyPress, onFileChange, message
}) => (
    <ModalWrapper visible={visible}>
      <div className={cx('form')}>
        <div className={cx('close')} onClick={onCancel}>&times;</div>
        <div className={cx('title')}>로그인</div>
        <div className={cx('description')}>keyStore</div>
        <div className={cx('message')}>{message}</div>
        <input type="file" onChange={onFileChange} />
        <div className={cx('description')}>비밀번호</div>
        <input autoFocus id="input-password" type="password" placeholder="비밀번호 입력"
          value={password} onChange={onChange} onKeyPress={onKeyPress} />
        {error && <div className={cx('error')}>로그인 실패</div>}
        <div className={cx('login')} onClick={onLogin}>로그인</div>
      </div>
    </ModalWrapper>
  );


export default LoginModal;