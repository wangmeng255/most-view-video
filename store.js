import reducers from './reducers/reducers';
import {createStore, applyMiddleware} from 'redux';
import {default as thunk} from 'redux-thunk';

var store = createStore(reducers.searchReducer,  applyMiddleware(thunk));
module.exports  = store;