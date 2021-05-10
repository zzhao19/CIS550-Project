import React from 'react';
import Chart from 'react-apexcharts'

import '../style/PowerCompete.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import PageNavbar from './PageNavbar';
import CharButton from './CharButton';
import AlignButton from './AlignButton';
import PowerCompeteRow from './PowerCompeteRow';
import ScoreTableRow from './ScoreTableRow';
import {options, option_bar} from './RadarElements';



export default class PowerCompete extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        alignment: [],
        characters: [],
        powers: [],
        scores: [],
        selectedAlign: "",
        selectedChar: "",
        series: [],
        lst1: []
      };

      this.showCharacters = this.showCharacters.bind(this);
      this.showPowers = this.showPowers.bind(this);
      this.showScores = this.showScores.bind(this);
  
    };
  
    // load alignment choice options when page launch
    componentDidMount() {
        fetch("http://localhost:8081/power",
        {method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(alignList => {
          if (!alignList) return;
          
          // map query outputs to buttons for display
          const alignDivs = alignList.map((alignObj, i) =>

          <AlignButton 
            id={"button-" + alignObj.alignment} 
            onClick={() => {this.showCharacters(alignObj.alignment);
            this.setState({selectedAlign:alignObj.alignment})}}
            align={alignObj.alignment} 
          /> );
          
          this.setState({
            alignment: alignDivs
          });
        }, err => {
          console.log(err);
        });
      };


    // show the most popular characters for chosen align
    showCharacters(align) {
      fetch("http://localhost:8081/power/" + align,
      {method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(charList => {
        if (!charList) return;

        const charDivs = charList.map((charObj, i) =>

        // map characters to onclick events
        <CharButton 
          id={"button-" + charObj.name} 
          onClick={() => {this.showPowers(charObj.name);
            this.showScores(charObj.name);
          this.setState({selectedChar:charObj.name+"'s "})}} 
          char={charObj.name} 
        /> 
        );

        this.setState({
          characters: charDivs
        });
      }, err => {
        console.log(err);
      });
    };


    // show power list for the chosen character
    showPowers(char) {
      const power_url = 'http://localhost:8081/power/:align/' + char;
      fetch(power_url,
      {method: "GET"
      })
      .then(res => {
        return res.json();
      }, err => {
        console.log(err);
      })
      .then(powerList => {
        if (!powerList) return;
        let powerLst = [];

        // handle cases where there's no data about a character in record
        if (powerList.length !== 0) {

          powerLst = powerList.map((powerObj, i) =>
          <PowerCompeteRow
            power_name={powerObj.power}
          />
          );
        } else {
          powerLst = ['Oops, data not found']
        }
        this.setState({
          powers: powerLst
        });
      }, err => {
        console.log(err);
      });
    };


    // retrive power dimension scores for chosen character
    // pass results to graphs
    showScores(char) {
      const score_url = 'http://localhost:8081/power/:align/:char/' + char;
      fetch(score_url,
      {method: "GET"
      })
      .then(res => {
        return res.json();
      }, err => {
        console.log(err);
      })
      .then(scores => {
        if (!scores) return;
        let rows = null;
        let scoreArr = null;
        let ab = null;

        // handle no data found scenarios
        if (scores.length !== 0) {
            rows = scores.map((scoreObj, i) => 
            <ScoreTableRow
              category={scoreObj.Category}
              score={scoreObj.Score}
            />
            );
            scoreArr = scores.map((scoreObj, i) => scoreObj.Score);
        } else {
            rows = ['Oops, data not found'];
            scoreArr = [0,0,0,0,0,0]; // pass in 0s to later charts when no data found
        }

        const seriesName = char;

        this.setState({
          scores: rows,
          series: [{name: seriesName,
            data: scoreArr}], // structure the output as needed for chart-making parameters
          lst1: scoreArr
        });

      }, err => {
        console.log(err);
      });
    };
  
    render() {    
      return (
        <div className="PowerCompete">
          <PageNavbar active="PowerCompete" />
          <h1 class='text-center text-light'> <br/> Power Statistics! </h1>
          
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


          <div class='container'>
            <div class='row'>
              <div class="col-lg-6">
                <div className="jumbotron jumbotron-left">
                  <div className="powers-container">

                    {/* show selected align in header */}
                    <div className="powers-header">
                      <div className="header-lg"><strong><var>{this.state.selectedChar}</var>Superpowers</strong></div>
                    </div>

                    {/* show character search output */}
                    <div className="results-container" id="results">
                      {this.state.powers}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div className="jumbotron jumbotron-right">
                  {/* radar chart for dimension stats */}
                  <div id="chart">
                    <Chart options={options} series={this.state.series} type="radar" height={350} />
                  </div>
                </div>

                <div className="jumbotron jumbotron-right">
                  {/* grouped bar charts for dimension comparison against average */}
                  <div id="chart">
                    <Chart options={option_bar} series={[{data:this.state.lst1},{data:[57.03,58.37,56.99,52.7,34.64,43.57]}]} type="bar" height={350} />
                  </div>
                </div>  
              </div>  
            </div>
          </div>
        </div>
      </div>
      );
    };
  };
  