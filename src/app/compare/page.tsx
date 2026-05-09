'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface SalaryOption {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  totalCompensation: number;
}

interface FullSalary extends SalaryOption {
  baseSalary: number;
  bonus: number;
  stock: number;
}

interface ComparisonData {
  left: FullSalary;
  right: FullSalary;
  difference: {
    base: number;
    bonus: number;
    stock: number;
    total: number;
  };
}

export default function ComparePage() {
  const [salaries, setSalaries] = useState<SalaryOption[]>([]);
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState('');

  // Load all salaries
  useEffect(() => {
    fetch('/api/salaries?limit=1000&sortBy=company&sortOrder=asc')
      .then(res => res.json())
      .then((response: any) => {
        const items = response.data || response;
        if (Array.isArray(items)) {
          const options = items.map((s: any) => ({
            id: s.id,
            company: s.company,
            role: s.role,
            level: s.level,
            location: s.location,
            totalCompensation: s.totalCompensation,
          }));
          setSalaries(options);
        } else {
          setSalaries([]);
        }
        setLoadingList(false);
      })
      .catch(() => setLoadingList(false));
  }, []);

  // Fetch comparison
  useEffect(() => {
    if (leftId && rightId && leftId !== rightId) {
      setComparing(true);
      setError('');
      fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [leftId, rightId] }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            const left = data.left.id === leftId ? data.left : data.right;
            const right = data.right.id === rightId ? data.right : data.left;
            const difference = {
              base: left.baseSalary - right.baseSalary,
              bonus: left.bonus - right.bonus,
              stock: left.stock - right.stock,
              total: left.totalCompensation - right.totalCompensation,
            };
            setComparison({ left, right, difference });
          }
          setComparing(false);
        })
        .catch(() => {
          setError('Failed to compare. Please try again.');
          setComparing(false);
        });
    } else {
      setComparison(null);
    }
  }, [leftId, rightId]);

  const getDisplayLabel = (s: SalaryOption) => {
    const company = s.company.charAt(0).toUpperCase() + s.company.slice(1);
    return `${company} – ${s.role} (${s.level}, ${s.location}) – ₹${s.totalCompensation.toLocaleString()}`;
  };

  const capitalizeCompany = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Compare Salaries</h1>
        <p className="text-gray-600 mb-6">Select two salary records to see a detailed side‑by‑side comparison.</p>

        {/* Selection dropdowns */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">First salary</label>
              {loadingList ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <select
                  value={leftId}
                  onChange={e => setLeftId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a salary --</option>
                  {salaries.map(s => (
                    <option key={s.id} value={s.id}>{getDisplayLabel(s)}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Second salary</label>
              {loadingList ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <select
                  value={rightId}
                  onChange={e => setRightId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a salary --</option>
                  {salaries.map(s => (
                    <option key={s.id} value={s.id}>{getDisplayLabel(s)}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {leftId === rightId && leftId !== '' && (
            <p className="text-amber-600 text-sm mt-3">Please select two different salaries.</p>
          )}
        </div>

        {/* Comparison results */}
        {comparing && (
          <div className="text-center py-12">
            <div className="inline-block animate-pulse text-gray-500">Loading comparison...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {comparison && !comparing && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                <h2 className="text-xl font-bold">{capitalizeCompany(comparison.left.company)}</h2>
                <p className="text-gray-600">{comparison.left.role} · {comparison.left.level} · {comparison.left.location}</p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Salary</span>
                  <span className="font-medium">₹{comparison.left.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bonus</span>
                  <span>₹{comparison.left.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock / Equity</span>
                  <span>₹{comparison.left.stock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                  <span>Total Compensation</span>
                  <span>₹{comparison.left.totalCompensation.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                <h2 className="text-xl font-bold">{capitalizeCompany(comparison.right.company)}</h2>
                <p className="text-gray-600">{comparison.right.role} · {comparison.right.level} · {comparison.right.location}</p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Salary</span>
                  <span className="font-medium">₹{comparison.right.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bonus</span>
                  <span>₹{comparison.right.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock / Equity</span>
                  <span>₹{comparison.right.stock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                  <span>Total Compensation</span>
                  <span>₹{comparison.right.totalCompensation.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Difference summary */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-5 text-sm">
              <h3 className="font-semibold text-gray-700 mb-2">Difference (first – second)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  Base:{' '}
                  <span className={comparison.difference.base >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{comparison.difference.base.toLocaleString()}
                  </span>
                </div>
                <div>
                  Bonus:{' '}
                  <span className={comparison.difference.bonus >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{comparison.difference.bonus.toLocaleString()}
                  </span>
                </div>
                <div>
                  Stock:{' '}
                  <span className={comparison.difference.stock >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{comparison.difference.stock.toLocaleString()}
                  </span>
                </div>
                <div className="font-bold">
                  Total:{' '}
                  <span className={comparison.difference.total >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{comparison.difference.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!leftId && !rightId && !comparison && !comparing && !loadingList && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Select two salaries from the dropdowns above to see the comparison.</p>
          </div>
        )}
      </main>
    </>
  );
}