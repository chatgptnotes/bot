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
  is_active: boolean;
}

/**
 * Master list of Full-time Doctors / RMOs
 * Extracted from: /Users/murali/Downloads/List of Doctors .docx
 */
export const doctorsMaster: Doctor[] = [
  {
    name: "Dr. Nilesh Katole",
    qualification: "MBBS",
    specialization: "Resident Medical Officer",
    registrationNumber: "2013/05/1577",
    department: "Casualty/Ward",
    role: "RMO",
    is_active: true
  },
  {
    name: "Dr. Ashish Patil",
    qualification: "MBBS",
    specialization: "Resident Medical Officer",
    registrationNumber: "2014/01/0082",
    department: "ICU/Ward",
    role: "RMO",
    is_active: true
  },
  {
    name: "Dr. Swapnil Bansod",
    qualification: "BAMS",
    specialization: "Resident Medical Officer",
    registrationNumber: "I-76632-A",
    department: "Ward/ICU",
    role: "RMO",
    is_active: true
  },
  {
    name: "Dr. Pallavi Agrawal",
    qualification: "BAMS",
    specialization: "Resident Medical Officer",
    registrationNumber: "I-78901-A",
    department: "Ward",
    role: "RMO",
    is_active: true
  },
  {
    name: "Dr. Amol Deshmukh",
    qualification: "BHMS",
    specialization: "Resident Medical Officer",
    registrationNumber: "54321",
    department: "Ward",
    role: "RMO",
    is_active: true
  }
];

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

      if (existing) continue;

      const { error } = await supabase
        .from('nabh_team_members')
        .insert({
          name: doc.name,
          designation: `${doc.role} (${doc.qualification})`,
          department: doc.department,
          role: 'Medical Staff',
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
