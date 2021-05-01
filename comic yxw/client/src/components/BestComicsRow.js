import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenreRow extends React.Component {
	/* ---- Q3b (Best Movies) ---- */
	render() {
		return (
			<div className="comicResults">
				<div className="title">{this.props.title}</div>
				<div className="issueYear">{this.props.issueYear}</div>
				<div className="numChar">{this.props.numChar}</div>
				<div className="commonChar">{this.props.commonChar}</div>
				<div className="description">{this.props.description}</div>
			</div>
		);
	};
};
