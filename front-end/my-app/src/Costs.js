import React , { useState, useEffect } from 'react'
import Footer from './Footer'

function Cost (){

        const [amountDue, setAmountDue] = useState([]);
        const [message, setMessage] = useState('');

    /* Χρειάζεται GET request για να λάβουμε πόσο οφείλει ο καθένας στον χρήστη
     Επίσης χρειάζεται POST request όταν πατηθεί κάποιο PAY putton. 
     Σε περίπτωση επιτυχίας πρέπει να ανακατευθύνει στην σελίδα /paysuccess
     Σε περίπτωση σφάλματος στην σελίδα /payfailure   
      O κώδικας που έδωσε το Chat GPT*/
        useEffect(() => {
            // Mock API call to fetch due amounts
            fetch('/api/getAmountsDue')
                .then(response => response.json())
                .then(data => setAmountDue(data.amounts))
                .catch(error => console.error('Error fetching due amounts:', error));
        }, []);
    
        const handleSubmit = async (e,operator,amount) => {
            e.preventDefault();
    
            try {
                const response = await fetch('/api/payDebt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ company:operator, money: amount })
                });
                const data = await response.json();
                setMessage(data.message || 'Η πληρωμή πραγματοποιήθηκε επιτυχώς!');
            } catch (error) {
                setMessage('Σφάλμα κατά την επεξεργασία της πληρωμής.');
            }
        };
        let total=amountDue[0]+amountDue[1]+amountDue[2]+amountDue[3]+amountDue[4]+amountDue[5]+amountDue[6]+amountDue[7];
return (
<div>
    <h1 style={{ textAlign: "center" }}>Διαχείριση Οφειλών</h1>
    <form class="row g-3">

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
<td>aegeanmotorway</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[0]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'aegeanmotorway',amountDue[0])}>    
    <button type="submit" class="btn btn-outline-primary" disabled={amountDue[0] === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<td>egnatia</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[1]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'egnatia',amountDue[1])}>    
    <button type="submit" class="btn btn-outline-primary"  disabled={amountDue[1] === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<td>gefyra</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[2]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'gefyra',amountDue[2])}>    
    <button type="submit" class="btn btn-outline-primary"  disabled={amountDue[2] === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<td>kentrikiodos</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[3]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'kentrikiodos',amountDue[3])}>    
    <button type="submit"class="btn btn-outline-primary"  disabled={amountDue[3] === 0} >Pay</button>
    </form>
</div>

<div class="col-md-4">
<td>moreas</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[4]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'moreas',amountDue[4])}>    
    <button type="submit" class="btn btn-outline-primary"  disabled={amountDue[4] === 0} >Pay</button>
    </form>
</div>

<div class="col-md-4">
<td>naodos</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[4]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'naodos',amountDue[5])}>    
    <button type="submit" class="btn btn-outline-primary"  disabled={amountDue[5] === 0} >Pay</button>
    </form>
</div>
<div class="col-md-4">
<td>neaodos</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[6]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'neaodos',amountDue[6])}>    
    <button type="submit" class="btn btn-outline-primary"  disabled={amountDue[6] === 0} >Pay</button>
    </form>
</div>



<div class="col-md-4">
<td>olympiaodos</td>
 </div>

  <div class="col-md-4">
<td>{amountDue[7]}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'olympiaodos',amountDue[7])}>    
    <button type="submit" class="btn btn-outline-primary"  disabled={amountDue[7] === 0} >Pay</button>
    </form>
</div>


<div class="col-md-4">
<td>Σύνολο</td>
 </div>

  <div class="col-md-4">
<td>{total}€</td>
 </div> 

 <div class="col-md-4">
    
    <form onSubmit={(event) => handleSubmit(event, 'all',total)}>    
    <button type="submit"class="btn btn-outline-primary"  disabled={total === 0} >Pay All</button>
    </form>
</div>

</form>
<Footer/>
</div>


);

}


export default Cost