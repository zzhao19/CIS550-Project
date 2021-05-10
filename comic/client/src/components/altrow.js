import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Altrow extends React.Component {

	// define the rows for alternate movie casts in Movies.js
	
	render() {
		return (
			<div className="comicResults">
				<div className="name">{this.props.name}</div>
				<div className="Alignment">{this.props.alignment}</div>
			</div>
		);
	};
};
