import React , { useState, useEffect } from 'react'

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
<div className='container vh-100 text-center mt-4 bg-primary'>
<h2>Διαχείριση Οφειλών</h2>
           
  <table>
<tr>
    <th>Εταιρεία</th>
    <th>Οφειλόμενο Ποσό</th>
    <th>Πληρωμή</th>
</tr>

<tr>
    <td>aegeanmotorway</td>
    <td>{amountDue[0]}€</td>
    <td>
        <form onSubmit={(event) => handleSubmit(event, 'aegeanmotorway',amountDue[0])}>
        <button type="submit" disabled={amountDue[0] === 0} >Pay</button>
        </form>
</td>
</tr>

<tr>
    <td>egnatia</td>
    <td>{amountDue[1]}€</td>
    <td>
        <form onSubmit={(event) => handleSubmit(event, 'egnatia',amountDue[1])}>
        <button type="submit" disabled={amountDue[1] === 0} >Pay</button>
        </form>
    </td>
</tr>

<tr>
    <td>gefyra</td>
    <td>{amountDue[2]}€</td>
    <td>
    <form onSubmit={(event) => handleSubmit(event, 'gefyra',amountDue[2])}>
        <button type="submit" disabled={amountDue[2] === 0} >Pay</button>
        </form>
    </td>
</tr>

<tr>
    <td>kentrikiodos</td>
    <td>{amountDue[3]}€</td>
    <td>
    <form onSubmit={(event) => handleSubmit(event, 'kentrikiodos',amountDue[3])}>
        <button type="submit" disabled={amountDue[3] === 0} >Pay</button>
        </form>

    </td>
</tr>

<tr>
    <td>moreas</td>
    <td>{amountDue[4]}€</td>
    <td>
    <form onSubmit={(event) => handleSubmit(event, 'moreas',amountDue[4])}>
        <button type="submit" disabled={amountDue[4] === 0} >Pay</button>
        </form>
    </td>
</tr>


<tr>
    <td>naodos</td>
    <td>{amountDue[5]}€</td>
    <td>
    <form onSubmit={(event) => handleSubmit(event, 'naodos',amountDue[5])}>
        <button type="submit" disabled={amountDue[5] === 0} >Pay</button>
        </form>
    </td>
</tr>

<tr>
    <td>neaodos</td>
    <td>{amountDue[6]}€</td>
    <td>
    <form onSubmit={(event) => handleSubmit(event, 'neaodos',amountDue[6])}>
        <button type="submit" disabled={amountDue[6] === 0} >Pay</button>
        </form>
    </td>
</tr>

<tr>
    <td>olympiaodos</td>
    <td>{amountDue[7]}€</td>
    <td><form onSubmit={(event) => handleSubmit(event, 'olympiaodos',amountDue[7])}>
        <button type="submit" disabled={amountDue[7] === 0} >Pay</button>
        </form>
    </td>
</tr>

<tr>
    <td>Σύνολο</td>
    <td>{total}€</td>
    <td><form onSubmit={(event) => handleSubmit(event, 'all',total)}>
        <button type="submit" disabled={total === 0} >Pay All</button>
        </form>
    </td>
</tr>
  </table>

</div>
);

}


export default Cost