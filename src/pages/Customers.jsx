import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Header from "../components/Header";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    secondName: "",
    contactNumber: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch customers from Firebase
  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList.reverse()); // Show latest first
    };
    fetchCustomers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Add new customer to Firestore
  const handleAddCustomer = async () => {
    if (!newCustomer.firstName || !newCustomer.secondName) {
      alert("First Name and Second Name are required!");
      return;
    }

    if (window.confirm("Are you sure you want to add this customer?")) {
      const docRef = await addDoc(collection(db, "customers"), newCustomer);
      setCustomers([{ id: docRef.id, ...newCustomer }, ...customers]); // Add new customer at top
      setNewCustomer({ firstName: "", secondName: "", contactNumber: "", address: "" });
      alert("Customer added successfully!");
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteDoc(doc(db, "customers", id));
      setCustomers(customers.filter((customer) => customer.id !== id));
      alert("Customer deleted successfully!");
    }
  };

  // Set the customer to be edited
  const handleEditCustomer = (customer) => {
    setEditingId(customer.id);
    setNewCustomer({
      firstName: customer.firstName,
      secondName: customer.secondName,
      contactNumber: customer.contactNumber,
      address: customer.address,
    });
  };

  // Update customer in Firestore
  const handleUpdateCustomer = async () => {
    if (!newCustomer.firstName || !newCustomer.secondName) {
      alert("First Name and Second Name are required!");
      return;
    }

    if (window.confirm("Are you sure you want to update this customer?")) {
      const customerRef = doc(db, "customers", editingId);
      await updateDoc(customerRef, newCustomer);

      setCustomers(
        customers.map((customer) =>
          customer.id === editingId ? { id: editingId, ...newCustomer } : customer
        )
      );
      setEditingId(null);
      setNewCustomer({ firstName: "", secondName: "", contactNumber: "", address: "" });
      alert("Customer updated successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] ">
      <Header />
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center">Customers</h2>

        {/* Add/Edit Customer Form */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name *"
            value={newCustomer.firstName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="secondName"
            placeholder="Second Name *"
            value={newCustomer.secondName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number (Optional)"
            value={newCustomer.contactNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address (Optional)"
            value={newCustomer.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {editingId ? (
          <button
            onClick={handleUpdateCustomer}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Update Customer
          </button>
        ) : (
          <button
            onClick={handleAddCustomer}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Customer
          </button>
        )}

        {/* Customer List */}
        <table className="w-full mt-6 border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 p-2">First Name</th>
              <th className="border border-gray-300 p-2">Second Name</th>
              <th className="border border-gray-300 p-2">Contact</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="text-center bg-white hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{customer.firstName}</td>
                <td className="border border-gray-300 p-2">{customer.secondName}</td>
                <td className="border border-gray-300 p-2">{customer.contactNumber || "N/A"}</td>
                <td className="border border-gray-300 p-2">{customer.address || "N/A"}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
