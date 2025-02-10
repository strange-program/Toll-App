import React , { useState, useEffect } from 'react'
import Footer from './Footer'
import { Link } from "react-router-dom";

function Cost (){

      const [amountDue, setAmountDue] = useState([]);

      const Companies=["aegeanmotorway","egnatia","gefyra","kentrikiodos","moreas","naodos","neaodos","olympiaodos"];



      /*Το backend πρέπει να απαντάει στο get ["label":operator,value:"3"] και οι operators
      
      να είναι σε αλφαβητικοή σειρά ώστε να τοποθετηθούν  με τη σωστή σειρά οι τιμές στην φόρμα.
      
      Αν ο λειτουργός-χρήστες οφείλει χρήματα, η τιμή εμφανίζεται αρνητική, αλλιώς θετική. Στον ευαυρό του είναι πάντα 0.
      */

      /* Στο post request το backend δέχεται 2 ορίσματα, τον operator και το amount. Αν ο χρήστης θέλει να εξοφλήσει τα πάντα, τότε
      
    ο operator έχει την τιμή all.
    
     Το amount ίσως να μην χρειάζεται γιατί το ποσό είναι συγκεκριμένο και ήδη γνωστό.
    */

        useEffect(() => {
            // Mock API call to fetch due amounts
            fetch('http://localhost:9115/api/getAmountsDue',{
              method: "GET",
              headers: { "Content-Type": "application/json" ,"X-OBSERVATORY-AUTH":localStorage.getItem("jwt")},
              //empty body
          })
                .then(response => response.json())
                .then((data)=>{
                  const labels = data.map((item) => item.label);
                   setAmountDue(data.map((item) => item.value));
                   console.log(amountDue);
                  }
                   
                )
                .catch(error => {console.error('Error fetching due amounts:', error);
                                    alert("Σφάλμα στην φόρτωση της σελίδας Πληρωμών");
                                    window.location.href='/homepage';}
              
              );
        }, []);


        function handleSubmit(e, operator, amount) {
          
          e.preventDefault();
          console.log("submit!");
          
          let list=[];

          let result=operator;

          if(operator === 'all'){console.log("all");       
            
            for(let i=0; i<8; i++){

              if(amountDue[i]<0){list.push(Companies[i]);}
            }

             result = list.join(",");
            }

              fetch("http://localhost:9115/api/postPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" ,"X-OBSERVATORY-AUTH":localStorage.getItem("jwt")},
                body: JSON.stringify({ company: result, money: amount })
            })
            .then(response => {
              console.log(response.status);
                if (response.ok) {
                  window.location.href='/paysuccess';
                }
                else {
                  window.location.href='/payfail'; 
                }
                
            })
            
            


          } ;
      
      
        let total=0;

        for(let i=0; i<8; i++)
        {  if(Number(amountDue[i])<0)  total=total+Number(amountDue[i]);}
        total=(total).toFixed(2) ;
     
return (
<div>
    <h1 style={{ textAlign: "center" }}>Διαχείριση Οφειλών</h1>
    <div class="row g-3">

    <div class="col-md-4">
    <h3>Εταιρεία</h3>
  </div>

  <div class="col-md-4">
    <h3>Οφειλόμενο Ποσό</h3>
  </div>

  <div class="col-md-4">
    <h3>Πληρωμή</h3>
  </div>

<div class="col-md-4">
<div>aegeanmotorway</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[0]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'aegeanmotorway',amountDue[0])}>    
    <button type="submit" className="btn btn-outline-primary" disabled={Number(amountDue[0]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<div>egnatia</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[1]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'egnatia',amountDue[1])}>    
    <button type="submit" className="btn btn-outline-primary"  disabled={Number(amountDue[1]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<div>gefyra</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[2]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'gefyra',amountDue[2])}>    
    <button type="submit" className="btn btn-outline-primary"  disabled={Number(amountDue[2]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<div>kentrikiodos</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[3]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'kentrikiodos',amountDue[3])}>    
    <button type="submit"className="btn btn-outline-primary"  disabled={Number(amountDue[3]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>

<div class="col-md-4">
<div>moreas</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[4]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'moreas',amountDue[4])}>    
    <button type="submit" className="btn btn-outline-primary"  disabled={Number(amountDue[4]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>

<div class="col-md-4">
<div>naodos</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[5]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'naodos',amountDue[5])}>    
    <button type="submit" className="btn btn-outline-primary"  disabled={Number(amountDue[5]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>
<div class="col-md-4">
<div>neaodos</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[6]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'neaodos',amountDue[6])}>    
    <button type="submit" className="btn btn-outline-primary"  disabled={Number(amountDue[6]) >= 0 || amountDue.length === 0} >Pay</button>
    </form>
</div>



<div class="col-md-4">
<div>olympiaodos</div>
 </div>

  <div class="col-md-4">
<div>{amountDue[7]}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'olympiaodos',amountDue[7])}>    
    <button type="submit" className="btn btn-outline-primary"  disabled={ amountDue.length === 0 || Number(amountDue[7]) >= 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<div>Σύνολο</div>
 </div>

  <div class="col-md-4">
<div>{total}€</div>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'all',total)}>    
    <button type="submit"className="btn btn-outline-primary"  disabled={ amountDue.length === 0|| total >= 0} >Pay All</button>
    </form>
    <br></br>
    <button type="button" class="btn btn-success btn-lg"><Link className="nav-link" to="/homepage">Επιστροφή στην Αρχική</Link></button>
</div>


<div>
<a>*Τα ποσά με θετικό πρόσημο αντιστοιχούν στις οφειλές από τους υπόλοιπους λειτουργούς (δεν εξοφλούνται από τον παρόντα λειτουργό)</a>
<br></br>
<a>*Τα ποσά με αρνητικό πρόσημο αντιστοιχούν στις οφειλές προς τους υπόλοιπους λειτουργούς (εξοφλούνται από τον παρόντα λειτουργό)</a>

</div>

</div>

<Footer/>
</div>


);

}


export default Cost
