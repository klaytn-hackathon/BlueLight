/* eslint-disable */
import { createAction, handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import Caver from 'caver-js'
import axios from 'axios'

import * as api from 'lib/api';

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
const SET_MESSAGE = 'caver/SET_MESSAGE';

// action creators
export const initialize = createAction(INITIALIZE, initCaver);
export const setKeyStore = createAction(SET_KEYSTORE);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const setMessage = createAction(SET_MESSAGE);

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



// console.log("caver action", DEPLOYED_ABI)
// console.log("caver action", DEPLOYED_ADDRESS)

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
    [SET_MESSAGE]: (state, action) => {
        return state.set('message', action.payload)
    }
}, initialState)