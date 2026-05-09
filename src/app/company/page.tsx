'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function CompanySearchPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<{ name: string; count: number }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/salaries?limit=1000')
      .then(res => res.json())
      .then((response: any) => {
        const items = response.data || response;
        if (Array.isArray(items)) {
          const counts: Record<string, number> = {};
          items.forEach((s: any) => {
            counts[s.company] = (counts[s.company] || 0) + 1;
          });
          const companyList = Object.entries(counts).map(([name, count]) => ({ name, count }));
          companyList.sort((a, b) => a.name.localeCompare(b.name));
          setCompanies(companyList);
        } else {
          setCompanies([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGo = () => {
    if (selectedCompany) {
      router.push(`/company/${selectedCompany.toLowerCase()}`);
    }
  };

  const capitalizeCompany = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Company Lookup</h1>
          <p className="text-gray-600 mb-4">Select a company from the dropdown to view its compensation insights.</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select a company</label>
            {loading ? (
              <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
            ) : companies.length === 0 ? (
              <div className="text-gray-500">No companies found. Add salary records first.</div>
            ) : (
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"
              >
                <option value="">-- Select a company --</option>
                {companies.map(comp => (
                  <option key={comp.name} value={comp.name}>
                    {capitalizeCompany(comp.name)} ({comp.count} record{comp.count !== 1 ? 's' : ''})
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleGo}
            disabled={!selectedCompany}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            View Company
          </button>
        </div>
      </main>
    </>
  );
}