import actions from '../actions/actions';

var initialState = {
    keyword: null,
    after: null,
    before: null,
    list: [],
    error: null,
    index: [],
    path: ''
};

var searchReducer = function(state, action) {
    state = state || initialState;
    if (action.type === actions.SEARCH_VIDEOS_SUCCESS) {
        return Object.assign({}, state, {
            keyword: action.keyword,
            after: action.after,
            before: action.before,
            list: action.list,
            error: null,
            index: [],
            path: action.path
        });
    }
    else if (action.type === actions.SEARCH_VIDEOS_ERROR) {
        return Object.assign({}, state, {
            keyword: action.keyword,
            after: action.after,
            before: action.before,
            list: [],
            error: action.error,
            index: []
        });
    } else if (action.type === actions.PLAY_VIDEO) {
        return Object.assign({}, state, {
            index: state.index.concat(action.index)
        });
    } else if (action.type === actions.CLOSE_VIDEO) {
        return Object.assign({}, state, {index: state.index.filter((value) => {
            return value !== action.index
        })});
    } else if (action.type === actions.CLICK_BAR) {
        return Object.assign({}, state, {
            index: [],
            path: action.path
        });
    } else if (action.type === actions.CLEAR) {
        return initialState;
    }
    return state;
};

exports.searchReducer = searchReducer;