import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaUserInjured, FaProcedures, FaCalendarAlt } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { patientsApi } from '../api/patientsApi';
import { scheduleApi } from '../api/scheduleApi';
import { historyApi } from '../api/historyApi';
import { Patient, ScheduleEntry, History } from '../types';
import SectionHeading from '../components/SectionHeading';

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
}


interface FilteredData {
  patients: Patient[];
  appointments: ScheduleEntry[];
  history: History[];
}

const Dashboard: React.FC<{ sidebarCollapsed: boolean; toggleSidebar: () => void }> = ({ sidebarCollapsed, toggleSidebar }) => {
  // State for real data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<ScheduleEntry[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Filter states
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [opIp, setOpIp] = useState<'OP' | 'IP'>('OP');
  const [autoRefresh, setAutoRefresh] = useState<number>(15);
  const [showAll, setShowAll] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Auto-refresh timer
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Set up auto-refresh
  useEffect(() => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }

    if (autoRefresh > 0) {
      const timer = setInterval(() => {
        loadData();
      }, autoRefresh * 60 * 1000); // Convert minutes to milliseconds
      setRefreshTimer(timer);
    }

    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [autoRefresh]);

  // Load all data from APIs
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [patientsData, appointmentsData, historyData] = await Promise.all([
        patientsApi.getAllPatients(),
        scheduleApi.getAllSchedules(),
        historyApi.getAllHistory()
      ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setHistory(historyData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard statistics
  const getDashboardStats = (): Stat[] => {
    const today = new Date().toISOString().split('T')[0];

    // Count active patients (patients with recent appointments or history)
    const activePatients = patients.filter(patient => {
      const hasRecentAppointment = appointments.some(apt =>
        apt.patientId === patient.id && apt.date >= today
      );
      const hasRecentHistory = history.some(h =>
        h.patientId === patient.id && h.date >= today
      );
      return hasRecentAppointment || hasRecentHistory;
    }).length;

    // Count today's dialysis sessions
    const todaysSessions = history.filter(h => h.date === today).length;

    // Count upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= new Date() && aptDate <= nextWeek;
    }).length;

    return [
      {
        label: 'Total Active Patients',
        value: activePatients,
        icon: <FaUserInjured />
      },
      {
        label: "Today's Dialysis Sessions",
        value: todaysSessions,
        icon: <FaProcedures />
      },
      {
        label: 'Upcoming Appointments',
        value: upcomingAppointments,
        icon: <FaCalendarAlt />
      },
    ];
  };

  // Filter data based on current filters
  const getFilteredData = (): FilteredData => {
    let filteredPatients = [...patients];
    let filteredAppointments = [...appointments];
    let filteredHistory = [...history];

    // Apply date range filter
    if (fromDate) {
      filteredAppointments = filteredAppointments.filter(apt => apt.date >= fromDate);
      filteredHistory = filteredHistory.filter(h => h.date >= fromDate);
    }
    if (toDate) {
      filteredAppointments = filteredAppointments.filter(apt => apt.date <= toDate);
      filteredHistory = filteredHistory.filter(h => h.date <= toDate);
    }

    // Apply status filter
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }

    // Apply OP/IP filter (assuming OP = outpatient, IP = inpatient)
    // This is a simplified implementation - you might need to adjust based on your data structure
    if (opIp === 'IP') {
      // Filter for inpatients (you might need to add a field to distinguish OP/IP)
      filteredPatients = filteredPatients.filter(p => p.id); // Placeholder logic
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = filteredPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower) ||
        p.mobileNo?.includes(search) ||
        p.bloodGroup?.toLowerCase().includes(searchLower)
      );
    }

    // Apply "Show All" filter
    if (!showAll) {
      // Show only patients with recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentDate = thirtyDaysAgo.toISOString().split('T')[0];

      filteredPatients = filteredPatients.filter(patient => {
        const hasRecentActivity = appointments.some(apt =>
          apt.patientId === patient.id && apt.date >= recentDate
        ) || history.some(h =>
          h.patientId === patient.id && h.date >= recentDate
        );
        return hasRecentActivity;
      });
    }

    return {
      patients: filteredPatients,
      appointments: filteredAppointments,
      history: filteredHistory
    };
  };

  // Handle manual refresh
  const handleRefresh = () => {
    loadData();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFromDate('');
    setToDate('');
    setStatus('');
    setOpIp('OP');
    setSearch('');
    setShowAll(true);
  };

  const stats = getDashboardStats();
  const filteredData = getFilteredData();

  if (loading) {
    return (
      <>
        <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        <Container fluid className="home-container py-5">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard data...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <Container fluid className="home-container py-5">
        <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className="alert alert-danger" role="alert">
          <h4>Error Loading Data</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={loadData}>Retry</Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* <Container fluid className={`page-container py-5 ${sidebarCollapsed ? 'collapsed' : ''}`}> */}

      {/* <Container fluid className="home-container py-5"> */}
      {/* <Container fluid className={`home-container py-5 ${sidebarCollapsed ? 'collapsed' : ''}`}> */}
      <Container fluid className={`home-container py-5 ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className="main-container">

          <div style={{ width: '100%', padding: '10px' }}>
            <SectionHeading title="Dashboard" subtitle="Overview and quick stats for dialysis management" />
          </div>
          <Row className="mb-4">
            {stats.map((stat) => (
              <Col key={stat.label} md={4} className="mb-3 d-flex">
                <div className="dashboard-card text-center p-4 shadow-sm rounded bg-white w-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="dashboard-icon mb-2">{stat.icon}</div>
                  <div className="dashboard-value mb-1">{stat.value}</div>
                  <div className="dashboard-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="mb-3 align-items-end g-3">
            <Col xs={12} md={2}>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
              />
            </Col>
            <Col xs={12} md={2}>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
              />
            </Col>
            <Col xs={12} md={2}>
              <Form.Label>Current Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={1} className="d-flex flex-column">
              <Form.Label>OP/IP</Form.Label>
              <InputGroup>
                <Form.Check
                  type="switch"
                  id="op-ip-switch"
                  label={opIp}
                  checked={opIp === 'IP'}
                  onChange={() => setOpIp(opIp === 'OP' ? 'IP' : 'OP')}
                />
              </InputGroup>
            </Col>
            <Col xs={12} md={2}>
              <Form.Label>Auto-Refresh Timer</Form.Label>
              <InputGroup>
                <Form.Select
                  value={autoRefresh}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setAutoRefresh(Number(e.target.value))}
                >
                  <option value={0}>Off</option>
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  title="Refresh"
                  onClick={handleRefresh}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col xs={12} md={1} className="d-flex flex-column align-items-center">
              <Form.Label>Show All Patients</Form.Label>
              <Form.Check
                type="checkbox"
                checked={showAll}
                onChange={() => setShowAll(!showAll)}
                label=""
              />
            </Col>
            <Col xs={12} md={1}>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </Col>
            <Col xs={12} md={1}>
              <Form.Label>&nbsp;</Form.Label>
              <Button
                variant="outline-secondary"
                onClick={handleResetFilters}
                className="w-100"
              >
                Reset
              </Button>
            </Col>
          </Row>
          {/* <Row> */}
          {/* <Col> */}
          <div className="table-responsive">
            <div className='dashboard-table-heading'>Registered Patients: {filteredData.patients.length}</div>
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Blood Group</th>
                  <th>DOB</th>
                  <th>Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.patients.length > 0 ? (
                  filteredData.patients.map(p => {
                    // Find last visit date
                    const lastVisit = history
                      .filter(h => h.patientId === p.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                    return (
                      <tr key={p.id}>
                        <td>{(p.firstName || p.name) + (p.lastName ? ' ' + p.lastName : '')}</td>
                        <td>{p.gender}</td>
                        <td>{p.mobileNo}</td>
                        <td>{p.bloodGroup}</td>
                        <td>{p.dateOfBirth}</td>
                        <td>{lastVisit ? lastVisit.date : 'No visits'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No patients found matching the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* </Col> */}
          {/* </Row> */}
          {/* <Row> */}
          {/* <Col> */}
          <div className="table-responsive">
            <div className='dashboard-table-heading'>Recent Appointments: {filteredData.appointments.length}</div>
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th></th>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.appointments.length > 0 ? (
                  filteredData.appointments.map(apt => (
                    <tr key={apt.id}>
                      <td><Button size="sm" variant="outline-primary">+</Button></td>
                      <td>{apt.patientName}</td>
                      <td>{apt.admittingDoctor || 'Dr. Smith'}</td>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td>{apt.dialysisUnit}</td>
                      <td>
                        <span className={`badge bg-${apt.status === 'Completed' ? 'success' : apt.status === 'Scheduled' ? 'primary' : 'warning'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-secondary">View</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      No appointments found matching the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* </Col> */}
          {/* </Row> */}
        </div>
        <Footer />
      </Container>
      {/* </Container> */}
    </>
  );
};

export default Dashboard; 