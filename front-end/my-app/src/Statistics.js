import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


const Statistics = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("aegeanmotorway");
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  
   const companies=[
    {
        "OpID": "AM",
        "Operator": "aegeanmotorway" },
    
    {   "OpID": "EG",
        "Operator": "egnatia"    },

    {    "OpID": "GE",
        "Operator": "gefyra"   },

    {    "OpID": "KO",
        "Operator": "kentrikiodos" }, 
        
    {   "OpID": "MO",
        "Operator": "moreas"         },
    
    {   "OpID": "NAO",
        "Operator": "naodos"         },

   {    "OpID": "NO",
        "Operator": "neaodos"        },

   {    "OpID": "OO",
        "Operator": "olympiaodos" }   
    
    ];


   

  useEffect(() => {           //καλείται όταν αλλάζει κάποιο από τα [startDate, endDate, selectedCompany]
    if (startDate && endDate) {

       let start=new Date(startDate);
       let end=new Date(endDate);
   
      if(start>end) alert("Εισάγετε έγκυρο χρονικό διάστημα");
      else{
      fetchData(start,end);}
    }
  }, [startDate, endDate, selectedCompany]);

  const fetchData = (start,end) => {                     
    // Mock data fetching - Replace this with an actual API call
    //const data = generateMockData(startDate, endDate, selectedCompany);
  

/* Το backend δέχεται get request με παραμέτρους startDate, endDate και operator και απαντά με το παρακάτω format:
   [{ date: "2024-01-01", value: 45 ,Price1:2, Price2:3, Price3:9 , Price4:10},
    { date: "2024-01-02", value: 30 ,Price1:2, Price2:3, Price3:9 , Price4:10},
    { date: "2024-01-03", value: 60 ,Price1:2, Price2:3, Price3:9 , Price4:10},]
    
*/
  console.log(selectedCompany);
  console.log(startDate);
  console.log(endDate);
  
  const url = new URL('http://localhost:9115/api/getDiagram1');
  url.searchParams.append('operator', selectedCompany);
  url.searchParams.append('startDate', startDate);
  url.searchParams.append('endDate', endDate);
  
  fetch(url, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "X-OBSERVATORY-AUTH": localStorage.getItem("jwt")
    }
  })
        .then(response => {
        console.log(response.status);
         if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); }); // Αν status ≠ 200, πετάμε error με το μήνυμα του server
         }
       return response.json(); // Αν status = 200, συνεχίζουμε κανονικά
       })
        .then((data)=>{
          if(data.length === 0) alert("Δεν βρέθηκαν διελεύσεις για το επιλεγμένο χρονικό διάστημα")        
          setChartData(data);
          setPieData(generatePieData(data));//πίτα με το ποσοστό των οχημάτων κάθε τιμής για αυτές τις διελεύσεις
          }
           
        )
        .catch(error => {console.error('Error fetching passes:', error);
                            alert("Σφάλμα στην φόρτωση της σελίδας Στατιστικών");
                            window.location.href='/statistics';})
 
  };
//Η generateMockData δημιουργεί τυχαία δεδομένα με το εξής format
//[
    //{ date: "2024-01-01", value: 45 ,Price1:2, Price2:3, Price3:9 , Price4:10},
    //{ date: "2024-01-02", value: 30 ,Price1:2, Price2:3, Price3:9 , Price4:10},
    //{ date: "2024-01-03", value: 60 ,Price1:2, Price2:3, Price3:9 , Price4:10},
    
  //]

  /*
  const generateMockData = (start, end, company) => {
    let data = [
      ];
    let currentDate = new Date(start);
    let endDate = new Date(end);
    
    let valaux,pr1aux,pr2aux,pr3aux,pr4aux;
    

   if(currentDate>endDate) alert("Εισάγετε έγκυρο χρονικό διάστημα");
    while (currentDate <= endDate) {

        
        pr1aux=Math.floor(Math.random()*25);
        pr2aux=Math.floor(Math.random()*25);
        pr3aux=Math.floor(Math.random()*25);
        pr4aux=Math.floor(Math.random()*25);

        valaux=pr1aux+pr2aux+pr3aux+pr4aux;

      data.push({
        date: currentDate.toISOString().split("T")[0],
        value: valaux,
        name:company,
        Price1: pr1aux,
        Price2: pr2aux,
        Price3: pr3aux,
        Price4: pr4aux
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  */
  const generatePieData = (data) => {
    const dsize=data.length;
    let tot =0;
    let array=[
        {name:"Price1", y:0},

        {name:"Price2", y:0},

        {name:"Price3", y:0},

        {name:"Price4",y:0}
    ];
    for(let i=0; i<dsize; i++)
     {        
         tot=tot+data[i].value; 
        array[0].y=array[0].y+ Number(data[i].Price1);
        array[1].y=array[1].y+ Number(data[i].Price2);
        array[2].y=array[2].y+ Number(data[i].Price3);
        array[3].y=array[3].y+ Number(data[i].Price4); 
         
    
    }
  
   array[0].y=(array[0].y/tot)*100 ;
   array[1].y=(array[1].y/tot)*100 ;
   array[2].y=(array[2].y/tot)*100 ;
   array[3].y=(array[3].y/tot)*100 ;
   
    return array;
  };


  const chartOptions = {
    title: { text: `Διελεύσεις για την εταιρεία ${selectedCompany}` },
    xAxis: {
      categories: chartData.map((d) => d.date),
      title: { text: "Ημερομηνία" },
    },
    yAxis: {
      title: { text: "Αριθμός Διελεύσεων" },
    },
    series: [
      {
        name: selectedCompany,
        data: chartData.map((d) => d.value),
      },
    ],
  };


  const pieChartOptions = {
    chart: {
      type: "pie"
    },
    title: { text: "Ποσοστό Διελεύσεων ανά Price" },
    series: [{
      name: "Ποσοστό",
      data: pieData,
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y:.1f}%"
      }
    }]
  };

  return (
    <div>
      <h2>Φίλτρα Αναζήτησης</h2>
      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <label>End Date:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <label>Company:</label>
      <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
        {companies.map((company) => (
          <option key={company.OpID} value={company.Operator}>{company.Operator}</option>
        ))}
      </select>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />

     
      <div className="position-relative">

      <div className="position-absolute bottom-0 end-0">
       <button type="button" class="btn btn-success btn-lg"><Link className="nav-link" to="/statistics2">Συνέχεια</Link></button>
      </div>
  
       </div>
       

    </div>
    
  );
};

export default Statistics;
