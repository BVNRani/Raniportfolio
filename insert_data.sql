-- ============================================================
-- Dr. Rani Portfolio – Full Data Insert (Updated from CSV)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Clear existing data first
DELETE FROM publications;
DELETE FROM patents;
DELETE FROM awards;
DELETE FROM projects;
DELETE FROM experience;
DELETE FROM education;
DELETE FROM gallery;
DELETE FROM teaching;
DELETE FROM collaborations;
DELETE FROM "sessionChairs";
DELETE FROM profile;

-- ── PROFILE ──────────────────────────────────────────────────
INSERT INTO profile (id, name, title, department, institution, location, email, phone, linkedin, "googleScholar", orcid, "researcherId", "researchGate", "scopusId", "semanticScholar", "citations", "hIndex", experience, "phdScholars", "photoUrl", summary, specializations, updated_at)
VALUES (
  'main',
  'Dr. Venkata Naga Rani Bandaru',
  'Associate Professor in Information Technology',
  'Department of Information Technology',
  'Vishnu Institute of Technology, Bhimavaram',
  'Vishnupur, Bhimavaram, Andhra Pradesh, India',
  'venkatanagarani.b@vishnu.edu.in',
  '+91-8668165871 / +91-9952054318',
  'www.linkedin.com/in/dr-venkata-naga-rani-bandaru-b3639321a/',
  'scholar.google.com/citations?user=N9pceegAAAAJ&hl=en',
  '0000-0002-0715-9220',
  'PA-2013-0030',
  '',
  '',
  '',
  '',
  '',
  '18+',
  '4',
  '',
  'A committed academician and researcher with over 18 years of rich experience in teaching, research, and academic administration in the domain of Computer Science and Engineering. Demonstrates excellence in curriculum development, student mentoring, and institutional development through contributions to NBA, NAAC, and NIRF initiatives. Specializes in cutting-edge technologies including Artificial Intelligence, Cybersecurity, Blockchain, Cloud Computing, and Internet of Things (IoT). Holds a strong publication record with 16+ research papers, 2 patents, and active participation in national and international projects. Known for organizing FDPs, seminars, and scholarly events, and providing leadership in internal academic quality audits and academic planning initiatives. Also serves as an advisory board member driving strategic industry collaboration and creating exclusive internship opportunities for high-achieving students.',
  '["Artificial Intelligence","Cybersecurity","Blockchain","Post-Quantum Cryptography","Cloud Computing","Internet of Things","Machine Learning","NLP"]'::jsonb,
  now()
);

-- ── EDUCATION ────────────────────────────────────────────────
INSERT INTO education (degree, institution, year, grade, description, "createdAt", "updatedAt") VALUES
('Ph.D. in Computer Science and Engineering', 'SRM University, Kattankulathur, Tamil Nadu', 'Dec 2024', '', 'Focused on Blockchain-based OMKHE (Optimal Multi-Key Homomorphic Encryption), Cryptographic Techniques, and AI-driven Security and Privacy Models in Cyber-Physical Systems. Successfully defended and awarded the degree.', now(), now()),
('M.E. in Computer Science and Engineering', 'Sri Krishna Engineering College, Tamil Nadu', 'June 2009', '76%', 'Secured 76% marks. Focus areas included Advanced Operating Systems, Compiler Design, and Distributed Computing.', now(), now()),
('B.E. in Computer Science and Engineering', 'Sri Krishna Engineering College, Tamil Nadu', 'June 2005', '75%', 'Graduated with 75% marks. Built strong foundational knowledge in C, Java, Operating Systems, and Computer Networks.', now(), now());

-- ── EXPERIENCE ───────────────────────────────────────────────
INSERT INTO experience (role, institution, period, description, "isCurrent", "createdAt", "updatedAt") VALUES
('Associate Professor, Department of Information Technology', 'Vishnu Institute of Technology, Bhimavaram, Andhra Pradesh', 'Feb 2021 – Present', 'Teaching UG/PG courses in AI, IoT, Compiler Design, Python Programming, and Data Visualization. Coordinating student research projects and mentoring for internships. Contributing to NBA, NAAC, and NIRF accreditations. Organizing FDPs, workshops, and curriculum enrichment sessions. Spearheading outcome-based education and assessments initiatives.', true, now(), now()),
('Assistant Professor (Sr. Grade), Department of CSE', 'SRM Easwari Engineering College, Chennai', 'June 2017 – Apr 2020', 'Delivered advanced lectures and handled labs in Operating Systems and Software Project Management. Actively involved in project reviews, university exam evaluation, and student guidance. Developed research proposals and guided UG/PG scholars in IEEE publication projects.', false, now(), now()),
('Assistant Professor & HoD, Department of CSE', 'Gopal Ramalingam Memorial Engineering College, Chennai', 'July 2012 – May 2017', 'Led department-level initiatives, curriculum planning, and faculty development programs. Acted as NBA Coordinator and IQAC representative for academic audits and improvements. Supervised project submissions and managed student placements coordination. Received ''Great Teacher Award'' for exceptional teaching performance.', false, now(), now()),
('Assistant Professor & HoD, Department of CSE', 'RRASE College of Engineering, Chennai', 'June 2010 – June 2012', 'Oversaw academic operations, research promotions, and quality assurance in the department. Led internal and external audit preparations for NAAC/NBA and ISO certifications.', false, now(), now()),
('Assistant Professor, Department of CSE', 'Sri Krishna Engineering College, Chennai', 'June 2009 – June 2010', 'Taught Programming in C, Data Structures, and Internet Technologies. Played a key role in deploying campus-wide intranet solutions.', false, now(), now()),
('Lecturer, Department of CSE', 'Sri Krishna Engineering College, Chennai', 'June 2005 – June 2007', 'Conducted labs and tutorials in Programming, OOPs, and UNIX Systems. Managed departmental student records and examination coordination.', false, now(), now());

-- ── PUBLICATIONS ─────────────────────────────────────────────
-- Journals (9)
INSERT INTO publications (title, authors, journal, year, type, doi, indexed, "createdAt", "updatedAt") VALUES

-- ★ NEW (from CSV)
('Personalized AI-Driven Health Insights: A Feedback-Centric Approach to Contextual Health Recommendations', 'Bandaru V.N.R., Manaswini T.M., Teenu P., Vardhan J.M., Kumar M.V.P.', 'International Journal of Scientific Engineering and Science', 2025, 'Journal', '', 'IJSES', now(), now()),

('Plant Disease Detection and Classification with Deep Learning', 'Bandaru V.N.R., Tejaswini A.S., Jaswanth A., Prasanth D., Vasavi M.M., Jhonathan P.', 'International Journal of Scientific Engineering and Science, vol. 8, no. 2, pp. 65-68', 2024, 'Journal', 'https://ijses.com/wp-content/uploads/2024/02/47-IJSES-V8N2.pdf', 'IJSES', now(), now()),

('Advanced Child Safety and Monitoring System', 'Bandaru V.N.R., Posina J.P., Ramarao V.K., Rahul Y., Tejaswi S., Durga Prasad U.', 'International Journal of Scientific Engineering and Science, vol. 8, no. 2, pp. 211-252', 2024, 'Journal', 'https://ijses.com/wp-content/uploads/2024/02/54-IJSES-V8N2.pdf', 'IJSES', now(), now()),

('Medizin: Revolutionizing Healthcare Management with Integrated Appointment Scheduling, Medication Tracking, and Real-Time Patient Engagement', 'Kakarla N.V.R., Bandaru V.N.R., Muddurthi C.M., Nulu L.K., Bonam J.V.S.', 'International Journal of Scientific Engineering and Science, vol. 8, no. 1, pp. 11-14', 2024, 'Journal', 'https://ijses.com/wp-content/uploads/2024/01/140-IJSES-V7N12.pdf', 'IJSES', now(), now()),

('Enhancing Privacy Measures in Healthcare within Cyber-Physical Systems through Cryptographic Solutions', 'Rani Bandaru V.N., Sumalatha M., Rafee S.M., Prasadraju K., Sri Lakshmi M.', 'EAI Endorsed Transactions on Scalable Information Systems, 11(6)', 2024, 'Journal', 'https://publications.eai.eu/index.php/sis/article/view/5732', 'Scopus', now(), now()),

('BDBC - Block-Chain Data Transmission Using Blowfish Security with Optimization in Cloud Network', 'Bandaru V.N.R., Visalakshi P.', 'International Journal of Intelligent Systems and Applications in Engineering, 12(5s), 370-378', 2023, 'Journal', 'https://ijisae.org/index.php/IJISAE/article/view/3899', 'Scopus', now(), now()),

('Block Chain Enabled Auditing with Optimal Multi-Key Homomorphic Encryption Technique for Public Cloud Computing Environment', 'Bandaru V.N.R., Visalakshi P.', 'Concurrency and Computation: Practice and Experience, 34(22), e7128', 2022, 'Journal', 'https://doi.org/10.1002/cpe.7128', 'Scopus/WoS', now(), now()),

('Security Algorithm Analysis and Implementation in an IoT Environment', 'Rao B.K., Saranya A., Saibaba V., Mamatha P.G., Sahu D.N., Bandaru V.N.R.', 'NeuroQuantology, vol. 20, no. 9, pp. 2731-2742', 2022, 'Journal', 'https://doi.org/10.14704/nq.2022.20.9.NQ44320', 'Scopus', now(), now()),

('A Driving Decision Strategy (DDS) Using Genetic Algorithm for an Autonomous Vehicle', 'Bandaru V.N.R., Atchana V.G., Garrugu S.K., Mude S.K., Eemani V.R.J.S.', 'International Journal of Research in Engineering, Science and Management, vol. 4, no. 10, pp. 189-192', 2021, 'Journal', 'https://journal.ijresm.com/index.php/ijresm/article/view/1480', 'IJRESM', now(), now());

-- Conferences (6)
INSERT INTO publications (title, authors, journal, year, type, doi, indexed, "createdAt", "updatedAt") VALUES

-- ★ NEW (from CSV)
('Rainwater-Centric Civil Infrastructure: Enhancing Flood Prediction and Crop Protection', 'Bandaru V.N.R., Vardhan G.H., Alisha S.S., Fayaz P., Kumar K.S.S.', 'Future Power Network and Smart Energy Systems, Volume 2. FPNSES 2023. Lecture Notes in Electrical Engineering, vol 1402. Springer, Singapore', 2025, 'Conference', 'https://doi.org/10.1007/978-981-96-5115-3_28', 'Scopus', now(), now()),

('Enhancing Data Security Solutions for Smart Energy Systems in IoT-Enabled Cloud Computing Environments through Lightweight Cryptographic Techniques', 'Bandaru V.N.R., Kaligotla V.S.H.G., Varma U.D.S.P., Prasadaraju K., Sugumaran S.', 'IOP Conference Series: Earth and Environmental Science, vol. 1375, 012003', 2024, 'Conference', 'https://doi.org/10.1088/1755-1315/1375/1/012003', 'Scopus', now(), now()),

('EEMS - Examining the Environment of the Job Metaverse Scheduling for Data Security', 'Bandaru V.N.R., Visalakshi P.', 'Cognitive Computing and Cyber Physical Systems. IC4S 2023. LNCS, vol 536. Springer, Cham.', 2024, 'Conference', 'https://doi.org/10.1007/978-3-031-48888-7_20', 'Scopus', now(), now()),

('BDCT - Blockchain-Based Decentralized Computing and Tamper Resistance for Cloud Storage', 'Bandaru V.N.R., Visalakshi P.', '2023 International Conference on Advanced & Global Engineering Challenges (AGEC), pp. 71-77', 2023, 'Conference', 'https://doi.org/10.1109/AGEC57922.2023.00025', 'IEEE', now(), now()),

('Solar Energy Prediction using Machine Learning with Support Vector Regression Algorithm', 'Kasireddy I., Padmini K., Ramarao R.V.D., Seshagiri B., Bandaru V.N.R.', 'Cognitive Computing and Cyber Physical Systems. IC4S 2022. LNCS, vol 472. Springer, Cham.', 2023, 'Conference', 'https://doi.org/10.1007/978-3-031-28975-0_2', 'Scopus', now(), now()),

('Device Aware VOD Services with Bicubic Interpolation Algorithm on Cloud', 'Bandaru V.N.R., Kiruthika S.U., Rajasekaran G., Lakshmanan M.', '2020 IEEE 4th Conference on Information & Communication Technology (CICT), pp. 1-5', 2020, 'Conference', 'https://doi.org/10.1109/CICT51604.2020.9312118', 'IEEE', now(), now());

-- Book Chapters (3)
INSERT INTO publications (title, authors, journal, year, type, doi, indexed, "createdAt", "updatedAt") VALUES

('AI/ML-Enhanced Inter-Satellite Optical Wireless and Fiber Communication for Intelligent 5G/6G Networks', 'Bandaru V.N.R., Madugula S., Madhuri P.K., Sanapathi A., Kamaja R.R., Sanapathi V.A.D.P.', 'Terahertz Technology in Microwave and Photonics for Effective Communications, 1st ed., pp. 62-85. CRC Press', 2025, 'Book Chapter', 'https://doi.org/10.1201/9781003599111-4', 'Book Chapter', now(), now()),

('Innovative Machine Learning Applications for Cryptography: Encryption Techniques in Machine Learning – A Concise Overview', 'Bandaru V.N.R., Visalakshi P., Ponnuru L.N.P.K., Rafee S.M., Suresh Kumar G.', 'Machine Learning and Cryptographic Solutions for Data Protection and Network Security, IGI Global, pp. 12-28', 2024, 'Book Chapter', 'https://doi.org/10.4018/979-8-3693-4159-9.ch002', 'Book Chapter', now(), now()),

('Internet of Things (IoT): Definitions, Components, Characteristics and Applications', 'Gowda V.D., Bandaru V.N.R., Begum A.Y., Palanikkumar D., Jadhav A.C.', 'Current Overview on Science and Technology Research Vol. 8, BP International, pp. 68-79. ISBN 978-93-5547-987-7', 2022, 'Book Chapter', '', 'Book Chapter', now(), now());

-- ── PATENTS ──────────────────────────────────────────────────
INSERT INTO patents (number, year, title, description, status, url, "createdAt", "updatedAt") VALUES
('202221000262', 2022, 'IoT Based Omicron Testing Booth Enabled with Thermal Image Detection of Visitor', 'This invention provides a contactless and efficient COVID-19 testing booth equipped with thermal imaging sensors to detect Omicron symptoms in visitors before testing.', 'Granted', 'https://vishnu.edu.in/patents/202221000262.pdf', now(), now()),
('202241030707', 2022, 'IoT and Blockchain Enabled Verifiable Searchable Encryption with Aggregated Authorization using Machine Learning Techniques', 'This patent proposes a novel hybrid framework integrating IoT and blockchain for secure, searchable data encryption. It enhances multi-user data access control using ML-based aggregated authorization.', 'Granted', 'https://vishnu.edu.in/patents/202241030707.pdf', now(), now()),
-- ★ NEW (from CSV)
('202541126301', 2026, 'Machine-Learning Flood Prediction and Automated Rapid-Drainage System', 'An AI/ML-based system for predicting floods and automating rapid drainage infrastructure to mitigate flood damage in civil environments.', 'Published', '', now(), now()),
('202541126306', 2026, 'AI-Driven Expert Matching and Consultation Management Platform', 'An intelligent platform leveraging AI to match users with domain experts and manage consultation workflows efficiently.', 'Published', '', now(), now());

-- ── AWARDS ───────────────────────────────────────────────────
INSERT INTO awards (title, body, year, description, category, "photoUrl", "createdAt", "updatedAt") VALUES
('Young Researcher of the Year 2025 Award', 'London School of Digital Business (UK) – LEAP 2025 Awards', 2025, 'Conferred in recognition of outstanding research excellence and global academic contributions. The event brought together distinguished scholars and leaders from over 70 countries.', 'Research Excellence', '', now(), now()),
('Best Paper Award – IC4S 2025', '6th EAI International Conference on Cognitive Computing and Cyber Physical Systems', 2025, 'Certificate of Appreciation for the Best Paper in offline mode of presentation.', 'Research', '', now(), now()),
('ACM Certified Reviewer', 'Association for Computing Machinery (ACM)', 2025, 'Successfully completed ACM''s Reviewer Training and Certification course. Recognized as an ACM Certified Reviewer, eligible to serve as a peer reviewer for ACM Journals, Magazines, SIGs, and Conferences.', 'Professional', '', now(), now()),
('Outreach Program Lead – Z.P. High School Plus, Rayakuduru', 'Vishnu Institute of Technology', 2025, 'Led a seven-member faculty team in delivering awareness sessions to students (8th–Inter+2) on topics like GenAI, Career Guidance, Digital Wellbeing, and Vedic Maths.', 'Service', '', now(), now()),
('Best Paper Award – IOP Conference Series', 'IOP Conference Series: Earth and Environmental Science', 2024, 'For paper titled ''Enhancing Data Security in IoT-Enabled Cloud Computing Environment through Lightweight Cryptographic Techniques''.', 'Research', '', now(), now()),
('Token of Appreciation – Genius Award', 'Dr. Murali Krishna, Dean – Academic Planning, VIT', 2024, 'Honored with a commemorative book for contributions to student research guidance.', 'Teaching', '', now(), now()),
('Masterclass Coordinator – Python Programming', 'Pantech eLearning (National-level, 2023)', 2023, 'Successfully coordinated a 21-day National-level Masterclass on Python Programming in collaboration with Pantech eLearning.', 'Teaching', '', now(), now()),
('Outstanding Reviewer Recognition', 'IEEE-sponsored Conferences (ICCCIET 2018, EAI IC4S 2023)', 2023, 'Received Best Reviewer award for valuable reviews at IEEE-sponsored international conferences: ICCCIET 2018 and EAI IC4S 2023.', 'Service', '', now(), now()),
('Google Cloud Internship Recognition', 'Google / Infosys Springboard', 2023, 'Awarded digital badge by Google for completing the Infosys Springboard Internship on Google Cloud Data Analytics.', 'Professional', '', now(), now()),
('FinGenius – AI Financial Chatbot', 'Self-developed Project', 2023, 'Developed a user-friendly AI-powered chatbot using RAG (Retrieval-Augmented Generation) for financial learning, advisory, expert podcasts, and real-time news updates.', 'Research', '', now(), now()),
('GREAT TEACHER Award', 'Gopal Ramalingam Memorial Engineering College', 2015, 'Conferred in recognition of exceptional dedication and performance in teaching on Teacher''s Day.', 'Teaching', '', now(), now()),
('NSS Coordinator', 'Department NSS Cell', 2012, 'Served as the department NSS Coordinator, actively organizing student community engagement and development programs.', 'Service', '', now(), now()),
('Academic Excellence Recognition', 'Sri Krishna Group of Engineering Colleges', 2009, 'Felicitated for consistent academic performance and mentoring success (2005–2009).', 'Academic', '', now(), now()),
('First Prize – Inter-College Sports Competitions', 'District-level Inter-College Tournaments', 2009, 'Secured first place in CoCo, Chess, and Badminton events across district-level inter-college tournaments.', 'Sports', '', now(), now()),
('Textbook Author – Fundamentals of Computer Programming', 'CBA Publications, Chennai', 2008, 'Authored and published the academic textbook titled ''Fundamentals of Computer Programming'' through CBA Publications, Chennai.', 'Academic', '', now(), now());

-- ── PROJECTS ─────────────────────────────────────────────────
INSERT INTO projects (title, status, area, description, funding, collaborators, "createdAt", "updatedAt") VALUES
('Development of Sustainable Rural Communities through AI and IoT Technologies', 'Submitted', 'AI, IoT', 'Serving as Convenor of this proposed seminar, endorsed by Vishnu Institute of Technology (Autonomous). The ANRF grant-in-aid covers domestic travel for scientists, pre-conference printing, and contingency expenses. Endorsement date: 24/02/2026.', 'Anusandhan National Research Foundation (ANRF), New Delhi', 'Vishnu Institute of Technology (Autonomous), Bhimavaram', now(), now()),
('Internet of Bodies (IoB) Based Secured Ecosystem for Personalized Remote Monitoring and Treatment Planning', 'Submitted', 'IoB, Edge AI, Blockchain', 'Aims to build a secure IoB data architecture with Edge AI, blockchain-based protection, and federated learning for adaptive treatment planning. Duration: Jan–Dec 2026.', 'IIIT-H Data IHub Foundation (2026)', '', now(), now()),
('A Home-Based System for Early Detection of Maternal Health Complications in Postpartum Women', 'Submitted', 'AI, Healthcare, IoT', 'Focused on developing a mobile app integrated with Bluetooth sensors and AI-based risk scoring for early detection, clinician triage, and ethical data handling. Duration: Jan–Dec 2026.', 'IIIT-H Data IHub Foundation (2026)', '', now(), now()),
('AI-Based Retrieval of Atmospheric Motion Winds', 'Submitted', 'AI, Remote Sensing, Climate', 'Led a research initiative applying ML, AI, and ARIMA models to Atmospheric Motion Vectors (AMVs) from Indian satellites (ISRO GEO), enhancing wind prediction models for weather and climate studies.', 'ISRO (INR 28 Lakhs)', 'ISRO', now(), now()),
('DST India-Singapore Joint Project – IoT Security', 'Submitted', 'IoT, Cybersecurity', 'Research proposal submitted in collaboration with a Singapore team under the India-Singapore Call for Joint Project Proposals 2025.', 'DST India-Singapore (INR 1 Crore)', 'Singapore Research Team', now(), now()),
('Intrusion Detection Systems in IoVT Using Hyperparameter Tuned Ensemble Classifiers', 'Submitted', 'IoT, AI, Cybersecurity', 'Research paper submitted to NIT Warangal focusing on advanced intrusion detection systems for Internet of Vehicles and Things using hyperparameter-tuned ensemble classifiers.', 'NIT Warangal', '', now(), now()),
('Future-Ready Cyber-Physical Systems and Cyber Security with AI', 'Submitted', 'Cybersecurity, AI, CPS', 'AICTE ATAL Academy FDP proposal on integrating AI with Cyber-Physical Systems security frameworks for future-ready institutions.', 'AICTE Training And Learning (ATAL) Academy', '', now(), now()),
('Quantum-Resistant Blockchain Framework for Healthcare', 'In Progress', 'Blockchain, Post-Quantum Cryptography', 'Framework using Kyber/Falcon/Qiskit algorithms for quantum-resistant healthcare data security.', 'Self-funded Research', '', now(), now()),
('MindBridge-W – Explainable AI for Women''s Mental Health', 'Proposal Stage', 'AI, IoT, Mental Health', 'IGSTC WISER 2026 grant proposal. Integrating computer vision and IoT wearables for explainable AI in women''s mental health monitoring.', 'IGSTC WISER 2026 (Applied)', 'Heidelberg University, Germany', now(), now());

-- ── TEACHING ─────────────────────────────────────────────────
INSERT INTO teaching (course, code, level, semester, year, description, "createdAt", "updatedAt") VALUES
('Artificial Intelligence', 'IT6001', 'UG', 'Odd', '2024-25', 'Covers search algorithms, knowledge representation, expert systems, ML basics, and neural networks. Includes hands-on lab sessions using Python.', now(), now()),
('Internet of Things', 'IT6002', 'UG', 'Even', '2024-25', 'Covers IoT architecture, communication protocols (MQTT, CoAP), sensor integration, edge computing, and cloud connectivity with practical experiments.', now(), now()),
('Compiler Design', 'IT5003', 'UG', 'Odd', '2024-25', 'Topics include lexical analysis, parsing techniques (LL/LR), semantic analysis, intermediate code generation, and optimization strategies.', now(), now()),
('Python Programming', 'IT3001', 'UG', 'Even', '2023-24', 'Comprehensive Python course covering data types, OOP, file I/O, libraries (NumPy, Pandas, Matplotlib), and mini-project development.', now(), now()),
('Data Visualization', 'IT4001', 'UG', 'Odd', '2023-24', 'Techniques and tools for visualizing large datasets using Matplotlib, Seaborn, Plotly, and Tableau. Focus on storytelling with data.', now(), now()),
('Operating Systems', 'CS3002', 'UG', 'Even', '2022-23', 'Core OS concepts: process management, scheduling algorithms, memory management, file systems, and deadlock handling.', now(), now()),
('Software Project Management', 'IT7001', 'PG', 'Odd', '2024-25', 'Covers agile/scrum methodologies, project planning, risk management, cost estimation, quality assurance, and team leadership for software projects.', now(), now());

-- ── COLLABORATIONS ────────────────────────────────────────────
INSERT INTO collaborations (name, type, role, description, url, "createdAt", "updatedAt") VALUES
('CodeSizzler', 'industry', 'Industry Partner', 'Collaborated on AI and cloud-based software development and student internship projects.', 'https://codesizzler.in', now(), now()),
('BLUMIN', 'industry', 'Industry Partner', 'Industry-academia bridge partnership for technology education and innovation programs.', 'https://www.bluminiic.com', now(), now()),
('Trizen', 'industry', 'Industry Partner', 'Joint initiatives in technology ventures and industry-academia collaboration programs.', 'https://trizenventures.com', now(), now()),
('Squaredots Solutions', 'industry', 'Industry Partner', 'Collaborated on web development and software solution projects with student teams.', 'https://squaredotssolutions.com', now(), now()),
('Yubhian Technologies LLP', 'industry', 'Industry Partner', 'Partnership in AI, Blockchain, and custom software development with student skill-building programs.', 'https://www.yubhiantechnologies.in', now(), now()),
('Gauthami Electromech Technologies', 'industry', 'Industry Partner', 'Industry collaboration for hardware-software integration and interdisciplinary student projects.', '', now(), now()),
('Hari Anna', 'coordinator', 'Research Coordinator', 'Actively coordinates research activities, lab operations, and collaborative academic initiatives.', '', now(), now()),
('Raja Rajeswari', 'coordinator', 'Research Coordinator', 'Supports research coordination across interdisciplinary project teams and documentation.', '', now(), now()),
('SRM University', 'research', 'Research Collaboration', 'Long-standing academic collaboration in AI, Blockchain, and Cybersecurity research areas.', '', now(), now()),
('Easwari Engineering College', 'research', 'Research Collaboration', 'Collaborative research in operating systems, distributed computing, and AI applications.', '', now(), now()),
('Vel Tech University', 'research', 'Research Collaboration', 'Joint publication and research supervision across advanced computing domains.', '', now(), now()),
('Sri Krishna Engineering College', 'research', 'Research Collaboration', 'Foundational research collaborations in networking, IoT, and machine learning.', '', now(), now()),
('RRASE College of Engineering', 'research', 'Research Collaboration', 'Collaborative academic and quality assurance research initiatives.', '', now(), now());

-- ── SESSION CHAIRS ────────────────────────────────────────────
INSERT INTO "sessionChairs" (conference, year, location, topic, description, "createdAt", "updatedAt") VALUES
('EAI IC4S – Cognitive Computing and Cyber Physical Systems', 2023, 'Online/Hybrid', 'AI and Cybersecurity in Cyber-Physical Systems', 'Served as Session Chair for technical paper presentations at the 5th EAI International Conference on Cognitive Computing and Cyber Physical Systems (IC4S 2023).', now(), now()),
('IEEE AGEC – Advanced & Global Engineering Challenges', 2023, 'India', 'Blockchain and Cloud Security', 'Chaired a technical session on emerging challenges in Blockchain and Cloud Security at the IEEE-sponsored AGEC 2023 conference.', now(), now());

-- ── HACKATHON AWARDS ──────────────────────────────────────────
INSERT INTO awards (title, body, year, description, category, "photoUrl", "createdAt", "updatedAt") VALUES
('Smart India Hackathon – Internal Round Winner', 'Vishnu Institute of Technology – SIH Internal Hackathon', 2024, 'Mentored and guided the winning student team in the Smart India Hackathon internal selection round, securing a spot for the national-level competition.', 'Hackathon', '', now(), now()),
('Smart India Hackathon – National Level Winner', 'Government of India – Smart India Hackathon (SIH)', 2024, 'Mentored student team that achieved top placement at the national level Smart India Hackathon, demonstrating excellence in innovation and problem-solving for real-world challenges.', 'Hackathon', '', now(), now());

-- ── MARK FUNDED PROJECTS ─────────────────────────────────────
UPDATE projects SET funded = true WHERE title LIKE '%Sustainable Rural%';
UPDATE projects SET funded = true WHERE title LIKE '%Internet of Bodies%';
UPDATE projects SET funded = true WHERE title LIKE '%Maternal Health%';
UPDATE projects SET funded = true WHERE title LIKE '%Atmospheric Motion%';
UPDATE projects SET funded = true WHERE title LIKE '%India-Singapore%';
UPDATE projects SET funded = true WHERE title LIKE '%Cyber-Physical Systems%';
