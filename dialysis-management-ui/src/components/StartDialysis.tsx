// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import { historyApi } from '../api/historyApi';
// import { patientsApi } from '../api/patientsApi';
// import { Patient, History } from '../types';
// import './StartDialysis.css';
// import SectionHeading from '../components/SectionHeading';
// import { Row, Col } from 'react-bootstrap'; 

// const StartDialysis: React.FC<{ sidebarCollapsed: boolean; toggleSidebar: () => void }> = ({ sidebarCollapsed, toggleSidebar }) => {
//   const [form, setForm] = useState({
//     patientId: '',
//     parameters: '',
//     notes: '',
//     amount: '',
//     age: '',
//     gender: '',
//   });
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [history, setHistory] = useState<History[]>([]);
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<boolean>(false);

//   useEffect(() => {
//     patientsApi.getAllPatients().then(setPatients).catch(() => setError('Failed to fetch patients'));
//     historyApi.getAllHistory().then(setHistory).catch(() => setError('Failed to fetch history'));
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const patient = patients.find(p => String(p.id) === form.patientId);
//     if (!patient) {
//       setError('Please select a patient.');
//       return;
//     }
//     const newEntry: History = {
//       date: new Date().toISOString().split('T')[0],
//       patientId: String(patient.id),
//       patientName: patient.name,
//       parameters: form.parameters || '',
//       notes: form.notes || '',
//       amount: form.amount ? String(form.amount) : '0',
//       age: form.age ? String(form.age) : 'NA',
//       gender: form.gender || 'NA',
//     };
//     try {
//       await historyApi.addHistory(newEntry);
//       setSuccess(true);
//       setForm({ patientId: '', parameters: '', notes: '', amount: '', age: '', gender: '' });
//       setHistory(await historyApi.getAllHistory());
//       setTimeout(() => setSuccess(false), 2000);
//     } catch (err) {
//       console.log('Failed to add history', err);
//       setError('Failed to add history');
//     }
//   };

//   return (
//     <div className={`start-dialysis-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
//       <Row className="mb-4">
//         <Col>
//           <SectionHeading title="Start Dialysis" subtitle="Begin and monitor a new dialysis session" />
//         </Col>
//       </Row>
//       <div className='start-dialysis-card'>
//         {error && <div className='alert alert-danger'>{error}</div>}
//         {success && <div className='alert alert-success'>Entry added successfully!</div>}
//         <form onSubmit={handleSubmit} className='start-dialysis-form'>
//           <div className='form-group'>
//             <label className='form-label'>Patient:</label>
//             <select 
//               name="patientId" 
//               value={form.patientId} 
//               onChange={handleChange}
//               className='form-select'
//             >
//               <option value="">Select a patient</option>
//               {patients.map(p => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className='form-group'>
//             <label className='form-label'>Parameters:</label>
//             <input 
//               type="text" 
//               name="parameters" 
//               value={form.parameters} 
//               onChange={handleChange}
//               className='form-control'
//               placeholder="Enter parameters"
//             />
//           </div>
          
//           <div className='form-group'>
//             <label className='form-label'>Notes:</label>
//             <input 
//               type="text" 
//               name="notes" 
//               value={form.notes} 
//               onChange={handleChange}
//               className='form-control'
//               placeholder="Enter notes"
//             />
//           </div>
          
//           <div className='form-group'>
//             <label className='form-label'>Amount:</label>
//             <input 
//               type="number" 
//               name="amount" 
//               value={form.amount} 
//               onChange={handleChange}
//               className='form-control'
//               placeholder="Enter amount"
//             />
//           </div>
          
//           <button type="submit" className='btn-primary'>Add Entry</button>
//         </form>
//       </div>

//       <div className='start-dialysis-card'>
//         <h3 className='start-dialysis-title'>Dialysis History</h3>
//         <div className='history-table-container'>
//           <table className='history-table'>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Patient</th>
//                 <th>Parameters</th>
//                 <th>Notes</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {history.map((h, i) => (
//                 <tr key={i}>
//                   <td>{h.date}</td>
//                   <td>{h.patientName}</td>
//                   <td>{h.parameters}</td>
//                   <td>{h.notes}</td>
//                   <td>{h.amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StartDialysis; 