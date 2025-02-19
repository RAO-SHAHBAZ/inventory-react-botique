import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Header from "../components/Header";

export default function PNL() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const orderSnapshot = await getDocs(collection(db, "orders"));
    const stockSnapshot = await getDocs(collection(db, "stock"));

    const stockMap = {};
    stockSnapshot.docs.forEach((doc) => {
      stockMap[doc.id] = doc.data();
    });

    const ordersList = orderSnapshot.docs.map((doc) => {
      const data = doc.data();
      const stockItem = stockMap[data.stockArticle.id] || {};

      const costPrice = parseFloat(stockItem.productCost) || 0;
      const sellingPrice = parseFloat(data.sellingPrice) || 0;
      const quantity = parseInt(data.quantity) || 1; // Default quantity to 1 if missing

      const totalCostPrice = costPrice * quantity;
      const totalSellingPrice = sellingPrice * quantity;
      const profitLoss = (sellingPrice - costPrice) * quantity;

      return {
        id: doc.id,
        articleName: data.stockArticle.articleName,
        articleNumber: data.stockArticle.articleNumber,
        customerName: `${data.customer.firstName} ${data.customer.secondName}`,
        quantity,
        costPrice,
        totalCostPrice,
        sellingPrice,
        totalSellingPrice,
        profitLoss,
        date: data.date,
      };
    });

    setOrders(ordersList.reverse());
    setFilteredOrders(ordersList.reverse());
    calculateTotalProfit(ordersList);
  };



  const calculateTotalProfit = (data) => {
    const total = data.reduce((acc, order) => acc + order.profitLoss, 0);
    setTotalProfit(total);
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filtered = orders.filter((order) => order.date >= startDate && order.date <= endDate);
    setFilteredOrders(filtered);
    calculateTotalProfit(filtered);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F4F7FC] p-8">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Profit & Loss Summary
          </h2>

          {/* Date Filter Section */}
          <div className="flex flex-wrap gap-4 justify-center items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <div>
              <label className="pr-2 text-gray-700 font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="pr-3 text-gray-700 font-semibold">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={handleFilter}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Filter
            </button>
          </div>

          {/* Profit & Loss Summary */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Profit/Loss:</h3>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalProfit.toFixed(2)} PKR
            </p>
          </div>

          {/* Transactions Table */}
          <table className="w-full border-collapse shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3"></th>
                <th className="p-5">Customer</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Cost Price</th>
                <th className="p-3">Total Cost</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Total Selling</th>
                <th className="p-3">Profit/Loss</th>
                <th className="p-5">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-100 transition-all">
                    <td className="p-3 text-gray-700">{order.articleName}</td>
                    <td className="p-3 text-gray-700">{order.customerName}</td>
                    <td className="p-3 text-gray-700 text-center">{order.quantity}</td>
                    <td className="p-3 text-gray-700">{order.costPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700">{order.totalCostPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700">{order.sellingPrice.toFixed(2)}</td>
                    <td className="p-3 text-gray-700">{order.totalSellingPrice.toFixed(2)}</td>
                    <td className={`p-3 font-bold ${order.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {order.profitLoss.toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-700">{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                    No transactions found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
