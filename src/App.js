
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import AdminDash from './Pages/admin/AdminDash';
import CounterHome from './Pages/counter/CounterHome';
import ProtectedRoute from './components/ProtectedRoute';
import API_BASE_URL from './apis/apiBaseUrl';
import axios from 'axios';


axios.defaults.baseURL = API_BASE_URL;

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
