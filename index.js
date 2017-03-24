import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, Route, Router} from 'react-router';
import store from './store';
import {Container, Results} from './components/search';

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render (
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