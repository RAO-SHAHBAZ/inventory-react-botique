import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="h-screen bg-gradient-to-r from-gray-100 to-gray-300 flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Boutique Dashboard</h1>
          <p className="text-lg text-gray-600">Manage orders, stock, customers, and finances efficiently.</p>
        </div>
      </div>
    </div>
  );
}