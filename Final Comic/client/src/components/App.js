import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Recommendations from './Recommendations';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							path="/recommendations"
							render={() => <Recommendations />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};