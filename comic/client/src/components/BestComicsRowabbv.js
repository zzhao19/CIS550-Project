import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestComicsRowabbv extends React.Component {

	render() {
		return (
			<div className="comicResults">
				<div className="title">{this.props.title}</div>
				<div className="issueYear">{this.props.issueYear}</div>
				<div className="issueNumber">{this.props.issueNumber}</div>
			</div>
		);
	};
};
