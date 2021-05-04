import React from 'react';
import '../style/PowerCompete.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import CharButton from './CharButton';
import AlignButton from './AlignButton';
import PowerCompeteRow from './PowerCompeteRow';
import ScoreTableRow from './ScoreTableRow';


export default class PowerCompete extends React.Component {
    constructor(props) {
      super(props);
  
      // The state maintained by this React Component. This component maintains the list of characters,
      // and a list of movies for a specified keyword.
      this.state = {
        alignment: [],
        characters: [],
        powers: [],
        scores: [],
        selectedAlign: "",
        selectedChar: ""
      };

      this.showCharacters = this.showCharacters.bind(this);
      this.showPowers = this.showPowers.bind(this);
      this.showScores = this.showScores.bind(this);
  
    };
  
    // React function that is called when the page load.
    componentDidMount() {
        // Send an HTTP request to the server.
        fetch("http://localhost:8081/power",
        {
          method: 'GET' // The type of HTTP request.
        }).then(res => {
          // Convert the response data to a JSON.
          return res.json();
        }, err => {
          // Print the error if there is one.
          console.log(err);
        }).then(alignList => {
          if (!alignList) return;
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showMovies function for each keyword.
          
          const alignDivs = alignList.map((alignObj, i) =>
          <AlignButton 
            id={"button-" + alignObj.alignment} 
            onClick={() => {this.showCharacters(alignObj.alignment);
            this.setState({selectedAlign:alignObj.alignment})}}
            align={alignObj.alignment} 
          /> 
        );
          
    
          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            alignment: alignDivs
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
      };


    showCharacters(align) {
      // Send an HTTP request to the server.
      fetch("http://localhost:8081/power/" + align,
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
        
        const charDivs = charList.map((charObj, i) =>
          <CharButton 
            id={"button-" + charObj.name} 
            onClick={() => {this.showPowers(charObj.name);
              this.showScores(charObj.name);
            this.setState({selectedChar:charObj.name+"'s "})}} 
            char={charObj.name} 
          /> 
        );
  
        // Set the state of the keywords list to the value returned by the HTTP response from the server.
        this.setState({
          characters: charDivs
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
    };
  

    /* ---- Q1b (Dashboard) ---- */
    /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
    showPowers(char) {
      const power_url = 'http://localhost:8081/power/:align/' + char;
      fetch(power_url,
      { 
        method: "GET"
      })
      .then(res => {
        console.log(power_url);
        return res.json();
      }, err => {
        console.log(err);
      })
      .then(powerList => {

        if (!powerList) return;

        let powerLst = [];

        if (powerList.length !== 0) {
          powerLst = powerList.map((powerObj, i) =>
        
          <PowerCompeteRow
            power_name={powerObj.power}
          />
          );
        } else {
          powerLst = ['Oops, data not found']
        }

        console.log(powerLst);
        
        this.setState({
          powers: powerLst
        });
      }, err => {
        console.log(err);
      });
    };



    showScores(char) {
      console.log('show scores func')
      const score_url = 'http://localhost:8081/power/:align/:char/' + char;
      console.log(score_url);
      fetch(score_url,
      { 
        method: "GET"
      })
      .then(res => {
        return res.json();
      }, err => {
        console.log(err);
      })
      .then(scores => {
        if (!scores) return;
        console.log(scores);
        const rows = scores.map((scoreObj, i) => 
            <ScoreTableRow
              category={scoreObj.Category}
              score={scoreObj.Score}
            />
            );

        this.setState({
          scores: rows
        });
        console.log(rows);
      }, err => {
        console.log(err);
      });
    };
  
    render() {    
      return (
        <div className="PowerCompete">
  
          <PageNavbar active="PowerCompete" />

          <br />
          <div className="container powers-container">

            <div className="jumbotron">
                <div className="h4"><b>Pick a side!</b></div>
                <div className="aligns-container">
                {this.state.alignment}
                </div>
            </div>

            <br />
            <div className="jumbotron">
              <div className="h4"><b>Most Popular <var>{this.state.selectedAlign}</var> Characters Top 30</b></div>
              <div className="chars-container">
                {this.state.characters}
              </div>
            </div>
  
            <br />
            <div className="jumbotron jumbotron-test">
              <div className="powers-container">
                <div className="powers-header">
                  <div className="header-lg"><strong><var>{this.state.selectedChar}</var>Superpowers</strong></div>
                </div>
                <div className="results-container" id="results">
                  {this.state.powers}
                </div>
              </div>
            </div>


            <br />
            <div className="jumbotron jumbotron-test">
              <div className="scores-container">
                <div className="scores-header">
                  <div className="header-lg"><strong>Dimension</strong></div>
                  <div className="header"><strong>Score</strong></div>
                </div>
                <div className="results-container" id="results">
                  {this.state.scores}
                </div>
              </div>
            </div>

            {/* <br/>
            <div class="jumbotron">
              <div class="row">
              <img src='https://upload.wikimedia.org/wikipedia/en/9/91/CaptainAmerica109.jpg'/>
              </div>

              <div class="row">
              <img src='https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png'/>
              </div>

            </div> */}

          </div>

        </div>
      );
    };
  };
  