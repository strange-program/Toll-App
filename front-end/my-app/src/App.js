import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Cost from './Costs';
import Logout from './Logout';
import Statistics from './Statistics';
import PaySuccess from './PaySuccess';
import PaymentsFrequency from './PaymentsFrequency';
import PayFailure from './PayFailure';



function App() {
  return (

<Router>
    <Routes>
        <Route path="/" element={<Login />} />
   </Routes>

   <Routes>
        <Route path="/homepage" element={<Home />} />
   </Routes>
   <Routes>
        <Route path="/frequency" element={<PaymentsFrequency />} />
   </Routes>
   <Routes>
        <Route path="/payments" element={<Cost />} />
   </Routes>

   <Routes>
        <Route path="/statistics" element={<Statistics />} />
   </Routes>

   <Routes>
        <Route path="/logout" element={<Logout />} />
   </Routes>

   <Routes>
        <Route path="/paysuccess" element={<PaySuccess />} />
   </Routes>

   <Routes>
        <Route path="/payfailure" element={<PayFailure />} />
   </Routes>

</Router>
  );
}

export default App;
