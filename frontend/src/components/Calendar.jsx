import React, { useState } from "react";
import { classNames } from "../utils/helpers";

export function MiniCalendar() {
  const [cur, setCur] = useState(new Date());
  const year = cur.getFullYear(),
    month = cur.getMonth();
  const start = new Date(year, month, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: startDay })
    .map(() => "")
    .concat(Array.from({ length: daysInMonth }).map((_, i) => i + 1));
  const goto = (d) => setCur(new Date(year, month + d, 1));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => goto(-1)}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ‹
        </button>
        <div className="font-medium">
          {cur.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          onClick={() => goto(1)}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((d, i) => (
          <div
            key={i}
            className={classNames(
              "aspect-square grid place-items-center text-sm rounded-xl",
              d === new Date().getDate() && month === new Date().getMonth()
                ? "bg-green-600 text-white"
                : "bg-gray-50"
            )}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
