import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { scheduleApi } from '../api/scheduleApi';
import { patientsApi } from '../api/patientsApi';
import { Patient, ScheduleEntry, StaffData } from '../types';
import './Schedule.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';
import PageContainer from '../components/PageContainer';


interface ScheduleFormValues {
  patientId: string;
  dialysisUnit: string;
  technician: string;
  admittingDoctor: string;
  date: string;
  time: string;
  remarks: string;
}

const validationSchema = Yup.object({
  patientId: Yup.string().required('Patient selection is required'),
  dialysisUnit: Yup.string().required('Dialysis unit is required'),
  technician: Yup.string().required('Technician is required'),
  admittingDoctor: Yup.string().required('Admitting doctor is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  remarks: Yup.string()
});

const Schedule: React.FC<{ sidebarCollapsed: boolean; toggleSidebar: () => void }> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<StaffData>({ technicians: [], doctors: [], units: [] });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Pagination state for schedules
  const [schedulesPage, setSchedulesPage] = useState(1);
  const [schedulesRowsPerPage, setSchedulesRowsPerPage] = useState(10);
  const schedulesTotalPages = Math.ceil(schedules.length / schedulesRowsPerPage);
  const paginatedSchedules = schedules.slice((schedulesPage - 1) * schedulesRowsPerPage, schedulesPage * schedulesRowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesData, patientsData, staffData] = await Promise.all([
          scheduleApi.getAllSchedules(),
          patientsApi.getAllPatients(),
          scheduleApi.getStaff()
        ]);
        setSchedules(schedulesData);
        setPatients(patientsData);
        setStaff(staffData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      }
    };
    fetchData();
  }, []);

  const initialValues: ScheduleFormValues = {
    patientId: '',
    dialysisUnit: '',
    technician: '',
    admittingDoctor: '',
    date: '',
    time: '',
    remarks: ''
  };

  const handleSubmit = async (values: ScheduleFormValues, { resetForm }: FormikHelpers<ScheduleFormValues>) => {
    setError('');
    const patient = patients.find(p => p.id?.toString() === values.patientId);
    if (!patient) {
      setError('Please select a patient.');
      return;
    }
    const newSchedule = {
      ...values,
      patientName: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
    };
    try {
      await scheduleApi.createSchedule(newSchedule);
      setSuccess(true);
      resetForm();
      setSchedules(await scheduleApi.getAllSchedules());
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to add schedule');
    }
  };

  const renderPagination = (currentPage: number, totalPages: number, setPage: (page: number) => void, rowsPerPage: number, setRowsPerPage: (n: number) => void) => {
    const pageWindow = 2;
    let start = Math.max(1, currentPage - pageWindow);
    let end = Math.min(totalPages, currentPage + pageWindow);
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      if (end === totalPages) start = Math.max(1, end - 4);
    }
    const pageNumbers = [];
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            style={{ margin: '0 8px', padding: '2px 8px', borderRadius: 4 }}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          Page {currentPage} of {totalPages}
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" onClick={() => setPage(1)} disabled={currentPage === 1}>&#171; First</button>
          <button className="pagination-btn" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>&#8249; Prev</button>
          <div className="page-numbers">
            {pageNumbers.map(page => (
              <button
                key={page}
                className={`page-number${page === currentPage ? ' active' : ''}`}
                onClick={() => setPage(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="pagination-btn" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>Next &#8250;</button>
          <button className="pagination-btn" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>Last &#187;</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Container fluid className={`home-container py-2 ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        {/* <div className="main-container" style={{ height: '100%' }}> */}
        <PageContainer>
          {/* <div style={{ width: '100%', padding: '10px',marginTop: '-20px' }}> */}
          <SectionHeading title="Schedule" subtitle="Manage and view dialysis appointments" />
          {/* </div> */}
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <h2 className="home-title mb-4">Schedule Dialysis Session</h2>
                  {success && (
                    <div className="alert alert-success">
                      Session scheduled successfully!
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Row>
                          <Col md={6} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="patientId" className="form-label">Patient</label>
                              <Field as="select" id="patientId" name="patientId" className="form-select">
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim()}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="patientId" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={6} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="dialysisUnit" className="form-label">Dialysis Unit</label>
                              <Field as="select" id="dialysisUnit" name="dialysisUnit" className="form-select">
                                <option value="">Select Unit</option>
                                {staff.units.map(unit => (
                                  <option key={unit} value={unit}>{unit}</option>
                                ))}
                              </Field>
                              <ErrorMessage name="dialysisUnit" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={6} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="technician" className="form-label">Technician</label>
                              <Field as="select" id="technician" name="technician" className="form-select">
                                <option value="">Select Technician</option>
                                {staff.technicians.map(tech => (
                                  <option key={tech} value={tech}>{tech}</option>
                                ))}
                              </Field>
                              <ErrorMessage name="technician" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={6} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="admittingDoctor" className="form-label">Admitting Doctor</label>
                              <Field as="select" id="admittingDoctor" name="admittingDoctor" className="form-select">
                                <option value="">Select Doctor</option>
                                {staff.doctors.map(doc => (
                                  <option key={doc} value={doc}>{doc}</option>
                                ))}
                              </Field>
                              <ErrorMessage name="admittingDoctor" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={6} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="date" className="form-label">Date</label>
                              <Field type="date" id="date" name="date" className="form-control" />
                              <ErrorMessage name="date" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={6} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="time" className="form-label">Time</label>
                              <Field type="time" id="time" name="time" className="form-control" />
                              <ErrorMessage name="time" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={12} className="mb-3">
                            <div className="form-group">
                              <label htmlFor="remarks" className="form-label">Remarks</label>
                              <Field as="textarea" id="remarks" name="remarks" className="form-control" rows={3} />
                              <ErrorMessage name="remarks" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col md={12}>
                            {/* <button type="submit" className="btn btn-primary" disabled={isSubmitting}> */}
                            <button type="submit" className="btn-with-gradient" disabled={isSubmitting}>
                              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
                            </button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="table-container" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className='dashboard-table-heading'>Scheduled Sessions: {schedules.length}</div>
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Unit</th>
                  <th>Technician</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchedules.length > 0 ? (
                  paginatedSchedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{schedule.patientName}</td>
                      <td>{schedule.date}</td>
                      <td>{schedule.time}</td>
                      <td>{schedule.dialysisUnit}</td>
                      <td>{schedule.technician}</td>
                      <td>{schedule.admittingDoctor}</td>
                      <td>{schedule.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No scheduled sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {schedulesTotalPages > 1 && renderPagination(schedulesPage, schedulesTotalPages, setSchedulesPage, schedulesRowsPerPage, setSchedulesRowsPerPage)}
          </div>
          {/* </div> */}
        </PageContainer>
        <Footer />
      </Container>
    </>
  );
};

export default Schedule; 