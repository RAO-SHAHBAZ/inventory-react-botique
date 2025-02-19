import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center px-6 py-4 bg-[#F4F7FC] text-[#2C3E50] shadow-md rounded-b-2xl border-b-2 border-[#4A90E2]"
    >
      {/* Logo / Brand */}
      <h1 className="text-2xl font-extrabold tracking-wide text-[#4A90E2]">
      <Link to="/dashboard">Boutique Dashboard </Link>
      </h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {[
          { path: "/create-order", label: "🛒 Create Order" },
          { path: "/add-stock", label: "📦 Add Stock" },
          { path: "/customers", label: "👥 Customers" },
          { path: "/pnl", label: "💰 PNL" },
        ].map(({ path, label }) => (
          <motion.button
            key={path}
            onClick={() => navigate(path)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg transition-all bg-[#4A90E2] text-white hover:bg-[#357ABD] shadow-md"
          >
            {label}
            
          </motion.button>
          
        ))}
      </nav>
      <button
            onClick={handleLogout}
            className=" hidden md:block px-4 py-2 bg-[#E74C3C] hover:bg-[#C0392B] text-white font-bold rounded-lg transition-all shadow-md"
          >
            Logout
          </button>
     
      

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-[#4A90E2]"
        onClick={toggleMenu}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-[#F4F7FC] shadow-lg p-5 flex flex-col space-y-4 md:hidden"
        >
          {[
            { path: "/create-order", label: "🛒 Create Order" },
            { path: "/add-stock", label: "📦 Add Stock" },
            { path: "/customers", label: "👥 Customers" },
            { path: "/pnl", label: "💰 PNL" },
          ].map(({ path, label }) => (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg transition-all bg-[#4A90E2] text-white hover:bg-[#357ABD] shadow-md"
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-[#E74C3C] hover:bg-[#C0392B] text-white font-bold rounded-lg transition-all shadow-md"
          >
            Logout
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
