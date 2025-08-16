import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../utils/appContext";
import { formatDate } from "../utils/helpers";

export default function AppointmentDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { appointments, updateAppointment, addNotification } = useApp();
  const appt = appointments.find((a) => a.id === id);

  if (!appt)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-xl font-semibold">Appointment not found</div>
        <button
          className="mt-4 px-4 py-2 border rounded-xl"
          onClick={() => nav("/dashboard")}
        >
          Back to dashboard
        </button>
      </div>
    );

  const meta = appt.meta || {};

  const isUpcoming = new Date(appt.datetime) > new Date();

  const statuses = isUpcoming
    ? ["Submitted", "Accepted", "In Progress", "Ready"]
    : [
        "Submitted",
        "Accepted",
        "In Progress",
        "Ready",
        "Successfully Completed",
        "Unsuccessfully Completed",
      ];

  const onAdvance = () => {
    const cur = appt.status || "Submitted";
    let next = cur;
    if (cur.toLowerCase() === "submitted") next = "Accepted";
    else if (cur.toLowerCase() === "accepted") next = "In Progress";
    else if (cur.toLowerCase() === "in progress") next = "Ready";
    else if (cur.toLowerCase() === "ready") {
      // only allow marking completed when appointment is not upcoming
      if (!isUpcoming) next = "Successfully Completed";
      else next = cur;
    }

    // if completed states, don't advance
    if (next !== cur) {
      updateAppointment(appt.id, { status: next });
      addNotification(
        `Appointment ${next} — ${appt.title} on ${new Date(
          appt.datetime
        ).toLocaleString()}`
      );
    }
  };

  const statusBadge = (s) => {
    const cls = s.toLowerCase().includes("completed")
      ? "bg-green-50 text-green-700"
      : s.toLowerCase().includes("unsuccess")
      ? "bg-red-50 text-red-700"
      : s.toLowerCase().includes("ready")
      ? "bg-teal-50 text-teal-700"
      : s.toLowerCase().includes("in progress")
      ? "bg-yellow-50 text-yellow-700"
      : s.toLowerCase().includes("accepted")
      ? "bg-green-50 text-green-700"
      : "bg-blue-50 text-blue-700";
    return <span className={`text-sm px-2 py-1 rounded-full ${cls}`}>{s}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">{appt.title}</div>
          <h2 className="text-2xl font-bold">Appointment details</h2>
          <div className="text-sm text-gray-500 mt-1">
            {formatDate(appt.datetime)} • {appt.location}
          </div>
        </div>
        <div>{statusBadge(appt.status || "Submitted")}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border rounded-2xl p-4">
          <div className="font-medium mb-2">Submitted information</div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <span className="text-gray-500">Full name: </span>
              <span className="font-medium">{meta.fullName || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Passport No: </span>
              <span className="font-medium">{meta.passportNo || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Nationality: </span>
              <span className="font-medium">{meta.nationality || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Email: </span>
              <span className="font-medium">{meta.email || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Phone: </span>
              <span className="font-medium">{meta.phone || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Period: </span>
              <span className="font-medium">{meta.period || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Appointment Slot: </span>
              <span className="font-medium">
                {meta.date ? `${meta.date} ${meta.time || ""}` : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4">
          <div className="font-medium mb-2">Status timeline</div>
          <div className="space-y-2 text-sm text-gray-700">
            {statuses.map((s) => (
              <div
                key={s}
                className={`p-3 rounded-xl border ${
                  s === appt.status
                    ? "border-green-300 bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>{s}</div>
                  {s === appt.status && (
                    <div className="text-xs text-gray-500">current</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => nav("/dashboard")}
              className="px-3 py-2 rounded-xl border"
            >
              Back
            </button>
            <button
              onClick={onAdvance}
              className="px-3 py-2 rounded-xl bg-green-600 text-white"
              disabled={(() => {
                const cur = (appt.status || "Submitted").toLowerCase();
                // no next step for final completed states
                if (cur.includes("success") || cur.includes("unsuccess"))
                  return true;
                // if upcoming and already 'ready', don't allow advancing to completed
                if (isUpcoming && cur === "ready") return true;
                return false;
              })()}
            >
              Advance status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
