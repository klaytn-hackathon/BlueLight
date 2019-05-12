import React from 'react';
import styles from './Footer.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const Footer = () => (
    <footer className={cx('footer')}>
        <Link to="/" className={cx('brand')}>
            reactblog
        </Link>
    </footer>
);

export default Footer;
