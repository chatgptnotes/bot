-- ============================================================================
-- COMPLETE STAFF SETUP - Run in Supabase SQL Editor
-- Paramedical/Support Staff Only (H036 - H077) - 42 Members
-- ============================================================================

-- STEP 1: Add emp_id_no column to nabh_team_members
ALTER TABLE public.nabh_team_members
ADD COLUMN IF NOT EXISTS emp_id_no TEXT;

-- STEP 2: Add unique constraint on emp_id_no
ALTER TABLE public.nabh_team_members
DROP CONSTRAINT IF EXISTS nabh_team_members_emp_id_no_key;

ALTER TABLE public.nabh_team_members
ADD CONSTRAINT nabh_team_members_emp_id_no_key UNIQUE (emp_id_no);

-- ============================================================================
-- STEP 3: INSERT ALL PARAMEDICAL/SUPPORT STAFF (H036 - H077)
-- Total: 42 Staff Members
-- ============================================================================

INSERT INTO public.nabh_team_members
(name, role, designation, department, emp_id_no, responsibilities, is_active)
VALUES
-- Admin & HR (H036-H037)
('Gaurav Agrawal', 'Management', 'HR Head / Admin', 'Admin', 'H036', '{}', true),
('Shashank Upgade', 'Support Staff', 'HR Attendant', 'Admin', 'H037', '{}', true),

-- Safety (H038)
('Aman Rajak', 'Safety Officer', 'Fire Safety Officer', 'Safety', 'H038', '{}', true),

-- Physiotherapy (H039-H040)
('Roma Kangwani', 'Technical Staff', 'Physiotherapist', 'Physiotherapy', 'H039', '{}', true),
('Ayushi Nandagawali', 'Support Staff', 'Physiotherapist Attendant', 'Physiotherapy', 'H040', '{}', true),

-- Radiology (H041-H042)
('Nitin Bawane', 'Technical Staff', 'X-Ray Technician', 'Radiology', 'H041', '{}', true),
('Pratik Vyankat', 'Support Staff', 'X-Ray Technician Attendant', 'Radiology', 'H042', '{}', true),

-- OT Technicians (H043-H045)
('Apeksha Wandre', 'Technical Staff', 'OT Technician', 'OT', 'H043', '{}', true),
('Shruti Uikey', 'Technical Staff', 'OT Technician', 'OT', 'H044', '{}', true),
('Sarvesh Bhramhe', 'Technical Staff', 'OT Technician', 'OT', 'H045', '{}', true),

-- Laboratory (H046-H048)
('Digesh Bisen', 'Technical Staff', 'Lab Technician', 'Laboratory', 'H046', '{}', true),
('Rachana Rathore', 'Technical Staff', 'Lab Technician', 'Laboratory', 'H047', '{}', true),
('Sarita Rangari', 'Support Staff', 'Lab Attendant', 'Laboratory', 'H048', '{}', true),

-- Front Office / Reception (H049-H050)
('Nisha Sharma', 'Admin', 'Receptionist', 'Front Office', 'H049', '{}', true),
('Diksha Sakhare', 'Admin', 'Receptionist', 'Front Office', 'H050', '{}', true),

-- Pharmacy (H051-H054)
('Ruchika Jambhulkar', 'Pharmacy', 'Pharmacist', 'Pharmacy', 'H051', '{}', true),
('Tejash Akhare', 'Pharmacy', 'Pharmacist', 'Pharmacy', 'H052', '{}', true),
('Abhishek Dannar', 'Pharmacy', 'Pharmacist', 'Pharmacy', 'H053', '{}', true),
('Lalit Meshram', 'Support Staff', 'Attendant Pharmacist', 'Pharmacy', 'H054', '{}', true),

-- Billing (H055-H058)
('Jagruti Tembhare', 'Admin', 'Billing Staff', 'Billing', 'H055', '{}', true),
('Azhar Khan', 'Admin', 'Billing Staff', 'Billing', 'H056', '{}', true),
('Madhuri Marwate', 'Admin', 'Billing Staff', 'Billing', 'H057', '{}', true),
('Pragati Nandeshwar', 'Admin', 'Billing Staff', 'Billing', 'H058', '{}', true),

-- MRD (H059)
('Kashish Jagwani', 'Support Staff', 'MRD Attendant', 'MRD', 'H059', '{}', true),

-- Finance / Accounts (H060-H061)
('Priyanka Tandekar', 'Admin', 'Accountant', 'Finance', 'H060', '{}', true),
('Shailesh Ninawe', 'Admin', 'Accountant', 'Finance', 'H061', '{}', true),

-- Housekeeping (H062-H074)
('Reena Nirgule', 'Support Staff', 'House-Keeping Supervisor', 'Housekeeping', 'H062', '{}', true),
('Asha Sakhare', 'Support Staff', 'Aya', 'Housekeeping', 'H063', '{}', true),
('Urmila Lautkar', 'Support Staff', 'Aya', 'Housekeeping', 'H064', '{}', true),
('Shubhangi Naik', 'Support Staff', 'Aya', 'Housekeeping', 'H065', '{}', true),
('Shrushti Lendare', 'Support Staff', 'Aya', 'Housekeeping', 'H066', '{}', true),
('Shilpa Bankar', 'Support Staff', 'Aya', 'Housekeeping', 'H067', '{}', true),
('Karuna Dhupare', 'Support Staff', 'Aya', 'Housekeeping', 'H068', '{}', true),
('Usha Bhave', 'Support Staff', 'Aya', 'Housekeeping', 'H069', '{}', true),
('Kartik Jangade', 'Support Staff', 'Wardboy', 'Housekeeping', 'H070', '{}', true),
('Vivek Channe', 'Support Staff', 'Wardboy', 'Housekeeping', 'H071', '{}', true),
('Rajkumar Walake', 'Support Staff', 'Housekeeping', 'Housekeeping', 'H072', '{}', true),
('Vijay Chatpaliwar', 'Support Staff', 'Housekeeping', 'Housekeeping', 'H073', '{}', true),
('Janardhan Motghare', 'Support Staff', 'Housekeeping', 'Housekeeping', 'H074', '{}', true),

-- Security (H075-H077)
('Afroz Khan', 'Support Staff', 'Security Guard', 'Security', 'H075', '{}', true),
('Kiran Kadbe', 'Support Staff', 'Security Guard', 'Security', 'H076', '{}', true),
('Jiyalal Sukhdeve', 'Support Staff', 'Security Guard', 'Security', 'H077', '{}', true)

ON CONFLICT (emp_id_no) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  designation = EXCLUDED.designation,
  department = EXCLUDED.department,
  responsibilities = EXCLUDED.responsibilities,
  is_active = EXCLUDED.is_active;

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify 42 staff members were inserted correctly
-- ============================================================================
SELECT emp_id_no, name, designation, department
FROM nabh_team_members
WHERE emp_id_no IS NOT NULL
ORDER BY emp_id_no;

-- Expected Output: 42 rows (H036 - H077)
