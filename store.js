var redux = require('redux');
var combineReducers = redux.combineReducers;
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var thunk = require('redux-thunk').default;
var routerReducer = require('react-router-redux').routerReducer;

var reducers = require('./reducers/reducers');

var store = createStore(combineReducers({search: reducers.searchReducer, routing: routerReducer}),  applyMiddleware(thunk));
module.exports  = store;