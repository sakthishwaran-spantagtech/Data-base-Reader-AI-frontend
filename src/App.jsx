import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AiPage from './pages/AiPage';
import EmployeesPage from './pages/EmployeesPage';

export default function App() {
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8085/api/employees')
      .then(r => setConnected(r.ok))
      .catch(() => setConnected(false));
  }, []);

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar connected={connected} />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
