import React from 'react'
import Footer from './Footer';
import { Link } from "react-router-dom";

 function Logout(){

  const backgroundStyle = {
    backgroundImage: "url('/Road1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign:"center",
  };



//Χρειάζεται POST request

  return(<div style={backgroundStyle}>
<div className='p-3 bg-white w-25 center'> 
  <h2>Logout</h2>

  <h5>Έχετε αποσυνδεδεθεί επιτυχώς</h5>

  <button type="button" class="btn btn-primary btn-lg"><Link className="nav-link" to="/">Οκ</Link></button>

  </div>

 <Footer/>
  </div>);



 }



 export default Logout;