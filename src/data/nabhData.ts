import type { Chapter, ObjectiveElement, ElementCategory, YouTubeVideo } from '../types/nabh';
import { CHAPTER_NAMES, CHAPTER_TYPES } from '../types/nabh';
import { getLearningResource } from './nabhLearningResources';

/**
 * NABH SHCO (Small Healthcare Organizations) Standards - 3rd Edition
 * Released: 31st August 2022
 * Effective: 1st August 2022
 *
 * Total: 10 Chapters, 71 Standards, 408 Objective Elements
 * - Core: 100 elements - Mandatorily assessed during each assessment
 * - Commitment: 257 elements - Assessed during final assessment
 * - Achievement: 35 elements - Assessed during surveillance
 * - Excellence: 16 elements - Assessed during re-accreditation
 */

// Priority mapping from Excel (NABH Jan 2026.xlsx)
// Maps to PSQ codes in Excel (which correspond to CQI in SHCO 3rd Edition)
const excelPriorityMap: Record<string, { priority: string; assignee: string; status: string }> = {
  "AAC.1.a": { "priority": "P0", "assignee": "Gaurav", "status": "Not started" },
  "AAC.1.b": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.1.c": { "priority": "P2", "assignee": "", "status": "Blocked" },
  "AAC.1.d": { "priority": "P3", "assignee": "", "status": "Completed" },
  "AAC.2.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "AAC.2.b": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.3.a": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.3.c": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.3.e": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.4.g": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.5.a": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.5.e": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.5.h": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.6.d": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.7.c": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  // COP - Care of Patients (NABH SHCO 3rd Edition - August 2022)
  // COP.1 - Uniform care with patient identification
  "COP.1.a": { "priority": "CORE", "assignee": "", "status": "" },  // Two identifiers - CORE per PDF
  // COP.2 - Emergency services
  "COP.2.b": { "priority": "CORE", "assignee": "", "status": "" },  // Medico-legal cases - CORE per PDF
  "COP.2.g": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  // COP.3 - CPR services
  "COP.3.b": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.3.d": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  // COP.4 - Nursing care
  "COP.4.a": { "priority": "CORE", "assignee": "", "status": "" },  // Nursing care documented - CORE per PDF
  // COP.5 - Transfusion services
  "COP.5.b": { "priority": "CORE", "assignee": "", "status": "" },  // Safe transfusion - CORE per PDF
  "COP.5.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  // COP.6 - ICU/HDU care
  "COP.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  // COP.7 - Obstetric care
  "COP.7.c": { "priority": "Prev NC", "assignee": "", "status": "" },
  "COP.7.d": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  // COP.9 - Procedural sedation
  "COP.9.b": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.9.d": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.9.e": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  // COP.10 - Anaesthesia services
  "COP.10.b": { "priority": "CORE", "assignee": "", "status": "" },  // Pre-anaesthesia assessment - CORE per PDF
  "COP.10.e": { "priority": "CORE", "assignee": "", "status": "" },  // Monitoring under anaesthesia - CORE per PDF
  "COP.10.f": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.10.h": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  // COP.11 - Clinical procedures / OT
  "COP.11.d": { "priority": "CORE", "assignee": "", "status": "" },  // Wrong site/patient/surgery prevention - CORE per PDF
  "COP.11.e": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.11.i": { "priority": "CORE", "assignee": "", "status": "" },  // Organ transplant legal compliance - CORE per PDF
  "COP.11.j": { "priority": "CORE", "assignee": "", "status": "" },  // Organ donation awareness - CORE per PDF
  // COP.12 - High risk patients
  "COP.12.c": { "priority": "CORE", "assignee": "", "status": "" },  // Fall risk - CORE per PDF
  "COP.12.d": { "priority": "CORE", "assignee": "", "status": "" },  // Pressure ulcer risk - CORE per PDF
  "COP.12.e": { "priority": "CORE", "assignee": "", "status": "" },  // DVT risk - CORE per PDF
  // COP.13 - Pain, rehabilitation, nutrition
  "COP.13.b": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "MOM.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "MOM.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "MOM.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "MOM.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "MOM.7.c": { "priority": "Prev NC", "assignee": "", "status": "" },
  "PRE.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "PRE.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "PRE.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HIC.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HIC.5.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HIC.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  // PSQ codes from Excel map to CQI in SHCO 3rd Edition
  "PSQ.1.a": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "PSQ.1.b": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.1.c": { "priority": "CORE", "assignee": "Kashish", "status": "Blocked" },
  "PSQ.1.d": { "priority": "CORE", "assignee": "Kashish", "status": "Completed" },
  "PSQ.1.e": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.1.f": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.1.g": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.1.h": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.1.i": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.2.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.2.b": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "PSQ.2.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.2.d": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "PSQ.2.e": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.3.a": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.3.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.3.c": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.3.d": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.3.e": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.4.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.4.b": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.4.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.4.d": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.5.a": { "priority": "CORE", "assignee": "Kashish", "status": "Completed" },
  "PSQ.5.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.5.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "PSQ.5.d": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "PSQ.5.e": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "ROM.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "ROM.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "ROM.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "FMS.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "FMS.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "FMS.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "FMS.5.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HRM.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HRM.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HRM.7.c": { "priority": "Prev NC", "assignee": "", "status": "" },
  "IMS.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "IMS.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "IMS.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "IMS.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
};

// Helper to create objective element with SHCO 3rd Edition data
// Automatically applies priority, assignee, and status from Excel if available
// Also loads Hindi explanations and YouTube videos from learning resources
const obj = (
  code: string,
  description: string = '',
  category: ElementCategory = 'Commitment',
  evidencesList: string = '',
  evidenceLinks: string = '',
  priority: string = '',
  assignee: string = '',
  status: string = ''
): ObjectiveElement => {
  // Look up Excel overrides
  const excelData = excelPriorityMap[code];
  const finalPriority = excelData?.priority || (category === 'Core' ? 'CORE' : priority);
  const finalAssignee = excelData?.assignee || assignee;
  const finalStatus = excelData?.status || status;

  // Get learning resources (Hindi explanation and YouTube videos)
  const learningResource = getLearningResource(code);
  const youtubeVideos: YouTubeVideo[] = learningResource.youtubeVideos.map((video, index) => ({
    id: `${code.toLowerCase().replace(/\./g, '-')}-video-${index}`,
    title: video.title,
    url: video.url,
    description: video.description,
    addedBy: 'NABH Training Team',
    addedAt: new Date().toISOString(),
  }));

  return {
    id: code.toLowerCase().replace(/\./g, '-').replace(/\s/g, '-'),
    code,
    title: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
    description,
    hindiExplanation: learningResource.hindiExplanation,
    category,
    isCore: category === 'Core',
    evidencesList,
    evidenceLinks,
    evidenceFiles: [],
    youtubeVideos,
    trainingMaterials: [],
    sopDocuments: [],
    priority: finalPriority as ObjectiveElement['priority'],
    assignee: finalAssignee,
    status: finalStatus as ObjectiveElement['status'],
    startDate: '',
    endDate: '',
    deliverable: '',
    notes: '',
  };
};

export const nabhData: Chapter[] = [
  // ============================================================================
  // AAC - Access, Assessment and Continuity of Care
  // ============================================================================
  {
    id: 'aac',
    code: 'AAC',
    name: 'AAC',
    fullName: CHAPTER_NAMES.AAC,
    type: CHAPTER_TYPES.AAC,
    objectives: [
      // AAC.1 - Organization defines and displays services
      obj('AAC.1.a', 'The services being provided are clearly defined and are in consonance with the needs of the community.', 'Commitment'),
      obj('AAC.1.b', 'The defined services are prominently displayed.', 'Commitment'),
      obj('AAC.1.c', 'The staff is oriented to these services.', 'Commitment'),

      // AAC.2 - Registration and admission process
      obj('AAC.2.a', 'Documented policies and procedures are used for registering and admitting patients.', 'Commitment'),
      obj('AAC.2.b', 'The documented procedures address out-patients, in-patients and emergency patients.', 'Core'),
      obj('AAC.2.c', 'A unique identification number is generated at the end of registration.', 'Core'),
      obj('AAC.2.d', 'Patients are accepted only if the organization can provide the required service.', 'Commitment'),
      obj('AAC.2.e', 'The documented policies and procedures also address managing patients during non-availability of beds.', 'Commitment'),
      obj('AAC.2.f', 'The staff is aware of these processes.', 'Commitment'),

      // AAC.3 - Transfer and referral mechanism
      obj('AAC.3.a', 'Documented policies and procedures exist for transfer of patients.', 'Commitment'),
      obj('AAC.3.b', 'Transfer-out is based on the patients condition and need for continuing care.', 'Core'),
      obj('AAC.3.c', 'Transfer process addresses the responsibility during transfer.', 'Core'),
      obj('AAC.3.d', 'A referral summary accompanies the patient.', 'Core'),
      obj('AAC.3.e', 'Transfer-in of patients is consistent with the organizations mission and resources.', 'Commitment'),

      // AAC.4 - Initial assessment
      obj('AAC.4.a', 'Documented policies and procedures define the scope and content of assessments.', 'Core'),
      obj('AAC.4.b', 'Initial medical assessment is done within 24 hours of admission or earlier as per patient condition.', 'Core'),
      obj('AAC.4.c', 'Initial nursing assessment is done within 24 hours of admission or earlier as per patient condition.', 'Core'),
      obj('AAC.4.d', 'Assessment is comprehensive covering medical, nursing and other needs.', 'Commitment'),
      obj('AAC.4.e', 'Assessments are documented in the patient record.', 'Core'),
      obj('AAC.4.f', 'Patients requiring emergency care undergo immediate assessment.', 'Core'),

      // AAC.5 - Reassessment
      obj('AAC.5.a', 'Patients are reassessed at appropriate intervals based on their condition and plan of care.', 'Core'),
      obj('AAC.5.b', 'Reassessment is done by a qualified individual.', 'Commitment'),
      obj('AAC.5.c', 'Reassessments are documented in the patient record.', 'Core'),
      obj('AAC.5.d', 'The care plan is modified based on the reassessment.', 'Commitment'),

      // AAC.6 - Laboratory services
      obj('AAC.6.a', 'Laboratory services are available as per the scope of the organization.', 'Commitment'),
      obj('AAC.6.b', 'Laboratory services are provided by qualified personnel.', 'Core'),
      obj('AAC.6.c', 'Standard operating procedures guide collection, identification, handling, safe transportation and disposal of specimens.', 'Core'),
      obj('AAC.6.d', 'Laboratory results are available in a timely manner.', 'Commitment'),
      obj('AAC.6.e', 'Critical results are communicated immediately to the concerned care provider.', 'Core'),
      obj('AAC.6.f', 'Outsourced laboratory services meet the organizations quality requirements.', 'Commitment'),

      // AAC.7 - Laboratory quality assurance
      obj('AAC.7.a', 'There is a quality assurance programme for laboratory services.', 'Commitment'),
      obj('AAC.7.b', 'Internal quality control is practiced.', 'Commitment'),
      obj('AAC.7.c', 'External quality assurance (EQAS) is practiced where available.', 'Achievement'),
      obj('AAC.7.d', 'Laboratory safety procedures are established and implemented.', 'Core'),
      obj('AAC.7.e', 'Laboratory equipment is regularly calibrated and maintained.', 'Commitment'),

      // AAC.8 - Imaging services
      obj('AAC.8.a', 'Imaging services are available as per the scope of the organization.', 'Core'),
      obj('AAC.8.b', 'Imaging services are provided by qualified personnel.', 'Core'),
      obj('AAC.8.c', 'Standard operating procedures guide the imaging services.', 'Commitment'),
      obj('AAC.8.d', 'Imaging results are available in a timely manner.', 'Commitment'),
      obj('AAC.8.e', 'Radiation safety norms are adhered to.', 'Core'),
      obj('AAC.8.f', 'Outsourced imaging services meet the organizations quality requirements.', 'Commitment'),

      // AAC.9 - Imaging quality assurance
      obj('AAC.9.a', 'There is a quality assurance programme for imaging services.', 'Commitment'),
      obj('AAC.9.b', 'Imaging equipment is regularly calibrated and maintained.', 'Commitment'),
      obj('AAC.9.c', 'Personnel are monitored for radiation exposure.', 'Core'),

      // AAC.10 - Discharge process
      obj('AAC.10.a', 'Documented policies and procedures guide the discharge process.', 'Commitment'),
      obj('AAC.10.b', 'Discharge planning is initiated early in the care process.', 'Commitment'),
      obj('AAC.10.c', 'A discharge summary is provided to the patient at the time of discharge.', 'Core'),
      obj('AAC.10.d', 'The discharge summary includes relevant clinical and follow-up information.', 'Core'),
      obj('AAC.10.e', 'Patient and family are educated about medications, diet, and follow-up care.', 'Core'),
      obj('AAC.10.f', 'Patients leaving against medical advice are informed about risks.', 'Core'),
    ],
  },

  // ============================================================================
  // COP - Care of Patients (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'cop',
    code: 'COP',
    name: 'COP',
    fullName: CHAPTER_NAMES.COP,
    type: CHAPTER_TYPES.COP,
    objectives: [
      // COP.1 - Uniform care to patients is provided in all settings
      obj('COP.1.a', 'The organization has a uniform process for identification of patients and at a minimum, uses two identifiers.', 'Core'),
      obj('COP.1.b', 'Care shall be provided in consonance with applicable laws and regulations.', 'Commitment'),
      obj('COP.1.c', 'The organization adopts evidence-based clinical practice guidelines and/or clinical protocols to guide uniform patient care.', 'Achievement'),
      obj('COP.1.d', 'Care delivery is uniform for a given clinical condition when similar care is provided in more than one setting.', 'Commitment'),
      obj('COP.1.e', 'Telemedicine facility is provided safely and securely based on written guidance.', 'Excellence'),

      // COP.2 - Emergency services including ambulance, and management of disasters
      obj('COP.2.a', 'There shall be an identified area in the organization, which is easily accessible to receive and manage emergency patients, with adequate and appropriate resources.', 'Commitment'),
      obj('COP.2.b', 'The organization manages medico-legal cases and provides emergency care in consonance with statutory requirements and in accordance with written guidance.', 'Core'),
      obj('COP.2.c', 'Initiation of appropriate care is guided by a system of triage.', 'Commitment'),
      obj('COP.2.d', 'Patients waiting in the emergency are reassessed as appropriate for the change in status.', 'Commitment'),
      obj('COP.2.e', 'Admission, discharge to home or transfer to another organization is documented, and a discharge note shall be given to the patient.', 'Commitment'),
      obj('COP.2.f', 'The organization shall implement a quality assurance programme.', 'Achievement'),
      obj('COP.2.g', 'The organization has systems in place for the management of patients found dead on arrival and patients who die within a few minutes of arrival.', 'Commitment'),
      obj('COP.2.h', 'The organization has access to ambulance services commensurate with the scope of services provided by it.', 'Commitment'),
      obj('COP.2.i', 'The ambulance(s) is fit for purpose, is operated by trained personnel, is appropriately equipped, and ensures that emergency medications are available in the ambulance.', 'Commitment'),
      obj('COP.2.j', 'The emergency department identifies opportunities to initiate treatment at the earliest, when the patient is in transit to the organization.', 'Excellence'),
      obj('COP.2.k', 'The organization manages potential community emergencies, epidemics and other disasters as per a documented plan.', 'Commitment'),

      // COP.3 - Cardio-pulmonary resuscitation services are provided uniformly
      obj('COP.3.a', 'Resuscitation services are available to patients at all times.', 'Commitment'),
      obj('COP.3.b', 'During cardiopulmonary resuscitation, assigned roles and responsibilities are complied with, and the events during cardiopulmonary resuscitation are recorded.', 'Commitment'),
      obj('COP.3.c', 'The equipment and medications for use during cardiopulmonary resuscitation are available in various areas of the organization.', 'Commitment'),
      obj('COP.3.d', 'A multidisciplinary committee does a post-event analysis of all cardiopulmonary resuscitations, and corrective and preventive measures are taken based on this.', 'Commitment'),

      // COP.4 - Nursing care is provided to patients in consonance with clinical protocols
      obj('COP.4.a', 'Nursing care is aligned and integrated with overall patient care, and is documented in the patient record.', 'Core'),
      obj('COP.4.b', 'Assignment of patient care is done as per current good clinical / nursing practice guidelines.', 'Commitment'),
      obj('COP.4.c', 'Nurses are provided with appropriate and adequate equipment for providing safe and efficient nursing services.', 'Commitment'),
      obj('COP.4.d', 'The organization develops and implements nursing clinical practice guidelines reflecting current standards of practice.', 'Excellence'),

      // COP.5 - Transfusion services are provided as per the scope of services, safely
      obj('COP.5.a', 'Transfusion services are commensurate with the services provided by the organization, and are governed by the applicable laws and regulations.', 'Commitment'),
      obj('COP.5.b', 'Transfusion of blood and blood components is done safely.', 'Core'),
      obj('COP.5.c', 'Blood and blood components are used rationally.', 'Commitment'),
      obj('COP.5.d', 'Informed consent is obtained for transfusion of blood and blood products, and for donation.', 'Commitment'),
      obj('COP.5.e', 'Blood/blood components are available for use in emergency situations within a defined time frame.', 'Commitment'),
      obj('COP.5.f', 'Post-transfusion form is collected, reactions if any identified and are analysed for corrective and preventive actions.', 'Achievement'),

      // COP.6 - Organization provides care in the intensive care and high dependency units
      obj('COP.6.a', 'The defined admission and discharge criteria for its intensive care and high dependency units are implemented, and defined procedures for the situation of bed shortages are followed.', 'Commitment'),
      obj('COP.6.b', 'The care is provided in intensive care and high dependency units based on written guidance by adequately available staff and equipment.', 'Commitment'),
      obj('COP.6.c', 'Infection control practices are documented and followed.', 'Commitment'),
      obj('COP.6.d', 'The organization shall implement a quality-assurance programme.', 'Achievement'),
      obj('COP.6.e', 'The organisation has a mechanism to counsel the patient and / or family periodically.', 'Commitment'),
      obj('COP.6.f', 'End of life care is provided in a consistent manner in the organization, and is in consonance with legal requirements.', 'Commitment'),

      // COP.7 - Organization provides safe obstetric care
      obj('COP.7.a', 'Obstetric services are organised and provided safely.', 'Commitment'),
      obj('COP.7.b', 'The organization identifies and provides care to high risk obstetric cases with competent doctors and nurses, and where needed, refers them to another appropriate centre.', 'Commitment'),
      obj('COP.7.c', 'Antenatal assessment also includes maternal nutrition.', 'Commitment'),
      obj('COP.7.d', 'Appropriate peri-natal and post-natal monitoring is performed.', 'Commitment'),
      obj('COP.7.e', 'The organization caring for high risk obstetric cases has the human resources and facilities to take care of neonates of such cases.', 'Commitment'),

      // COP.8 - Organization provides safe paediatric services
      obj('COP.8.a', 'Paediatric services are organised and provided safely.', 'Commitment'),
      obj('COP.8.b', 'Neonatal care is in consonance with the national/ international guidelines.', 'Commitment'),
      obj('COP.8.c', 'Those who care for children have age-specific competency.', 'Commitment'),
      obj('COP.8.d', 'Provisions are made for special care of children.', 'Commitment'),
      obj('COP.8.e', 'Patient assessment includes nutritional, growth, developmental and immunisation assessment.', 'Commitment'),
      obj('COP.8.f', 'The organization has measures in place to prevent child/neonate abduction and abuse.', 'Commitment'),

      // COP.9 - Procedural sedation is provided consistently and safely
      obj('COP.9.a', 'Procedural sedation is administered in a consistent manner.', 'Commitment'),
      obj('COP.9.b', 'Informed consent for administration of procedural sedation is obtained.', 'Commitment'),
      obj('COP.9.c', 'Competent and trained persons perform and monitor sedation.', 'Commitment'),
      obj('COP.9.d', 'Intra-procedure monitoring includes at a minimum the heart rate, cardiac rhythm, respiratory rate, blood pressure, oxygen saturation, and level of sedation.', 'Commitment'),
      obj('COP.9.e', 'Post procedure monitoring is documented, and patients are discharged from the recovery area based on objective criteria.', 'Commitment'),

      // COP.10 - Anaesthesia services are provided consistently and safely
      obj('COP.10.a', 'Anaesthesia services are administered in a consistent and safe manner.', 'Commitment'),
      obj('COP.10.b', 'The pre-anaesthesia assessment results in the formulation of an anaesthesia plan which is documented.', 'Core'),
      obj('COP.10.c', 'A pre-induction assessment is performed and documented.', 'Commitment'),
      obj('COP.10.d', 'Informed consent for administration of anaesthesia, is obtained.', 'Commitment'),
      obj('COP.10.e', 'Patients are monitored while under anaesthesia.', 'Core'),
      obj('COP.10.f', 'Post anaesthesia monitoring is documented, and patients are discharged from the recovery area based on objective criteria.', 'Commitment'),
      obj('COP.10.g', 'The type of anaesthesia and anaesthetic medications used are documented in the patient record.', 'Commitment'),
      obj('COP.10.h', 'Intra-operative adverse anaesthesia events are recorded and monitored.', 'Achievement'),

      // COP.11 - Clinical procedures, as well as procedures in the operation theatre
      obj('COP.11.a', 'Clinical procedures as well as procedures done in operation theatres are done in a consistent and safe manner.', 'Commitment'),
      obj('COP.11.b', 'Surgical patients have a preoperative assessment, a documented pre-operative diagnosis, and pre-operative instructions provided before surgery and documented.', 'Commitment'),
      obj('COP.11.c', 'Informed consent is obtained by the doctor prior to the procedure.', 'Commitment'),
      obj('COP.11.d', 'Care is taken to prevent adverse events like wrong site, wrong patient and wrong surgery.', 'Core'),
      obj('COP.11.e', 'The procedure is done adhering to standard precautions.', 'Commitment'),
      obj('COP.11.f', 'Procedures / operation notes, post procedure monitoring and post-operative care plan are documented accurately in the patient record.', 'Commitment'),
      obj('COP.11.g', 'Appropriate facilities, equipment, instruments and supplies are available in the operating theatre.', 'Commitment'),
      obj('COP.11.h', 'The organization shall implement a quality assurance programme.', 'Achievement'),
      obj('COP.11.i', 'The organ transplant program shall be in consonance with the legal requirements and shall be conducted ethically.', 'Core'),
      obj('COP.11.j', 'The organization shall take measures to create awareness regarding organ donation.', 'Core'),

      // COP.12 - The organization identifies and manages patients who are at higher risk of morbidity and mortality
      obj('COP.12.a', 'The organization identifies and manages vulnerable patients.', 'Commitment'),
      obj('COP.12.b', 'The organization provides for a safe and secure environment for the vulnerable patient.', 'Commitment'),
      obj('COP.12.c', 'The organization identifies and manages patients who are at risk of fall.', 'Core'),
      obj('COP.12.d', 'The organization identifies and manages patients who are at risk of developing / worsening of pressure ulcers.', 'Core'),
      obj('COP.12.e', 'The organization identifies and manages patients who are at risk of developing / worsening of developing deep vein thrombosis.', 'Core'),
      obj('COP.12.f', 'The organization identifies and manages patients who need restraints.', 'Commitment'),

      // COP.13 - Pain management, rehabilitation services and nutritional therapy
      obj('COP.13.a', 'Patients in pain are effectively managed.', 'Commitment'),
      obj('COP.13.b', 'Pain alleviation measures or medications are initiated and titrated according to the patient\'s need and response.', 'Commitment'),
      obj('COP.13.c', 'Scope of rehabilitation services at a minimum is commensurate to the services provided by the organization.', 'Commitment'),
      obj('COP.13.d', 'Care providers collaboratively plan rehabilitation services.', 'Commitment'),
      obj('COP.13.e', 'Patients admitted to the organization are screened for nutritional risk, and assessment is done for patients found at risk during nutritional screening.', 'Commitment'),
      obj('COP.13.f', 'The therapeutic diet is planned and provided collaboratively.', 'Commitment'),
    ],
  },

  // ============================================================================
  // MOM - Management of Medication (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'mom',
    code: 'MOM',
    name: 'MOM',
    fullName: CHAPTER_NAMES.MOM,
    type: CHAPTER_TYPES.MOM,
    objectives: [
      // MOM.1 - Pharmacy services organization
      obj('MOM.1.a', 'The organisation develops and maintains a list of medications as per its scope of services.', 'Commitment'),
      obj('MOM.1.b', 'A multidisciplinary committee oversees the medication-management system.', 'Core'),
      obj('MOM.1.c', 'There is a documented procedure for procuring medications.', 'Commitment'),
      obj('MOM.1.d', 'There are documented procedures for storage of medications that promote accurate identification and safe maintenance of medications.', 'Commitment'),
      obj('MOM.1.e', 'Proper storage of medications is ensured.', 'Commitment'),
      obj('MOM.1.f', 'The organisation has approved and implemented criteria for non-formulary medications.', 'Excellence'),

      // MOM.2 - Prescription
      obj('MOM.2.a', 'The organisation identifies those who are permitted to prescribe and or order medications.', 'Core'),
      obj('MOM.2.b', 'All prescriptions and medication orders are written legibly and the elements are complete.', 'Commitment'),
      obj('MOM.2.c', 'Verbal and telephone orders are to be received only by qualified personnel.', 'Core'),
      obj('MOM.2.d', 'The organisation implements practices to improve the accuracy of verbal/telephone orders.', 'Achievement'),
      obj('MOM.2.e', 'Any verbal/telephone order is documented and read back before being administered.', 'Commitment'),
      obj('MOM.2.f', 'The patient medication orders are reviewed for appropriateness before dispensing.', 'Core'),

      // MOM.3 - Dispensing
      obj('MOM.3.a', 'Medications are dispensed in the most ready-to-administer form to minimize opportunities for errors.', 'Commitment'),
      obj('MOM.3.b', 'The individual dispensing medication, verifies patient identification, medication, dose, route, and timing of administration.', 'Core'),
      obj('MOM.3.c', 'Patients are given adequate and appropriate information about their medications.', 'Commitment'),
      obj('MOM.3.d', 'An appropriate system exists for dispensing medications when the pharmacy is closed.', 'Excellence'),
      obj('MOM.3.e', 'Medications are returned to the pharmacy and are appropriately disposed of in a safe and legal manner.', 'Core'),
      obj('MOM.3.f', 'Medications recall system exists in the organisation.', 'Achievement'),
      obj('MOM.3.g', 'Dispensing staff are trained on emergency medications.', 'Achievement'),
      obj('MOM.3.h', 'Medications are checked for expiry before dispensing.', 'Core'),

      // MOM.4 - Administration
      obj('MOM.4.a', 'Medications are administered by those who are permitted to do so by law, regulation and the organisation.', 'Commitment'),
      obj('MOM.4.b', 'The staff administers medication as per good practices and guidelines.', 'Commitment'),
      obj('MOM.4.c', 'Self-administration of medications is supervised where permitted by law and organization policy.', 'Commitment'),
      obj('MOM.4.d', 'The administration of medication is verified and documented.', 'Commitment'),

      // MOM.5 - Adverse drug events
      obj('MOM.5.a', 'The organization has defined the near-misses.', 'Commitment'),
      obj('MOM.5.b', 'The organization has defined medication errors.', 'Commitment'),
      obj('MOM.5.c', 'The organization has defined adverse drug events.', 'Commitment'),
      obj('MOM.5.d', 'Near misses, medication errors and adverse drug events are reported, analysed and documented.', 'Core'),
      obj('MOM.5.e', 'Corrective and preventive actions are implemented and their effectiveness is verified.', 'Core'),
      obj('MOM.5.f', 'The organization monitors patients for adverse drug events.', 'Commitment'),

      // MOM.6 - High-risk medications
      obj('MOM.6.a', 'The organisation implements a system for identifying high-risk / high-alert medications.', 'Commitment'),
      obj('MOM.6.b', 'The organisation implements a system to ensure safety of high-risk / high-alert medications.', 'Commitment'),
      obj('MOM.6.c', 'The organisation identifies look-alike and sound-alike medications used in the organisation.', 'Commitment'),
      obj('MOM.6.d', 'The organisation takes actions to prevent potential errors with look-alike and sound-alike medications.', 'Core'),
      obj('MOM.6.e', 'The organisation has a process of identification and safe handling of radioactive and investigational medications.', 'Commitment'),
      obj('MOM.6.f', 'A policy guides safe storage, usage, and administration of concentrated electrolytes.', 'Core'),
      obj('MOM.6.g', 'The organisation has a system to ensure safe use of cytotoxic medications.', 'Commitment'),
      obj('MOM.6.h', 'Patient monitoring is established for patients on anticoagulation therapy.', 'Commitment'),
      obj('MOM.6.i', 'The organisation has a programme for antibiotic stewardship in place.', 'Achievement'),

      // MOM.7 - Patient-specific medications
      obj('MOM.7.a', 'Patients own medications are regulated as per the policies of the organisation.', 'Commitment'),
      obj('MOM.7.b', 'A process exists for reconciliation of medications at all points of transition.', 'Commitment'),
      obj('MOM.7.c', 'Prior to administration, the potential for drug-food interaction is assessed and acted upon.', 'Core'),
      obj('MOM.7.d', 'Prior to administration, the potential for drug-drug interaction is assessed and acted upon.', 'Commitment'),
      obj('MOM.7.e', 'A process exists for checking for patient allergy to the medication before administration.', 'Commitment'),

      // MOM.8 - Emergency medications
      obj('MOM.8.a', 'The organisation has defined the list of emergency medications.', 'Commitment'),
      obj('MOM.8.b', 'Emergency medications are uniformly available across the organisation.', 'Commitment'),
      obj('MOM.8.c', 'Emergency medications and related supplies are available in a standardised manner.', 'Commitment'),
      obj('MOM.8.d', 'Emergency medications are monitored and replenished in a timely manner.', 'Commitment'),
      obj('MOM.8.e', 'The process of monitoring emergency medications is documented.', 'Commitment'),

      // MOM.9 - Sample medications
      obj('MOM.9.a', 'The organisation has a process that addresses availability of sample medications in the organisation.', 'Commitment'),
      obj('MOM.9.b', 'Sample medications shall be of standard quality.', 'Commitment'),
      obj('MOM.9.c', 'Sample medications are administered in a controlled environment.', 'Commitment'),
    ],
  },

  // ============================================================================
  // PRE - Patient Rights and Education (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'pre',
    code: 'PRE',
    name: 'PRE',
    fullName: CHAPTER_NAMES.PRE,
    type: CHAPTER_TYPES.PRE,
    objectives: [
      // PRE.1 - Patient rights policy
      obj('PRE.1.a', 'The organisation identifies patient and families rights and responsibilities.', 'Commitment'),
      obj('PRE.1.b', 'The rights and responsibilities of patients are displayed and also given to the patient at the time of admission, in a format and language they can understand.', 'Achievement'),
      obj('PRE.1.c', 'Staff is aware of their responsibility to protect patient and family rights.', 'Core'),
      obj('PRE.1.d', 'The patients and families are aware of their rights.', 'Core'),
      obj('PRE.1.e', 'The patients and families are aware of their responsibilities.', 'Core'),

      // PRE.2 - Patient rights protection
      obj('PRE.2.a', 'The patient has a right to information.', 'Commitment'),
      obj('PRE.2.b', 'The patient has a right to participate in decision making regarding his/her care.', 'Commitment'),
      obj('PRE.2.c', 'The patient has a right to accept/refuse treatment.', 'Commitment'),
      obj('PRE.2.d', 'The patient has a right to give/withhold informed consent.', 'Core'),
      obj('PRE.2.e', 'The patient has a right to privacy.', 'Commitment'),
      obj('PRE.2.f', 'The patient has a right to confidentiality of information.', 'Commitment'),
      obj('PRE.2.g', 'The patient has a right to be protected from physical abuse.', 'Core'),
      obj('PRE.2.h', 'The patient has a right to be protected from neglect.', 'Commitment'),
      obj('PRE.2.i', 'The patient has a right to safe clinical care.', 'Commitment'),
      obj('PRE.2.j', 'The patients right to dignity is respected.', 'Commitment'),
      obj('PRE.2.k', 'The patient has the right to access his/her medical records.', 'Commitment'),
      obj('PRE.2.l', 'Patient has a right to complain and to know the outcome of the complaint.', 'Commitment'),
      obj('PRE.2.m', 'Patients right related to billing and receiving explanation of charges is respected.', 'Commitment'),
      obj('PRE.2.n', 'The patient has the right to a second opinion.', 'Commitment'),
      obj('PRE.2.o', 'The organisation respects the wish of the patient to accept or refuse to participate in clinical trials / research.', 'Achievement'),
      obj('PRE.2.p', 'The organization has a mechanism to address ethical issues and concerns.', 'Achievement'),

      // PRE.3 - Informed consent
      obj('PRE.3.a', 'Informed consent is obtained before surgery, anaesthesia, transfusion, and any other invasive/high-risk procedures.', 'Core'),
      obj('PRE.3.b', 'Consent is taken from the appropriate surrogate decision makers when the patient is not able to provide it.', 'Core'),
      obj('PRE.3.c', 'The organisation identifies the situations where other than the treating doctor can take informed consent and implements the same.', 'Commitment'),
      obj('PRE.3.d', 'The doctor taking the consent communicates sufficient information about the procedure to enable the patient/family to make a decision.', 'Core'),

      // PRE.4 - Patient and family education
      obj('PRE.4.a', 'The organisation identifies and documents the education needs of the patient and family.', 'Core'),
      obj('PRE.4.b', 'The organisation identifies the barriers to education.', 'Commitment'),
      obj('PRE.4.c', 'The organisation uses appropriate patient educational methods.', 'Commitment'),
      obj('PRE.4.d', 'The learning is documented in the patient record.', 'Commitment'),
      obj('PRE.4.e', 'Adequate time is given to the patient to understand and retain the information.', 'Commitment'),
      obj('PRE.4.f', 'The effectiveness of the education provided is assessed.', 'Excellence'),

      // PRE.5 - Beliefs, values, and support services
      obj('PRE.5.a', 'Patients values, beliefs and religious/spiritual practices are respected and addressed.', 'Core'),
      obj('PRE.5.b', 'Patients cultural preferences are respected and addressed.', 'Commitment'),
      obj('PRE.5.c', 'Spiritual or religious services as requested, are provided to the patients.', 'Commitment'),
      obj('PRE.5.d', 'The organization extends services for social support.', 'Achievement'),

      // PRE.6 - Grievance redressal
      obj('PRE.6.a', 'The organisation has an effective grievance redressal mechanism.', 'Commitment'),
      obj('PRE.6.b', 'The organisation analyses the grievances and uses the information for improvements.', 'Excellence'),
      obj('PRE.6.c', 'Grievances can be raised without compromising continued care of the patient.', 'Core'),
      obj('PRE.6.d', 'Vulnerable patients are identified and protected from neglect.', 'Achievement'),
    ],
  },

  // ============================================================================
  // HIC - Hospital Infection Control (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'hic',
    code: 'HIC',
    name: 'HIC',
    fullName: CHAPTER_NAMES.HIC,
    type: CHAPTER_TYPES.HIC,
    objectives: [
      // HIC.1 - Infection control programme
      obj('HIC.1.a', 'A documented hospital-wide programme for infection prevention and control is established and implemented.', 'Core'),
      obj('HIC.1.b', 'The organization has an antibiotic policy.', 'Achievement'),
      obj('HIC.1.c', 'The program is managed by a multidisciplinary committee/team.', 'Commitment'),
      obj('HIC.1.d', 'There is a designated individual to coordinate infection control activities across the organization.', 'Commitment'),
      obj('HIC.1.e', 'The programme is periodically reviewed and updated.', 'Core'),
      obj('HIC.1.f', 'The programme is based on current scientific knowledge and practices.', 'Achievement'),

      // HIC.2 - Standard precautions and transmission-based precautions
      obj('HIC.2.a', 'Hand hygiene: The organisation implements current hand-hygiene guidelines.', 'Core'),
      obj('HIC.2.b', 'Hand hygiene compliance is monitored.', 'Core'),
      obj('HIC.2.c', 'PPE: The organisation provides and enforces appropriate use of personal protective equipment in all patient areas.', 'Commitment'),
      obj('HIC.2.d', 'Injection safety: The organisation follows injection safety practices.', 'Core'),
      obj('HIC.2.e', 'Respiratory hygiene / cough etiquette practices are implemented.', 'Commitment'),
      obj('HIC.2.f', 'The organisation implements transmission-based precautions including isolation where necessary.', 'Core'),
      obj('HIC.2.g', 'The organisation has facilities of negative pressure isolation and follows appropriate guidelines for use.', 'Excellence'),

      // HIC.3 - Prevention of healthcare-associated infections
      obj('HIC.3.a', 'The organisation implements strategies for prevention of bloodstream infections.', 'Commitment'),
      obj('HIC.3.b', 'The organisation implements strategies for prevention of urinary tract infections.', 'Commitment'),
      obj('HIC.3.c', 'The organisation implements strategies for prevention of respiratory infections.', 'Core'),
      obj('HIC.3.d', 'The organisation implements strategies for prevention of surgical site infections.', 'Core'),
      obj('HIC.3.e', 'The organisation implements strategies for management of an outbreak.', 'Commitment'),
      obj('HIC.3.f', 'There is a post-exposure prophylaxis programme for blood-borne pathogens exposures in place.', 'Commitment'),

      // HIC.4 - Environmental cleaning
      obj('HIC.4.a', 'The organisation complies with environmental cleaning and disinfection guidelines.', 'Commitment'),
      obj('HIC.4.b', 'The organisation complies with cleaning and disinfection guidelines for linen.', 'Commitment'),
      obj('HIC.4.c', 'The organisation complies with cleaning and disinfection guidelines for cleaning equipment.', 'Commitment'),
      obj('HIC.4.d', 'The organisation complies with guidelines for kitchen hygiene.', 'Commitment'),
      obj('HIC.4.e', 'The housekeeping and laundry staff is trained in infection control practices.', 'Commitment'),
      obj('HIC.4.f', 'Housekeeping and laundry services are monitored.', 'Commitment'),

      // HIC.5 - Safe reprocessing and waste management
      obj('HIC.5.a', 'The organisation has an established central sterile service department/area or has outsourced the same.', 'Core'),
      obj('HIC.5.b', 'All methods of sterilization are monitored by chemical, biological and physical means.', 'Core'),
      obj('HIC.5.c', 'Single use / disposable items are not reused.', 'Achievement'),
      obj('HIC.5.d', 'Reprocessing of instruments and equipment used for endoscopic procedures is done as per guidelines.', 'Commitment'),
      obj('HIC.5.e', 'Bio-medical waste management: The organisation manages bio-medical waste according to prevailing regulations.', 'Core'),
      obj('HIC.5.f', 'The disposal/treatment of body parts is in consonance with applicable regulations and professional standards.', 'Commitment'),

      // HIC.6 - Management support for infection control
      obj('HIC.6.a', 'The management supports the infection control programme.', 'Commitment'),
      obj('HIC.6.b', 'Staff is trained in infection control practices.', 'Core'),
      obj('HIC.6.c', 'Infection control training is included in induction training.', 'Commitment'),
      obj('HIC.6.d', 'The organisation identifies and monitors infection indicators.', 'Commitment'),
      obj('HIC.6.e', 'Surveillance data is analysed and used for improvement.', 'Commitment'),
    ],
  },

  // ============================================================================
  // PSQ - Patient Safety and Quality Improvement (NABH SHCO 3rd Edition - August 2022)
  // Note: PDF shows PSQ (Chapter 6), but code previously used CQI
  // ============================================================================
  {
    id: 'psq',
    code: 'PSQ',
    name: 'PSQ',
    fullName: 'Patient Safety and Quality Improvement',
    type: 'Organization Centered',
    objectives: [
      // PSQ.1 - Patient safety and quality improvement programme
      obj('PSQ.1.a', 'The patient safety programme is developed, implemented and maintained by a multi-disciplinary committee.', 'Core'),
      obj('PSQ.1.b', 'The patient-safety programme identifies opportunities for improvement based on review at pre-defined intervals.', 'Commitment'),
      obj('PSQ.1.c', 'The organisation performs proactive analysis of patient safety risks and makes improvement accordingly.', 'Core'),
      obj('PSQ.1.d', 'The organisation adapts and implements national/international patient-safety goals/solutions.', 'Core'),
      obj('PSQ.1.e', 'A comprehensive quality improvement programme is developed, implemented and maintained by a multi-disciplinary committee.', 'Core'),
      obj('PSQ.1.f', 'There is a designated individual for coordinating and implementing the quality improvement programme.', 'Commitment'),
      obj('PSQ.1.g', 'The quality improvement programme identifies opportunities for improvement based on review at pre-defined intervals.', 'Commitment'),
      obj('PSQ.1.h', 'Audits are conducted at regular intervals as a means of continuous monitoring.', 'Commitment'),
      obj('PSQ.1.i', 'There is an established process in the organisation to monitor and improve quality of nursing care.', 'Core'),

      // PSQ.2 - Key indicators
      obj('PSQ.2.a', 'The organisation identifies and monitors key indicators to oversee the clinical structures, processes and outcomes.', 'Commitment'),
      obj('PSQ.2.b', 'The organisation identifies and monitors the key indicators to oversee infection control activities.', 'Core'),
      obj('PSQ.2.c', 'The organisation identifies and monitors the key indicators to oversee the managerial structures, processes and outcomes.', 'Commitment'),
      obj('PSQ.2.d', 'The organisation identifies and monitors the key indicators to oversee patient safety activities.', 'Core'),
      obj('PSQ.2.e', 'Data is regularly verified by the quality team and is analysed to identify the opportunities for improvement.', 'Commitment'),

      // PSQ.3 - Clinical audit and quality improvement
      obj('PSQ.3.a', 'Clinical audits are performed to improve the quality of patient care and documented.', 'Commitment'),
      obj('PSQ.3.b', 'The parameters to be audited are defined by the organisation.', 'Commitment'),
      obj('PSQ.3.c', 'Medical and nursing staff participates in this system.', 'Commitment'),
      obj('PSQ.3.d', 'Remedial measures are implemented.', 'Commitment'),
      obj('PSQ.3.e', 'The organisation undertakes quality improvement projects.', 'Core'),

      // PSQ.4 - Management support
      obj('PSQ.4.a', 'The management creates a culture of safety.', 'Achievement'),
      obj('PSQ.4.b', 'The leaders at all levels in the organisation are aware of the intent of the patient safety quality improvement program and the approach to its implementation.', 'Commitment'),
      obj('PSQ.4.c', 'The management makes available adequate resources required for patient safety and quality improvement programme, earmarks adequate funds from its annual budget in this regard.', 'Commitment'),
      obj('PSQ.4.d', 'The management uses the feedback obtained from the workforce to improve patient safety and quality improvement programme.', 'Excellence'),

      // PSQ.5 - Incident management
      obj('PSQ.5.a', 'The organisation implements an incident management system.', 'Core'),
      obj('PSQ.5.b', 'The organisation has a mechanism to identify sentinel events.', 'Commitment'),
      obj('PSQ.5.c', 'The organisation has an established process for analysis of incidents.', 'Commitment'),
      obj('PSQ.5.d', 'Corrective and preventive actions are taken based on the findings of such analysis.', 'Commitment'),
      obj('PSQ.5.e', 'The organization shall have a process for informing various stakeholders in case of a near miss / adverse event / sentinel event.', 'Excellence'),
    ],
  },

  // ============================================================================
  // ROM - Responsibilities of Management (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'rom',
    code: 'ROM',
    name: 'ROM',
    fullName: CHAPTER_NAMES.ROM,
    type: CHAPTER_TYPES.ROM,
    objectives: [
      // ROM.1 - Governance
      obj('ROM.1.a', 'Those responsible for governance are identified, and their roles and responsibilities are defined and documented.', 'Core'),
      obj('ROM.1.b', 'Those responsible for governance lay down the organisation\'s vision, mission and values and make them public.', 'Commitment'),
      obj('ROM.1.c', 'Those responsible for governance monitor and measure the performance of the organisation against the stated mission.', 'Achievement'),
      obj('ROM.1.d', 'Those responsible for governance appoint the senior leaders in the organisation.', 'Commitment'),
      obj('ROM.1.e', 'Those responsible for governance support the ethical management framework of the organisation.', 'Core'),

      // ROM.2 - Leadership
      obj('ROM.2.a', 'The person heading the organisation has requisite and appropriate administrative qualifications.', 'Commitment'),
      obj('ROM.2.b', 'The person heading the organisation has requisite and appropriate administrative experience.', 'Commitment'),
      obj('ROM.2.c', 'The leader is responsible for and complies with the laid-down and applicable legislations, regulations and notifications.', 'Core'),
      obj('ROM.2.d', 'The performance of the organisation\'s leader is reviewed for effectiveness.', 'Achievement'),

      // ROM.3 - Professionalism
      obj('ROM.3.a', 'Those responsible for governance approve the strategic and operational plans and the organisation\'s annual budget.', 'Commitment'),
      obj('ROM.3.b', 'The organisation coordinates the functioning with departments and external agencies and monitors the progress in achieving the defined goals and objectives.', 'Achievement'),
      obj('ROM.3.c', 'The functioning of committees is reviewed for their effectiveness.', 'Commitment'),
      obj('ROM.3.d', 'The organisation documents the service standards that are measurable and monitors them.', 'Achievement'),
      obj('ROM.3.e', 'The organization documents staff rights and responsibilities.', 'Commitment'),

      // ROM.4 - Patient safety and risk management
      obj('ROM.4.a', 'Management ensures proactive risk management across the organisation.', 'Core'),
      obj('ROM.4.b', 'Management ensures integration between quality improvement, risk management and strategic planning within the organisation.', 'Excellence'),
      obj('ROM.4.c', 'Management ensures implementation of systems for internal and external reporting of system and process failures.', 'Commitment'),
      obj('ROM.4.d', 'Management ensures that it has a documented agreement for all outsourced services that include service parameters.', 'Core'),
      obj('ROM.4.e', 'Management monitors the quality of the outsourced services and improvements are made as required.', 'Achievement'),
    ],
  },

  // ============================================================================
  // FMS - Facility Management and Safety (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'fms',
    code: 'FMS',
    name: 'FMS',
    fullName: CHAPTER_NAMES.FMS,
    type: CHAPTER_TYPES.FMS,
    objectives: [
      // FMS.1 - Environment and facilities
      obj('FMS.1.a', 'Facilities and space provisions are appropriate to the scope of services.', 'Commitment'),
      obj('FMS.1.b', 'As-built and updated drawings are maintained as per statutory requirements.', 'Commitment'),
      obj('FMS.1.c', 'There are internal and external sign postings in the organisation in a manner understood by the patient, families and community.', 'Core'),
      obj('FMS.1.d', 'Potable water and electricity are available round the clock.', 'Core'),
      obj('FMS.1.e', 'Alternate sources for electricity and water are provided as a backup for any failure/shortage and their functioning is tested at a predefined frequency.', 'Commitment'),
      obj('FMS.1.f', 'The organisation takes initiatives towards an energy-efficient and environment friendly hospital.', 'Excellence'),

      // FMS.2 - Safety of environment
      obj('FMS.2.a', 'Patient-safety devices and infrastructure are installed across the organisation and inspected periodically.', 'Core'),
      obj('FMS.2.b', 'The organisation has facilities for the differently-abled.', 'Commitment'),
      obj('FMS.2.c', 'Operational planning identifies areas which need to have extra security and describes access to different areas in the hospital by staff, patients, and visitors.', 'Achievement'),
      obj('FMS.2.d', 'Facility inspection rounds to ensure safety are conducted at least once a month.', 'Core'),
      obj('FMS.2.e', 'Organisation conducts electrical safety audits for the facility.', 'Achievement'),
      obj('FMS.2.f', 'There is a procedure which addresses the identification and disposal of material(s) not in use in the organisation.', 'Commitment'),
      obj('FMS.2.g', 'Hazardous materials are identified and used safely within the organisation.', 'Core'),

      // FMS.3 - Medical equipment management
      obj('FMS.3.a', 'The organisation plans for medical and support service equipment in accordance with its services and strategic plan.', 'Commitment'),
      obj('FMS.3.b', 'Medical equipment and support service equipment are inventoried, and proper logs are maintained as required.', 'Commitment'),
      obj('FMS.3.c', 'The documented operational and maintenance (preventive and breakdown) plan for medical and support service equipment is implemented.', 'Core'),
      obj('FMS.3.d', 'Medical and support service equipment are periodically inspected and calibrated for their proper functioning.', 'Commitment'),
      obj('FMS.3.e', 'Qualified and trained personnel operate and maintain medical and support service equipment.', 'Commitment'),
      obj('FMS.3.f', 'There is monitoring of medical equipment and medical devices related to adverse events, and compliance hazard notices on recalls.', 'Achievement'),
      obj('FMS.3.g', 'Downtime for critical equipment breakdown is monitored from reporting to inspection and implementation of corrective actions.', 'Achievement'),

      // FMS.4 - Medical gases, vacuum and compressed air
      obj('FMS.4.a', 'Written guidance governs the implementation of procurement, handling, storage, distribution, usage and replenishment of medical gases.', 'Commitment'),
      obj('FMS.4.b', 'Medical gases are handled, stored, distributed and used in a safe manner.', 'Core'),
      obj('FMS.4.c', 'Alternate sources for medical gases, vacuum and compressed air are provided for, in case of failure and their functioning is tested at a predefined frequency.', 'Core'),
      obj('FMS.4.d', 'There is an operational, inspection, testing and maintenance plan for piped medical gas, compressed air and vacuum installation.', 'Commitment'),

      // FMS.5 - Fire and non-fire emergencies
      obj('FMS.5.a', 'The organisation has plans and provisions for early detection, abatement and containment of the fire, and non-fire emergencies.', 'Core'),
      obj('FMS.5.b', 'The organisation has a documented and displayed exit plan in case of fire and non-fire emergencies.', 'Commitment'),
      obj('FMS.5.c', 'Mock drills are held at least twice a year.', 'Commitment'),
      obj('FMS.5.d', 'There is a maintenance plan for fire-related equipment and infrastructure.', 'Commitment'),
      obj('FMS.5.e', 'The organisation has a service continuity plan in case of fire and non-fire emergencies.', 'Achievement'),
    ],
  },

  // ============================================================================
  // HRM - Human Resource Management (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'hrm',
    code: 'HRM',
    name: 'HRM',
    fullName: CHAPTER_NAMES.HRM,
    type: CHAPTER_TYPES.HRM,
    objectives: [
      // HRM.1 - Human resource planning
      obj('HRM.1.a', 'Human resource planning supports the organisation\'s current and future ability to meet the care, treatment and service needs of the patient.', 'Excellence'),
      obj('HRM.1.b', 'Written guidance governs the process of recruitment.', 'Core'),
      obj('HRM.1.c', 'The organisation maintains an adequate number and mix of staff to meet the care, treatment and service needs of the patient.', 'Core'),
      obj('HRM.1.d', 'The organisation has contingency plans to manage long- and short-term workforce shortages, including unplanned shortages.', 'Achievement'),
      obj('HRM.1.e', 'The reporting relationships, job specification and job description are defined for each category of staff.', 'Commitment'),
      obj('HRM.1.f', 'The organisation performs a background check of new staff.', 'Commitment'),
      obj('HRM.1.g', 'The organisation defines and implements a code of conduct for its staff.', 'Core'),
      obj('HRM.1.h', 'Exit interviews are conducted and used as a tool to improve human resource practices.', 'Achievement'),
      obj('HRM.1.i', 'Written guidance governs disciplinary and grievance handling mechanisms.', 'Commitment'),

      // HRM.2 - Induction and professional training
      obj('HRM.2.a', 'Staff are provided with induction training.', 'Core'),
      obj('HRM.2.b', 'Written guidance governs training and development policy for the staff through an on-going programme for professional training and development of the staff.', 'Core'),
      obj('HRM.2.c', 'Staff are appropriately trained based on their specific job description.', 'Commitment'),
      obj('HRM.2.d', 'Staff involved in direct patient care are provided training on cardiopulmonary resuscitation at the time of induction and periodically thereafter.', 'Core'),
      obj('HRM.2.e', 'Evaluation of training effectiveness is done by the organisation.', 'Excellence'),

      // HRM.3 - Safety and quality training
      obj('HRM.3.a', 'Staff are trained in the organisation\'s safety programme.', 'Commitment'),
      obj('HRM.3.b', 'Staff are provided training in the detection, handling, minimisation and elimination of identified risks within the organisation\'s environment.', 'Commitment'),
      obj('HRM.3.c', 'Staff members are made aware of procedures to follow in the event of an incident.', 'Commitment'),
      obj('HRM.3.d', 'Staff are trained in occupational safety aspects.', 'Commitment'),
      obj('HRM.3.e', 'Staff are trained in the organisation\'s disaster management plan.', 'Core'),
      obj('HRM.3.f', 'Staff are trained in handling fire and non-fire emergencies.', 'Core'),
      obj('HRM.3.g', 'Staff are trained in the organisation\'s quality improvement programme.', 'Commitment'),

      // HRM.4 - Performance appraisal
      obj('HRM.4.a', 'Performance appraisal is done for staff within the organisation and staff are made aware of the same at the time of induction.', 'Commitment'),
      obj('HRM.4.b', 'Performance is evaluated based on pre-determined criteria.', 'Commitment'),
      obj('HRM.4.c', 'The appraisal system is used as a tool for further development.', 'Excellence'),
      obj('HRM.4.d', 'Performance appraisal is carried out at defined intervals and is documented.', 'Commitment'),

      // HRM.5 - Staff well-being
      obj('HRM.5.a', 'Staff well-being is promoted through identification of health problems of the staff, including occupational health hazards, in accordance with the organisation\'s policy.', 'Commitment'),
      obj('HRM.5.b', 'Health checks of staff are done at least once a year and the findings/results are documented.', 'Core'),
      obj('HRM.5.c', 'Organisation provides treatment to staff who sustain workplace-related injuries.', 'Commitment'),
      obj('HRM.5.d', 'The organisation has measures in place for preventing and handling workplace violence.', 'Core'),

      // HRM.6 - Personal information
      obj('HRM.6.a', 'Personal files are maintained with respect to all staff, and their confidentiality is ensured.', 'Commitment'),
      obj('HRM.6.b', 'The personal files contain personal information regarding the staff\'s qualification, job description, proof of formal engagement verification of credentials and health status.', 'Commitment'),
      obj('HRM.6.c', 'Records of in-service training and education are contained in the personal files.', 'Commitment'),
      obj('HRM.6.d', 'Personal files contain results of all evaluations and remarks.', 'Commitment'),

      // HRM.7 - Credentialing of medical professionals
      obj('HRM.7.a', 'Medical professionals permitted by law, regulation and the organisation to provide patient care without supervision are identified.', 'Core'),
      obj('HRM.7.b', 'The education, registration, training, experience and other information of medical professionals are identified, verified, documented and updated periodically.', 'Commitment'),
      obj('HRM.7.c', 'Medical professionals are granted privileges to admit and care for the patients in consonance with their qualification, training, experience and registration.', 'Core'),
      obj('HRM.7.d', 'The requisite services to be provided by the medical professionals are known to them as well as the various departments/units of the organisation.', 'Commitment'),

      // HRM.8 - Credentialing of nursing professionals
      obj('HRM.8.a', 'Nursing staff permitted by law, regulation and the organisation to provide patient care without supervision are identified.', 'Core'),
      obj('HRM.8.b', 'The education, registration, training, experience and other information of nursing staff are identified, verified, documented and updated periodically.', 'Commitment'),
      obj('HRM.8.c', 'Nursing staff are granted privileges in consonance with their qualification, training, experience and registration.', 'Core'),
      obj('HRM.8.d', 'The requisite services to be provided by the nursing staff are known to them as well as the various departments/units of the organisation.', 'Commitment'),

      // HRM.9 - Credentialing of para-clinical professionals
      obj('HRM.9.a', 'Para-clinical professionals permitted by law, regulation and the organisation to provide patient care without supervision are identified.', 'Core'),
      obj('HRM.9.b', 'The education, registration, training and experience of para-clinical professionals are appropriately verified, documented and updated periodically.', 'Commitment'),
      obj('HRM.9.c', 'Para-clinical professionals are granted privileges in consonance with their qualification, training, experience and registration.', 'Core'),
      obj('HRM.9.d', 'The requisite services to be provided by the para-clinical professionals are known to them as well as the various departments/units of the organisation.', 'Commitment'),
    ],
  },

  // ============================================================================
  // IMS - Information Management System (NABH SHCO 3rd Edition - August 2022)
  // ============================================================================
  {
    id: 'ims',
    code: 'IMS',
    name: 'IMS',
    fullName: CHAPTER_NAMES.IMS,
    type: CHAPTER_TYPES.IMS,
    objectives: [
      // IMS.1 - Information needs
      obj('IMS.1.a', 'The organization identifies, captures and disseminates the information needs of the patients, visitors, staff, management, external agencies and community.', 'Core'),
      obj('IMS.1.b', 'Information management and technology acquisitions and maintenance plan are in consonance with the identified information needs.', 'Commitment'),
      obj('IMS.1.c', 'The organisation stores and retrieves data according to its information needs.', 'Commitment'),
      obj('IMS.1.d', 'The organization contributes to external databases in accordance with the law and regulations.', 'Commitment'),
      obj('IMS.1.e', 'Processes for data collection are standardized and data is analysed to meet the information needs.', 'Commitment'),

      // IMS.2 - Medical records
      obj('IMS.2.a', 'The unique identifier is assigned to the medical record.', 'Core'),
      obj('IMS.2.b', 'The contents of medical record are identified, documented and provides a complete, up-to-date and chronological account of patient care.', 'Commitment'),
      obj('IMS.2.c', 'Authorized staff make the entry in the medical record, author of the entry can be identified.', 'Commitment'),
      obj('IMS.2.d', 'Entry in the medical record is named, signed, dated and timed.', 'Commitment'),
      obj('IMS.2.e', 'The medical record has only authorised abbreviations.', 'Commitment'),

      // IMS.3 - Continuity of care
      obj('IMS.3.a', 'The medical record contains information regarding reasons for admission, diagnosis and plan of care.', 'Commitment'),
      obj('IMS.3.b', 'The medical record contains the details of assessments, re-assessments, consultations, results of investigations, operative and other procedures, and the details of the care provided.', 'Commitment'),
      obj('IMS.3.c', 'When patient is transferred to another hospital, the medical record contains the details of the transfer.', 'Commitment'),
      obj('IMS.3.d', 'The medical record contains a copy of the discharge summary.', 'Commitment'),
      obj('IMS.3.e', 'In case of death, the medical record contains a copy of the cause of death certificate.', 'Commitment'),
      obj('IMS.3.f', 'Care providers have access to current and past medical record.', 'Commitment'),

      // IMS.4 - Confidentiality, integrity and security
      obj('IMS.4.a', 'The organization maintains the confidentiality of records, data and information.', 'Core'),
      obj('IMS.4.b', 'The organization maintains the integrity of records, data and information.', 'Core'),
      obj('IMS.4.c', 'The organization maintains the security of records, data and information.', 'Core'),
      obj('IMS.4.d', 'The organization discloses privileged health information as authorized by patient and/ or as required by law.', 'Commitment'),
      obj('IMS.4.e', 'Request for access to information in the medical records by patients/physicians and other public agencies are addressed consistently.', 'Commitment'),

      // IMS.5 - Document control and retention
      obj('IMS.5.a', 'The organization has an effective process for document control.', 'Core'),
      obj('IMS.5.b', 'The organization retains patient\'s clinical records, data and information, according to its requirements.', 'Core'),
      obj('IMS.5.c', 'The retention process provides expected confidentiality and security.', 'Commitment'),
      obj('IMS.5.d', 'The destruction of medical records, data and information is in accordance with the laid-down policy.', 'Commitment'),

      // IMS.6 - Medical records review
      obj('IMS.6.a', 'The medical records are reviewed periodically.', 'Core'),
      obj('IMS.6.b', 'The review uses a representative sample of both active and discharged patients, based on statistical principles.', 'Commitment'),
      obj('IMS.6.c', 'The review is conducted by identified individuals.', 'Commitment'),
      obj('IMS.6.d', 'The review of records is based on identified parameters.', 'Core'),
      obj('IMS.6.e', 'Appropriate corrective and preventive measures are undertaken on the deficiencies pointed out in the review.', 'Commitment'),
    ],
  },
];

export const getChapterStats = (chapter: Chapter) => {
  const total = chapter.objectives.length;
  const completed = chapter.objectives.filter((o) => o.status === 'Completed').length;
  const inProgress = chapter.objectives.filter((o) => o.status === 'In progress').length;
  const blocked = chapter.objectives.filter((o) => o.status === 'Blocked').length;
  const notStarted = chapter.objectives.filter((o) => o.status === 'Not started').length;
  const core = chapter.objectives.filter((o) => o.isCore).length;
  const prevNC = chapter.objectives.filter((o) => o.priority === 'Prev NC').length;
  const commitment = chapter.objectives.filter((o) => o.category === 'Commitment').length;
  const achievement = chapter.objectives.filter((o) => o.category === 'Achievement').length;
  const excellence = chapter.objectives.filter((o) => o.category === 'Excellence').length;

  return { total, completed, inProgress, blocked, notStarted, core, prevNC, commitment, achievement, excellence };
};

export const getOverallStats = () => {
  let total = 0;
  let completed = 0;
  let inProgress = 0;
  let blocked = 0;
  let notStarted = 0;
  let core = 0;
  let prevNC = 0;
  let commitment = 0;
  let achievement = 0;
  let excellence = 0;

  nabhData.forEach((chapter) => {
    const stats = getChapterStats(chapter);
    total += stats.total;
    completed += stats.completed;
    inProgress += stats.inProgress;
    blocked += stats.blocked;
    notStarted += stats.notStarted;
    core += stats.core;
    prevNC += stats.prevNC;
    commitment += stats.commitment;
    achievement += stats.achievement;
    excellence += stats.excellence;
  });

  return { total, completed, inProgress, blocked, notStarted, core, prevNC, commitment, achievement, excellence };
};
