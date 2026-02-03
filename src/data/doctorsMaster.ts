import { supabase } from '../lib/supabase';

/**
 * Interface for Resident Medical Officer / Full-time Doctor
 */
export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  registrationNumber: string;
  qualification: string;
  department: string;
  role: 'RMO' | 'Full-time' | 'Resident';
  emp_id_no?: string;
  is_active: boolean;
}

/**
 * Master list of Full-time Doctors / RMOs
 * Extracted from: /Users/murali/Downloads/List of Doctors .docx
 */
export const doctorsMaster: Doctor[] = [];

/**
 * Sync doctors to Supabase (nabh_team_members table)
 */
export const syncDoctorsToDatabase = async () => {
  console.log('Syncing doctors to database...');
  for (const doc of doctorsMaster) {
    try {
      const { data: existing } = await supabase
        .from('nabh_team_members')
        .select('id')
        .eq('name', doc.name)
        .maybeSingle();

      if (existing) {
        // Update Emp ID
        await supabase
          .from('nabh_team_members')
          .update({ emp_id_no: doc.emp_id_no } as never)
          .eq('name', doc.name);
        continue;
      }

      const { error } = await supabase
        .from('nabh_team_members')
        .insert({
          name: doc.name,
          designation: `${doc.role} (${doc.qualification})`,
          department: doc.department,
          role: 'Medical Staff',
          emp_id_no: doc.emp_id_no,
          is_active: true,
          responsibilities: [`Registration: ${doc.registrationNumber}`, `Specialization: ${doc.specialization}`]
        } as never);

      if (error) throw error;
    } catch (err) {
      console.error(`Error adding doctor ${doc.name}:`, err);
    }
  }
  return { success: true };
};

export default doctorsMaster;
