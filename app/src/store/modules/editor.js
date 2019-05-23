import { createAction, handleActions } from 'redux-actions';

import { Map } from 'immutable';

// action types
const INITIALIZE = 'editor/INITIALIZE';
const CHANGE_INPUT = 'editor/CHANGE_INPUT';
const SET_POST = 'editor/SET_POST';

// action creators
export const initialize = createAction(INITIALIZE);
export const changeInput = createAction(CHANGE_INPUT);
export const setPost = createAction(SET_POST);


// initial state
const initialState = Map({
    postId: null,
    title: '',
    markdown: '',
    tags: '',
});

// reducer
export default handleActions({
    [INITIALIZE]: (state, action) => initialState,
    [CHANGE_INPUT]: (state, action) => {
        const { name, value } = action.payload;
        return state.set(name, value);
    },
    [SET_POST]: (state, action) => {
        const { title, body, tags } = action.payload
        return state.set('title', title)
                .set('markdown', body)
                .set('tags', tags);
    },
}, initialState)