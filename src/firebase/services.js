// src/firebase/services.js
import { supabase } from './config';

// ── Generic CRUD ──────────────────────────────────────────────

export const getCollection = async (collectionName) => {
  const { data, error } = await supabase
    .from(collectionName)
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const addItem = async (collectionName, data) => {
  const now = new Date().toISOString();
  const { data: inserted, error } = await supabase
    .from(collectionName)
    .insert({ ...data, createdAt: now, updatedAt: now })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return inserted.id;
};

export const updateItem = async (collectionName, id, data) => {
  const { error } = await supabase
    .from(collectionName)
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
};

export const deleteItem = async (collectionName, id) => {
  const { error } = await supabase
    .from(collectionName)
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
};

// ── Profile (single row with fixed id = 'main') ───────────────

export const getProfile = async () => {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', 'main')
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // row not found
    throw new Error(error.message);
  }
  return data;
};

export const saveProfile = async (data) => {
  const { error } = await supabase
    .from('profile')
    .upsert({ ...data, id: 'main', updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
};

// ── File / Photo Upload ───────────────────────────────────────

export const uploadFile = async (file, path) => {
  const { error } = await supabase.storage
    .from('portfolio-media')
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(path);
  return data.publicUrl;
};

export const uploadPhoto = async (file, folder = 'photos') => {
  const path = `${folder}/${Date.now()}_${file.name}`;
  return await uploadFile(file, path);
};

export const deleteFile = async (url) => {
  try {
    const marker = '/portfolio-media/';
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    await supabase.storage.from('portfolio-media').remove([path]);
  } catch (e) {
    console.warn('File delete skipped:', e.message);
  }
};

// ── Seed initial data (runs only once) ───────────────────────

export const seedInitialData = async () => {
  const existing = await getProfile();
  if (existing) return;

  // ── Profile ──────────────────────────────────────────────────
  await saveProfile({
    name: "Dr. Venkata Naga Rani Bandaru",
    title: "Associate Professor in Information Technology",
    department: "Department of Information Technology",
    institution: "Vishnu Institute of Technology, Bhimavaram",
    location: "Vishnupur, Bhimavaram, Andhra Pradesh, India",
    email: "venkatanagarani.b@vishnu.edu.in",
    phone: "+91-8668165871 / +91-9952054318",
    linkedin: "www.linkedin.com/in/dr-venkata-naga-rani-bandaru-b3639321a/",
    googleScholar: "scholar.google.com/citations?user=N9pceegAAAAJ&hl=en",
    orcid: "0000-0002-0715-9220",
    researcherId: "PA-2013-0030",
    experience: "18+",
    phdScholars: "4",
    photoUrl: "",
    summary: "A committed academician and researcher with over 18 years of rich experience in teaching, research, and academic administration in the domain of Computer Science and Engineering. Demonstrates excellence in curriculum development, student mentoring, and institutional development through contributions to NBA, NAAC, and NIRF initiatives. Specializes in cutting-edge technologies including Artificial Intelligence, Cybersecurity, Blockchain, Cloud Computing, and Internet of Things (IoT). Holds a strong publication record with 16+ research papers, 2 patents, and active participation in national and international projects. Known for organizing FDPs, seminars, and scholarly events, and providing leadership in internal academic quality audits and academic planning initiatives. Also serves as an advisory board member driving strategic industry collaboration and creating exclusive internship opportunities for high-achieving students.",
    specializations: ["Artificial Intelligence", "Cybersecurity", "Blockchain", "Post-Quantum Cryptography", "Cloud Computing", "Internet of Things", "Machine Learning", "NLP"]
  });

  // ── Publications ─────────────────────────────────────────────
  const pubs = [
    // Journals
    { type: "Journal", year: 2024, title: "EEMS - Examining the Environment of the Job Metaverse Scheduling for Data Security", journal: "Cognitive Computing and Cyber Physical Systems. IC4S 2023. LNCS, vol 536. Springer, Cham.", doi: "https://doi.org/10.1007/978-3-031-48888-7_20", indexed: "Scopus", authors: "Bandaru V.N.R., Visalakshi P." },
    { type: "Journal", year: 2024, title: "Advanced Child Safety and Monitoring System", journal: "Int. J. of Scientific Engineering and Science, 8(2), 211-252", doi: "https://ijses.com/wp-content/uploads/2024/02/54-IJSES-V8N2.pdf", indexed: "IJSES", authors: "Bandaru V.N.R., Posina J.P., Ramarao V.K., Rahul Y., Tejaswi S., Durga Prasad U." },
    { type: "Journal", year: 2024, title: "Medizin: Revolutionizing Healthcare Management", journal: "IJSES, 8(1), 11-14", doi: "https://ijses.com/wp-content/uploads/2024/01/140-IJSES-V7N12.pdf", indexed: "IJSES", authors: "Kakarla N.V.R., Bandaru V.N.R., Muddurthi C.M., Nulu L.K., Bonam J.V.S." },
    { type: "Journal", year: 2024, title: "Plant Disease Detection and Classification with Deep Learning", journal: "IJSES, 8(2), 65-68", doi: "https://ijses.com/wp-content/uploads/2024/02/47-IJSES-V8N2.pdf", indexed: "IJSES", authors: "Bandaru V.N.R., Tejaswini A.S., Jaswanth A., Prasanth D., Vasavi M.M., Jhonathan P." },
    { type: "Journal", year: 2024, title: "Enhancing Privacy Measures in Healthcare within Cyber-Physical Systems through Cryptographic Solutions", journal: "EAI Endorsed Transactions on Scalable Information Systems, 11(6)", doi: "https://publications.eai.eu/index.php/sis/article/view/5732", indexed: "Scopus", authors: "Bandaru V.N.R., et al." },
    { type: "Journal", year: 2024, title: "Enhancing Data Security in IoT-enabled Smart Energy Systems via Lightweight Cryptographic Techniques", journal: "IOP Conf. Series: EES, 1375(1), 012003", doi: "https://doi.org/10.1088/1755-1315/1375/1/012003", indexed: "Scopus", authors: "Bandaru V.N.R., Kaligotla V.S.H.G., Varma U.D.S.P., Prasadaraju K., Sugumaran S." },
    { type: "Journal", year: 2022, title: "Blockchain Enabled Auditing with Multi-Key Homomorphic Encryption", journal: "Concurrency and Computation: Practice and Experience, 34(22), e7128", doi: "https://doi.org/10.1002/cpe.7128", indexed: "Scopus/WoS", authors: "Bandaru V.N.R., Visalakshi P." },
    { type: "Journal", year: 2022, title: "Security Algorithm Analysis and Implementation in an IoT Environment", journal: "NeuroQuantology, 20(9), 2731-2742", doi: "https://doi.org/10.14704/nq.2022.20.9.NQ44320", indexed: "Scopus", authors: "Rao B.K., Saranya A., Saibaba V., Mamatha P.G., Sahu D.N., Bandaru V.N.R." },
    { type: "Journal", year: 2021, title: "A Driving Decision Strategy (DDS) Using Genetic Algorithm for Autonomous Vehicle", journal: "IJRESM, 4(10), 189-192", doi: "https://journal.ijresm.com/index.php/ijresm/article/view/1480", indexed: "IJRESM", authors: "Bandaru V.N.R., Atchana V.G., Garrugu S.K., Mude S.K., Eemani V.R.J.S." },
    // Conferences
    { type: "Conference", year: 2023, title: "BDBC - Block-Chain Data Transmission Using Blowfish Security", journal: "IJISAE, 12(5s), 370-378", doi: "https://ijisae.org/index.php/IJISAE/article/view/3899", indexed: "Scopus", authors: "Bandaru V.N.R., Visalakshi P." },
    { type: "Conference", year: 2023, title: "BDCT - Blockchain-Based Decentralized Computing and Tamper Resistance for Cloud Storage", journal: "IEEE AGEC 2023", doi: "https://doi.org/10.1109/AGEC57922.2023.00025", indexed: "IEEE", authors: "Bandaru V.N.R., Visalakshi P." },
    { type: "Conference", year: 2023, title: "Solar Energy Prediction using ML with SVR Algorithm", journal: "IC4S 2022. LNCS, vol 472. Springer", doi: "https://doi.org/10.1007/978-3-031-28975-0_2", indexed: "Scopus", authors: "Kasireddy I., Padmini K., Ramarao R.V.D., Seshagiri B., Bandaru V.N.R." },
    { type: "Conference", year: 2020, title: "Device-Aware VOD Services using Bicubic Interpolation on Cloud", journal: "IEEE CICT 2020", doi: "https://doi.org/10.1109/CICT51604.2020.9312118", indexed: "IEEE", authors: "Bandaru V.N.R., Kiruthika S.U., Rajasekaran G., Lakshmanan M." },
    // Book Chapters
    { type: "Book Chapter", year: 2025, title: "AI/ML-Enhanced Inter-Satellite Optical Wireless and Fiber Communication for Intelligent 5G/6G Networks", journal: "Terahertz Technology in Microwave and Photonics for Effective Communications, CRC Press", doi: "", indexed: "Book Chapter", authors: "Bandaru V.N.R., Madugula S., Madhuri P.K., Sanapathi A., Kamaja R.R., Sanapathi V.A.D.P." },
    { type: "Book Chapter", year: 2024, title: "Encryption Techniques in Machine Learning: A Concise Overview", journal: "Machine Learning and Cryptographic Solutions for Data Protection, IGI Global", doi: "https://doi.org/10.4018/979-8-3693-4159-9.ch002", indexed: "Book Chapter", authors: "Bandaru V.N.R., et al." },
    { type: "Book Chapter", year: 2024, title: "Innovative Machine Learning Applications for Cryptography", journal: "IGI Global", doi: "https://doi.org/10.4018/979-8-3693-4159-9.ch002", indexed: "Book Chapter", authors: "Bandaru V.N.R., et al." },
    { type: "Book Chapter", year: 2022, title: "Internet of Things (IoT): Definitions, Components, Characteristics, and Applications", journal: "Current Overview on Science and Technology Research, BP International, ISBN 978-93-5547-987-7", doi: "", indexed: "Book Chapter", authors: "Dankan V.G., Bandaru V.N.R., Begum A.Y., Palanikkumar D., Jadhav A.C." },
  ];
  for (const p of pubs) await addItem('publications', p);

  // ── Patents ──────────────────────────────────────────────────
  const patents = [
    { number: "202221000262", year: 2022, title: "IoT-Based Omicron Testing Booth Enabled with Thermal Image Detection", description: "This invention provides a contactless and efficient COVID-19 testing booth equipped with thermal imaging sensors to detect Omicron symptoms in visitors before testing.", status: "Granted", url: "https://vishnu.edu.in/patents/202221000262.pdf" },
    { number: "202241030707", year: 2022, title: "IoT and Blockchain Enabled Verifiable Searchable Encryption with Aggregated Authorization using Machine Learning Techniques", description: "This patent proposes a novel hybrid framework integrating IoT and blockchain for secure, searchable data encryption. It enhances multi-user data access control using ML-based aggregated authorization.", status: "Granted", url: "https://vishnu.edu.in/patents/202241030707.pdf" },
  ];
  for (const p of patents) await addItem('patents', p);

  // ── Awards ───────────────────────────────────────────────────
  const awards = [
    { year: 2025, title: "Young Researcher of the Year 2025 Award", body: "London School of Digital Business (UK) – LEAP 2025 Awards", description: "Conferred in recognition of outstanding research excellence and global academic contributions. The event brought together distinguished scholars and leaders from over 70 countries.", category: "Research Excellence" },
    { year: 2025, title: "Best Paper Award – IC4S 2025", body: "6th EAI International Conference on Cognitive Computing and Cyber Physical Systems", description: "Certificate of Appreciation for the Best Paper in offline mode of presentation.", category: "Research" },
    { year: 2025, title: "ACM Certified Reviewer", body: "Association for Computing Machinery (ACM)", description: "Successfully completed ACM's Reviewer Training and Certification course. Recognized as an ACM Certified Reviewer, eligible to serve as a peer reviewer for ACM Journals, Magazines, SIGs, and Conferences.", category: "Professional" },
    { year: 2025, title: "Outreach Program Lead – Z.P. High School Plus, Rayakuduru", body: "Vishnu Institute of Technology", description: "Led a seven-member faculty team in delivering awareness sessions to students (8th–Inter+2) on topics like GenAI, Career Guidance, Digital Wellbeing, and Vedic Maths.", category: "Service" },
    { year: 2024, title: "Best Paper Award – IOP Conference Series", body: "IOP Conference Series: Earth and Environmental Science", description: "For paper titled 'Enhancing Data Security in IoT-Enabled Cloud Computing Environment through Lightweight Cryptographic Techniques'.", category: "Research" },
    { year: 2024, title: "Token of Appreciation – Genius Award", body: "Dr. Murali Krishna, Dean – Academic Planning, VIT", description: "Honored with a commemorative book for contributions to student research guidance.", category: "Teaching" },
    { year: 2023, title: "Masterclass Coordinator – Python Programming", body: "Pantech eLearning (National-level)", description: "Successfully coordinated a 21-day National-level Masterclass on Python Programming in collaboration with Pantech eLearning.", category: "Teaching" },
    { year: 2023, title: "Outstanding Reviewer Recognition", body: "IEEE-sponsored Conferences (ICCCIET 2018, EAI IC4S 2023)", description: "Received Best Reviewer award for valuable reviews at IEEE-sponsored international conferences: ICCCIET 2018 and EAI IC4S 2023.", category: "Service" },
    { year: 2023, title: "Google Cloud Internship Recognition", body: "Google / Infosys Springboard", description: "Awarded digital badge by Google for completing the Infosys Springboard Internship on Google Cloud Data Analytics.", category: "Professional" },
    { year: 2015, title: "GREAT TEACHER Award", body: "Gopal Ramalingam Memorial Engineering College", description: "Conferred in recognition of exceptional dedication and performance in teaching on Teacher's Day.", category: "Teaching" },
    { year: 2009, title: "Academic Excellence Recognition", body: "Sri Krishna Group of Engineering Colleges", description: "Felicitated for consistent academic performance and mentoring success (2005–2009).", category: "Academic" },
    { year: 2009, title: "First Prize Winner – Inter-College Sports Competitions", body: "District-level Inter-College Tournaments", description: "Secured first place in CoCo, Chess, and Badminton events across district-level inter-college tournaments.", category: "Sports" },
    { year: 2008, title: "Textbook Author – Fundamentals of Computer Programming", body: "CBA Publications, Chennai", description: "Authored and published the academic textbook titled 'Fundamentals of Computer Programming' through CBA Publications, Chennai.", category: "Academic" },
  ];
  for (const a of awards) await addItem('awards', a);

  // ── Projects (Research & Submitted Proposals) ────────────────
  const projects = [
    { title: "Development of Sustainable Rural Communities through AI and IoT Technologies", status: "Submitted", area: "AI, IoT", description: "Serving as Convenor of this proposed seminar, endorsed by Vishnu Institute of Technology (Autonomous). The ANRF grant-in-aid covers domestic travel for scientists, pre-conference printing, and contingency expenses. The Institute has committed full infrastructure support and financial management.", funding: "Anusandhan National Research Foundation (ANRF), New Delhi", collaborators: "Vishnu Institute of Technology (Autonomous), Bhimavaram" },
    { title: "Internet of Bodies (IoB) Based Secured Ecosystem for Personalized Remote Monitoring and Treatment Planning", status: "Submitted", area: "IoB, Edge AI, Blockchain", description: "Aims to build a secure IoB data architecture with Edge AI, blockchain-based protection, and federated learning for adaptive treatment planning. Duration: Jan–Dec 2026.", funding: "IIIT-H Data IHub Foundation (2026)", collaborators: "" },
    { title: "A Home-Based System for Early Detection of Maternal Health Complications in Postpartum Women", status: "Submitted", area: "AI, Healthcare, IoT", description: "Focused on developing a mobile app integrated with Bluetooth sensors and AI-based risk scoring for early detection, clinician triage, and ethical data handling. Duration: Jan–Dec 2026.", funding: "IIIT-H Data IHub Foundation (2026)", collaborators: "" },
    { title: "AI-Based Retrieval of Atmospheric Motion Winds", status: "Submitted", area: "AI, Remote Sensing, Climate", description: "Led a research initiative applying ML, AI, and ARIMA models to Atmospheric Motion Vectors (AMVs) from Indian satellites (ISRO GEO), enhancing wind prediction models for weather and climate studies.", funding: "ISRO (INR 28 Lakhs)", collaborators: "ISRO" },
    { title: "DST India-Singapore Joint Project – IoT Security", status: "Submitted", area: "IoT, Cybersecurity", description: "Research proposal submitted in collaboration with a Singapore team under the India-Singapore Call for Joint Project Proposals 2025.", funding: "DST India-Singapore (INR 1 Crore)", collaborators: "Singapore Research Team" },
    { title: "Intrusion Detection Systems in IoVT Using Hyperparameter Tuned Ensemble Classifiers", status: "Submitted", area: "IoT, AI, Cybersecurity", description: "Research paper submitted to NIT Warangal focusing on advanced intrusion detection systems for Internet of Vehicles and Things using hyperparameter-tuned ensemble classifiers.", funding: "NIT Warangal", collaborators: "" },
    { title: "Future-Ready Cyber-Physical Systems and Cyber Security with AI", status: "Submitted", area: "Cybersecurity, AI, CPS", description: "AICTE ATAL Academy FDP proposal on integrating AI with Cyber-Physical Systems security frameworks for future-ready institutions.", funding: "AICTE Training And Learning (ATAL) Academy", collaborators: "" },
    { title: "Quantum-Resistant Blockchain Framework for Healthcare", status: "In Progress", area: "Blockchain, Post-Quantum Cryptography", description: "Framework using Kyber/Falcon/Qiskit algorithms for quantum-resistant healthcare data security.", funding: "Self-funded Research", collaborators: "" },
    { title: "MindBridge-W – Explainable AI for Women's Mental Health", status: "Proposal Stage", area: "AI, IoT, Mental Health", description: "IGSTC WISER 2026 grant proposal. Integrating computer vision and IoT wearables for explainable AI in women's mental health monitoring.", funding: "IGSTC WISER 2026 (Applied)", collaborators: "Heidelberg University, Germany" },
  ];
  for (const p of projects) await addItem('projects', p);

  // ── Experience ───────────────────────────────────────────────
  const experience = [
    { role: "Associate Professor, Department of Information Technology", institution: "Vishnu Institute of Technology, Bhimavaram, Andhra Pradesh", period: "Feb 2021 – Present", description: "Teaching UG/PG courses in AI, IoT, Compiler Design, Python Programming, and Data Visualization. Coordinating student research projects and mentoring for internships. Contributing to NBA, NAAC, and NIRF accreditations. Organizing FDPs, workshops, and curriculum enrichment sessions. Spearheading outcome-based education and assessments initiatives.", isCurrent: true },
    { role: "Assistant Professor (Sr. Grade), Department of CSE", institution: "SRM Easwari Engineering College, Chennai", period: "June 2017 – Apr 2020", description: "Delivered advanced lectures and handled labs in Operating Systems and Software Project Management. Actively involved in project reviews, university exam evaluation, and student guidance. Developed research proposals and guided UG/PG scholars in IEEE publication projects.", isCurrent: false },
    { role: "Assistant Professor & HoD, Department of CSE", institution: "Gopal Ramalingam Memorial Engineering College, Chennai", period: "July 2012 – May 2017", description: "Led department-level initiatives, curriculum planning, and faculty development programs. Acted as NBA Coordinator and IQAC representative for academic audits and improvements. Supervised project submissions and managed student placements coordination. Received 'Great Teacher Award' for exceptional teaching performance.", isCurrent: false },
    { role: "Assistant Professor & HoD, Department of CSE", institution: "RRASE College of Engineering, Chennai", period: "June 2010 – June 2012", description: "Oversaw academic operations, research promotions, and quality assurance in the department. Led internal and external audit preparations for NAAC/NBA and ISO certifications.", isCurrent: false },
    { role: "Assistant Professor, Department of CSE", institution: "Sri Krishna Engineering College, Chennai", period: "June 2009 – June 2010", description: "Taught Programming in C, Data Structures, and Internet Technologies. Played a key role in deploying campus-wide intranet solutions.", isCurrent: false },
    { role: "Lecturer, Department of CSE", institution: "Sri Krishna Engineering College, Chennai", period: "June 2005 – June 2007", description: "Conducted labs and tutorials in Programming, OOPs, and UNIX Systems. Managed departmental student records and examination coordination.", isCurrent: false },
  ];
  for (const e of experience) await addItem('experience', e);

  // ── Education ────────────────────────────────────────────────
  const education = [
    { degree: "Ph.D. in Computer Science and Engineering", institution: "SRM University, Kattankulathur, Tamil Nadu", year: "Dec 2024", grade: "", description: "Focused on Blockchain-based OMKHE (Optimal Multi-Key Homomorphic Encryption), Cryptographic Techniques, and AI-driven Security and Privacy Models in Cyber-Physical Systems. Successfully defended and awarded the degree." },
    { degree: "M.E. in Computer Science and Engineering", institution: "Sri Krishna Engineering College, Tamil Nadu", year: "June 2009", grade: "76%", description: "Focus areas included Advanced Operating Systems, Compiler Design, and Distributed Computing." },
    { degree: "B.E. in Computer Science and Engineering", institution: "Sri Krishna Engineering College, Tamil Nadu", year: "June 2005", grade: "75%", description: "Graduated with 75% marks. Built strong foundational knowledge in C, Java, Operating Systems, and Computer Networks." },
  ];
  for (const e of education) await addItem('education', e);

  console.log('✅ Initial data seeded from cv_data.json!');
};
