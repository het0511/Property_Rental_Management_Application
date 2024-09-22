import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenantLogin from './components/TenantLogin';
import LandlordLogin from './components/LandlordLogin';
import TenantSignUp from './components/TenantSignUp';
import LandlordSignUp from './components/LandlordSignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tenant-login" element={<TenantLogin />} />
        <Route path="/landlord-login" element={<LandlordLogin />} />
        <Route path="/tenant-signup" element={<TenantSignUp />} />
        <Route path="/landlord-signup" element={<LandlordSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
