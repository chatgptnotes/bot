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
 * EXACT DATA AS PER SOURCE LIST provided by user
 */
export const staffMaster: StaffMember[] = [
  { emp_id_no: "1", name: "Sandeep mohod", designation: "MANGER", department: "Admin", role: "Quality Coordinator", is_active: true },
  { emp_id_no: "2", name: "amol somkuwar", designation: "ACCOUNTANT", department: "Admin", role: "Admin Officer", is_active: true },
  { emp_id_no: "3", name: "gaurav chute", designation: "Maintance", department: "Maintance", role: "Maintenance Incharge", is_active: true },
  { emp_id_no: "4", name: "vijay kohad", designation: "H.K SUPERVISER", department: "H.K", role: "Support Staff", is_active: true },
  { emp_id_no: "5", name: "prakash mate", designation: "PHARMACY", department: "PHARMACY", role: "Pharmacy Incharge", is_active: true },
  { emp_id_no: "6", name: "priyanka meshram", designation: "Incharge Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "7", name: "ashwini wanode", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "8", name: "dipali kadu", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "9", name: "rohini zade", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "10", name: "nikita meshram", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "11", name: "savita sahare", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "12", name: "snehal dhoke", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "13", name: "pooja bawne", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "14", name: "karishma bagde", designation: "Staff Nurse", department: "Nursing", role: "Nursing Staff", is_active: true },
  { emp_id_no: "15", name: "sonali wankhede", designation: "Resptnist", department: "Front Office", role: "Admin", is_active: true },
  { emp_id_no: "16", name: "suraj gedam", designation: "Billing", department: "Billing", role: "Admin", is_active: true },
  { emp_id_no: "17", name: "rahul meshram", designation: "H.K", department: "H.K", role: "Support Staff", is_active: true },
  { emp_id_no: "18", name: "akash sahare", designation: "H.K", department: "H.K", role: "Support Staff", is_active: true },
  { emp_id_no: "19", name: "rakesh mate", designation: "PHARMACY", department: "PHARMACY", role: "Pharmacy", is_active: true },
  { emp_id_no: "20", name: "vikas dongre", designation: "LAB", department: "LAB", role: "Technical Staff", is_active: true },
  { emp_id_no: "21", name: "sachin patil", designation: "X-RAY", department: "X-RAY", role: "Technical Staff", is_active: true }
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
        await supabase
          .from('nabh_team_members')
          .update({ emp_id_no: staff.emp_id_no, designation: staff.designation, department: staff.department } as never)
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
