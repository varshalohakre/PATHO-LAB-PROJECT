import { useState } from "react";
import { Search, UserCircle, Bell } from "lucide-react"; 
import AddPatient from "./AddPatient";
import AddTest from "./AddTest";

export default function AdminDashboard() {
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [activePatient, setActivePatient] = useState(null);

// This function will be called by AddPatient when registration is successful
  const handlePatientSuccess = (patientData) => {
    setActivePatient(patientData);
    setShowAddPatient(false); // Close the Add Patient modal
    setShowAddTest(true);    // Automatically open the Add Test modal
  };

  return (
    <div className="min-h-screen bg-[#F2FBFA]">
      {/* 1. Header Section */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        
        {/* Search Bar (Left/Center) */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients, bills, or kits..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Admin Section (Right) */}
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">mrs.khaire</p>
              <p className="text-xs text-teal-600 font-medium">Administrator</p>
            </div>
            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
              <UserCircle className="h-8 w-8" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Content */}
      <main className="p-8">
        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Today's Patients" value="47" change="+12%" />
          <StatCard title="Pending Reports" value="23" change="-8%" />
          <StatCard
            title="Low Stock Alerts"
            value="5"
            badge="2 new today"
            highlight
          />
          <StatCard title="Revenue Today" value="₹45,230" change="+18%" />
        </div>

        {/* Management cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ManagementCard
            title="Patient Management"
            value="247"
            button="Add Patient"
            onClick={() => setShowAddPatient(true)}
          />
          <ManagementCard title="Test Management" value="89" button="Add Test" 
          onClick={() => {
          setActivePatient(null); // No patient selected
          setShowAddTest(true);
          }}/>
          <ManagementCard title="Kit Management" value="342" button="Update Stock" />
        </div>
      </main>

      {/* Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl overflow-hidden">
            <AddPatient onClose={() => setShowAddPatient(false)}
            onSuccess={handlePatientSuccess} />
          </div>
        </div>
      )}
      {showAddTest && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-[700px] shadow-2xl overflow-hidden">
        <AddTest 
          patient={activePatient} // You can set this after adding a patient
          onClose={() => setShowAddTest(false)} 
        />
      </div>
    </div>
  )}
    </div>
  );
}

{/* Sub-components (StatCard and ManagementCard) remain exactly as you had them */}
function StatCard({ title, value, change, badge, highlight }) {
  return (
    <div className={`rounded-2xl p-6 shadow-sm border border-gray-100 bg-white ${highlight ? "bg-orange-50 border-orange-100" : ""}`}>
      <p className="text-gray-500 font-medium">{title}</p>
      <h2 className="text-4xl font-bold text-teal-700 mt-2">{value}</h2>
      {change && <p className="text-teal-600 text-sm font-semibold mt-2">{change} vs yesterday</p>}
      {badge && (
        <span className="inline-block mt-3 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
          {badge}
        </span>
      )}
    </div>
  );
}

function ManagementCard({ title, value, button, onClick }) {
  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <h2 className="text-4xl font-bold text-teal-600 mt-4">{value}</h2>
      <p className="text-gray-500 text-sm">Total Records</p>
      <button
        onClick={onClick}
        className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {button}
      </button>
    </div>
  );
}