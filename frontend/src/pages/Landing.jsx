import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  Building2,
  ChevronDown,
  Bot,
  CheckCircle2,
} from "lucide-react";
import { DEPARTMENTS, SEARCH_ITEMS } from "../utils/mockData";
import ChatbotWidget from "../components/ChatbotWidget";

const SearchResultItem = ({ item }) => {
  if (item.type === "department") {
    return (
      <Link
        to={`/departments/${item.id}`}
        className="flex gap-3 p-3 hover:bg-gray-50 rounded-2xl"
      >
        <Building2 className="w-5 h-5 mt-1" />
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-gray-500">Department</div>
        </div>
      </Link>
    );
  }
  return (
    <Link
      to={`/departments/${item.depId}`}
      className="flex gap-3 p-3 hover:bg-gray-50 rounded-2xl"
    >
      <FileText className="w-5 h-5 mt-1" />
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-500">
          Service • {DEPARTMENTS.find((d) => d.id === item.depId)?.name}
        </div>
      </div>
    </Link>
  );
};

export default function Landing() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_ITEMS.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.description?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  return (
    <div>
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              One Portal. All Services,{" "}
              <span className="text-green-600">One Touch Away.</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Get what you need faster, without the queues or confusion. Search
              for a service or department below.
            </p>
            <div className="mt-6 relative">
              <div className="flex items-center gap-2 bg-white rounded-2xl shadow p-2 border">
                <Search className="w-5 h-5 ml-2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 outline-none p-2"
                  placeholder="Search for a service... (e.g., Working Visa Extension)"
                />
              </div>
              {results.length > 0 && (
                <div className="absolute mt-2 w-full bg-white border rounded-2xl shadow-xl z-10">
                  {results.map((r) => (
                    <SearchResultItem key={r.type + r.id} item={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <img
              alt="people cheering"
              className="rounded-3xl shadow-xl w-full object-cover"
              src="/images/Hero Image.png"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-lg font-semibold text-gray-600">Quick Access</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          {DEPARTMENTS[0].services.slice(0, 4).map((s, idx) => (
            <Link
              key={s.id}
              to={`/departments/${DEPARTMENTS[0].id}`}
              className="group bg-white p-3 rounded-2xl border shadow-sm hover:shadow-md transition"
            >
              <img
                src={`/images/${
                  s.id === "working-visa-extension"
                    ? "Working_Visa_Extension.jpg"
                    : s.id === "tourist-visa-extension"
                    ? "Tourist_Visa_Extension.jpg"
                    : `service-${idx + 1}.jpg`
                }`}
                className="rounded-xl w-full h-36 object-cover"
              />
              <div className="mt-3 font-medium group-hover:text-green-700">
                {s.name}
              </div>
              <div className="text-sm text-gray-500">{s.short}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-sm text-green-700">
                Get started <ChevronDown className="rotate-[-90deg] w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "url('/images/Meet_Guidey_Background.png'), radial-gradient(600px 200px at 10% 10%, #22c55e33, transparent), radial-gradient(600px 200px at 90% 80%, #16a34a33, transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div
            className="bg-white rounded-3xl border shadow-xl p-6 grid md:grid-cols-2 gap-6 items-center"
            style={{
              backgroundImage: "url('/images/Meet_Guidey.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left bottom",
              backgroundSize: "38%",
            }}
          >
            <div className="relative pb-16">
              <span className="inline-flex items-center gap-2 text-green-700 font-semibold">
                {" "}
                <Bot className="w-5 h-5" /> Meet Guidey
              </span>
              <h3 className="text-2xl font-bold mt-2">
                Your 24/7 Government Service Assistant
              </h3>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 mt-[2px]" /> Get instant
                  answers to your questions
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 mt-[2px]" /> Follow
                  step-by-step guidance for any process
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 mt-[2px]" /> Help in Sinhala,
                  Tamil, or English
                </li>
              </ul>
            </div>
            <div>
              <ChatbotWidget />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
