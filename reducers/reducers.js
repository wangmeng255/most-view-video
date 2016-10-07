var actions = require('../actions/actions');

var initialState = {
    keyword: null,
    after: null,
    before: null,
    list: [],
    error: null,
    index: []
};

var searchReducer = function(state, action) {
    state = state || initialState;
    if(action.type === actions.SEARCH_VIDEOS_SUCCESS) {
        return Object.assign({}, state, {
            keyword: action.keyword,
            after: action.after,
            before: action.before,
            list: action.list,
            error: null,
            index: []
        });
    }
    else if(action.type === actions.SEARCH_VIDEOS_ERROR) {
        return Object.assign({}, state, {
            keyword: action.keyword,
            after: action.after,
            before: action.before,
            list: [],
            error: action.error,
            index: []
        });
    } else if(action.type === actions.PLAY_VIDEO) {
        return Object.assign({}, state, {
            index: state.index.concat(action.index)
        });
    } else if(action.type === actions.CLOSE_VIDEO) {
        return Object.assign({}, state, {index: state.index.filter((value) => {
            return value !== action.index
        })});
    }
    return state;
};

exports.searchReducer = searchReducer;