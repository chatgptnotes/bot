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
  "CQI.1.a": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "CQI.1.b": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.1.c": { "priority": "CORE", "assignee": "Kashish", "status": "Blocked" },
  "CQI.1.d": { "priority": "CORE", "assignee": "Kashish", "status": "Completed" },
  "CQI.1.e": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.1.f": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.1.g": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.1.h": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.1.i": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.2.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.2.b": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "CQI.2.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.2.d": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "CQI.2.e": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.3.a": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.c": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.d": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.e": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.4.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.4.b": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.4.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.4.d": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.5.a": { "priority": "CORE", "assignee": "Kashish", "status": "Completed" },
  "CQI.5.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.5.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.5.d": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.5.e": { "priority": "P2", "assignee": "Kashish", "status": "" },
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
  // MOM - Management of Medication
  // ============================================================================
  {
    id: 'mom',
    code: 'MOM',
    name: 'MOM',
    fullName: CHAPTER_NAMES.MOM,
    type: CHAPTER_TYPES.MOM,
    objectives: [
      // MOM.1 - Pharmacy services organization
      obj('MOM.1.a', 'Pharmacy services are organized to meet patient needs.', 'Commitment'),
      obj('MOM.1.b', 'Pharmacy services are available 24x7 or as per organizational policy.', 'Commitment'),
      obj('MOM.1.c', 'A qualified pharmacist supervises pharmacy operations.', 'Core'),
      obj('MOM.1.d', 'A formulary appropriate to the organization is developed and maintained.', 'Commitment'),
      obj('MOM.1.e', 'Medications are stored under proper conditions.', 'Core'),
      obj('MOM.1.f', 'Expiry of medications is monitored.', 'Core'),

      // MOM.2 - Prescription
      obj('MOM.2.a', 'Medications are prescribed by authorized personnel.', 'Core'),
      obj('MOM.2.b', 'Prescriptions are legible and complete.', 'Core'),
      obj('MOM.2.c', 'Look-alike, sound-alike medications are identified and managed.', 'Core'),
      obj('MOM.2.d', 'High-risk medications are identified and managed safely.', 'Core'),
      obj('MOM.2.e', 'Verbal and telephone orders are minimized and verified.', 'Commitment'),

      // MOM.3 - Dispensing
      obj('MOM.3.a', 'Medications are dispensed by qualified personnel.', 'Core'),
      obj('MOM.3.b', 'Prescriptions are verified before dispensing.', 'Core'),
      obj('MOM.3.c', 'Patients are counseled about medications.', 'Commitment'),
      obj('MOM.3.d', 'Dispensing records are maintained.', 'Commitment'),

      // MOM.4 - Administration
      obj('MOM.4.a', 'Medications are administered by trained and authorized personnel.', 'Core'),
      obj('MOM.4.b', 'Patient identification is verified before medication administration.', 'Core'),
      obj('MOM.4.c', 'Medication administration is documented.', 'Core'),
      obj('MOM.4.d', 'Self-administration is supervised when permitted.', 'Commitment'),

      // MOM.5 - Adverse drug events
      obj('MOM.5.a', 'Adverse drug events are defined.', 'Commitment'),
      obj('MOM.5.b', 'Patients are monitored for adverse drug events.', 'Core'),
      obj('MOM.5.c', 'Adverse drug events are documented and reported.', 'Core'),
      obj('MOM.5.d', 'Appropriate action is taken for adverse drug events.', 'Core'),

      // MOM.6 - Medical gases
      obj('MOM.6.a', 'Medical gases are stored safely.', 'Core'),
      obj('MOM.6.b', 'Medical gases are administered by trained personnel.', 'Core'),
      obj('MOM.6.c', 'Stock levels of medical gases are monitored.', 'Commitment'),
    ],
  },

  // ============================================================================
  // PRE - Patient Rights and Education
  // ============================================================================
  {
    id: 'pre',
    code: 'PRE',
    name: 'PRE',
    fullName: CHAPTER_NAMES.PRE,
    type: CHAPTER_TYPES.PRE,
    objectives: [
      // PRE.1 - Patient rights and responsibilities
      obj('PRE.1.a', 'Patient rights are documented and displayed.', 'Core'),
      obj('PRE.1.b', 'Patient responsibilities are communicated.', 'Commitment'),
      obj('PRE.1.c', 'Staff is trained on patient rights.', 'Commitment'),
      obj('PRE.1.d', 'Patient privacy is maintained during care.', 'Core'),
      obj('PRE.1.e', 'Confidentiality of patient information is maintained.', 'Core'),
      obj('PRE.1.f', 'Patients are protected from physical abuse.', 'Core'),

      // PRE.2 - Beliefs and values
      obj('PRE.2.a', 'Patient beliefs and values are respected.', 'Commitment'),
      obj('PRE.2.b', 'Cultural and religious preferences are accommodated.', 'Commitment'),
      obj('PRE.2.c', 'Patients are involved in decision making about their care.', 'Commitment'),
      obj('PRE.2.d', 'Patients can refuse treatment after being informed of consequences.', 'Core'),

      // PRE.3 - Informed consent
      obj('PRE.3.a', 'A documented consent policy exists.', 'Commitment'),
      obj('PRE.3.b', 'Informed consent is obtained for procedures and surgeries.', 'Core'),
      obj('PRE.3.c', 'Consent includes information about risks, benefits and alternatives.', 'Core'),
      obj('PRE.3.d', 'Consent is obtained by the treating physician.', 'Core'),
      obj('PRE.3.e', 'General consent is obtained at admission.', 'Commitment'),
      obj('PRE.3.f', 'Consent for high-risk procedures is specifically documented.', 'Core'),

      // PRE.4 - Patient education
      obj('PRE.4.a', 'Patients are informed about their diagnosis.', 'Core'),
      obj('PRE.4.b', 'Patients are informed about planned treatment and care.', 'Core'),
      obj('PRE.4.c', 'Patients are educated about medications.', 'Commitment'),
      obj('PRE.4.d', 'Patients are educated about diet and nutrition.', 'Commitment'),
      obj('PRE.4.e', 'Patients are educated about safe and effective use of equipment.', 'Commitment'),
      obj('PRE.4.f', 'Patient education is documented.', 'Commitment'),

      // PRE.5 - Grievances
      obj('PRE.5.a', 'A grievance redressal mechanism exists.', 'Commitment'),
      obj('PRE.5.b', 'Patients are informed about the grievance mechanism.', 'Commitment'),
      obj('PRE.5.c', 'Grievances are documented and addressed.', 'Commitment'),
      obj('PRE.5.d', 'Feedback is used for improvement.', 'Achievement'),
    ],
  },

  // ============================================================================
  // HIC - Hospital Infection Control
  // ============================================================================
  {
    id: 'hic',
    code: 'HIC',
    name: 'HIC',
    fullName: CHAPTER_NAMES.HIC,
    type: CHAPTER_TYPES.HIC,
    objectives: [
      // HIC.1 - Infection control programme
      obj('HIC.1.a', 'An infection control programme is in place.', 'Commitment'),
      obj('HIC.1.b', 'An infection control team/committee exists.', 'Commitment'),
      obj('HIC.1.c', 'Standard precautions are adhered to at all times.', 'Core'),
      obj('HIC.1.d', 'Hand hygiene practices are followed.', 'Core'),
      obj('HIC.1.e', 'Personal protective equipment is available and used appropriately.', 'Core'),
      obj('HIC.1.f', 'Cleanliness and general hygiene of facilities is maintained.', 'Core'),

      // HIC.2 - Infection control manual and surveillance
      obj('HIC.2.a', 'An infection control manual exists.', 'Commitment'),
      obj('HIC.2.b', 'The manual is periodically reviewed and updated.', 'Achievement'),
      obj('HIC.2.c', 'Surveillance of hospital-associated infections is conducted.', 'Commitment'),
      obj('HIC.2.d', 'Surveillance data is analyzed and used for improvement.', 'Achievement'),

      // HIC.3 - Prevention of HAI
      obj('HIC.3.a', 'Measures are taken to prevent surgical site infections.', 'Core'),
      obj('HIC.3.b', 'Measures are taken to prevent catheter-associated urinary tract infections.', 'Core'),
      obj('HIC.3.c', 'Measures are taken to prevent central line-associated bloodstream infections.', 'Core'),
      obj('HIC.3.d', 'Measures are taken to prevent ventilator-associated pneumonia.', 'Core'),
      obj('HIC.3.e', 'Isolation practices are implemented when needed.', 'Core'),
      obj('HIC.3.f', 'Staff safety measures are in place.', 'Commitment'),

      // HIC.4 - Sterilization
      obj('HIC.4.a', 'A central sterile supply department/area exists.', 'Commitment'),
      obj('HIC.4.b', 'Sterilization procedures are documented.', 'Commitment'),
      obj('HIC.4.c', 'Sterilization is monitored using appropriate indicators.', 'Core'),
      obj('HIC.4.d', 'Sterile supplies are stored and handled appropriately.', 'Core'),
      obj('HIC.4.e', 'Equipment cleaning and disinfection practices are followed.', 'Core'),

      // HIC.5 - Biomedical waste
      obj('HIC.5.a', 'Biomedical waste is segregated at source.', 'Core'),
      obj('HIC.5.b', 'Color-coded bins and bags are used.', 'Core'),
      obj('HIC.5.c', 'Biomedical waste is transported safely.', 'Core'),
      obj('HIC.5.d', 'Biomedical waste is disposed as per regulations.', 'Core'),
      obj('HIC.5.e', 'Records of biomedical waste disposal are maintained.', 'Commitment'),
      obj('HIC.5.f', 'Staff is trained in biomedical waste management.', 'Commitment'),

      // HIC.6 - Management support and training
      obj('HIC.6.a', 'Management supports the infection control program.', 'Commitment'),
      obj('HIC.6.b', 'Staff is trained on infection control practices.', 'Core'),
      obj('HIC.6.c', 'Resources are allocated for infection control.', 'Commitment'),
      obj('HIC.6.d', 'Infection control compliance is monitored.', 'Achievement'),

      // HIC.7 - Laundry and linen
      obj('HIC.7.a', 'Laundry services are organized appropriately.', 'Commitment'),
      obj('HIC.7.b', 'Infected linen is handled separately.', 'Core'),
      obj('HIC.7.c', 'Clean and soiled linen are stored separately.', 'Core'),
      obj('HIC.7.d', 'Staff handling linen use appropriate protection.', 'Commitment'),
    ],
  },

  // ============================================================================
  // CQI - Continuous Quality Improvement (SHCO uses CQI instead of PSQ)
  // ============================================================================
  {
    id: 'cqi',
    code: 'CQI',
    name: 'CQI',
    fullName: CHAPTER_NAMES.CQI,
    type: CHAPTER_TYPES.CQI,
    objectives: [
      // CQI.1 - Quality assurance programme
      obj('CQI.1.a', 'A quality assurance programme is in place.', 'Commitment'),
      obj('CQI.1.b', 'Quality objectives are defined.', 'Commitment'),
      obj('CQI.1.c', 'Quality improvement activities are conducted.', 'Achievement'),
      obj('CQI.1.d', 'A quality committee/team exists.', 'Commitment'),

      // CQI.2 - Key indicators
      obj('CQI.2.a', 'Key indicators are identified for clinical areas.', 'Commitment'),
      obj('CQI.2.b', 'Key indicators are identified for managerial areas.', 'Commitment'),
      obj('CQI.2.c', 'Data is collected and analyzed.', 'Commitment'),
      obj('CQI.2.d', 'Results are used for improvement.', 'Achievement'),
      obj('CQI.2.e', 'Benchmarking is done where possible.', 'Excellence'),

      // CQI.3 - Patient safety programme
      obj('CQI.3.a', 'A patient safety programme is in place.', 'Commitment'),
      obj('CQI.3.b', 'Patient identification is ensured before any procedure.', 'Core'),
      obj('CQI.3.c', 'Communication is standardized for handovers.', 'Core'),
      obj('CQI.3.d', 'High-alert medications are managed safely.', 'Core'),
      obj('CQI.3.e', 'Surgical safety is ensured.', 'Core'),
      obj('CQI.3.f', 'Fall prevention measures are in place.', 'Core'),
      obj('CQI.3.g', 'Pressure ulcer prevention measures are in place.', 'Commitment'),

      // CQI.4 - Incident reporting
      obj('CQI.4.a', 'An incident reporting system exists.', 'Commitment'),
      obj('CQI.4.b', 'Incidents are reported without fear of punitive action.', 'Commitment'),
      obj('CQI.4.c', 'Incidents are analyzed and action is taken.', 'Commitment'),
      obj('CQI.4.d', 'Learning from incidents is shared.', 'Achievement'),

      // CQI.5 - Audit
      obj('CQI.5.a', 'Medical audits are conducted.', 'Achievement'),
      obj('CQI.5.b', 'Nursing audits are conducted.', 'Achievement'),
      obj('CQI.5.c', 'Audit findings are used for improvement.', 'Achievement'),

      // CQI.6 - Sentinel events
      obj('CQI.6.a', 'Sentinel events are defined.', 'Commitment'),
      obj('CQI.6.b', 'Root cause analysis is conducted for sentinel events.', 'Core'),
      obj('CQI.6.c', 'Corrective actions are implemented.', 'Core'),
      obj('CQI.6.d', 'Effectiveness of corrective actions is monitored.', 'Commitment'),

      // CQI.7 - Satisfaction
      obj('CQI.7.a', 'Patient satisfaction is measured.', 'Commitment'),
      obj('CQI.7.b', 'Employee satisfaction is measured.', 'Achievement'),
      obj('CQI.7.c', 'Results are analyzed and used for improvement.', 'Achievement'),
    ],
  },

  // ============================================================================
  // ROM - Responsibilities of Management
  // ============================================================================
  {
    id: 'rom',
    code: 'ROM',
    name: 'ROM',
    fullName: CHAPTER_NAMES.ROM,
    type: CHAPTER_TYPES.ROM,
    objectives: [
      // ROM.1 - Management responsibilities
      obj('ROM.1.a', 'The governance structure is defined.', 'Commitment'),
      obj('ROM.1.b', 'Responsibilities of management are documented.', 'Commitment'),
      obj('ROM.1.c', 'Management reviews organizational performance.', 'Commitment'),

      // ROM.2 - Department services
      obj('ROM.2.a', 'Services of each department are defined.', 'Commitment'),
      obj('ROM.2.b', 'Department heads are accountable for their services.', 'Commitment'),
      obj('ROM.2.c', 'Coordination between departments exists.', 'Commitment'),

      // ROM.3 - Ethical management
      obj('ROM.3.a', 'Ethical practices are followed.', 'Commitment'),
      obj('ROM.3.b', 'Conflict of interest is managed.', 'Commitment'),
      obj('ROM.3.c', 'Professional ethics are upheld.', 'Commitment'),
      obj('ROM.3.d', 'Transparency in dealings is maintained.', 'Commitment'),

      // ROM.4 - Qualified leadership
      obj('ROM.4.a', 'The organization has a qualified head/administrator.', 'Core'),
      obj('ROM.4.b', 'The head has appropriate authority and responsibility.', 'Commitment'),
      obj('ROM.4.c', 'The head ensures compliance with laws and regulations.', 'Core'),

      // ROM.5 - Patient safety and risk management
      obj('ROM.5.a', 'Patient safety is a priority for management.', 'Core'),
      obj('ROM.5.b', 'Risk management processes are in place.', 'Commitment'),
      obj('ROM.5.c', 'Resources are allocated for safety initiatives.', 'Commitment'),
      obj('ROM.5.d', 'Safety culture is promoted.', 'Achievement'),

      // ROM.6 - Strategic planning
      obj('ROM.6.a', 'A strategic plan exists.', 'Achievement'),
      obj('ROM.6.b', 'An operational plan exists.', 'Commitment'),
      obj('ROM.6.c', 'Plans are reviewed and updated periodically.', 'Achievement'),

      // ROM.7 - Statutory compliance
      obj('ROM.7.a', 'All required licenses and registrations are in place.', 'Core'),
      obj('ROM.7.b', 'Licenses are renewed in a timely manner.', 'Core'),
      obj('ROM.7.c', 'Compliance with statutory requirements is monitored.', 'Commitment'),
    ],
  },

  // ============================================================================
  // FMS - Facilities Management and Safety
  // ============================================================================
  {
    id: 'fms',
    code: 'FMS',
    name: 'FMS',
    fullName: CHAPTER_NAMES.FMS,
    type: CHAPTER_TYPES.FMS,
    objectives: [
      // FMS.1 - Regulatory compliance
      obj('FMS.1.a', 'Applicable laws and regulations are identified.', 'Commitment'),
      obj('FMS.1.b', 'Compliance with building codes is maintained.', 'Core'),
      obj('FMS.1.c', 'Required facility inspections are completed.', 'Core'),
      obj('FMS.1.d', 'Non-conformities are addressed.', 'Commitment'),

      // FMS.2 - Safe environment
      obj('FMS.2.a', 'The facility is designed for patient safety.', 'Commitment'),
      obj('FMS.2.b', 'Safety hazards are identified and addressed.', 'Core'),
      obj('FMS.2.c', 'Security measures are in place.', 'Core'),
      obj('FMS.2.d', 'Access control is implemented.', 'Commitment'),
      obj('FMS.2.e', 'Signage and wayfinding are adequate.', 'Commitment'),

      // FMS.3 - Equipment management
      obj('FMS.3.a', 'Equipment inventory is maintained.', 'Commitment'),
      obj('FMS.3.b', 'Equipment is regularly inspected and maintained.', 'Core'),
      obj('FMS.3.c', 'Preventive maintenance schedules are followed.', 'Commitment'),
      obj('FMS.3.d', 'Staff is trained to operate equipment.', 'Core'),
      obj('FMS.3.e', 'Equipment malfunctions are reported and addressed.', 'Commitment'),

      // FMS.4 - Utilities
      obj('FMS.4.a', 'Safe drinking water is available.', 'Core'),
      obj('FMS.4.b', 'Water quality is tested regularly.', 'Commitment'),
      obj('FMS.4.c', 'Electricity supply is reliable with backup arrangements.', 'Core'),
      obj('FMS.4.d', 'Medical gases are safely stored and supplied.', 'Core'),
      obj('FMS.4.e', 'Vacuum systems are maintained.', 'Commitment'),

      // FMS.5 - Fire safety
      obj('FMS.5.a', 'A fire safety plan exists.', 'Core'),
      obj('FMS.5.b', 'Fire detection and suppression equipment is in place.', 'Core'),
      obj('FMS.5.c', 'Fire evacuation routes are marked and unobstructed.', 'Core'),
      obj('FMS.5.d', 'Fire drills are conducted regularly.', 'Core'),
      obj('FMS.5.e', 'Staff is trained in fire safety.', 'Core'),
      obj('FMS.5.f', 'Non-fire emergency plans exist.', 'Commitment'),

      // FMS.6 - Smoking policy
      obj('FMS.6.a', 'A no-smoking policy is in place.', 'Core'),
      obj('FMS.6.b', 'No-smoking signs are displayed.', 'Commitment'),
      obj('FMS.6.c', 'The policy is enforced.', 'Commitment'),

      // FMS.7 - Disaster management
      obj('FMS.7.a', 'A disaster management plan exists.', 'Commitment'),
      obj('FMS.7.b', 'Roles and responsibilities are defined.', 'Commitment'),
      obj('FMS.7.c', 'Mock drills are conducted.', 'Achievement'),
      obj('FMS.7.d', 'Coordination with external agencies exists.', 'Achievement'),

      // FMS.8 - Hazardous materials
      obj('FMS.8.a', 'Hazardous materials are identified.', 'Commitment'),
      obj('FMS.8.b', 'Material Safety Data Sheets (MSDS) are available.', 'Commitment'),
      obj('FMS.8.c', 'Hazardous materials are stored safely.', 'Core'),
      obj('FMS.8.d', 'Staff handling hazardous materials is trained.', 'Core'),
      obj('FMS.8.e', 'Spill management procedures are in place.', 'Commitment'),

      // FMS.9 - Security
      obj('FMS.9.a', 'Security personnel/systems are in place.', 'Commitment'),
      obj('FMS.9.b', 'Vulnerable areas are secured.', 'Core'),
      obj('FMS.9.c', 'Visitor management system exists.', 'Commitment'),
      obj('FMS.9.d', 'Vehicle parking is organized.', 'Commitment'),
    ],
  },

  // ============================================================================
  // HRM - Human Resource Management
  // ============================================================================
  {
    id: 'hrm',
    code: 'HRM',
    name: 'HRM',
    fullName: CHAPTER_NAMES.HRM,
    type: CHAPTER_TYPES.HRM,
    objectives: [
      // HRM.1 - HR planning
      obj('HRM.1.a', 'Staffing requirements are defined.', 'Commitment'),
      obj('HRM.1.b', 'Staffing patterns are based on patient care needs.', 'Commitment'),
      obj('HRM.1.c', 'Nurse-patient ratio is maintained.', 'Core'),

      // HRM.2 - Recruitment
      obj('HRM.2.a', 'Job descriptions exist for all positions.', 'Commitment'),
      obj('HRM.2.b', 'Recruitment process is documented.', 'Commitment'),
      obj('HRM.2.c', 'Credentials are verified before appointment.', 'Core'),
      obj('HRM.2.d', 'Background verification is done.', 'Commitment'),

      // HRM.3 - Induction
      obj('HRM.3.a', 'Induction training programme exists.', 'Commitment'),
      obj('HRM.3.b', 'New staff receive orientation to policies and procedures.', 'Commitment'),
      obj('HRM.3.c', 'Induction includes patient safety and infection control.', 'Core'),

      // HRM.4 - Training and development
      obj('HRM.4.a', 'Training needs are identified.', 'Commitment'),
      obj('HRM.4.b', 'Training programmes are conducted.', 'Commitment'),
      obj('HRM.4.c', 'Training records are maintained.', 'Commitment'),
      obj('HRM.4.d', 'Effectiveness of training is evaluated.', 'Achievement'),

      // HRM.5 - Job-specific training
      obj('HRM.5.a', 'Training is aligned with job requirements.', 'Commitment'),
      obj('HRM.5.b', 'Competency is assessed.', 'Commitment'),
      obj('HRM.5.c', 'Staff maintain required qualifications.', 'Commitment'),

      // HRM.6 - Safety and quality training
      obj('HRM.6.a', 'Staff are trained on patient safety.', 'Core'),
      obj('HRM.6.b', 'Staff are trained on infection control.', 'Core'),
      obj('HRM.6.c', 'Staff are trained on fire safety.', 'Core'),
      obj('HRM.6.d', 'Staff are trained on basic life support.', 'Core'),

      // HRM.7 - Performance appraisal
      obj('HRM.7.a', 'A performance appraisal system exists.', 'Commitment'),
      obj('HRM.7.b', 'Appraisals are conducted periodically.', 'Commitment'),
      obj('HRM.7.c', 'Feedback is provided to staff.', 'Achievement'),

      // HRM.8 - Disciplinary and grievance
      obj('HRM.8.a', 'Disciplinary process is documented.', 'Commitment'),
      obj('HRM.8.b', 'Grievance handling mechanism exists.', 'Commitment'),
      obj('HRM.8.c', 'Processes are implemented fairly.', 'Commitment'),

      // HRM.9 - Staff wellbeing
      obj('HRM.9.a', 'Staff health check-ups are conducted.', 'Commitment'),
      obj('HRM.9.b', 'Staff immunization is ensured.', 'Core'),
      obj('HRM.9.c', 'Staff safety is addressed.', 'Commitment'),
      obj('HRM.9.d', 'Post-exposure prophylaxis is available.', 'Core'),

      // HRM.10 - Personnel records
      obj('HRM.10.a', 'Personal files are maintained for all staff.', 'Commitment'),
      obj('HRM.10.b', 'Files contain relevant documents and credentials.', 'Commitment'),
      obj('HRM.10.c', 'Records are kept confidential.', 'Commitment'),

      // HRM.11 - Credentialing
      obj('HRM.11.a', 'Credentialing process is defined.', 'Commitment'),
      obj('HRM.11.b', 'Medical professionals are credentialed before practice.', 'Core'),
      obj('HRM.11.c', 'Privileges are granted based on qualifications and competence.', 'Core'),
      obj('HRM.11.d', 'Re-credentialing is done periodically.', 'Achievement'),
    ],
  },

  // ============================================================================
  // IMS - Information Management System
  // ============================================================================
  {
    id: 'ims',
    code: 'IMS',
    name: 'IMS',
    fullName: CHAPTER_NAMES.IMS,
    type: CHAPTER_TYPES.IMS,
    objectives: [
      // IMS.1 - Information management system
      obj('IMS.1.a', 'An information management system is in place.', 'Commitment'),
      obj('IMS.1.b', 'Information needs are identified.', 'Commitment'),
      obj('IMS.1.c', 'Information is available for decision making.', 'Commitment'),

      // IMS.2 - Medical records
      obj('IMS.2.a', 'A policy for medical records exists.', 'Commitment'),
      obj('IMS.2.b', 'Medical records contain all relevant clinical information.', 'Core'),
      obj('IMS.2.c', 'Entries are dated, timed and signed.', 'Core'),
      obj('IMS.2.d', 'Records are legible.', 'Core'),
      obj('IMS.2.e', 'Corrections in records are done appropriately.', 'Commitment'),

      // IMS.3 - Storage and retrieval
      obj('IMS.3.a', 'Records are stored securely.', 'Core'),
      obj('IMS.3.b', 'Retention period is defined and followed.', 'Commitment'),
      obj('IMS.3.c', 'Records are retrievable when needed.', 'Core'),
      obj('IMS.3.d', 'Access to records is controlled.', 'Core'),

      // IMS.4 - Protection
      obj('IMS.4.a', 'Records are protected from loss and damage.', 'Core'),
      obj('IMS.4.b', 'Confidentiality of records is maintained.', 'Core'),
      obj('IMS.4.c', 'Unauthorized access is prevented.', 'Core'),
      obj('IMS.4.d', 'Backup and recovery procedures exist for electronic records.', 'Commitment'),

      // IMS.5 - Reporting
      obj('IMS.5.a', 'Statutory reporting requirements are identified.', 'Commitment'),
      obj('IMS.5.b', 'Reports are submitted in a timely manner.', 'Commitment'),
      obj('IMS.5.c', 'Notifiable diseases are reported.', 'Core'),

      // IMS.6 - Data use
      obj('IMS.6.a', 'Data is analyzed for trends.', 'Commitment'),
      obj('IMS.6.b', 'Information is used for planning.', 'Achievement'),
      obj('IMS.6.c', 'Information supports quality improvement.', 'Achievement'),

      // IMS.7 - Abbreviations
      obj('IMS.7.a', 'A list of approved abbreviations exists.', 'Commitment'),
      obj('IMS.7.b', 'A list of prohibited abbreviations exists.', 'Commitment'),
      obj('IMS.7.c', 'Staff is aware of the abbreviation policy.', 'Commitment'),
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
