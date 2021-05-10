import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Recommendations from './Recommendations';
import PowerCompete from './PowerCompete';
import Home from './Home';
import Movies from './Movies';
import Search from './Search';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						{/* Home page */}
						<Route
							exact
							path="/"
							render={() => <Home />}
						/>
						{/* Recommendation page */}
						<Route
							path="/recommendations"
							render={() => <Recommendations />}
						/>
						{/* power statistic page */}
						<Route
							exact
							path="/power"
							render={() => <PowerCompete />}
						/>
						{/* movies page */}
						<Route
							exact
							path="/movies"
							render={() => <Movies />}
						/>
						{/* search page */}
						<Route
							exact
							path="/search"
							render={() => <Search />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};