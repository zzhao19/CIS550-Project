import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'bootstrap';
import {Link } from "react-router-dom";

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

	componentDidMount() {
		const pageList = ['Recommendations', 'Power', 'Movies'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			} else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		});

		this.setState({
			navDivs: navbarDivs
		});
	};

	

	render() {
		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
				  {/* <Link to="/"><button class='btn btn-light font-weight-bold text-uppercase'>Home</button></Link> */}
				  <a className="nav-item nav-link active text-dark" href="/"><b>Home</b></a>
			      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			        <div className="navbar-nav">
			        	{this.state.navDivs}
			        </div>
			      </div>
			    </nav>
			</div>
    );
	};
};