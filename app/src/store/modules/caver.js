import { createAction, handleActions } from 'redux-actions';

import { Map } from 'immutable';
import { pender } from 'redux-pender';
import Caver from 'caver-js'

import * as api from 'lib/api';

// action types
const INITIALIZE = 'caver/INITIALIZE';

// action creators
export const initialize = createAction(INITIALIZE);

// initial state
// initial state
const initialState = Map({
    cav: null,
    postDB: null
});

console.log("caver action", _DEPLOYED_ABI)

// reducer
export default handleActions({
    [INITIALIZE]: (state, action) => {
        const cav = new Caver('https://api.baobab.klaytn.net:8651')
        // const postDB = cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
        const postDB = null
        return Map({
            cav,
            postDB,
        })
    },
}, initialState)