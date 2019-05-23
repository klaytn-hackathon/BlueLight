/* eslint-disable */
import { createAction, handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import Caver from 'caver-js'

// util variables
const initCaver = () => {
    return new Promise((resolve, reject) => {
        try {
            const cav = new Caver('https://api.baobab.klaytn.net:8651')
            const postDB = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
            resolve({
                cav, postDB
            })
        } catch (err) {
            if (err) throw err
            reject()
        }
    })
}

// action types
const INITIALIZE = 'caver/INITIALIZE';
const SET_KEYSTORE = 'caver/SET_KEYSTORE';
const LOGIN = 'caver/LOGIN';
const LOGOUT = 'caver/LOGOUT';
const CHECK_LOGIN = 'caver/CHECK_LOGIN';
const SET_MESSAGE = 'caver/SET_MESSAGE';
const GET_POST = 'caver/GET_POST';
const TEST = 'caver/TEST';

// action creators
export const initialize = createAction(INITIALIZE, initCaver);
export const setKeyStore = createAction(SET_KEYSTORE);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const checkLogin = createAction(CHECK_LOGIN);
export const setMessage = createAction(SET_MESSAGE);
export const getPost = createAction(GET_POST);
export const test = createAction(TEST);

// initial state
const initialState = Map({
    cav: null,
    postDB: null,
    gas: 2500000,
    auth: {
        accessType: 'keyStore',
        keyStore: '',
        password: '',
    },
    logged: false,
    message: '',
    walletInstance: null,
});


// reducer
export default handleActions({
    ...pender({
        type: INITIALIZE,
        onSuccess: (state, action) => {
            return state.set('cav', fromJS(action.payload.cav))
                .set('postDB', fromJS(action.payload.postDB))
                .set('loading', action.payload.loading)
        }
    }),
    [SET_KEYSTORE]: (state, action) => {
        return state.setIn(['auth', 'keyStore'], action.payload);
    },
    [LOGIN]: (state, action) => {
        const { password } = action.payload
        const cav = state.get('cav')
        try {
            const privateKey = cav.klay.accounts.decrypt(state.getIn(['auth', 'keyStore']), password).privateKey;
            const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
            cav.klay.accounts.wallet.add(walletInstance)
            sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
            return state.set('walletInstance', walletInstance)
                .set('logged', true)
        } catch (e) {
            if (e) throw e
            return state.set('message', "로그인 실패")
        }
    },
    [LOGOUT]: (state, action) => {
        const cav = state.get('cav')
        cav.klay.accounts.wallet.clear()
        sessionStorage.removeItem('walletInstance')
        return state.setIn(['auth', 'keyStore'], '')
            .setIn(['auth', 'password'], '')
            .set('logged', false)
    },
    // [TEST]: (state, action) => {
    //     console.log("[TEST]")
    //     return state
    // },
    [CHECK_LOGIN]: (state, action) => {
        const walletInstance = sessionStorage.getItem('walletInstance')
        if (!walletInstance) return state
        try {
            const cav = state.get('cav')
            const postDB = state.get('postDB')
            cav.klay.accounts.wallet.add(JSON.parse(walletInstance))
            return state.set('walletInstance', JSON.parse(walletInstance))
                .set('logged', true)
        } catch (e) {
            if (e) throw e
        }
    },
    [SET_MESSAGE]: (state, action) => {
        return state.set('message', action.payload)
    },
    [GET_POST]: (state, action) => {
        return state
    },
}, initialState)