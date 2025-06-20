// import React from 'react';
// import { useDialysis } from '../context/DialysisContext';

// const ScheduleDialysis: React.FC = () => {
//   const { patients } = useDialysis();

//   return (
//     <div>
//       <h2>Schedule Dialysis Session</h2>
//       <form>
//         <label>Select Patient:
//           <select>
//             {patients.map((p) => (
//               <option key={p.id} value={p.id}>{p.name}</option>
//             ))}
//           </select>
//         </label><br />
//         <label>Dialysis Unit:<input type="text" /></label><br />
//         <label>Technician:<input type="text" /></label><br />
//         <label>Admitting Doctor:<input type="text" /></label><br />
//         <label>Additional Remarks:<textarea /></label><br />
//         <button type="submit">Schedule</button>
//       </form>
//     </div>
//   );
// };

// export default ScheduleDialysis; 