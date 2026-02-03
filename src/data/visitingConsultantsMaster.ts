import { supabase } from '../lib/supabase';

/**
 * Interface for Visiting Consultant
 */
export interface VisitingConsultant {
  id?: string;
  name: string;
  specialization: string;
  registrationNumber: string;
  emp_id_no?: string;
  qualification?: string;
  department?: string;
  is_active?: boolean;
}

/**
 * Master list of Visiting Consultants
 * Extracted from: /Users/murali/Downloads/Visiting Consultant List with Registration Number in Hope Hospital_____.xlsx
 */
export const visitingConsultantsMaster: VisitingConsultant[] = [];

/**
 * Function to sync consultants to Supabase (nabh_team_members table)
 */
export const syncConsultantsToDatabase = async () => {
  console.log('Syncing visiting consultants to database...');
  
  for (const consultant of visitingConsultantsMaster) {
    const employeeData = {
      name: consultant.name,
      emp_id_no: consultant.emp_id_no,
      designation: `Consultant ${consultant.specialization}`,
      department: consultant.specialization,
      role: 'Visiting Consultant',
      is_active: true,
      responsibilities: [`Registration Number: ${consultant.registrationNumber}`]
    };

    try {
      // Check if exists
      const { data: existing } = await supabase
        .from('nabh_team_members')
        .select('id')
        .eq('name', consultant.name)
        .maybeSingle();

      if (existing) {
        console.log(`Consultant ${consultant.name} already exists, skipping.`);
        continue;
      }

      const { error } = await supabase
        .from('nabh_team_members')
        .insert(employeeData as never);

      if (error) throw error;
      console.log(`Added consultant: ${consultant.name}`);
    } catch (err) {
      console.error(`Error adding consultant ${consultant.name}:`, err);
    }
  }
  
  return { success: true };
};

export default visitingConsultantsMaster;
