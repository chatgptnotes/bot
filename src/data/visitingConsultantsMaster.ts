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
export const visitingConsultantsMaster: VisitingConsultant[] = [
  {
    name: "Dr. Sandeep Agrawal",
    specialization: "Critical Care",
    registrationNumber: "84705",
    emp_id_no: "HOPE/VC/001"
  },
  {
    name: "Dr. Rahul Saxena",
    specialization: "Gastroenterologist",
    registrationNumber: "2002/03/1138",
    emp_id_no: "HOPE/VC/002"
  },
  {
    name: "Dr. Shrikant Kothekar",
    specialization: "Gastro Surgeon",
    registrationNumber: "73204",
    emp_id_no: "HOPE/VC/003"
  },
  {
    name: "Dr. Sudhir Tomey",
    specialization: "Gastro Surgeon",
    registrationNumber: "75355",
    emp_id_no: "HOPE/VC/004"
  },
  {
    name: "Dr. Vikas Jain",
    specialization: "Gastro Surgeon",
    registrationNumber: "2000/01/181",
    emp_id_no: "HOPE/VC/005"
  },
  {
    name: "Dr. Praveen Shingade",
    specialization: "Neuro Surgeon",
    registrationNumber: "2003/03/1020",
    emp_id_no: "HOPE/VC/006"
  },
  {
    name: "Dr. Priyesh Dhoke",
    specialization: "Spine Surgeon",
    registrationNumber: "2004/02/1218",
    emp_id_no: "HOPE/VC/007"
  },
  {
    name: "Dr. Sanjay Ramteke",
    specialization: "Neurologist",
    registrationNumber: "63276",
    emp_id_no: "HOPE/VC/008"
  },
  {
    name: "Dr. Amit Agrawal",
    specialization: "Neurologist",
    registrationNumber: "2000/01/0172",
    emp_id_no: "HOPE/VC/009"
  },
  {
    name: "Dr. Vikram Alsi",
    specialization: "Plastic Surgeon",
    registrationNumber: "65615",
    emp_id_no: "HOPE/VC/010"
  },
  {
    name: "Dr. Jitendra Mehra",
    specialization: "Urologist",
    registrationNumber: "81881",
    emp_id_no: "HOPE/VC/011"
  },
  {
    name: "Dr. Rahul Gulhane",
    specialization: "Pulmonologist",
    registrationNumber: "2008/04/1360",
    emp_id_no: "HOPE/VC/012"
  },
  {
    name: "Dr. Parimal Agrawal",
    specialization: "Pulmonologist",
    registrationNumber: "2008/04/1041",
    emp_id_no: "HOPE/VC/013"
  },
  {
    name: "Dr. Shriprakash Kelkar",
    specialization: "Physician",
    registrationNumber: "51280",
    emp_id_no: "HOPE/VC/014"
  },
  {
    name: "Dr. Sameer Chaudhari",
    specialization: "Physician",
    registrationNumber: "2001/08/2753",
    emp_id_no: "HOPE/VC/015"
  },
  {
    name: "Dr. Sachin Agrawal",
    specialization: "Physician",
    registrationNumber: "2000/08/2927",
    emp_id_no: "HOPE/VC/016"
  },
  {
    name: "Dr. Amit Pasari",
    specialization: "Nephrologist",
    registrationNumber: "2006/02/894",
    emp_id_no: "HOPE/VC/017"
  },
  {
    name: "Dr. Vishal Ramteke",
    specialization: "Nephrologist",
    registrationNumber: "2004/03/1825",
    emp_id_no: "HOPE/VC/018"
  },
  {
    name: "Dr. Swanand Khanzode",
    specialization: "Psychiatrist",
    registrationNumber: "2004/02/1155",
    emp_id_no: "HOPE/VC/019"
  },
  {
    name: "Dr. Abhay Agrawal",
    specialization: "Radiologist",
    registrationNumber: "77732",
    emp_id_no: "HOPE/VC/020"
  },
  {
    name: "Dr. Sanjay Jain",
    specialization: "Radiologist",
    registrationNumber: "60395",
    emp_id_no: "HOPE/VC/021"
  }
];

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
