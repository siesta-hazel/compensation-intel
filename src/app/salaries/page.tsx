'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  experienceYears: number;
  totalCompensation: number;
}

type SortField = 'company' | 'role' | 'level' | 'location' | 'totalCompensation' | 'experienceYears';
type SortOrder = 'asc' | 'desc';

const capitalizeCompany = (name: string) => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// This component contains all the logic that uses useSearchParams
function SalariesContent() {
  const searchParams = useSearchParams();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
    role: searchParams.get('role') || '',
    level: searchParams.get('level') || '',
    location: searchParams.get('location') || '',
  });
  const [sortField, setSortField] = useState<SortField>('totalCompensation');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.company) params.append('company', filters.company);
    if (filters.role) params.append('role', filters.role);
    if (filters.level) params.append('level', filters.level);
    if (filters.location) params.append('location', filters.location);
    params.append('sortBy', sortField);
    params.append('sortOrder', sortOrder);
    params.append('page', currentPage.toString());
    params.append('limit', '20');
    fetch(`/api/salaries?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        setSalaries(json.data);
        setTotalPages(json.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters, sortField, sortOrder, currentPage]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <span className="text-gray-300 ml-1">↕️</span>;
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Salary Explorer</h1>
      <p className="text-gray-600 mb-6">Partial search: type “goog” to find Google, “bang” to find Bangalore, etc.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input type="text" placeholder="e.g., Google" value={filters.company} onChange={e => { setFilters({ ...filters, company: e.target.value }); setCurrentPage(1); }} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input type="text" placeholder="e.g., Engineer" value={filters.role} onChange={e => { setFilters({ ...filters, role: e.target.value }); setCurrentPage(1); }} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <input type="text" placeholder="e.g., L4" value={filters.level} onChange={e => { setFilters({ ...filters, level: e.target.value }); setCurrentPage(1); }} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" placeholder="e.g., Bangalore" value={filters.location} onChange={e => { setFilters({ ...filters, location: e.target.value }); setCurrentPage(1); }} className="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading salaries...</div>
      ) : salaries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">No salaries found. Try broader search terms.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Company', 'Role', 'Level', 'Location', 'Experience', 'Total Compensation'].map((label, idx) => {
                    const field: SortField | null = ['company', 'role', 'level', 'location', 'experienceYears', 'totalCompensation'][idx] as SortField;
                    return (
                      <th key={label} onClick={() => field && handleSort(field)} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${field ? 'cursor-pointer hover:bg-gray-100' : ''}`}>
                        {label}
                        {field && <SortIndicator field={field} />}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                      <Link href={`/company/${salary.company}`}>{capitalizeCompany(salary.company)}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm">{salary.role}</td>
                    <td className="px-6 py-4 text-sm"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{salary.level}</span></td>
                    <td className="px-6 py-4 text-sm">{salary.location}</td>
                    <td className="px-6 py-4 text-sm">{salary.experienceYears}y</td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{salary.totalCompensation.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-md disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-md disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

// The main exported component – wrap SalariesContent in Suspense
export default function SalariesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="p-6 text-center">Loading salary explorer...</div>}>
        <SalariesContent />
      </Suspense>
    </>
  );
}