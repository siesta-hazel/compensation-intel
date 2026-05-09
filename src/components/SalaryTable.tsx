'use client';
import { useEffect, useState } from 'react';

interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  experienceYears: number;
  totalCompensation: number;
}

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [filters, setFilters] = useState({ company: '', level: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/salaries?company=${filters.company}&level=${filters.level}`)
      .then(res => res.json())
      .then(data => { setSalaries(data); setLoading(false); });
  }, [filters]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Salary Explorer</h1>
      <div className="flex gap-4 mb-6">
        <input placeholder="Company" value={filters.company} onChange={e => setFilters({...filters, company: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Level (L3, L4...)" value={filters.level} onChange={e => setFilters({...filters, level: e.target.value})} className="border p-2 rounded" />
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr><th>Company</th><th>Role</th><th>Level</th><th>Location</th><th>Experience</th><th>Total Comp (₹)</th></tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.company}</td><td>{s.role}</td><td>{s.level}</td><td>{s.location}</td><td>{s.experienceYears}y</td>
                <td className="font-semibold">₹{s.totalCompensation.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}