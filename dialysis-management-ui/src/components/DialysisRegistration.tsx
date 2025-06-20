// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import { patientsApi } from '../api/patientsApi';
// import { Patient } from '../types';

// const DialysisRegistration: React.FC = () => {
//   const [form, setForm] = useState<Omit<Patient, 'id'>>({ 
//     name: '', 
//     bloodGroup: '', 
//     catheterDate: '', 
//     fistulaDate: '' 
//   });
//   const [error, setError] = useState<string>('');
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [success, setSuccess] = useState<boolean>(false);

//   useEffect(() => {
//     patientsApi.getAllPatients()
//       .then(setPatients)
//       .catch(() => setError('Failed to fetch patients'));
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!form.name || !form.bloodGroup || !form.catheterDate || !form.fistulaDate) {
//       setError('All fields are required');
//       return;
//     }
//     setError('');
//     try {
//       await patientsApi.addPatient(form);
//       setSuccess(true);
//       setForm({ name: '', bloodGroup: '', catheterDate: '', fistulaDate: '' });
//       setPatients(await patientsApi.getAllPatients());
//       setTimeout(() => setSuccess(false), 2000);
//     } catch {
//       setError('Failed to add patient');
//     }
//   };

//   return (
//     <div>
//       <h2>Dialysis Registration</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>Patient added!</p>}
//       <form onSubmit={handleSubmit}>
//         <label>Patient Name:<input type="text" name="name" value={form.name} onChange={handleChange} /></label><br />
//         <label>Blood Group:<input type="text" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} /></label><br />
//         <label>Catheter Insertion Date:<input type="date" name="catheterDate" value={form.catheterDate} onChange={handleChange} /></label><br />
//         <label>Fistula Creation Date:<input type="date" name="fistulaDate" value={form.fistulaDate} onChange={handleChange} /></label><br />
//         <button className="btn-with-gradient" type="submit">Register Patient</button>
//       </form>
//       <h3>Registered Patients</h3>
//       <table style={{ border: '1px solid black' }}>
//         <thead>
//           <tr><th>Name</th><th>Blood Group</th><th>Catheter Date</th><th>Fistula Date</th></tr>
//         </thead>
//         <tbody>
//           {patients.map(p => (
//             <tr key={p.id}>
//               <td>{p.name}</td>
//               <td>{p.bloodGroup}</td>
//               <td>{p.catheterDate}</td>
//               <td>{p.fistulaDate}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// export default DialysisRegistration; 