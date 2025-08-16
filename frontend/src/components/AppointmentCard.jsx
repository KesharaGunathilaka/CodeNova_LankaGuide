import React from "react";
import { Calendar as CalIcon } from "lucide-react";
import { formatDate } from "../utils/helpers";
import { classNames } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

export default function AppointmentCard({ appt }) {
  const nav = useNavigate();

  // map statuses to color classes (simple demo mapping)
  const statusClass = () => {
    switch ((appt.status || "").toLowerCase()) {
      case "submitted":
        return "bg-blue-50 text-blue-700";
      case "accepted":
        return "bg-green-50 text-green-700";
      case "in progress":
        return "bg-yellow-50 text-yellow-700";
      case "ready":
        return "bg-teal-50 text-teal-700";
      case "success":
      case "successfully completed":
        return "bg-green-50 text-green-700";
      case "failed":
      case "unsuccessfully":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <button
      onClick={() => nav(`/appointments/${appt.id}`)}
      className="w-full text-left p-3 rounded-2xl border flex items-center gap-3 hover:shadow-sm"
    >
      <CalIcon className="w-5 h-5" />
      <div className="flex-1">
        <div className="font-medium">{appt.title}</div>
        <div className="text-sm text-gray-500">
          {formatDate(appt.datetime)} • {appt.location}
        </div>
      </div>
      <span
        className={classNames("text-sm px-2 py-1 rounded-full", statusClass())}
      >
        {appt.status}
      </span>
    </button>
  );
}
