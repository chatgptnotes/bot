import { supabase } from '../lib/supabase';

/**
 * Interface for Hospital Staff
 */
export interface StaffMember {
  id?: string;
  name: string;
  designation: string;
  department: string;
  role: string;
  emp_id_no?: string;
  is_active: boolean;
}

/**
 * Master list of Staff Members
 * Extracted from: /Users/murali/Downloads/HOPE NEW All Staff List.docx
 */
export const staffMaster: StaffMember[] = [
  // NURSING STAFF
  { name: "Mrs. Meena Raut", emp_id_no: "HOPE/NS/001", designation: "Nursing Superintendent", department: "Nursing", role: "Management", is_active: true },
  { name: "Ms. Priyanka Meshram", emp_id_no: "HOPE/NS/002", designation: "Incharge Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Ashwini Wanode", emp_id_no: "HOPE/NS/003", designation: "Staff Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Savita Sahare", emp_id_no: "HOPE/NS/004", designation: "Staff Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Rohini Zade", emp_id_no: "HOPE/NS/005", designation: "Staff Nurse", department: "Ward", role: "Nursing Staff", is_active: true },
  { name: "Ms. Dipali Kadu", emp_id_no: "HOPE/NS/006", designation: "Staff Nurse", department: "Ward", role: "Nursing Staff", is_active: true },
  { name: "Ms. Nikita Meshram", emp_id_no: "HOPE/NS/007", designation: "Staff Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Snehal Dhoke", emp_id_no: "HOPE/NS/008", designation: "Staff Nurse", department: "Ward", role: "Nursing Staff", is_active: true },
  { name: "Ms. Pooja Bawane", emp_id_no: "HOPE/NS/009", designation: "Staff Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Karishma Bagde", emp_id_no: "HOPE/NS/010", designation: "Staff Nurse", department: "Ward", role: "Nursing Staff", is_active: true },
  
  // SUPPORT STAFF
  { name: "Mr. Amol Somkuwar", emp_id_no: "HOPE/ADM/001", designation: "Admin Officer", department: "Administration", role: "Admin", is_active: true },
  { name: "Mr. Sandeep Mohod", emp_id_no: "HOPE/QTY/001", designation: "Quality Coordinator", department: "Quality", role: "NABH Coordinator", is_active: true },
  { name: "Mr. Rakesh Mate", emp_id_no: "HOPE/PHM/001", designation: "Pharmacy Incharge", department: "Pharmacy", role: "Pharmacy", is_active: true },
  { name: "Mr. Vikas Dongre", emp_id_no: "HOPE/LAB/001", designation: "Lab Technician", department: "Laboratory", role: "Technical Staff", is_active: true },
  { name: "Mr. Sachin Patil", emp_id_no: "HOPE/RAD/001", designation: "X-Ray Technician", department: "Radiology", role: "Technical Staff", is_active: true },
  { name: "Mr. Gaurav Chute", emp_id_no: "HOPE/MNT/001", designation: "Maintenance Incharge", department: "Maintenance", role: "Technical Staff", is_active: true },
  
  // FRONT DESK & BILLING
  { name: "Ms. Sonali Wankhede", emp_id_no: "HOPE/FD/001", designation: "Front Desk Executive", department: "Front Office", role: "Admin", is_active: true },
  { name: "Mr. Suraj Gedam", emp_id_no: "HOPE/BIL/001", designation: "Billing Executive", department: "Billing", role: "Admin", is_active: true },
  
  // HOUSEKEEPING & MAINTENANCE
  { name: "Mr. Vijay Kohad", emp_id_no: "HOPE/HK/001", designation: "Housekeeping Supervisor", department: "Housekeeping", role: "Support Staff", is_active: true },
  { name: "Mr. Rahul Meshram", emp_id_no: "HOPE/HK/002", designation: "Housekeeping Staff", department: "Housekeeping", role: "Support Staff", is_active: true },
  { name: "Mr. Akash Sahare", emp_id_no: "HOPE/HK/003", designation: "Housekeeping Staff", department: "Housekeeping", role: "Support Staff", is_active: true }
];

/**
 * Function to sync staff to Supabase
 */
export const syncStaffToDatabase = async () => {
  console.log('Syncing staff to database...');
  for (const staff of staffMaster) {
    try {
      const { data: existing } = await supabase
        .from('nabh_team_members')
        .select('id')
        .eq('name', staff.name)
        .maybeSingle();

      if (existing) {
        // Update existing if ID is missing
        await supabase
          .from('nabh_team_members')
          .update({ emp_id_no: staff.emp_id_no } as never)
          .eq('name', staff.name);
        continue;
      }

      const { error } = await supabase
        .from('nabh_team_members')
        .insert({
          name: staff.name,
          designation: staff.designation,
          department: staff.department,
          role: staff.role,
          emp_id_no: staff.emp_id_no,
          is_active: staff.is_active,
          responsibilities: []
        } as never);

      if (error) throw error;
    } catch (err) {
      console.error(`Error adding staff ${staff.name}:`, err);
    }
  }
  return { success: true };
};

export default staffMaster;
