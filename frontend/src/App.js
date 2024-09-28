import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenantLogin from './components/TenantLogin';
import LandlordLogin from './components/LandlordLogin';
import TenantSignUp from './components/TenantSignUp';
import LandlordSignUp from './components/LandlordSignUp';
import LandlordDashboard from './components/LandlordDashboard';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tenant-login" element={<TenantLogin />} />
        <Route path="/landlord-login" element={<LandlordLogin />} />
        <Route path="/tenant-signup" element={<TenantSignUp />} />
        <Route path="/landlord-signup" element={<LandlordSignUp />} />
        <Route path="/landlord-dashboard/*" element={<LandlordDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
