import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import { Link } from "react-router-dom";
import HighchartsReact from "highcharts-react-official";
import Footer from './Footer';


const Statistics2 = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const companies=["aegeanmotorway" ,"egnatia","gefyra","kentrikiodos","moreas", "naodos","neaodos","olympiaodos"];
    

  useEffect(() => {
    if (startDate && endDate) {

      let start=new Date(startDate);
      let end=new Date(endDate);
  
     if(start>end) alert("Εισάγετε έγκυρο χρονικό διάστημα");
     else{
     fetchData(start,end);}
    }
  }, [startDate, endDate]);


/*  Το backend δέχεται get request με παραμέτρους startDate και endDate. Επιστρέφει τον αριθμό των διελεύσεων και των 8 λειρτουργών με το 
 εξής format:
  [ { name: "aegean", y: 45},
    { name: "olympia", y: 30},
    { name: "neaodos", y: 60},])

*/ 


  const fetchData = (start,end) => {  
   fetch('http://localhost:9115/api/getDiagram2',{
      method: "GET",
      headers: { "Content-Type": "application/json" ,"X-OBSERVATORY-AUTH":localStorage.getItem("jwt")},
      params: {
        startDate: start,
        endDate: end
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
          
          setChartData(data);
          setPieData(generatePieData(data));//πίτα με το ποσοστό των διελεύσεων ανά εταιρεία
          }
           
        )
        .catch(error => {console.error('Error fetching passes:', error);
                            alert("Σφάλμα στην φόρτωση της σελίδας Στατιστικών");
                            window.location.href='/homepage';})

  };
/*
  const generateMockData = (start, end) => {
    let data = companies.map(company => {
      return {
        name: company,
        y: Math.floor(Math.random() * 500)
      };
    });
    return data;
  };
*/
  const generatePieData = (data) => {
    const total = data.reduce((sum, company) => sum + company.y, 0);
    return data.map(company => ({
      name: company.name,
      y: (company.y / total) * 100
    }));
  };

  const chartOptions = {
    chart: {
      type: "column"
    },
    title: { text: "Σύνολο Διελεύσεων ανά Εταιρεία" },
    xAxis: {
      categories: companies,
      title: { text: "Εταιρεία" },
    },
    yAxis: {
      title: { text: "Αριθμός Διελεύσεων" },
    },
    series: [{
      name: "Διελεύσεις",
      data: chartData
    }]
  };


  const pieChartOptions = {
    chart: {
      type: "pie"
    },
    title: { text: "Ποσοστό Διελεύσεων ανά Εταιρεία" },
    series: [{
      name: "Ποσοστό",
      data: pieData,
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y:.1f}%"
      }
    }]
  }

  return (
    <div>
      <h2>Φίλτρα Αναζήτησης</h2>
      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <label>End Date:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
      
        
      <div className="position-relative">

      <div className="position-absolute bottom-0 end-0">
       <button type="button" class="btn btn-success btn-lg"><Link className="nav-link" to="/homepage">Επιστροφή στην Αρχική</Link></button>
      </div>
      <Footer/>

       </div>
    </div>
  );
};

export default Statistics2;
