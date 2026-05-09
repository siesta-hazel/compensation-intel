'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const router = useRouter();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [companiesCount, setCompaniesCount] = useState<number | null>(null);
  const [levelsList, setLevelsList] = useState<string[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/salaries?limit=1000').then(res => res.json()),
    ])
      .then(([salaryResponse]) => {
        const items = salaryResponse.data || salaryResponse;
        if (Array.isArray(items)) {
          const uniqueCompanies = new Set(items.map((s: any) => s.company));
          setCompaniesCount(uniqueCompanies.size);
          const uniqueLevels = new Set(items.map((s: any) => s.level));
          setLevelsList(Array.from(uniqueLevels).sort());
        }
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));
  }, []);

  const handleSalarySearch = () => {
    const params = new URLSearchParams();
    if (company) params.append('company', company);
    if (role) params.append('role', role);
    if (level) params.append('level', level);
    if (location) params.append('location', location);
    router.push(`/salaries?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight gradient-text sm:text-6xl">
            Compensation Intelligence
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Levels‑based, structured, and comparable salary insights.
            Make data‑driven career decisions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {loadingStats ? '...' : companiesCount ?? 0}
            </div>
            <div className="text-gray-600">Companies tracked</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {loadingStats ? '...' : levelsList.length > 0 ? levelsList.join(', ') : 'L3 – L5'}
            </div>
            <div className="text-gray-600">Standardized levels</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">Real-time</div>
            <div className="text-gray-600">Comparison</div>
          </div>
        </div>

        {/* Salary Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Find Salaries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company (e.g., Google)"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Role (e.g., Engineer)"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Level (e.g., L4)"
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Location (e.g., Bangalore)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            onClick={handleSalarySearch}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search Salaries →
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-gray-200 p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Contribute your salary</h2>
          <p className="text-gray-600 mb-4">
            Help others by sharing your compensation data. It takes only a minute.
          </p>
          <Link
            href="/add-salary"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
          >
            Add Your Salary →
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            You can use the form or paste JSON – all data is strictly validated.
          </p>
        </div>
      </main>
    </>
  );
}