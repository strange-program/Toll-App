import React , { useEffect, useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';


function Login(){
const [password,setPassword]=useState('');    
const [email, setEmail]=useState('');

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
 
    //Χρειάζεται ένα POST request με το email και το password του χρήστη
    //Σε περίπτωση επιτυχίας θα επιστρέφει ένα json με το token του χρήστη και θα συνεχίζει στην σελίδα 
    //homepage
    //Σε περίπτωση σφάλματος ανακατευθύνει πάλι στην ίδια σελίδα /.

    //Αυτός είναι ο κώδικας από το
  //axios.post('http://localhost:8081/login', {email, password})
    //.then(res=>console.log(res))
   // .catch(err=>console.log(err));
}
return(
   <div style={backgroundStyle}>

      
<div className='p-3 bg-white w-25'>
<h1 style={{ textAlign: "center" ,color:"black"}}>Login</h1>
<form onSubmit={handleSubmit}>

 <div className="mb-3">
    <label style={{textAlign: "left",color:"black"}} htmlFor="email">Email</label>

    <input type="email" placeholder="Enter email" className='form-control'
    onChange={e => setEmail(e.target.value)}/>
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