import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import Footer from './Footer';

function PayFailure(){

   return(
    <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
    
      <div className='p-3 bg-white w-50'>
       <h1 style={{textAlign: "center"}}>Σφάλμα κατά την πληρωμή σας</h1>

        
       <div style={{textAlign: "center"}}>
        <br></br>
       <button type="button" class="btn btn-danger btn-lg"><Link className="nav-link" to="/payments">Πίσω στις Πληρωμές</Link></button>
    
       </div>
      </div>
      <Footer/>
    </div>


    );
};

export default PayFailure;