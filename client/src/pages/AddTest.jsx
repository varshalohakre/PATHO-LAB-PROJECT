import { useState, useEffect } from "react";
import { LAB_TESTS } from "../constants/labtests";
import { FileText, Upload, Trash2, Plus, X } from "lucide-react";

export default function AddTest({ patient, onClose }) {
  const [patientName, setPatientName] = useState(patient?.name || "");
  const [testName, setTestName] = useState("");
  const [addedTests, setAddedTests] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setPatientName(patient?.name || "");
  }, [patient]);

  const filteredTests = LAB_TESTS.filter((test) =>
    test.toLowerCase().includes(testName.toLowerCase())
  );

  const handleAddToList = () => {
    if (!testName.trim()) return;

    setAddedTests((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: testName.trim(),
        labType: "Our Lab",
      },
    ]);

    setTestName("");
    setShowSuggestions(false);
  };

  const toggleLabType = (id, type) => {
    setAddedTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, labType: type } : t))
    );
  };

  const removeTest = (id) => {
    setAddedTests((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="p-8 relative">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100"
      >
        <X className="h-6 w-6 text-gray-600" />
      </button>

      <h2 className="text-3xl font-bold text-gray-900">Test Management</h2>

      <p className="text-gray-500 mt-2">
        Patient:{" "}
        <span className="font-bold text-teal-600">
          {patient?.name || "Select Patient"}
        </span>
      </p>

      {/* Patient Name */}
      <div className="mt-5">
        <label className="block text-sm font-medium mb-2">Patient Name *</label>
        <input
          className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-teal-600"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mt-6 border-b">
        <button className="pb-3 text-teal-600 font-semibold border-b-2 border-teal-600">
          Add Test
        </button>
        <button className="pb-3 text-gray-500">View Tests</button>
      </div>

      {/* Test Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Test Name *</label>

        <div className="flex gap-4 items-start">
          <div className="relative flex-1">
            <input
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-teal-600"
              placeholder="Search test name"
              value={testName}
              onChange={(e) => {
                setTestName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && testName && (
              <div className="absolute z-10 mt-2 w-full max-h-56 overflow-y-auto rounded-xl border bg-white shadow-lg">
                {filteredTests.length ? (
                  filteredTests.map((test) => (
                    <div
                      key={test}
                      className="px-4 py-2 cursor-pointer hover:bg-teal-50"
                      onClick={() => {
                        setTestName(test);
                        setShowSuggestions(false);
                      }}
                    >
                      {test}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">
                    No matching tests
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToList}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>

      {/* Test Cards List */}
      <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto">
        {addedTests.map((test) => (
          <div
            key={test.id}
            className="border rounded-2xl p-4 bg-gray-50"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{test.name}</h3>
                <p className="text-xs text-gray-400">Test ID: {test.id}</p>
              </div>
              <button onClick={() => removeTest(test.id)}>
                <Trash2 className="text-red-600 h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Lab Type *</label>
              <div className="flex gap-2 mt-2">
                {["Our Lab", "External Lab"].map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleLabType(test.id, type)}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      test.labType === type
                        ? "bg-teal-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {test.labType === "Our Lab" ? (
              <button className="w-full mt-4 border border-teal-600 text-teal-600 py-3 rounded-xl flex justify-center gap-2">
                <FileText size={18} /> Create Report
              </button>
            ) : (
              <label className="w-full mt-4 border border-teal-600 text-teal-600 py-3 rounded-xl flex justify-center gap-2 cursor-pointer">
                <Upload size={18} /> Upload PDF
                <input type="file" hidden accept="application/pdf" />
              </label>
            )}
          </div>
        ))}
      </div>

      <button className="w-full mt-8 bg-teal-600 text-white font-bold py-4 rounded-xl">
        Submit All Tests
      </button>
    </div>
  );
}
