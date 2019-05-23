import React from 'react';
import styles from './Spinner.scss';
import classNames from 'classnames/bind';
import { RotateSpinner } from 'react-spinners-kit'

const cx = classNames.bind(styles);

const Spinner = ({ spinner }) => {
  return (
    <div className={cx('spinner')}>
      <RotateSpinner
        size={100}
        color="blue"
        loading={spinner}
      />
    </div>
  )
};

export default Spinner;