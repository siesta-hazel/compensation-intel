'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function AddSalaryPage() {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    level_standardized: '',
    base_salary: '',
    bonus: '',
    stock: '',
    location: '',
    experience_years: '',
  });
  const [jsonInput, setJsonInput] = useState('');
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = {
      company: formData.company,
      role: formData.role,
      level_standardized: formData.level_standardized,
      base_salary: parseFloat(formData.base_salary),
      bonus: parseFloat(formData.bonus) || 0,
      stock: parseFloat(formData.stock) || 0,
      location: formData.location,
      experience_years: parseInt(formData.experience_years),
    };
    try {
      const res = await fetch('/api/ingest-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Salary added successfully!' });
        setFormData({
          company: '', role: '', level_standardized: '', base_salary: '', bonus: '', stock: '', location: '', experience_years: '',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add salary' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = JSON.parse(jsonInput);
      const res = await fetch('/api/ingest-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Salary added successfully!' });
        setJsonInput('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid JSON or missing fields' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid JSON format' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Add Salary Record</h1>
        <p className="text-gray-600 mb-6">Contribute to the compensation intelligence system.</p>

        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setMode('form')}
            className={`pb-2 px-2 ${mode === 'form' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
          >
            Form
          </button>
          <button
            onClick={() => setMode('json')}
            className={`pb-2 px-2 ${mode === 'json' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
          >
            Paste JSON
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {mode === 'form' && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input name="company" value={formData.company} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input name="role" value={formData.role} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level * (e.g., L4)</label>
                <input name="level_standardized" value={formData.level_standardized} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary * (₹)</label>
                <input name="base_salary" type="number" value={formData.base_salary} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus (₹)</label>
                <input name="bonus" type="number" value={formData.bonus} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2" />
                <p className="text-xs text-gray-400 mt-1">Defaults to 0</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock / Equity (₹)</label>
                <input name="stock" type="number" value={formData.stock} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2" />
                <p className="text-xs text-gray-400 mt-1">Defaults to 0</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input name="location" value={formData.location} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                <input name="experience_years" type="number" value={formData.experience_years} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Salary'}
            </button>
          </form>
        )}

        {mode === 'json' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <textarea
              rows={10}
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
              placeholder={`{
  "company": "Google",
  "role": "Software Engineer",
  "level_standardized": "L4",
  "base_salary": 3500000,
  "bonus": 500000,
  "stock": 800000,
  "location": "Bangalore",
  "experience_years": 4
}`}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <button onClick={handleJsonSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit JSON'}
            </button>
          </div>
        )}
      </main>
    </>
  );
}