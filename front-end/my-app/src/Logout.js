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

 function HandleClick(){


  fetch("http://localhost:9115/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" ,"X-OBSERVATORY-AUTH":localStorage.getItem("jwt")},
    //empty body
})
.then(response => {
  console.log(response.status);
    if (!response.ok) {
        return response.json().then(err => { throw new Error(err.message); }); // Αν status ≠ 200, πετάμε error με το μήνυμα του server
    }
    return response.json(); // Αν status = 200, συνεχίζουμε κανονικά
})
.then(data => {
   localStorage.removeItem("jwt", localStorage.getItem("jwt")); // Αποθήκευση JWT
    alert("Επιτυχής Αποσύνδεση");
    window.location.href = "/"; // Ανακατεύθυνση στο Login
})
.catch(error => {
    alert(error.message); // Εμφάνιση μηνύματος λάθους από τον server
    window.location.href = "/logout"; // Μένουμε στην ίδια σελίδα
});


 }

//Χρειάζεται POST request

  return(<div style={backgroundStyle}>
<div className='p-3 bg-white w-25 center'> 
  
<h5>Θέλετε να αποσυνδεθείτε;</h5>

  <button type="button" class="btn btn-primary btn-lg" onClick={HandleClick}><Link className="nav-link" to="/">Logout</Link></button>

  </div>

 <Footer/>
  </div>);



 }



 export default Logout;