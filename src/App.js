
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import AdminDash from './Pages/admin/AdminDash';
import CounterHome from './Pages/counter/CounterHome';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/counter/*"
            element={
              <ProtectedRoute allowedRole="counter">
                <CounterHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
