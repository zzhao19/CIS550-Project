import React from 'react';
import '../style/PowerCompete.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'wikipedia';



export default class PowerCompete extends React.Component {
    constructor(props) {
      super(props);
  
      // The state maintained by this React Component. This component maintains the list of characters,
      // and a list of movies for a specified keyword.
      this.state = {
        url:''
      };

  
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


    





    
    };
  