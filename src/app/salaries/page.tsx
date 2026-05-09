export const dynamic = 'force-dynamic';
'use client';
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

export default function SalariesPage() {
  const searchParams = useSearchParams();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
    role: searchParams.get('role') || '',
    level: searchParams.get('level') || '',
    location: searchParams.get('location') || '',
  });
  const [sortField, setSortField] = useState<SortField>('totalCompensation');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const fetchSalaries = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.company) params.append('company', filters.company);
    if (filters.role) params.append('role', filters.role);
    if (filters.level) params.append('level', filters.level);
    if (filters.location) params.append('location', filters.location);
    params.append('sortBy', sortField);
    params.append('sortOrder', sortOrder);
    params.append('page', currentPage.toString());
    params.append('limit', '20');
    try {
      const res = await fetch(`/api/salaries?${params.toString()}`);
      const json = await res.json();
      setSalaries(json.data);
      setTotalPages(json.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Salary Explorer</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              placeholder="e.g., Google"
              value={filters.company}
              onChange={e => {
                setFilters({ ...filters, company: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              placeholder="e.g., Engineer"
              value={filters.role}
              onChange={e => {
                setFilters({ ...filters, role: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <input
              type="text"
              placeholder="e.g., L4"
              value={filters.level}
              onChange={e => {
                setFilters({ ...filters, level: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g., Bangalore"
              value={filters.location}
              onChange={e => {
                setFilters({ ...filters, location: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading salaries...</div>
        ) : salaries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No salaries found. Try broader search terms.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { label: 'Company', field: 'company' },
                      { label: 'Role', field: 'role' },
                      { label: 'Level', field: 'level' },
                      { label: 'Location', field: 'location' },
                      { label: 'Experience', field: 'experienceYears' },
                      { label: 'Total Compensation', field: 'totalCompensation' },
                    ].map((col) => (
                      <th
                        key={col.label}
                        onClick={() => col.field && handleSort(col.field as SortField)}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          col.field ? 'cursor-pointer hover:bg-gray-100' : ''
                        }`}
                      >
                        {col.label}
                        {col.field && <SortIndicator field={col.field as SortField} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                        <Link href={`/company/${salary.company}`}>
                          {capitalizeCompany(salary.company)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{salary.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {salary.level}
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{salary.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{salary.experienceYears}y</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{salary.totalCompensation.toLocaleString()}
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}