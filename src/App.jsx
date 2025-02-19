import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AddStock from "./pages/AddStock";
import Customers from "./pages/Customers";
import CreateOrder from "./pages/CreateOrder";
import PNL from "./pages/PNL";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-stock" element={<AddStock />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/pnl" element={<PNL />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
