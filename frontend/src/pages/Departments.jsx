import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DepartmentsIndex() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/departments");
        setDepartments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading departments...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Departments</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {departments.map((d) => (
          <Link
            key={d._id}
            to={`/departments/${d._id}`}
            className="bg-white border rounded-3xl p-4 hover:shadow-md"
          >
            <div className="font-semibold">{d.name}</div>
            <div className="text-sm text-gray-600 mt-1">{d.description}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {/* Simple department image placeholder */}
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={d.imageUrl || "/images/Hero Image.png"}
                  className="rounded-xl w-full h-36 object-cover"
                  alt={d.name}
                />
                <div className="p-2 text-xs font-medium">View Services</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}