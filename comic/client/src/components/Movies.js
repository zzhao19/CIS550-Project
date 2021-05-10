import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/movies.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/react-tabs.css';

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
		this.handleNameChange = this.handleNameChange.bind(this);
	};

    // on load provide dropdown list for movie titles
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

    //  pass the selected movie title to the query and return comic book recommendations
    getComics() {
        const myUrlWithParams = `http://localhost:8081/movie/${this.state.selectedName}`;
        fetch(myUrlWithParams,
            {method: 'GET'
            }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(charList => {
            if (!charList) return;

            const namesDivs = charList.map((comicObj, i) => (
                <BestComicsRowabbv
                    title={comicObj.Title}
                    issueYear={comicObj.issueYear}
                    issueNumber={comicObj.issueNumber}
                    description={String(comicObj.description).replace(' ','')}
                />

            ));
            this.setState({
                comicrecs: namesDivs
            });
        })
    };

    // return possible cast in the same cinematic universe
    getAlternate() {
        console.log(this.state.selectedTitle);
        const myUrlWithParams = `http://localhost:8081/movie/alt/${this.state.selectedName}`;
        console.log(myUrlWithParams);
             fetch(myUrlWithParams,
            {method: 'GET'
            }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(charList => {
            if (!charList) return;

            const cha = charList.map((comicObj, i) => (
                <Altrow // alternative cast rows consists of cast name and alignment
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


    // handle dropdown list selection events
	handleNameChange(e){
		this.setState(
		    {selectedName:e[0].props.value},
		    ()=>console.log(this.state.selectedName)
		);
	};

	render() {

	    const{selectedName}=this.state;

		return (
			<div className="Recommendations">
                <PageNavbar active="bestcomics" />
                <h1 class='text-center text-light'> <br/> It's All About Movies! </h1>

                {/* container for the dropdown list and alternative cast box */}
                <div className="container bestmovies-container">
                    <div class='row'>
                        <div class='col-md-8 col-lg-8'>
                            <div className="jumbotron jumbotron-moviesearch">
                                <div className="h5"> 
                                Huge fan of superhero movies?
                                Know more about origins and casts!
                                </div>
                                <br/>
                                <Select
                                placeholder='Please select your favorite movie name'
                                options={this.state.movies}
                                value={selectedName}
                                searchable={this.state.searchable}
                                labelField={this.state.labelField}
                                valueField={this.state.valueField}
                                onChange={this.handleNameChange}
                                id="namesDropdown"
                                />
                                <br/>
                                <button className="submit-btn" id="submitBtn" onClick={this.getComics}>What comic books is my favorite movie based on?</button>
                                <button className="submit-btn" id="submitBtn" onClick={this.getAlternate}>What are the possible new casts? .. Keep clicking!</button>
                                <br/>
                                <br></br>

                                {/* gif for styling */}
                                <img src='https://i.pinimg.com/originals/b9/6b/a7/b96ba7c09694b5ece6db21c7e917d943.gif' height="55%" width="100%"></img>
                            </div>
                        </div>
                        
                        <div class='col-md-4 col-lg-4'>
                            <div className="movies-container">
                                <div className="jumbotron jumbotron-newcast">
                                    <div className="comic">
                                        <div className="h5">New cast... in a parallel universe!</div>
                                    </div>
                                    <div className="comics-container" id="results">
                                        {this.state.alt}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* container to store the results */}
                    <div className="movies-container">
                        <div className="jumbotron jumbotron-moviesresult">
                            <div className="movie">
                                <div className="header0"><strong>Title</strong></div>
                                <div className="header1"><strong>Issue Year</strong></div>
                                <div className="header1"><strong>Issue Number</strong></div>
                                <div className="header2"><strong>Description</strong></div>
                            </div>
                            <div className="movies-container" id="results">
                                {this.state.comicrecs}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	};
};
