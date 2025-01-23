import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Footer from './Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PaymentsFrequency(){

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
      });
    //Χρειάζεται GET request για να λάβει την συχνότητα των πληρωμών από την βάση
    //Ο κώδικας που έδωσε το chat είναι:
      /*useEffect(() => {
        fetch("https://api.example.com/data") // Αντικατάστησε με το δικό σου API endpoint
          .then((response) => response.json())
          .then((data) => {
            const labels = data.map((item) => item.label);
            const values = data.map((item) => item.value);
    
            setChartData({
              labels: labels,
              datasets: [
                {
                  label: "Τιμές",
                  data: values,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            });
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, []);*/

      useEffect(() => {
        // Dummy data για δοκιμή
        const dummyData = [
          { label: "A", value: 10 },
          { label: "B", value: 20 },
          { label: "C", value: 30 },
          { label: "D", value: 40 },
          { label: "E", value: 50 }
        ];
    
        const labels = dummyData.map((item) => item.label);
        const values = dummyData.map((item) => item.value);
    
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Τιμές",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      }, []);
    
      return (
        <div>
        <div className='container vh-100 text-center mt-4'>
          <h2>Συχνότητα Πληρωμών</h2>
          <Bar data={chartData} />
        </div>
        <Footer/>
        </div>
      );



}

export default PaymentsFrequency 