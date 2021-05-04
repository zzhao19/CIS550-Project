import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Recommendations from './Recommendations';
import PowerCompete from './PowerCompete';
import Home from './Home'

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Home />}
						/>
						<Route
							path="/recommendations"
							render={() => <Recommendations />}
						/>
						<Route
							exact
							path="/power"
							render={() => <PowerCompete />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};