import React from 'react';

import styles from './RewardsModal.scss';
import classNames from 'classnames/bind';
import ModalWrapper from 'components/modal/ModalWrapper';
import Button from 'components/common/Button';

const cx = classNames.bind(styles);


const RewardsModal = ({ visible, onCancel, onConfirm, rewardsAmount, onChangeInput }) => (
  <ModalWrapper visible={visible}>
    <div className={cx('question')}>
      <div className={cx('title')}>Rewards</div>
      <div><input type="number" value={rewardsAmount} onChange={onChangeInput} /> KLAY</div>
      <div className={cx('description')}>기부 감사합니다!</div>
    </div>
    <div className={cx('options')}>
      <Button theme="gray" onClick={onCancel}>취소</Button>
      <Button onClick={onConfirm}>기부</Button>
    </div>
  </ModalWrapper>
);


export default RewardsModal;