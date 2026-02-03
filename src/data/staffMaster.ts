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
  is_active: boolean;
}

/**
 * Master list of Staff Members
 * Extracted from: /Users/murali/Downloads/HOPE NEW All Staff List.docx
 */
export const staffMaster: StaffMember[] = [
  // NURSING STAFF
  { name: "Mrs. Meena Raut", designation: "Nursing Superintendent", department: "Nursing", role: "Management", is_active: true },
  { name: "Ms. Priyanka Meshram", designation: "Incharge Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Ashwini Wanode", designation: "Staff Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Savita Sahare", designation: "Staff Nurse", department: "ICU", role: "Nursing Staff", is_active: true },
  { name: "Ms. Rohini Zade", designation: "Staff Nurse", department: "Ward", role: "Nursing Staff", is_active: true },
  { name: "Ms. Dipali Kadu", designation: "Staff Nurse", department: "Ward", role: "Nursing Staff", is_active: true },
  
  // SUPPORT STAFF
  { name: "Mr. Amol Somkuwar", designation: "Admin Officer", department: "Administration", role: "Admin", is_active: true },
  { name: "Mr. Sandeep Mohod", designation: "Quality Coordinator", department: "Quality", role: "NABH Coordinator", is_active: true },
  { name: "Mr. Rakesh Mate", designation: "Pharmacy Incharge", department: "Pharmacy", role: "Pharmacy", is_active: true },
  { name: "Mr. Vikas Dongre", designation: "Lab Technician", department: "Laboratory", role: "Technical Staff", is_active: true },
  { name: "Mr. Sachin Patil", designation: "X-Ray Technician", department: "Radiology", role: "Technical Staff", is_active: true },
  
  // HOUSEKEEPING & MAINTENANCE
  { name: "Mr. Vijay Kohad", designation: "Housekeeping Supervisor", department: "Housekeeping", role: "Support Staff", is_active: true },
  { name: "Mr. Rahul Meshram", designation: "Maintenance Staff", department: "Maintenance", role: "Support Staff", is_active: true }
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

      if (existing) continue;

      const { error } = await supabase
        .from('nabh_team_members')
        .insert({
          name: staff.name,
          designation: staff.designation,
          department: staff.department,
          role: staff.role,
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
