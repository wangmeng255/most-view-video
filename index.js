var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require('./store');
var search = require('./search');
var Container = search.Container;
var Results = search.Results;
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var hashHistory = router.hashHistory;

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={Container}>
                    <Route path="search/:keyword" component={Results} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById('app')
    );
});