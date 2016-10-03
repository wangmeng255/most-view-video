var actions = require('../actions/actions');

var initialState = {
    keyword: null,
    list: [],
    index: []
};

var searchReducer = function(state, action) {
    state = state || initialState;
    if(action.type === actions.SEARCH_VIDEOS_SUCCESS) {
        return Object.assign({}, state, {
            keyword: action.keyword,
            list: action.list,
            index: []
        });
    }
    else if(action.type === actions.SEARCH_VIDEOS_ERROR) {
        return Object.assign({}, state, {
            keyword: action.keyword,
            error: action.error,
            index: []
        });
    } else if(action.type === actions.PLAY_VIDEO) {
        return Object.assign({}, state, {
            index: state.index.concat(action.index)
        });
    } if(action.type === actions.CLOSE_VIDEO) {
        for(var i = 0; i < state.index.length; i++) {
            if(action.index === state.index[i]) {
                var temp = new Array(state.index.splice(action.index, 1));
                return Object.assign({}, state, {
                    index: temp
                });
            }
        }
    }
    return state;
};

exports.searchReducer = searchReducer;