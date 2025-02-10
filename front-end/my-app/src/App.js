import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Cost from './Costs';
import Logout from './Logout';
import Statistics from './Statistics';
import PaySuccess from './PaySuccess';
import PaymentsFrequency from './PaymentsFrequency';
import PayFailure from './PayFailure';
import TollMap from './Map';
import Statistics2 from './Statistics2';
import ProtectedRoute from './ProtectedRoute';




function App() {
  return (

<Router>
    <Routes>
        
  <Route path="/" element={<Login />} />

  <Route path="/tollmap" element={<TollMap />} />
   
    <Route path="/statistics2" element={<Statistics2 />} />

    <Route path="/homepage" element={<Home />} />

    <Route path="/statistics" element={<Statistics />} />
   
   <Route element={<ProtectedRoute />}>
  
   
        <Route path="/frequency" element={<PaymentsFrequency />} />
  
        <Route path="/payments" element={<Cost />} />
         
         <Route path="/logout" element={<Logout />} />

        <Route path="/paysuccess" element={<PaySuccess />} />

          <Route path="/payfailure" element={<PayFailure />} />
 
        
</Route>

<Route path="*" element={<Navigate to="/" />} />
</Routes>
</Router>
  );
}

export default App;

