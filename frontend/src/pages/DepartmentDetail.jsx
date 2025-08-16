import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import axios from "axios";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        // Fetch department with its services
        const response = await axios.get(`http://localhost:5000/api/department/${id}`);
        setDepartment(response.data.department);
        setServices(response.data.services || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16">Loading...</div>;
  if (error) return <div className="max-w-3xl mx-auto px-4 py-16">Error: {error}</div>;
  if (!department) return <div className="max-w-3xl mx-auto px-4 py-16">Department not found.</div>;

  // Image mapping for known services
  const serviceImages = {
    "working-visa-extension": "/images/Working_Visa_Extension.jpg",
    "tourist-visa-extension": "/images/Tourist_Visa_Extension.jpg",
    "driving-license-renewal": "/images/Driving_License_Renewal.jpg",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">{department.name}</h2>
      <p className="text-gray-600 max-w-3xl">{department.description}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {services.map((s) => {
          const imgSrc = serviceImages[s._id] || s.imageUrl || "/images/Meet_Guidey.png";
          return (
            <Link
              key={s._id}
              to={`/service/working-visa-extension`}
              className="bg-white border rounded-3xl hover:shadow-md overflow-hidden block"
            >
              <img
                src={imgSrc}
                alt={s.name}
                className="w-full h-40 md:h-44 object-cover"
              />
              <div className="p-4">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600 mt-1">{s.shortDescription}</div>
                <div className="mt-3 text-green-700 text-sm inline-flex items-center gap-1">
                  Open <ChevronDown className="rotate-[-90deg] w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}