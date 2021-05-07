import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import {Link } from "react-router-dom";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  };



  render() {    
    return (
      <div className="Home">

        {/* <PageNavbar active="Home" /> */}
        <div class='container'>
            <div class='jumbotron jumbotron-home bg-light text-light text-center'>
            
                <h1 class='font-weight-bold text-uppercase'><br/><br/> Welcome </h1>
                <p> <br/><br/>Some introduction words some introduction words some introduction words some introduction words some introduction words some introduction words <br/><br/><br/><br/><br/><br/></p>


            </div>
        </div>



        <div class='container'>
            <div class='row'>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                        <img src='https://i.pinimg.com/474x/cc/82/f7/cc82f7be8cfaeb3815783ef4ccecadb6.jpg'></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Movies</h5>
                                <Link to="/movies"><button class='btn btn-dark'>Get some reccomendations!
                                </button></Link>
                            </div>
                    </div>
                </div>

                <br/>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                    <img src='https://upload.wikimedia.org/wikipedia/en/9/9f/Havok_%28Alex_Summers%29.png'></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Recommending comic books to you!</h5>
                                <Link to="/recommendations"><button class='btn btn-dark'>Recommendation</button></Link>
                            </div>
                    </div>
                </div>

                <br/>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                    <img src='https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png'></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Read power statistics about your favorite characters</h5>
                                <Link to="/power"><button class='btn btn-dark'>Checkout Power</button></Link>
                            </div>
                    </div>
                </div>

                <br/>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                    <img src='https://upload.wikimedia.org/wikipedia/en/2/2b/Blue_Lantern_Flash.jpg'></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Page 4</h5>
                                <button class='btn btn-dark'>Go to Page 4</button>
                            </div>
                    </div>
                </div>
            </div> 
      </div>
    </div>
    
    );
  };
};
