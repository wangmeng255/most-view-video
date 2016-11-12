var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var browserHistory = router.browserHistory;
var syncHistoryWithStore = require('react-router-redux').syncHistoryWithStore;

var store = require('./store');
var search = require('./components/search');
var Container = search.Container;

var history = syncHistoryWithStore(browserHistory, store);

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={Container}>
                    <Route path="/?search/q=:keyword&span=:after_:before" comppnent={Container} onChange={Container.Search} />
                    <Route path="/?search/q=:keyword&span=:after_:before&filter=:i" component={Container} onEnter={Container.filter} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById('app')
    );
});