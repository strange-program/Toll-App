import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function PayFailure(){

   return(
    <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
    
      <div className='p-3 bg-white w-25'>
       <h1>Σφάλμα κατά την πληρωμή σας</h1>

       <div className="button-group">
       <button><Link className="nav-link" to="/payments">Πίσω στις Πληρωμές</Link></button>
    
       </div>
      </div>

    </div>


    );
};

export default PayFailure;