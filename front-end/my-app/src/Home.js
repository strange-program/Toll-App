import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link } from "react-router-dom";
import HomeImage from './home_image.jpg';
import Footer from './Footer';


function Home(){


    const navItemStyle = {
        color: "black",
        transition: "color 0.3s ease-in-out"
      };
      
      const navItemHoverStyle = {
        color: "#ff5733"
      };
    return (
        
          <div >
          

<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
              <Link className="nav-link" to="/tollmap"  style={navItemStyle} 
  onMouseEnter={(e) => e.target.style.color = navItemHoverStyle.color}
  onMouseLeave={(e) => e.target.style.color = navItemStyle.color}>Στατιστικά Διελεύσεων</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/logout"  style={navItemStyle} 
  onMouseEnter={(e) => e.target.style.color = navItemHoverStyle.color}
  onMouseLeave={(e) => e.target.style.color = navItemStyle.color}>Logout</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/payments"  style={navItemStyle} 
  onMouseEnter={(e) => e.target.style.color = navItemHoverStyle.color}
  onMouseLeave={(e) => e.target.style.color = navItemStyle.color}>Πληρωμές</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
<br></br>
    
<div id="carouselExampleIndicators" class="carousel slide vh-100" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="first slide"></li>
    <li data-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="second slide"></li>
    <li data-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="third slide"></li>
  </ol>
  <div class="carousel-inner vh-100">
    <div class="carousel-item active">
      <img class="d-block w-100" src="/Road2.jpg" alt="First slide"/>
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/Road1.jpg" alt="Second slide"/>
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src={HomeImage} alt="Third slide"/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="previous">

    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
    </button>

  <button class="carousel-control-next"  type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<Footer/>
</div>
      );

}

export default Home
