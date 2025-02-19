import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Header from "../components/Header"; // ✅ Import Header

export default function AddStock() {
  const [articleNumber, setArticleNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [productCost, setProductCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockList, setStockList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      const querySnapshot = await getDocs(collection(db, "stock"));
      const stockData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStockList(stockData.sort((a, b) => b.timestamp - a.timestamp));
    };

    fetchStock();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!articleNumber || !productName || !productCost || !quantity) {
      alert("Please fill all fields!");
      return;
    }

    if (!window.confirm(editingId ? "Are you sure you want to update this stock?" : "Do you want to add this stock?")) {
      return;
    }

    try {
      if (editingId) {
        const stockRef = doc(db, "stock", editingId);
        await updateDoc(stockRef, { articleNumber, productName, productCost, quantity });

        setStockList(
          stockList.map((stock) =>
            stock.id === editingId ? { id: editingId, articleNumber, productName, productCost, quantity } : stock
          )
        );
        alert("Stock updated successfully!");
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, "stock"), {
          articleNumber,
          productName,
          productCost,
          quantity,
          timestamp: Date.now(),
        });

        setStockList([{ id: docRef.id, articleNumber, productName, productCost, quantity }, ...stockList]);
        alert("Stock added successfully!");
      }

      setArticleNumber("");
      setProductName("");
      setProductCost("");
      setQuantity("");
    } catch (error) {
      console.error("Error saving stock:", error);
      alert("Failed to save stock. Check Firebase rules.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock item?")) {
      try {
        await deleteDoc(doc(db, "stock", id));
        setStockList(stockList.filter((stock) => stock.id !== id));
        alert("Stock deleted successfully!");
      } catch (error) {
        console.error("Error deleting stock:", error);
        alert("Failed to delete stock.");
      }
    }
  };

  const handleEdit = (stock) => {
    setEditingId(stock.id);
    setArticleNumber(stock.articleNumber);
    setProductName(stock.productName);
    setProductCost(stock.productCost);
    setQuantity(stock.quantity);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      <Header /> {/* ✅ Header Added */}

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">{editingId ? "Edit Stock" : "Add Stock"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Article Number</label>
            <input
              type="text"
              value={articleNumber}
              onChange={(e) => setArticleNumber(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-600">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-600">Product Cost</label>
            <input
              type="number"
              value={productCost}
              onChange={(e) => setProductCost(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-600">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded transition ${
              editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {editingId ? "Update Stock" : "Add Stock"}
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Stock List</h2>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Article Number</th>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Product Cost</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockList.map((stock) => (
                  <tr key={stock.id} className="border">
                    <td className="px-4 py-2">{stock.articleNumber}</td>
                    <td className="px-4 py-2">{stock.productName}</td>
                    <td className="px-4 py-2">{stock.productCost}</td>
                    <td className="px-4 py-2">{stock.quantity}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(stock)} className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(stock.id)} className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
