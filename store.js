var reducers = require('./reducers/reducers');
var redux = require('redux');
var thunk = require('redux-thunk').default;

var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;

var store = createStore(reducers.searchReducer,  applyMiddleware(thunk));
module.exports  = store;