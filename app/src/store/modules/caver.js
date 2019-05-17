/* eslint-disable */
import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender';
import Caver from 'caver-js'

import * as api from 'lib/api';

// util variables

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

console.log("caver action", DEPLOYED_ABI)
console.log("caver action", DEPLOYED_ADDRESS)

// reducer
export default handleActions({
    [INITIALIZE]: (state, action) => {
        const cav = new Caver('https://api.baobab.klaytn.net:8651')
        console.log("cav? ", cav)
        console.log("cav.klay? ", cav.klay)
        console.log("cav.klay.Contract? ", cav.klay.Contract)
        const postDB = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
        console.log("postDB? ", postDB)
        return Map({
            cav,
            postDB,
        })
    },
}, initialState)