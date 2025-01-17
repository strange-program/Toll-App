import React from 'react'
import { Link } from "react-router-dom";

function PaySuccess(){

    return(
    <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
    
      <div className='p-3 bg-white w-25'>
       <h1>Η πληρωμή σας εκχωρήθηκε επιτυχώς</h1>

       <div className="button-group">
       <button><Link className="nav-link" to="/payments">Πίσω στις Πληρωμές</Link></button>
       <br></br>
      
       <button><Link className="nav-link" to="/logout">Logout</Link></button>
       </div>
      </div>

    </div>
);



}

export default PaySuccess