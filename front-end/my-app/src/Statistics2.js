import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
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
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = () => {  //Χρειάζεται GET request
    if(startDate>endDate)alert("Εισάγετε έγκυρο χρονικό διάστημα");
    else{
    const data = generateMockData(startDate, endDate);
    setChartData(data);
    setPieData(generatePieData(data));
}
  };

  const generateMockData = (start, end) => {
    let data = companies.map(company => {
      return {
        name: company,
        y: Math.floor(Math.random() * 500)
      };
    });
    return data;
  };

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
      <Footer/>
    </div>
  );
};

export default Statistics2;
