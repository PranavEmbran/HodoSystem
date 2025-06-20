import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const dbPath = path.join(__dirname, '../db/db.json');

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  mobileNo: string;
  bloodGroup: string;
  catheterInsertionDate: string;
  fistulaCreationDate: string;
}

interface Appointment {
  id: string;
  [key: string]: any;
}

interface Billing {
  id: string;
  [key: string]: any;
}

interface History {
  id: string;
  [key: string]: any;
}

interface DialysisFlowChart {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  hemodialysisNIO: string;
  bloodAccess: string;
  hdStartingTime: string;
  hdClosingTime: string;
  durationHours: string;
  bloodFlowRate: string;
  injHeparinPrime: string;
  injHeparinBolus: string;
  startingWithSaline: boolean;
  closingWithAir: boolean;
  closingWithSaline: boolean;
  bloodTransfusion: boolean;
  bloodTransfusionComment: string;
  bpBeforeDialysis: string;
  bpAfterDialysis: string;
  bpDuringDialysis: string;
  weightPreDialysis: string;
  weightPostDialysis: string;
  weightLoss: string;
  dryWeight: string;
  weightGain: string;
  dialysisMonitorNameFO: string;
  dialysisNameSize: string;
  dialysisNumberOfRefuse: string;
  bloodTubeNumberOfRefuse: string;
  dialysisFlowRate: string;
  bathacetete: string;
  bathBicarb: string;
  naConductivity: string;
  profilesNo: string;
  equipmentsComplaints: string;
  patientsComplaints: string;
  spo2: string;
  fever: boolean;
  rigor: boolean;
  hypertension: boolean;
  hypoglycemia: boolean;
  deptInChargeSign: string;
}

interface StaffData {
  technicians: string[];
  doctors: string[];
  units: string[];
}

interface HaemodialysisRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  rows: any[];
}

interface Database {
  patients: Patient[];
  appointments: Appointment[];
  billing: Billing[];
  history: History[];
  dialysisFlowCharts: DialysisFlowChart[];
  haemodialysisRecords: HaemodialysisRecord[];
}

function readDB(): Database {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error(`Failed to read database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function writeDB(data: Database): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error(`Failed to write to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Patients
export const getPatients = (req: Request, res: Response): void => {
  try {
    console.log('Fetching all patients...');
    const db = readDB();
    const patients = db.patients || [];
    console.log(`Found ${patients.length} patients`);
    res.json(patients);
  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json({ 
      message: 'Failed to get patients',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addPatient = (req: Request, res: Response): void => {
  try {
    console.log('Adding new patient:', req.body);
    const { firstName, lastName, gender, dateOfBirth, mobileNo, bloodGroup, catheterInsertionDate, fistulaCreationDate } = req.body;
    
    // Validate required fields
    const requiredFields = {
      firstName, lastName, gender, dateOfBirth, mobileNo, bloodGroup, catheterInsertionDate, fistulaCreationDate
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: 'All fields are required',
        missingFields 
      });
    }

    const db = readDB();
    const newPatient: Patient = {
      id: Date.now().toString(),
      firstName,
      lastName,
      gender,
      dateOfBirth,
      mobileNo,
      bloodGroup,
      catheterInsertionDate,
      fistulaCreationDate
    };

    db.patients.push(newPatient);
    writeDB(db);
    console.log('Successfully added new patient:', newPatient);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error in addPatient:', error);
    res.status(500).json({ 
      message: 'Failed to add patient',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePatient = (req: Request, res: Response): void => {
  try {
    const patientId = req.params.id;
    console.log('Deleting patient with ID:', patientId);
    
    if (!patientId) {
      console.error('No patient ID provided');
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    const db = readDB();
    const initialLength = db.patients.length;
    db.patients = db.patients.filter(p => p.id !== patientId);
    
    if (db.patients.length === initialLength) {
      console.error('Patient not found:', patientId);
      return res.status(404).json({ message: 'Patient not found' });
    }

    writeDB(db);
    console.log('Successfully deleted patient:', patientId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deletePatient:', error);
    res.status(500).json({ 
      message: 'Failed to delete patient',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Appointments
export const getAppointments = (req: Request, res: Response): void => {
  try {
    console.log('Fetching all appointments...');
    const db = readDB();
    const appointments = db.appointments || [];
    console.log(`Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json({ 
      message: 'Failed to get appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addAppointment = (req: Request, res: Response): void => {
  try {
    console.log('Adding new appointment:', req.body);
    const db = readDB();
    const newAppointment: Appointment = { id: Date.now().toString(), ...req.body };
    db.appointments.push(newAppointment);
    writeDB(db);
    console.log('Successfully added new appointment:', newAppointment);
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error in addAppointment:', error);
    res.status(500).json({ 
      message: 'Failed to add appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteAppointment = (req: Request, res: Response): void => {
  try {
    const appointmentId = req.params.id;
    console.log('Deleting appointment with ID:', appointmentId);
    const db = readDB();
    db.appointments = db.appointments.filter(a => a.id !== appointmentId);
    writeDB(db);
    console.log('Successfully deleted appointment:', appointmentId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    res.status(500).json({ 
      message: 'Failed to delete appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Billing
export const getBilling = (req: Request, res: Response): void => {
  try {
    console.log('Fetching all billing records...');
    const db = readDB();
    const billing = db.billing || [];
    console.log(`Found ${billing.length} billing records`);
    res.json(billing);
  } catch (error) {
    console.error('Error in getBilling:', error);
    res.status(500).json({ 
      message: 'Failed to get billing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addBilling = (req: Request, res: Response): void => {
  try {
    console.log('Adding new billing record:', req.body);
    const db = readDB();
    const newBilling: Billing = { id: Date.now().toString(), ...req.body };
    db.billing.push(newBilling);
    writeDB(db);
    console.log('Successfully added new billing record:', newBilling);
    res.status(201).json(newBilling);
  } catch (error) {
    console.error('Error in addBilling:', error);
    res.status(500).json({ 
      message: 'Failed to add billing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteBilling = (req: Request, res: Response): void => {
  try {
    const billingId = req.params.id;
    console.log('Deleting billing record with ID:', billingId);
    const db = readDB();
    db.billing = db.billing.filter(b => b.id !== billingId);
    writeDB(db);
    console.log('Successfully deleted billing record:', billingId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteBilling:', error);
    res.status(500).json({ 
      message: 'Failed to delete billing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// History
export const getHistory = (req: Request, res: Response): void => {
  try {
    console.log('Fetching all history records...');
    const db = readDB();
    const history = db.history || [];
    console.log(`Found ${history.length} history records`);
    res.json(history);
  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({ 
      message: 'Failed to get history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addHistory = (req: Request, res: Response): void => {
  try {
    console.log('Adding new history record:', req.body);
    const db = readDB();
    const newHistory: History = { id: Date.now().toString(), ...req.body };
    db.history.push(newHistory);
    writeDB(db);
    console.log('Successfully added new history record:', newHistory);
    res.status(201).json(newHistory);
  } catch (error) {
    console.error('Error in addHistory:', error);
    res.status(500).json({ 
      message: 'Failed to add history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteHistory = (req: Request, res: Response): void => {
  try {
    const historyId = req.params.id;
    console.log('Deleting history record with ID:', historyId);
    const db = readDB();
    db.history = db.history.filter(h => h.id !== historyId);
    writeDB(db);
    console.log('Successfully deleted history record:', historyId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteHistory:', error);
    res.status(500).json({ 
      message: 'Failed to delete history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Staff
export const getStaff = (req: Request, res: Response): void => {
  try {
    console.log('Fetching staff data...');
    const staffData: StaffData = {
      technicians: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      doctors: ['Dr. Brown', 'Dr. Wilson', 'Dr. Davis'],
      units: ['Unit A', 'Unit B', 'Unit C']
    };
    res.json(staffData);
  } catch (error) {
    console.error('Error in getStaff:', error);
    res.status(500).json({ 
      message: 'Failed to get staff data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Dialysis Flow Charts
export const getDialysisFlowCharts = (req: Request, res: Response): void => {
  try {
    console.log('Fetching all dialysis flow charts...');
    const db = readDB();
    const dialysisFlowCharts = db.dialysisFlowCharts || [];
    console.log(`Found ${dialysisFlowCharts.length} dialysis flow charts`);
    res.json(dialysisFlowCharts);
  } catch (error) {
    console.error('Error in getDialysisFlowCharts:', error);
    res.status(500).json({ 
      message: 'Failed to get dialysis flow charts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addDialysisFlowChart = (req: Request, res: Response): void => {
  try {
    console.log('Adding new dialysis flow chart:', req.body);
    const db = readDB();
    const newDialysisFlowChart: DialysisFlowChart = { 
      id: Date.now().toString(), 
      ...req.body 
    };
    db.dialysisFlowCharts.push(newDialysisFlowChart);
    writeDB(db);
    console.log('Successfully added new dialysis flow chart:', newDialysisFlowChart);
    res.status(201).json(newDialysisFlowChart);
  } catch (error) {
    console.error('Error in addDialysisFlowChart:', error);
    res.status(500).json({ 
      message: 'Failed to add dialysis flow chart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteDialysisFlowChart = (req: Request, res: Response): void => {
  try {
    const dialysisFlowChartId = req.params.id;
    console.log('Deleting dialysis flow chart with ID:', dialysisFlowChartId);
    const db = readDB();
    db.dialysisFlowCharts = db.dialysisFlowCharts.filter(d => d.id !== dialysisFlowChartId);
    writeDB(db);
    console.log('Successfully deleted dialysis flow chart:', dialysisFlowChartId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteDialysisFlowChart:', error);
    res.status(500).json({ 
      message: 'Failed to delete dialysis flow chart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Haemodialysis Records
export const getHaemodialysisRecords = (req: Request, res: Response): void => {
  try {
    const db = readDB();
    res.json(db.haemodialysisRecords || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch haemodialysis records' });
  }
};

export const addHaemodialysisRecord = (req: Request, res: Response): void => {
  try {
    const db = readDB();
    const newRecord: HaemodialysisRecord = {
      id: Date.now().toString(),
      ...req.body
    };
    db.haemodialysisRecords.push(newRecord);
    writeDB(db);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add haemodialysis record' });
  }
}; 