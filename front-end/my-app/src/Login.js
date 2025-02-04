import React , { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';



function Login(){
const [password,setPassword]=useState('');    
const [username, setUsername]=useState('');


const backgroundStyle = {
   backgroundImage: "url('/Road2.jpg')",
   backgroundSize: "cover",
   backgroundPosition: "center",
   backgroundRepeat: "no-repeat",
   width: "100vw",
   height: "100vh",
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
 };

function handleSubmit(event){

    event.preventDefault();
 
    //Στον backend server να ληφθεί υπόψη το  "application/x-www-form-urlencoded"

    //Χρειάζεται ένα POST request με το email και το password του χρήστη
    //Σε περίπτωση επιτυχίας θα επιστρέφει ένα json με το token του χρήστη και θα συνεχίζει στην σελίδα 
    //homepage
    //Σε περίπτωση σφάλματος ανακατευθύνει πάλι στην ίδια σελίδα /.


     // Έλεγχος αν τα πεδία είναι κενά
     if (!username || !password) {
      alert("Εισάγετε username και password");
      return;
  }
  const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
  

   fetch("http://localhost:9115/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData// Μετατροπή σε x-www-form-urlencoded
  })
  .then(response => {
    console.log(response.status);
      if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); }); // Αν status ≠ 200, πετάμε error με το μήνυμα του server
      }
      return response.json(); // Αν status = 200, συνεχίζουμε κανονικά
  })
  .then(data => {
      localStorage.setItem("jwt", data.token); // Αποθήκευση JWT
      console.log("JWT Token:", data.token);
      window.location.href = "/homepage"; // Ανακατεύθυνση στο /Home
  })
  .catch(error => {
      alert(error.message); // Εμφάνιση μηνύματος λάθους από τον server
      window.location.href = "/"; // Μένουμε στην ίδια σελίδα
  });
  
 
}
return(
   <div style={backgroundStyle}>

      
<div className='p-3 bg-white w-25'>
<h1 style={{ textAlign: "center" ,color:"black"}}>Login</h1>
<form onSubmit={handleSubmit}>

 <div className="mb-3">
    <label style={{textAlign: "left",color:"black"}} htmlFor="email">Username</label>

    <input type="username" placeholder="Enter username" className='form-control'
    onChange={e => setUsername(e.target.value)}/>
 </div>
 <div className="mb-3">
    <label htmlFor="password">Password</label>
  
    <input type="password" placeholder="Enter password"className='form-control'  
    onChange={e => setPassword(e.target.value)}/>
 </div>

<button className='btn btn-success'>Login</button>
</form>

</div>
</div>

);


}

export default Login