'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  experienceYears: number;
  totalCompensation: number;
}

interface CompanyData {
  salaries: Salary[];
  medianComp: number;
  levelDistribution: Record<string, number>;
}

interface PageProps {
  params: { company: string };
}

const capitalizeCompany = (name: string) => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export default function CompanyPage({ params }: PageProps) {
  const router = useRouter();
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<{ name: string; count: number }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Fetch current company data – using relative URL (works in dev & production)
  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      const res = await fetch(`/api/company/${params.company}`);
      if (!res.ok) {
        setData(null);
        setLoading(false);
        notFound();
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchCompanyData();
  }, [params.company]);

  // Fetch all companies (using relative URL)
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
        setLoadingCompanies(false);
      })
      .catch(() => setLoadingCompanies(false));
  }, []);

  const handleGoToCompany = () => {
    if (selectedCompany) {
      router.push(`/company/${selectedCompany.toLowerCase()}`);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!data) return null;
    const levelTotals: Record<string, { sum: number; count: number }> = {};
    data.salaries.forEach(s => {
      if (!levelTotals[s.level]) {
        levelTotals[s.level] = { sum: 0, count: 0 };
      }
      levelTotals[s.level].sum += s.totalCompensation;
      levelTotals[s.level].count += 1;
    });
    const levels = Object.keys(levelTotals).sort();
    const averages = levels.map(l => levelTotals[l].sum / levelTotals[l].count);
    return {
      labels: levels,
      datasets: [
        {
          label: 'Average Total Compensation (₹)',
          data: averages,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">Loading company data...</div>
      </>
    );
  }

  if (!data) {
    notFound();
  }

  const chartData = prepareChartData();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Average Total Compensation by Level' },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Dropdown to jump to another company */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Jump to another company</label>
          <div className="flex gap-3">
            {loadingCompanies ? (
              <div className="flex-1 h-10 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"
              >
                <option value="">-- Select a company --</option>
                {companies.map(comp => (
                  <option key={comp.name} value={comp.name}>
                    {capitalizeCompany(comp.name)} ({comp.count} record{comp.count !== 1 ? 's' : ''})
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleGoToCompany}
              disabled={!selectedCompany}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              Go
            </button>
          </div>
        </div>

        {/* Company header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold">{capitalizeCompany(params.company)}</h1>
          <p className="text-gray-500 mt-1">Compensation insights by level</p>
        </div>

        {/* Median and Level Distribution Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm uppercase tracking-wide text-gray-500">Median Total Compensation</h2>
            <p className="text-4xl font-bold mt-2">₹{data.medianComp.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">across all levels</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Level Distribution</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(data.levelDistribution).map(([level, count]) => (
                <div key={level} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className="font-semibold">{level}</span>: {count} record{count !== 1 ? 's' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData && chartData.labels.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-10">
            <div style={{ height: '400px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Salary Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Salaries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.salaries.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{s.role}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{s.level}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{s.location}</td>
                    <td className="px-6 py-4 text-sm">{s.experienceYears}y</td>
                    <td className="px-6 py-4 text-sm font-medium">₹{s.totalCompensation.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}