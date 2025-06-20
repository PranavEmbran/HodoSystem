import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDialysis } from '../context/DialysisContext';
import { History } from '../types';

interface SortConfig {
  key: keyof History | 'amount';
  direction: 'asc' | 'desc';
}

const DialysisHistory: React.FC = () => {
  const { history, setHistory } = useDialysis();
  const [search, setSearch] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

  useEffect(() => {
    const savedHistory = localStorage.getItem('dialysisHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [setHistory]);

  useEffect(() => {
    localStorage.setItem('dialysisHistory', JSON.stringify(history));
  }, [history]);

  const handleDelete = (indexToDelete: number) => {
    const updatedHistory = history.filter((_: any, index: number) => index !== indexToDelete);
    setHistory(updatedHistory);
  };

  const handleSort = (key: keyof History | 'amount') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedHistory = [...history].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredHistory = sortedHistory.filter((entry: any) =>
    entry.patientName.toLowerCase().includes(search.toLowerCase()) &&
    (!dateRange.from || new Date(entry.date) >= new Date(dateRange.from)) &&
    (!dateRange.to || new Date(entry.date) <= new Date(dateRange.to))
  );

  return (
    <div>
      <h2>Dialysis History</h2>
      <input
        type="text"
        placeholder="Search by patient name..."
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '50%' }}
      />
      <div style={{ marginBottom: '10px' }}>
        <label>From: <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} /></label>
        <label style={{ marginLeft: '10px' }}>To: <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} /></label>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('patientName')} style={{ cursor: 'pointer' }}>Patient {sortConfig.key === 'patientName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th>Treatment Parameters</th>
            <th>Nursing Notes</th>
            <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Amount {sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.length === 0 && (
            <tr>
              <td colSpan={6}>No matching records found</td>
            </tr>
          )}
          {filteredHistory.map((entry: any, index: number) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.patientName} [{entry.age} yrs, {entry.gender}]</td>
              <td>{entry.parameters}</td>
              <td>{entry.notes}</td>
              <td><span style={{
                display: 'inline-block',
                padding: '4px 8px',
                backgroundColor: '#f44336',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px'
              }}>{entry.amount} INR</span></td>
              <td>
                <button onClick={() => handleDelete(index)} style={{ backgroundColor: '#e53935' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DialysisHistory; 