import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestComicsRowabbv extends React.Component {

	// define the output content of best comics search based on a movie in Movies.js

	render() {
		return (
			<div className="movieResults">
				<div className="title">{this.props.title}</div>
				<div className="issueYear">{this.props.issueYear}</div>
				<div className="issueNumber">{this.props.issueNumber}</div>
				<div className="description">{this.props.description}</div>
			</div>
		);
	};
};
