import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link } from "react-router-dom";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  };


  render() {    
    return (
      <div className="Home">

        {/* Home page welcome image and text container */}
        <div class='container'>
            <div class='jumbotron jumbotron-home bg-light text-light text-center'>
                <h1 class='font-weight-bold text-uppercase'><br/><br/> Welcome </h1>
                <p class='font-weight-bold'><br/><br/>Search all you need, read all you like, and get what's the best for you -- from the ultimate comic book universe!<br/><br/><br/><br/><br/><br/></p>
            </div>
        </div>


        {/* Feature tab cards for image, intro text, buttons, and links */}
        <div class='container'>
            <div class='row'>
                {/* Search Page */}
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                        <img src='https://images-na.ssl-images-amazon.com/images/I/61hM-N+yPfL._SY344_BO1,204,203,200_.jpg' height="380" width="100%"></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Search for characters based on appearances and comics</h5>
                                <Link to="/search"><button class='btn btn-dark'>Search</button></Link>
                            </div>
                    </div>
                </div>

                {/* Recommendations Page */}
                <br/>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                    <img src='https://images-na.ssl-images-amazon.com/images/I/91odRtgklnL.jpg' height="380" width="100%"></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Checkout our comic recommendations for you!</h5>
                                <Link to="/recommendations"><button class='btn btn-dark'>Recommendation</button></Link>
                            </div>
                    </div>
                </div>

                {/* Power Page */}
                <br/>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                    <img src='https://static.comicvine.com/uploads/original/11122/111223024/4874581-3040110730-340051.jpeg' height="380" width="100%"></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Read power statistics about your favorite characters</h5>
                                <Link to="/power"><button class='btn btn-dark'>Power</button></Link>
                            </div>
                    </div>
                </div>

                {/* Movies Page */}
                <br/>
                <div class="col-md-6 col-lg-3">
                    <div class='card'>
                    <img src='https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg' height="380" width="100%"></img>
                            <div class='card-body'>
                                <h5 class='card-title'>Interested in cinematic universe? Checkout movies!</h5>
                                <Link to="/movies"><button class='btn btn-dark'>Movies</button></Link>
                            </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    );
  };
};
