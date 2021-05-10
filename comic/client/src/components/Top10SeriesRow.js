import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Top10SeriesRow extends React.Component {
	
	// define the return outputs in Search.js

	render() {
		return (
			<div className="seriesResults">
				<div className="title">{this.props.title}</div>
				<div className="num">{this.props.num}</div>
			</div>
		);
	};
};
