import React from 'react'
import { Link } from "react-router-dom";
import Footer from './Footer';
function PaySuccess(){

    return(
    <div className="d-flex vh-100 justify-content-center align-items-center bg-info">
    
      <div className='p-3 bg-white w-50'>
       <h1>Η πληρωμή σας εκχωρήθηκε επιτυχώς</h1>

       <br></br>
       <div class="d-grid gap-2">
  <button class="btn btn-secondary" type="button"><Link className="nav-link" to="/payments">Πίσω στις Πληρωμές</Link></button>
  <button class="btn btn-secondary" type="button"><Link className="nav-link" to="/logout">Logout</Link></button>
</div>
      </div>
   <Footer></Footer>
    </div>
);



}

export default PaySuccess