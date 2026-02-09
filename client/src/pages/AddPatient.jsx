import { useEffect, useState } from "react";

export default function AddPatient({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name || !form.age || !form.gender || !form.phone_number) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/patients/register-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add patient");
        return;
      }

      alert("Patient added successfully");
      onClose(); // close modal on success
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  }

  // ESC key support
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white w-[720px] rounded-2xl shadow-xl p-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900">
          Patient Management
        </h2>
        <p className="text-gray-500 mt-2">
          Add, update, or view patient records and history
        </p>

        {/* Tabs */}
        <div className="flex gap-10 mt-8 border-b">
          <button className="pb-3 text-green-500 font-semibold border-b-2 border-green-500">
            Add Patient
          </button>
          <button className="pb-3 text-gray-500">
            View Records
          </button>
          <button className="pb-3 text-gray-500">
            Complete History
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 mt-8">
          <Input
            label="Full Name *"
            name="name"
            placeholder="Enter patient name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Age *"
            name="age"
            type="number"
            placeholder="Enter age"
            value={form.age}
            onChange={handleChange}
          />
          <Select
            label="Gender *"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          />
          <Input
            label="Phone Number *"
            name="phone_number"
            placeholder="+91 XXXXX-XXXXX"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-10 ${
            loading ? "bg-gray-400" : "bg-teal-600 hover:bg-green-600"
          } text-white font-semibold py-4 rounded-xl text-lg`}
        >
          {loading ? "Adding Patient..." : "Add Patient"}
        </button>
      </div>
    </div>
  );
}

/* Reusable inputs */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}

function Select({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
  );
}
