/* eslint-disable */
import { createAction, handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import Caver from 'caver-js'
import axios from 'axios'

import * as api from 'lib/api';

// util variables
const initCaver = () => {
    console.log("initCaver()")
    return new Promise((resolve, reject) => {
        try {
            const cav = new Caver('https://api.baobab.klaytn.net:8651')
            const postDB = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
            console.log("initCaver() Resolve", cav, postDB)
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
        console.log("[SET_KEYSTORE]")
        console.log("actions.payload?", action.payload)
        return state.setIn(['auth', 'keyStore'], action.payload);
    },
    [LOGIN]: (state, action) => {
        console.log("[LOGIN]")
        const { password } = action.payload
        const cav = state.get('cav')
        console.log("state? ", state)
        try {
            const privateKey = cav.klay.accounts.decrypt(state.getIn(['auth', 'keyStore']), password).privateKey;
            console.log("private Key? ", privateKey)
            const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
            cav.klay.accounts.wallet.add(walletInstance)
            console.log("walletInstance? ", walletInstance)
            sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
            return state.set('walletInstance', walletInstance)
                .set('logged', true)
        } catch (e) {
            if (e) throw e
            return state.set('message', "로그인 실패")
        }
    },
    [LOGOUT]: (state, action) => {
        console.log("[LOGOUT]")
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
        console.log("[CHECK_LOGIN]")
        // TODO: cav와 postDB도 설정해줘야 한다.?


        const walletInstance = sessionStorage.getItem('walletInstance')
        console.log("checkLogin walletInstance? ", walletInstance)
        if (!walletInstance) return state
        try {
            const cav = state.get('cav')
            console.log("체크로그인 cav? ", cav)
            const postDB = state.get('postDB')
            console.log("체크로그인 postDB? ", postDB)
            cav.klay.accounts.wallet.add(JSON.parse(walletInstance))
            console.log("체크로그인 wallet added ")
            return state.set('walletInstance', JSON.parse(walletInstance))
                .set('logged', true)
        } catch (e) {
            if (e) throw e
        }
    },
    [SET_MESSAGE]: (state, action) => {
        return state.set('message', action.payload)
    },
}, initialState)