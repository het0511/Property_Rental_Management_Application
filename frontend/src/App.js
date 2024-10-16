import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenantLogin from './components/TenantLogin';
import LandlordLogin from './components/LandlordLogin';
import TenantSignUp from './components/TenantSignUp';
import LandlordSignUp from './components/LandlordSignUp';
import LandlordDashboard from './components/LandlordDashboard';
import TenantDashboard from './components/TenantDashboard';
import AddApartment from './components/AddApartment';
import EditApartment from './components/EditApartment';
import EditTenant from './components/EditTenant';
import AddTenant from './components/AddTenant';
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
        <Route path="/tenant-dashboard/*" element={<TenantDashboard />} />
        <Route path="/add-apartment" element={<AddApartment />} />
        <Route path="/edit-apartment/:id" element={<EditApartment />} />
        <Route path="/edit-tenant/:id" element={<EditTenant />} />
        <Route path="add-tenant" element={<AddTenant />} />
      </Routes>
    </Router>
  );
}

export default App;
