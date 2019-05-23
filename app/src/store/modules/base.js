import { createAction, handleActions } from 'redux-actions';

import { Map } from 'immutable';

// action types
const SHOW_MODAL = 'base/SHOW_MODAL';
const HIDE_MODAL = 'base/HIDE_MODAL';

const CHANGE_PASSWORD_INPUT = 'base/CHANGE_PASSWORD_INPUT';
const INITIALIZE_LOGIN_MODAL = 'base/INITIALIZE_LOGIN_MODAL';

const SHOW_SPINNER = 'base/SHOW_SPINNER';
const HIDE_SPINNER = 'base/HIDE_SPINNER';

// action creators
export const showModal = createAction(SHOW_MODAL);
export const hideModal = createAction(HIDE_MODAL);

export const changePasswordInput = createAction(CHANGE_PASSWORD_INPUT);
export const initializeLoginModal = createAction(INITIALIZE_LOGIN_MODAL);

export const showSpinner = createAction(SHOW_SPINNER);
export const hideSpinner = createAction(HIDE_SPINNER);

// initial state
const initialState = Map({
    // 모달의 가시성 상태
    modal: Map({
        remove: false,
        login: false,
        donation: false,
    }),
    loginModal: Map({
        password: '',
        error: false,
    }),
    logged: false, // 현재 로그인 상태
    spinner: false,
});

// reducer
export default handleActions(
    {
        [SHOW_MODAL]: (state, action) => {
            const { payload: modalName } = action;
            return state.setIn(['modal', modalName], true);
        },
        [HIDE_MODAL]: (state, action) => {
            const { payload: modalName } = action;
            return state.setIn(['modal', modalName], false);
        },
        [CHANGE_PASSWORD_INPUT]: (state, action) => {
            const { payload: value } = action;
            return state.setIn(['loginModal', 'password'], value);
        },
        [INITIALIZE_LOGIN_MODAL]: (state, action) => {
            // 로그인 모달의 상태를 초기 상태로 설정 (텍스트/오류 초기화)
            return state.set('loginModal', initialState.get('loginModal'));
        },
        [SHOW_SPINNER]: (state, action) => {
            return state.set('spinner', true)
        },
        [HIDE_SPINNER]: (state, action) => {
            return state.set('spinner', false)
        },
        
    },
    initialState
);
