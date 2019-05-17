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
        } catch(err) {
            if(err) throw err
            reject()
        }
    })
}


// action types
const INITIALIZE = 'caver/INITIALIZE';

// action creators
export const initialize = createAction(INITIALIZE, initCaver);

// initial state
const initialState = Map({
    cav: null,
    postDB: null,
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
}, initialState)