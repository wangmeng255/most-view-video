var Provider = require('react-redux').Provider;
var React = require('react');
var ReactDOM = require('react-dom');
var router = require('react-router');

var browserHistory = router.browserHistory;
var Route = router.Route;
var Router = router.Router;

var store = require('./store');
var search = require('./components/search');
var Container = search.Container;
var Results = search.Results;

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={Container}>
                    <Route path="search" comppnent={Results} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById('app')
    );
});