import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import HomeImage from './home_image.jpg';

function Home(){
    const navItemStyle = {
        color: "black",
        transition: "color 0.3s ease-in-out"
      };
      
      const navItemHoverStyle = {
        color: "#ff5733"
      };
    return (
        
          <div className="container vh-100 text-center mt-4 bg-primary ">
          

<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
              <Link className="nav-link" to="/statistics"  style={navItemStyle} 
  onMouseEnter={(e) => e.target.style.color = navItemHoverStyle.color}
  onMouseLeave={(e) => e.target.style.color = navItemStyle.color}>Στατιστικά Διελεύσεων</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/frequency"  style={navItemStyle} 
  onMouseEnter={(e) => e.target.style.color = navItemHoverStyle.color}
  onMouseLeave={(e) => e.target.style.color = navItemStyle.color}>Στατιστικά Πληρωμών</Link>
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
      <img 
            src={HomeImage}
            alt="Welcome" 
            className="img-fluid mb-3"
          />


          </div>
      );

}

export default Home