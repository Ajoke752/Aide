// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddMedicineFlow from './pages/AddMedicineFlow';
import ReminderScreen from './pages/ReminderScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans text-brand-dark">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddMedicineFlow />} />
          <Route path="/reminder/:id" element={<ReminderScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;