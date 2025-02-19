import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import Header from "../components/Header";

export default function CreateOrder() {
  const [stock, setStock] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchStock();
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchStock = async () => {
    const querySnapshot = await getDocs(collection(db, "stock"));
    setStock(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchCustomers = async () => {
    const querySnapshot = await getDocs(collection(db, "customers"));
    setCustomers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse()); // Latest orders on top
  };

  const handleSubmit = async () => {
    if (!selectedStock || !selectedCustomer || !sellingPrice || !quantity || !date || !time) {
      alert("Please fill all fields.");
      return;
    }

    const selectedStockObj = stock.find(item => item.id === selectedStock);
    const selectedCustomerObj = customers.find(customer => customer.id === selectedCustomer);

    if (editingOrder) {
      const orderRef = doc(db, "orders", editingOrder.id);
      await updateDoc(orderRef, {
        stockArticle: selectedStockObj,
        customer: selectedCustomerObj,
        sellingPrice,
        quantity,
        date,
        time
      });
      setEditingOrder(null);
    } else {
      await addDoc(collection(db, "orders"), {
        stockArticle: selectedStockObj,
        customer: selectedCustomerObj,
        sellingPrice,
        quantity,
        date,
        time
      });
    }

    setSelectedStock("");
    setSelectedCustomer("");
    setSellingPrice("");
    setQuantity("");
    setDate("");
    setTime("");
    fetchOrders();
  };

  const handleEdit = (order) => {
    setSelectedStock(order.stockArticle.id);
    setSelectedCustomer(order.customer.id);
    setSellingPrice(order.sellingPrice);
    setQuantity(order.quantity);
    setDate(order.date);
    setTime(order.time);
    setEditingOrder(order);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", id));
      fetchOrders();
    }
  };

  return (
    <div className="min-h-screen bg-{#F4F7FC}">
      <Header />
      <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">🛒 Create Order</h2>

        {/* Order Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Stock Dropdown */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">🔻 Select Stock Article</option>
            {stock.map((item) => (
              <option key={item.id} value={item.id}>
                {item.articleNumber} - {item.articleName}
              </option>
            ))}
          </select>

          {/* Customer Dropdown */}
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">👤 Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.secondName}
              </option>
            ))}
          </select>

          {/* Selling Price */}
          <input
            type="number"
            placeholder="💰 Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
          />

          {/* Quantity */}
          <input
            type="number"
            placeholder="🔢 Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
          />

          {/* Date & Time */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full  bg-[#4A90E2] text-white hover:bg-[#357ABD] px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          {editingOrder ? "✏️ Update Order" : "✅ Create Order"}
        </button>

        {/* Orders Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📜 Transaction Summary</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">No orders yet.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 bg-gray-50 rounded-lg overflow-hidden">
              <thead className=" bg-[#4A90E2] text-white">
                <tr>
                  <th className="border p-3">ID</th>
                  <th className="border p-3">👤 Customer</th>
                  <th className="border p-2">💰 S Price</th>
                  <th className="border ">Quantity</th>
                  <th className="border p-3">📅 Date</th>
                  <th className="border p-3">⏰ Time</th>
                  <th className="border p-3">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border hover:bg-gray-200">
                    <td className="border p-3">
                      {order.stockArticle.articleNumber} - {order.stockArticle.articleName}
                    </td>
                    <td className="border p-3">
                      {order.customer.firstName} {order.customer.secondName}
                    </td>
                    <td className="border p-3">{order.sellingPrice} PKR</td>
                    <td className="border p-3">{order.quantity}</td>
                    <td className="border p-3">{order.date}</td>
                    <td className="border p-3">{order.time}</td>
                    <td className="border p-3 flex gap-2">
                      <button onClick={() => handleEdit(order)} className="bg-blue-500 text-white px-3 py-1 rounded">✏️ Edit</button>
                      <button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white px-3 py-1 rounded">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
