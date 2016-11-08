var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var browserHistory = router.browserHistory;

var store = require('./store');
var search = require('./components/search');
var Container = search.Container;

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={Container}>
                    <Route path="/?search/q=:keyword&span=:after-:before" onChange={search.Search} />
                    <Route path="/?search/q=:keyword&span=:after-:before" onEnter={search.filter} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById('app')
    );
});