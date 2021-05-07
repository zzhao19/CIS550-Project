import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/BestComics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@material/react-text-field/dist/text-field.css';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Select from "react-dropdown-select";
import BestComicsRowabbv from "./BestComicsRowabbv";
import Altrow from "./altrow";

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		    labelField: "props.value",
		    valueField: "props.value",
		    searchable: true,
			selectedTitle: "",
            selectedName: "",
			movies: [],
            comicrecs: [],
            alt: []
		};
        this.getComics = this.getComics.bind(this);
        this.getAlternate = this. getAlternate.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
	};

	componentDidMount() {
        fetch("http://localhost:8081/movie",{
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(titlesList => {
          if (!titlesList) return;

          const titlesDivs = titlesList.map((title, i) => (
            <option className="titlesOption" key={i} value={title.movie}>{title.movie}</option>
          ));

          this.setState({
            movies: titlesDivs
          });
        }, err => {
          console.log(err);
        });
     };

    getComics() {
        // Send an HTTP request to the server.
        console.log(this.state.selectedName);
        const myUrlWithParams = `http://localhost:8081/movie/${this.state.selectedName}`;
        fetch(myUrlWithParams,
            {
                method: 'GET' // The type of HTTP request.
            }).then(res => {
            // Convert the response data to a JSON.
            return res.json();
        }, err => {
            // Print the error if there is one.
            console.log(err);
        }).then(charList => {
            if (!charList) return;
            // Map each keyword in this.state.keywords to an HTML element:
            // A button which triggers the showMovies function for each keyword.

            const namesDivs = charList.map((comicObj, i) => (
                <BestComicsRowabbv
                    title={comicObj.Title}
                    issueYear={comicObj.issueYear}
                    issueNumber={comicObj.issueNumber}
                />

            ));
            this.setState({
                comicrecs: namesDivs
            });
        })
    };

    getAlternate() {
        // Send an HTTP request to the server.
        console.log(this.state.selectedTitle);
        const myUrlWithParams = `http://localhost:8081/movie/alt/${this.state.selectedTitle}`;
        console.log(myUrlWithParams);
             fetch(myUrlWithParams,
            {
                method: 'GET' // The type of HTTP request.
            }).then(res => {
            // Convert the response data to a JSON.
            return res.json();
        }, err => {
            // Print the error if there is one.
            console.log(err);
        }).then(charList => {
            if (!charList) return;
            const cha = charList.map((comicObj, i) => (
                <Altrow
                    name={comicObj.name}
                    Alignment={comicObj.alignment}
                />

            ));
            this.setState({
                alt: cha
            })
            ;

        })
    };

	handleTitleChange(input){
		this.setState(
		    {selectedTitle:input[0].props.value},
		    ()=>console.log(this.state.selectedTitle)
		);
	};

	handleNameChange(e){
		this.setState(
		    {selectedName:e[0].props.value},
		    ()=>console.log(this.state.selectedName)
		);
	};

	render() {

	    const{selectedTitle}=this.state;
	    const{selectedName}=this.state;
		return (
			<div className="Recommendations">
				<PageNavbar active="bestcomics" />
				<h1 class='text-center text-light'> <br/> Choose your favorite movie, and we'll choose some comics for you! </h1>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">

                    <Tab eventKey="home" title="Home">

                    </Tab>
                    <div className = 'jumbotron'>
                      <Tab>Some reccomended reading!</Tab>
                      <Tab>Your favorite movie... with a twist!
                      </Tab>
                    </div>

                    <TabPanel>
                        <div className="container bestcomics-container">
                            <div className="jumbotron jumbotron-comicsearch">
                                <div className="h5">Learn what your favorite movies are based off</div>

                                <Select
                                    placeholder='Please select your favorite movie, and we will reccomend some comic books!'
                                    options={this.state.movies}
                                    value={selectedName}
                                    searchable={this.state.searchable}
                                    labelField={this.state.labelField}
                                    valueField={this.state.valueField}
                                    onChange={this.handleNameChange}
                                    id="namesDropdown"
                                />

                                <button className="submit-btn" id="submitBtn" onClick={this.getComics}>Submit</button>

                            </div>

                            <div className="jumbotron">
                                <div className="comics-container">
                                    <div className="comic">
                                      <div className="header0"><strong>Title</strong></div>
                                      <div className="header1"><strong>Issue Year</strong></div>
                                      <div className="header1"><strong>Issue Number</strong></div>
                                      <div className="header1"><strong></strong></div>
                                      <div className="header2"><strong></strong></div>
                                    </div>
                            <div className="comics-container" id="results">
                              {this.state.comicrecs}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="container bestcomics-container">
                            <div className="jumbotron jumbotron-comicsearch">
                                <div className="h5">An alternate timeline...</div>
                                 <Select
                                        placeholder='Please a movie you want to recast'
                                        options={this.state.movies}
                                        value={selectedTitle}
                                        searchable={this.state.searchable}
                                        labelField={this.state.labelField}
                                        valueField={this.state.valueField}
                                        onChange={this.handleTitleChange}
                                        id="namesDropdown"
                                    />

                                    <button className="submit-btn" id="submitBtn" onClick={this.getAlternate}>Submit</button>
                            </div>

                            <div className="jumbotron">
                                <div className="comics-container">
                                    <div className="comic">
                                        <div className="header0"><strong>Name</strong></div>
                                        <div className="header1"><strong></strong></div>
                                        <div className="header2"><strong></strong></div>
                                    </div>
                            <div className="comics-container" id="results">
                              {this.state.alt}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>


                </Tabs>
			</div>
		);
	};
};
