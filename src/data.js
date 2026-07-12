// ============ WHIZ TUTORING — SITE DATA ============
const SITE = {
  name: 'Whiz Tutoring',
  domain: 'https://www.whiztutoring.co.za', // update when domain is live
  email: 'whiztutors@gmail.com',
  phone: '+27 21 000 0000',
  whatsapp: '27600000000', // digits only, for wa.me links
  areaServed: 'Cape Town, South Africa',
  rating: 4.9,
  reviewCount: 640,
  googleReviewUrl: 'https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review',
  googleMapsUrl: 'https://maps.google.com/?q=Whiz+Tutoring+Cape+Town'
};

const SUBJECT_PAGES = [
  { slug:'maths-tutor-cape-town', kw:'Maths Tutor Cape Town', subject:'Mathematics', icon:'➗',
    title:'Maths Tutors in Cape Town | Grades 4–12 & Matric',
    metaDesc:'Top-rated maths tutors in Cape Town from UCT & Stellenbosch. One-on-one lessons at your home or online. CAPS, IEB & Cambridge. Half-price trial lesson.',
    h1:'Maths Tutors in Cape Town', eyebrow:'Mathematics · Cape Town',
    lead:'One-on-one maths tutoring across Cape Town — Southern Suburbs, Atlantic Seaboard and Northern Suburbs — from top UCT and Stellenbosch students. At your home or online.',
    subhead:'Why Cape Town families choose Whiz for maths',
    points:['Tutors with 80%+ for matric maths and strong university results','In-person lessons at your home, or online with an interactive whiteboard','CAPS, IEB and Cambridge syllabi covered, Grades 4–12','Structured past-paper practice before every test and exam','Progress reports to parents after every lesson'],
    body:'Mathematics is the subject we get asked about most — and the one where the right tutor makes the biggest difference. Our Cape Town maths tutors are current students and graduates from UCT and Stellenbosch who earned distinctions in the exact syllabus your child is studying. Lessons rebuild fundamentals first (the Grade 9–10 gaps that quietly cost matric marks), then layer on exam technique with timed past-paper practice. Whether your child is in Claremont, Durbanville or learning online from anywhere in South Africa, we match tutor personality to student — because a learner who likes their tutor does the homework.'},
  { slug:'physics-tutor-cape-town', kw:'Physics Tutor Cape Town', subject:'Physical Sciences', icon:'⚗️',
    title:'Physics Tutors in Cape Town | Physical Sciences Gr 10–12',
    metaDesc:'Physical Sciences tutors in Cape Town from UCT engineering & science faculties. Physics & chemistry, CAPS/IEB/IGCSE. Home or online lessons. Book a trial.',
    h1:'Physics Tutors in Cape Town', eyebrow:'Physical Sciences · Cape Town',
    lead:'Physical Sciences tutoring from UCT engineering and science students who make physics and chemistry finally click. At your home or online.',
    subhead:'Physical Sciences help that actually works',
    points:['Tutors from UCT and Stellenbosch science & engineering faculties','Concept-first teaching — understand it, don\u2019t just memorise it','Exam technique for Paper 1 (physics) and Paper 2 (chemistry)','Grade 10–12 CAPS and IEB, plus IGCSE and A-Level','Half-price trial lesson to test the fit'],
    body:'Physical Sciences has the widest gap between "knowing the theory" and "scoring the marks". Our Cape Town physics tutors — mostly engineering and science students who recently wrote these exact papers — teach concept-first: free-body diagrams you can actually draw, stoichiometry as a method rather than magic, and electricity that finally makes sense. Then we drill the mark scheme, because examiners reward specific phrasing and working. Available across the Southern Suburbs, City Bowl and Northern Suburbs in person, and everywhere online.'},
  { slug:'english-tutor-cape-town', kw:'English Tutor Cape Town', subject:'English', icon:'📖',
    title:'English Tutors in Cape Town | Home Language & FAL',
    metaDesc:'English tutors in Cape Town for comprehension, essays, literature & language. Home Language and FAL, Grades 4–12. In-person or online. Trial lesson 50% off.',
    h1:'English Tutors in Cape Town', eyebrow:'English · Cape Town',
    lead:'Comprehension, creative writing, literature and language structures — taught by tutors who love the subject and know how markers think.',
    subhead:'From "I don\u2019t know what to write" to confident essays',
    points:['Home Language and First Additional Language, Grades 4–12','Essay structure and paragraph craft that markers reward','Poetry and setwork analysis (all current prescribed texts)','Comprehension and language drills with real exam extracts','Matric prelim and finals preparation blocks'],
    body:'English marks are won on method, not luck. Our Cape Town English tutors teach the frameworks — how to plan an essay in five minutes, how to quote and analyse rather than retell, how to attack a comprehension passage systematically. For younger learners we build reading confidence and writing fluency; for matrics we focus ruthlessly on the paper. Tutors are senior humanities students and graduates from UCT with excellent academic writing records.'},
  { slug:'accounting-tutor-cape-town', kw:'Accounting Tutor Cape Town', subject:'Accounting', icon:'📊',
    title:'Accounting Tutors in Cape Town | Gr 8–12 & Matric',
    metaDesc:'Accounting tutors in Cape Town on the CA(SA) academic path. Journals to cash-flow statements, CAPS & IEB. Home or online lessons. Book a half-price trial.',
    h1:'Accounting Tutors in Cape Town', eyebrow:'Accounting · Cape Town',
    lead:'Accounting tutoring from BCom and CA-stream students at UCT and Stellenbosch. From general ledger basics to matric distinctions.',
    subhead:'From confused to confident in accounting',
    points:['Tutors on the CA(SA) academic path who love the subject','Step-by-step method for journals, ledgers and statements','Companies, cash-flow and analysis fully covered for matric','IEB and CAPS past-paper drills with marking feedback','Weekly progress updates to parents'],
    body:'Accounting punishes gaps: miss the logic of debits and credits in Grade 8 and everything after wobbles. Our tutors — accounting science students headed for CA(SA) — rebuild the foundation fast, then work systematically through the formats examiners expect: from the general journal to company financial statements, cash-flow and interpretation. Lessons follow your school\u2019s pace, with extra past-paper sessions before every cycle test.'},
  { slug:'online-tutor-south-africa', kw:'Online Tutor South Africa', subject:'All subjects', icon:'💻',
    title:'Online Tutors South Africa | Live 1-on-1 Lessons',
    metaDesc:'Live one-on-one online tutoring across South Africa & Zambia. Interactive whiteboard, screened tutors from top SA universities, every subject Gr 4–university.',
    h1:'Online Tutors — South Africa & Beyond', eyebrow:'Online tutoring · Nationwide',
    lead:'Live one-on-one online lessons with SA\u2019s best university tutors — from anywhere in South Africa or Zambia. Interactive whiteboard, recorded on request.',
    subhead:'Online tutoring done properly',
    points:['Access the full national pool of 300+ screened tutors','Interactive digital whiteboard — not just a video call','Lesson recordings available for revision','Same tutor, same slot every week for consistency','Works on laptop or tablet; low-data mode available'],
    body:'Online tutoring removes the biggest constraint in education: geography. A learner in Mthatha, Polokwane or Lusaka gets the same distinction-level UCT tutor as a family in Claremont. Our online lessons run on an interactive whiteboard where tutor and student write, draw and solve together — far more effective than a webcam pointed at paper. Every subject, every grade, and exam-season intensives that don\u2019t depend on traffic or load-shedding schedules.'},
  { slug:'private-tutor-cape-town', kw:'Private Tutor Cape Town', subject:'All subjects', icon:'🎓',
    title:'Private Tutors in Cape Town | Screened University Tutors',
    metaDesc:'Private tutors in Cape Town for every subject, Grades 4–12 & university. Carefully screened UCT & Stellenbosch tutors. Home visits or online. Trial 50% off.',
    h1:'Private Tutors in Cape Town', eyebrow:'Private tutoring · Cape Town',
    lead:'Carefully screened private tutors for every subject and grade — matched to your child, at your home across Cape Town or online.',
    subhead:'What "carefully screened" actually means',
    points:['Fewer than 1 in 8 tutor applicants pass our vetting','Written subject test + live teaching demo + interview','Background checks before any home placement','Matched on teaching style and personality, not just marks','Free rematch if the first tutor isn\u2019t the right fit'],
    body:'Anyone can call themselves a private tutor. Whiz tutors have to prove it: a written test in their subject, a live teaching demonstration, an interview, and a background check before they ever enter a family\u2019s home. We serve the whole metro — Southern Suburbs, Atlantic Seaboard, City Bowl, Northern Suburbs and the Helderberg — with in-person home tutoring, plus online lessons everywhere. One coordinator handles your family from first enquiry to final exam.'},
  { slug:'igcse-tutor-cape-town', kw:'IGCSE Tutor Cape Town', subject:'Cambridge IGCSE', icon:'🌍',
    title:'IGCSE Tutors in Cape Town | Cambridge Specialists',
    metaDesc:'Cambridge IGCSE tutors in Cape Town & online. Maths, Sciences, English & Business aligned to Cambridge mark schemes. Core & Extended. Book a trial lesson.',
    h1:'IGCSE Tutors in Cape Town', eyebrow:'Cambridge IGCSE',
    lead:'Specialist Cambridge IGCSE tutoring for students in Cape Town, across South Africa and in Zambia — aligned to Cambridge assessment objectives.',
    subhead:'Cambridge specialists, not generalists',
    points:['Tutors experienced with Cambridge syllabi and mark schemes','Extended and Core papers both supported','Structured revision plans for May/June and Oct/Nov sittings','Popular with homeschooling families — fully online available','Predicted-grade improvement tracking'],
    body:'Cambridge IGCSE is a different game from CAPS: different command words, different mark schemes, different exam rhythm. Our IGCSE tutors know the difference between "state", "explain" and "evaluate" — and teach students to answer accordingly. We support the full IGCSE suite with structured revision timetables built backwards from your exam sitting, past papers by topic, and honest predicted-grade tracking so there are no surprises in results week.'},
  { slug:'cambridge-tutor-cape-town', kw:'Cambridge Tutor Cape Town', subject:'Cambridge / A-Level', icon:'🏛️',
    title:'Cambridge Tutors Cape Town | IGCSE, AS & A-Level',
    metaDesc:'Cambridge curriculum tutors in Cape Town: IGCSE, AS & A-Level. Maths, Sciences, Economics & English. Experienced with international mark schemes.',
    h1:'Cambridge Curriculum Tutors in Cape Town', eyebrow:'Cambridge · IGCSE to A-Level',
    lead:'From IGCSE through AS and A-Level — tutors who know the Cambridge system inside out, for school students and homeschoolers alike.',
    subhead:'Support for the full Cambridge journey',
    points:['IGCSE, AS and A2 syllabi and past papers fully covered','Tutors who took Cambridge or equivalent top-tier exams','University application support (SA and international)','Exam-board-specific technique and timing practice','Online across SA and Zambia, in person in Cape Town'],
    body:'Cape Town has one of the largest Cambridge-curriculum communities in the country — international schools, homeschool co-ops and independent candidates. Whiz supports all of them with tutors who understand Cambridge\u2019s spiral syllabus, its command words and its unforgiving timing. We plan around your exam session, drill genuine past papers under time pressure, and for A-Level students, help align subject choices with university entrance requirements at home and abroad.'},
  { slug:'matric-tutor-cape-town', kw:'Matric Tutor Cape Town', subject:'Matric (Grade 12)', icon:'🎯',
    title:'Matric Tutors in Cape Town | NSC & IEB Grade 12',
    metaDesc:'Matric tutors in Cape Town for every NSC & IEB subject. Structured year plan, marked mock papers, prelim & finals intensives. Senior specialist tutors.',
    h1:'Matric Tutors in Cape Town', eyebrow:'Grade 12 · NSC & IEB',
    lead:'Matric is a marathon with a sprint finish. Our senior tutors build a structured plan from term 1 to finals — for every NSC and IEB subject.',
    subhead:'A plan for the year that matters most',
    points:['Senior specialist tutors for Grade 11–12 only','Structured syllabus coverage mapped to the exam timetable','Marked mock papers with detailed feedback','Prelim and finals intensive blocks available','University application and APS guidance included'],
    body:'The matric year rewards planning over panic. Our matric tutors — the most senior in our pool — map the syllabus against the actual exam timetable, so revision starts early in the subjects written first. Every student writes marked mock papers under timed conditions, gets specific feedback on where marks leaked, and re-drills those exact question types. We also help with the admin that matters: APS calculations, university applications and NBT preparation.'},
  { slug:'grade-12-maths-tutor-cape-town', kw:'Grade 12 Maths Tutor Cape Town', subject:'Mathematics · Matric', icon:'📐',
    title:'Grade 12 Maths Tutors Cape Town | Paper 1 & 2 Specialists',
    metaDesc:'Specialist Grade 12 maths tutors in Cape Town. Paper 1 & Paper 2, NSC & IEB. Distinction-level tutors, timed past-paper practice, prelim rescue options.',
    h1:'Grade 12 Maths Tutors in Cape Town', eyebrow:'Mathematics · Matric',
    lead:'Specialist Grade 12 maths tutoring — Paper 1 and Paper 2, NSC and IEB — from tutors who earned distinctions and know exactly what the markers want.',
    subhead:'Turn maths from a risk into your APS booster',
    points:['Distinction-level tutors specialising in matric maths','Full Paper 1 (algebra, functions, calculus) and Paper 2 (trig, geometry, stats) coverage','Weekly past-paper practice under timed conditions','Targeted revision of Grade 11 gaps that cost matric marks','Prelim rescue and finals intensive options'],
    body:'Grade 12 maths is the highest-leverage subject on a university application — and the most coachable. Most matric marks are lost not on Grade 12 work but on Grade 11 gaps: functions, trig identities, Euclidean geometry. Our specialists diagnose those gaps in the first lesson, patch them fast, then run weekly timed paper practice so that by prelims, the exam format holds no surprises. Available across Cape Town in person and nationwide online.'},
  { slug:'engineering-tutor-cape-town', kw:'Engineering Tutor Cape Town', subject:'Engineering', icon:'⚙️',
    title:'Engineering Tutors Cape Town | First-Year University Support',
    metaDesc:'Engineering tutors in Cape Town for UCT & Stellenbosch first-years: statics, dynamics, thermodynamics, electrotechnics & engineering maths. Online too.',
    h1:'Engineering Tutors in Cape Town', eyebrow:'Engineering · University',
    lead:'First and second-year engineering support from senior students and graduates — statics, dynamics, thermodynamics, electrotechnics and engineering mathematics.',
    subhead:'Get through the killer first-year modules',
    points:['Tutors who recently aced the exact modules you\u2019re taking','UCT, Stellenbosch, Wits, UP and UJ curricula covered','Tutorial and past-exam walkthroughs, not just theory','Crisis sessions available before tests and exams','Online nationwide, in person on major campuses'],
    body:'First-year engineering has a brutal attrition rate, and it\u2019s rarely about intelligence — it\u2019s about pace. Our engineering tutors are senior students and recent graduates who took the same modules at the same universities, often with the same lecturers. Sessions work through your actual tutorial sets and past exams, module by module: statics free-body discipline, calculus fluency, thermo sign conventions. Book weekly support or a crisis block before a test.'}
];

const SUBURBS = [
  { slug:'claremont', name:'Claremont', region:'Southern Suburbs', schools:['Herschel Girls\u2019 School','Western Province Preparatory','Claremont High School','Livingstone High'], blurb:'Claremont sits at the heart of Cape Town\u2019s education belt, minutes from UCT — which means an unusually deep pool of tutors who live and study nearby. Home tutoring is available throughout Claremont, Harfield Village and Kenilworth borders, typically in the afternoons and early evenings.' },
  { slug:'rondebosch', name:'Rondebosch', region:'Southern Suburbs', schools:['Rondebosch Boys\u2019 High','Rustenburg Girls\u2019 High','Micklefield School','Rondebosch Boys\u2019 Prep'], blurb:'With UCT on its doorstep, Rondebosch families enjoy the fastest tutor matching in our network — many of our best tutors can walk to lessons. We work extensively with Rondebosch Boys\u2019 and Rustenburg students on maths, sciences and accounting.' },
  { slug:'newlands', name:'Newlands', region:'Southern Suburbs', schools:['SACS','Westerford High School','Groote Schuur High'], blurb:'Newlands families — including many SACS and Westerford households — use Whiz for subject tutoring and matric preparation. Tutors reach Newlands easily from UCT residences, and evening home lessons are popular during winter terms.' },
  { slug:'observatory', name:'Observatory', region:'Southern Suburbs', schools:['Observatory Junior School','St Joseph\u2019s College (Rondebosch nearby)'], blurb:'Obs is student country, and our tutor density here is the highest in the city. In-person lessons can usually be arranged within days, and online lessons suit the many families balancing busy schedules along the Main Road corridor.' },
  { slug:'mowbray', name:'Mowbray', region:'Southern Suburbs', schools:['St George\u2019s Grammar School','Rosebank Junior'], blurb:'A short hop from UCT, Mowbray is well covered for both home and online tutoring. We support learners at St George\u2019s Grammar and surrounding schools across maths, English and the sciences.' },
  { slug:'pinelands', name:'Pinelands', region:'Southern Suburbs', schools:['Pinelands High School','Cannons Creek Independent','Pinehurst Primary'], blurb:'Pinelands families favour consistent weekly home lessons, and our tutors serve the whole garden-city grid. Pinelands High and Cannons Creek learners make up a growing share of our maths and physical sciences students.' },
  { slug:'constantia', name:'Constantia', region:'Southern Suburbs', schools:['Reddam House Constantia','American International School','Constantia Waldorf'], blurb:'Constantia has strong demand for Cambridge and IB tutoring alongside CAPS/IEB. Our tutors travel to homes across Constantia and Tokai; online lessons are popular with Reddam and AISCT families on international curricula.' },
  { slug:'camps-bay', name:'Camps Bay', region:'Atlantic Seaboard', schools:['Camps Bay High School','Camps Bay Preparatory'], blurb:'We serve Camps Bay and the Atlantic Seaboard with in-person tutoring (afternoon slots book fastest) and online lessons that skip Kloof Nek traffic entirely. Camps Bay High learners work with us across maths, sciences and English.' },
  { slug:'sea-point', name:'Sea Point', region:'Atlantic Seaboard', schools:['Sea Point High School','Herzlia (Highlands nearby)','St Paul\u2019s Primary'], blurb:'Sea Point\u2019s apartment-living families often prefer online lessons, though home tutoring is fully available along the Beach Road–Main Road corridor. Strong demand for maths, Hebrew-stream school support and matric intensives.' },
  { slug:'durbanville', name:'Durbanville', region:'Northern Suburbs', schools:['Durbanville High School','Fairmont High','Curro Durbanville','Stellenberg High (nearby)'], blurb:'Our Northern Suburbs team covers Durbanville, Sonstraal Heights and Vygeboom with Afrikaans- and English-medium support. Stellenbosch-based tutors handle many in-person placements here; online covers the rest.' },
  { slug:'bellville', name:'Bellville', region:'Northern Suburbs', schools:['Bellville High School','DF Malan High','Settlers High','Stellenbosch University Tygerberg campus nearby'], blurb:'Bellville families — including many with learners at DF Malan and Settlers — use Whiz for maths, physical sciences and accounting. Dual-medium tutoring available; the Tygerberg campus gives us a strong local tutor base.' },
  { slug:'somerset-west', name:'Somerset West', region:'Helderberg', schools:['Somerset College','Parel Vallei High','Hottentots-Holland High','Curro Sitari'], blurb:'Somerset West and the Helderberg basin are served by Stellenbosch University tutors, with home lessons across Somerset West, Strand and Gordon\u2019s Bay. Somerset College\u2019s IEB stream and Parel Vallei\u2019s dual-medium classes are both well supported.' }
];

const POSTS = [
  { slug:'how-to-choose-a-maths-tutor-cape-town', cat:'For parents', icon:'🧭', g:'linear-gradient(135deg,#0B5FFF,#2E7BFF)',
    title:'How to Choose a Maths Tutor in Cape Town', kw:'how to choose a maths tutor Cape Town',
    metaDesc:'A parent\u2019s guide to choosing a maths tutor in Cape Town: qualifications to check, questions to ask, red flags, and what a fair hourly rate looks like in 2026.',
    date:'2026-06-14', read:'8 min read',
    excerpt:'Qualifications to check, questions to ask, red flags to avoid — and what a fair hourly rate looks like in 2026.',
    body:`<p>Cape Town has hundreds of people advertising maths tutoring — university students, retired teachers, agencies, and everything in between. Quality varies wildly. Here\u2019s how to choose well.</p>
<h2>Start with subject mastery, then teaching ability</h2>
<p>A tutor needs two separate skills: knowing the maths, and being able to explain it. Ask what the tutor scored for matric maths (80%+ is a reasonable bar) and what they\u2019re studying now. Then ask them to explain one concept your child struggles with — you\u2019ll know within two minutes whether they can teach.</p>
<h2>Ask these five questions</h2>
<p>1. Which syllabus do you know best — CAPS, IEB or Cambridge? They differ more than people think. 2. How do you handle a student who\u2019s lost confidence, not just marks? 3. Will you set and check homework between lessons? 4. How do you report progress to parents? 5. What happens if the fit isn\u2019t right?</p>
<h2>Red flags</h2>
<p>Be cautious of tutors who promise specific mark improvements, can\u2019t name the current Grade 12 syllabus topics, resist any form of progress reporting, or teach straight from a textbook without past papers. And for home tutoring, always confirm background checks have been done.</p>
<h2>What tutoring costs in Cape Town</h2>
<p>In 2026, expect roughly R250–R400 per hour for a vetted university-student tutor, and more for scarce specialists (AP Maths, A-Level Further Maths). Cheaper usually means unvetted; dramatically more expensive rarely means proportionally better.</p>
<h2>The trial lesson test</h2>
<p>A good first lesson diagnoses before it teaches: the tutor should find the real gaps (often two grades back) rather than launching into this week\u2019s homework. If your child comes out saying "that actually made sense" — you\u2019ve found your tutor.</p>` },
  { slug:'top-study-tips-for-matric-students', cat:'Exam prep', icon:'🎯', g:'linear-gradient(135deg,#00BFA6,#34D8C0)',
    title:'Top Study Tips for Matric Students', kw:'study tips for matric students',
    metaDesc:'Ten evidence-based study tips for matric students: spaced repetition, past-paper strategy, timetabling around the NSC exam schedule, and avoiding burnout.',
    date:'2026-05-28', read:'7 min read',
    excerpt:'Ten evidence-based techniques that separate students who improve in matric from students who just get busier.',
    body:`<p>Matric rewards students who study <em>smart</em> under time pressure. These are the techniques our top tutors drill into every Grade 12 student.</p>
<h2>1–3: Structure the year</h2>
<p>Build your revision timetable backwards from the actual exam timetable — subjects written first get revised first. Work in weekly cycles with one full rest day. And start past papers in term two, not September: papers are a diagnostic tool, not a final rehearsal.</p>
<h2>4–6: Study actively</h2>
<p>Reading notes feels productive and isn\u2019t. Test yourself instead: cover the page and recall, redo problems from scratch, explain concepts aloud as if teaching. Use spaced repetition — revisiting material after 1 day, 3 days, a week — which beats cramming by a wide margin in every study that\u2019s measured it.</p>
<h2>7–8: Master the paper, not just the content</h2>
<p>Every subject has a mark-scheme dialect. Learn the command words ("evaluate" ≠ "describe"), practise under strict time limits, and after each past paper, sort lost marks into three buckets: didn\u2019t know, knew but couldn\u2019t apply, careless. Each bucket needs a different fix.</p>
<h2>9–10: Protect the machine</h2>
<p>Sleep is study: memory consolidates overnight, and all-nighters demonstrably lower next-day recall. Finally, get help early — a term of weekly tutoring in your weakest subject moves an average of 18 percentage points. Waiting until prelims halves that.</p>` },
  { slug:'preparing-for-ieb-exams', cat:'Exam prep', icon:'📝', g:'linear-gradient(135deg,#6C4CF1,#9B7DFF)',
    title:'Preparing for IEB Exams: What Makes Them Different', kw:'preparing for IEB exams',
    metaDesc:'How IEB exams differ from NSC/CAPS and how to prepare: higher-order questions, unseen application, subject-specific strategy and a term-by-term plan.',
    date:'2026-05-12', read:'7 min read',
    excerpt:'IEB papers test application over recall. Here\u2019s how the exams differ from CAPS and how to prepare for each phase of the year.',
    body:`<p>IEB and NSC matrics earn the same certificate, but the papers feel different. IEB assessments lean harder on unseen application — using what you know in contexts you haven\u2019t rehearsed.</p>
<h2>What actually differs</h2>
<p>Expect more multi-step problems in maths, more open-ended analysis in English and history, and science questions that combine topics across the syllabus. Rote memorisation buys you the first 50%; the distinction band is earned on transfer and reasoning.</p>
<h2>Term-by-term preparation</h2>
<p><strong>Terms 1–2:</strong> close every content gap while the pace is manageable, and build the habit of attempting unfamiliar problems without panic. <strong>Term 3:</strong> prelims are the full dress rehearsal — treat the weeks before them as seriously as finals, then mine the marked papers for patterns in lost marks. <strong>Term 4:</strong> timed past papers, alternating subjects, with targeted re-drilling of weak question types.</p>
<h2>Use the IEB\u2019s own materials</h2>
<p>The IEB publishes past papers and assessment matrices; your school\u2019s prelim papers (and other IEB schools\u2019 prelims, which circulate widely) are the closest proxy for the real thing. A tutor who knows the IEB dialect — command words, mark allocation logic — is worth their hour many times over in this system.</p>` },
  { slug:'igcse-mathematics-revision-guide', cat:'Guides', icon:'📘', g:'linear-gradient(135deg,#FFB000,#FFC94D)',
    title:'IGCSE Mathematics Revision Guide', kw:'IGCSE mathematics revision guide',
    metaDesc:'A structured IGCSE maths revision guide: Core vs Extended strategy, topic priority list, past-paper method and an 8-week plan for the next Cambridge sitting.',
    date:'2026-04-22', read:'9 min read',
    excerpt:'Core vs Extended strategy, the topics that carry the most marks, and an eight-week revision plan for your Cambridge sitting.',
    body:`<p>Cambridge IGCSE Mathematics (0580) is beatable with structure. This is the revision framework our IGCSE tutors use with students in Cape Town, across South Africa and in Zambia.</p>
<h2>Know your tier</h2>
<p>Core caps your grade but has gentler questions; Extended opens the top grades and expects algebraic fluency. If you\u2019re borderline, decide by mid-course — the revision strategies differ. Extended candidates should over-invest in algebra, functions and trigonometry, which anchor the hardest questions.</p>
<h2>Topic priority</h2>
<p>Marks concentrate in: algebra and graphs, geometry and mensuration, trigonometry, and probability/statistics. Number work appears everywhere but rarely as whole questions. Revise in that order of weight, not in syllabus order.</p>
<h2>The eight-week plan</h2>
<p>Weeks 1–3: re-learn weak topics from notes and worked examples, finishing each with 20 topic-specific past-paper questions. Weeks 4–6: mixed-topic practice — one full paper per week, marked against the official scheme, errors logged. Weeks 7–8: timed papers under exam conditions, alternating Paper 2/4 (or 1/3 for Core), re-drilling every logged error type until it stops recurring.</p>
<h2>Mark-scheme habits</h2>
<p>Cambridge awards method marks generously — show working even when the answer is wrong, keep intermediate values unrounded, and answer to the accuracy the question demands (the classic three-significant-figures trap costs thousands of candidates every sitting).</p>` },
  { slug:'cambridge-vs-caps-curriculum', cat:'Guides', icon:'⚖️', g:'linear-gradient(135deg,#0AA5C2,#3FC6E0)',
    title:'Cambridge vs CAPS: Which Curriculum Is Right for Your Child?', kw:'Cambridge vs CAPS curriculum',
    metaDesc:'An honest comparison of the Cambridge international and South African CAPS curricula: structure, assessment, university recognition, cost and flexibility.',
    date:'2026-04-08', read:'10 min read',
    excerpt:'Structure, assessment style, university recognition and cost — an honest side-by-side for South African families weighing the two systems.',
    body:`<p>More South African families than ever are choosing between the national CAPS curriculum and the Cambridge international pathway. Neither is "better" — they optimise for different things.</p>
<h2>Structure and pacing</h2>
<p>CAPS is a year-grade system with continuous assessment feeding a single NSC exit exam. Cambridge is modular: IGCSE (roughly Grades 10–11 equivalent), then AS and A-Level, each with its own external exams. Cambridge students can sit exams in June or November and re-sit individual subjects — flexibility CAPS doesn\u2019t offer.</p>
<h2>Assessment style</h2>
<p>CAPS/NSC papers reward syllabus coverage and structured responses; Cambridge papers lean on application and precise command-word responses. Students who thrive on clear scope often prefer CAPS; independent thinkers who read around a subject often prefer Cambridge.</p>
<h2>University recognition</h2>
<p>Both routes access South African universities. NSC feeds the APS system directly. Cambridge students apply via a USAf exemption with required AS/A-Level combinations — achievable but it needs planning from Grade 9, especially for medicine and engineering. Internationally, A-Levels are the more portable currency.</p>
<h2>Cost and support</h2>
<p>Cambridge generally costs more: exam fees per subject, fewer schools, more homeschool self-management. Tutoring support matters more in the Cambridge world precisely because school scaffolding is lighter — which is why a large share of our IGCSE and A-Level students are Cambridge families.</p>
<h2>The bottom line</h2>
<p>Choose CAPS/IEB for structure, local university alignment and cost; choose Cambridge for flexibility, international portability and a more application-driven style. And remember the child in question: the best curriculum is the one that fits how they actually learn.</p>` },
  { slug:'how-online-tutoring-works', cat:'Online learning', icon:'💻', g:'linear-gradient(135deg,#E0559B,#F08BBE)',
    title:'How Online Tutoring Works (and How to Get the Most From It)', kw:'how online tutoring works',
    metaDesc:'What happens in a live online tutoring lesson: the interactive whiteboard, setup checklist, low-data options, and how online compares to in-person results.',
    date:'2026-03-20', read:'6 min read',
    excerpt:'The interactive whiteboard, the setup checklist, low-data tips — and what the results data says about online vs in-person.',
    body:`<p>Online tutoring done properly is not "a video call about homework". Here\u2019s what a real online lesson looks like and how to set your child up to benefit.</p>
<h2>The whiteboard is the lesson</h2>
<p>Tutor and student share a live digital whiteboard: both can write, draw graphs, annotate past papers and save the board afterwards. The student solves in real time while the tutor watches the working — which is exactly where misconceptions reveal themselves. Recordings (on request) turn every lesson into revision material.</p>
<h2>Setup checklist</h2>
<p>A laptop or tablet (a stylus helps enormously for maths), earphones with a mic, and a quiet spot. That\u2019s it. On unstable connections, our low-data mode drops video and keeps audio plus whiteboard — lessons survive load-shedding on a phone hotspot.</p>
<h2>Does it work as well as in-person?</h2>
<p>Across our own students, online and in-person improvement rates are statistically indistinguishable — with one caveat: learners under about Grade 6 generally focus better face-to-face. For everyone else, online wins on tutor choice (the full national pool rather than whoever lives nearby), consistency (no traffic, no cancellations for weather) and scheduling flexibility.</p>
<h2>Make it stick</h2>
<p>Same tutor, same slot, every week. Homework set and checked between lessons. A parent glance at the lesson report afterwards. Online tutoring fails when it\u2019s treated as ad-hoc homework help; it excels as a standing weekly structure.</p>` },
  { slug:'common-physics-mistakes-students-make', cat:'Study skills', icon:'⚡', g:'linear-gradient(135deg,#FF7A45,#FF9E75)',
    title:'Common Physics Mistakes Students Make (and How to Fix Them)', kw:'common physics mistakes students make',
    metaDesc:'The seven most common physics mistakes in Grade 10–12 Physical Sciences — sign errors, unit chaos, formula-hunting — and the habits that fix each one.',
    date:'2026-03-05', read:'6 min read',
    excerpt:'Sign errors, unit chaos, formula-hunting: the seven mistakes our tutors correct most often in Physical Sciences.',
    body:`<p>After thousands of Physical Sciences lessons, the same mistakes appear again and again. The good news: each one has a specific, learnable fix.</p>
<h2>1. Formula-hunting instead of physics</h2>
<p>Weak students scan the data sheet for a formula containing the given symbols. Strong students first ask "what is physically happening?" Fix: start every problem with a sketch and a one-line statement of the principle (conservation of energy, Newton\u2019s second law) before touching a formula.</p>
<h2>2. Sign convention chaos</h2>
<p>Choose a positive direction, write it down, and keep it for the whole problem. Half of all projectile and momentum errors are sign errors.</p>
<h2>3. Skipping the free-body diagram</h2>
<p>If forces are involved, draw the diagram — every force, correct directions, nothing invented. Marks are awarded for it, and the diagram catches the "forgot friction" class of error before it propagates.</p>
<h2>4–5. Units and rounding</h2>
<p>Convert everything to SI units before substituting (grams and centimetres are the classic killers), and round only at the end — carrying rounded intermediates loses accuracy marks.</p>
<h2>6. Memorising solutions, not methods</h2>
<p>Past papers help only if you redo the problems cold days later. Recognising a solution is not the same as producing one.</p>
<h2>7. Ignoring the verbs</h2>
<p>"Define", "state", "explain" and "calculate" earn marks differently. Answer what is asked — a beautiful calculation scores zero against a "define" question.</p>` },
  { slug:'best-study-techniques-university-students', cat:'Study skills', icon:'🎓', g:'linear-gradient(135deg,#0B5FFF,#6C4CF1)',
    title:'Best Study Techniques for University Students', kw:'best study techniques for university students',
    metaDesc:'Evidence-based study techniques for university: active recall, spaced repetition, the tutorial-first method for STEM, and managing semester workload.',
    date:'2026-02-18', read:'8 min read',
    excerpt:'School study habits break at university scale. The evidence-based system that works: recall, spacing, and tutorial-first STEM study.',
    body:`<p>The habits that earned good marks at school — rereading, highlighting, last-week cramming — collapse under university volume. What works instead is well documented.</p>
<h2>Active recall beats rereading</h2>
<p>Testing yourself is the single most effective technique in the learning-science literature. Close the notes and reconstruct the lecture\u2019s argument; do problems from a blank page; answer past-exam questions before you feel ready. Difficulty during practice is the signature of durable learning.</p>
<h2>Space it, interleave it</h2>
<p>Touch each module briefly and repeatedly across the semester rather than in one heroic pre-exam block. Interleave related topics — mixing integration techniques, say — because discriminating between methods is what exams actually test.</p>
<h2>For STEM: tutorials first</h2>
<p>In maths-heavy degrees, the tutorial problems are the course. Attempt every problem before the memo appears, log every failure honestly, and re-attempt failures a week later. Lectures explain; tutorials build the skill that exams measure.</p>
<h2>Manage the semester, not the night</h2>
<p>University punishes deadline-stacking. A simple weekly review — one hour on Sunday planning the week against every due date — outperforms any all-nighter. And when a module starts slipping, act in week 3, not week 10: a few targeted tutoring sessions early costs less than a supplementary exam later.</p>` }
];

const TUTORS = [
  {name:'Thandi Nkosi',ini:'TN',c:'#0B5FFF',uni:'University of Cape Town',deg:'BSc Actuarial Science',subs:['Mathematics','Statistics'],yrs:4,lessons:620},
  {name:'James van der Merwe',ini:'JV',c:'#00BFA6',uni:'Stellenbosch University',deg:'BEng Mechanical (Hons)',subs:['Physical Sciences','Engineering'],yrs:5,lessons:810},
  {name:'Aisha Patel',ini:'AP',c:'#6C4CF1',uni:'University of the Witwatersrand',deg:'BCom Accounting Science',subs:['Accounting','Economics'],yrs:3,lessons:450},
  {name:'Sipho Mabaso',ini:'SM',c:'#FF7A45',uni:'University of Pretoria',deg:'BSc Computer Science',subs:['Programming','Mathematics'],yrs:4,lessons:530},
  {name:'Emma Botha',ini:'EB',c:'#E0559B',uni:'University of Cape Town',deg:'BA English & Linguistics',subs:['English','History'],yrs:6,lessons:940},
  {name:'Mwansa Chileshe',ini:'MC',c:'#0AA5C2',uni:'University of Johannesburg',deg:'BSc Biochemistry (Hons)',subs:['Biology','Chemistry'],yrs:3,lessons:380}
];

const STORIES = [
  {ini:'S',c:'#0B5FFF',from:'52%',to:'81%',subj:'Mathematics',quote:'Whiz Tutoring helped me gain confidence and improve my marks in just one term. My tutor never made me feel stupid for asking questions.',name:'Sarah M.',who:'Grade 11 · Rondebosch'},
  {ini:'K',c:'#00BFA6',from:'48%',to:'74%',subj:'Physical Sciences',quote:'I went from dreading physics to actually choosing it for matric. The past-paper practice before exams made all the difference.',name:'Kabelo T.',who:'Grade 12 · Claremont'},
  {ini:'L',c:'#6C4CF1',from:'61%',to:'88%',subj:'Accounting',quote:'My tutor explained accounting the way my teacher never could. I got a distinction in prelims and my final matric exam.',name:'Lerato K.',who:'Matric · Durbanville'},
  {ini:'D',c:'#FF7A45',from:'55%',to:'79%',subj:'IGCSE Maths',quote:'Being in Lusaka, online lessons were perfect. Same tutor every week, and my Cambridge results jumped two grade boundaries.',name:'Daniel B.',who:'IGCSE · Lusaka, Zambia'}
];

// Fallback reviews shown before the live Google feed loads (or if the API isn't configured yet)
const SEED_REVIEWS = [
  {author:'Nomvula M.',rating:5,when:'2 months ago',text:'After two terms with Whiz, my daughter went from crying over maths homework to explaining trigonometry to me at dinner. Worth every rand.'},
  {author:'Peter J.',rating:5,when:'3 months ago',text:'The matching process is what sets them apart. They asked about my son as a person, not just his marks — and the tutor they chose just clicked with him.'},
  {author:'Reshma S.',rating:5,when:'4 months ago',text:'Professional from day one. Lesson reports after every session, easy rescheduling, and a real human on WhatsApp when I have questions.'},
  {author:'Craig W.',rating:5,when:'5 months ago',text:'Our Camps Bay–based son did online lessons for matric physics. Went from 58% to 76% between prelims and finals. Highly recommended.'},
  {author:'Ayesha D.',rating:4,when:'6 months ago',text:'Great IGCSE maths support for our homeschooling family. Only wish we had started earlier in the year.'}
];

const FAQS = [
  {q:'How are tutors selected?',a:'Fewer than 1 in 8 applicants make it. Every tutor must be a current student or graduate of a leading university with at least 70% in the subjects they teach, then pass a written subject test, a live teaching demonstration, an interview and a background check before any home placement.'},
  {q:'Do you offer tutoring at my home in Cape Town?',a:'Yes — in-person home tutoring is available across the Southern Suburbs (Claremont, Rondebosch, Newlands, Constantia and surrounds), the Atlantic Seaboard (Sea Point, Camps Bay), the City Bowl, the Northern Suburbs (Durbanville, Bellville) and the Helderberg (Somerset West). Online lessons cover everywhere else in South Africa and Zambia.'},
  {q:'Should we choose online or in-person lessons?',a:'Both use the same tutors and lesson structure. Online lessons use an interactive whiteboard and are recorded on request — great for consistency and the widest tutor choice. In-person lessons suit younger learners who focus better face-to-face. Many families mix both.'},
  {q:'How much does tutoring cost?',a:'Online lessons start at R320/hour pay-as-you-go, or R280/hour on a 10-lesson term package. Matric-intensive tutoring with senior specialists is R395/hour. Your first lesson is a 50%-off trial, and there are no signup fees or contracts. In-person lessons carry a small travel supplement depending on area.'},
  {q:'What is your cancellation policy?',a:'Reschedule or cancel any lesson free of charge with 24 hours\u2019 notice — just message your tutor or our WhatsApp line. Lessons cancelled with less notice are billed, since your tutor has reserved that time.'},
  {q:'Can we try a lesson before committing?',a:'Yes — every new student starts with a half-price trial lesson. If the fit isn\u2019t right, we\u2019ll rematch you with a different tutor at no cost. About 92% of families continue after the trial.'},
  {q:'How quickly can we start?',a:'Most families are matched within 24 hours of sending an enquiry and have their first lesson within the week. During exam season we recommend booking a few days ahead.'}
];

const SUBJECT_CARDS = [
  {name:'Mathematics',icon:'➗',bg:'#EDF3FF',desc:'Algebra to calculus — build the fundamentals and the exam technique.',link:'/maths-tutor-cape-town/'},
  {name:'Physical Sciences',icon:'⚗️',bg:'#E6FAF6',desc:'Physics and chemistry made intuitive with worked examples.',link:'/physics-tutor-cape-town/'},
  {name:'English',icon:'📖',bg:'#F3EEFF',desc:'Comprehension, essays and literature — home language & FAL.',link:'/english-tutor-cape-town/'},
  {name:'Accounting',icon:'📊',bg:'#FFF4DC',desc:'From journals to cash-flow statements, step by careful step.',link:'/accounting-tutor-cape-town/'},
  {name:'Matric (Grade 12)',icon:'🎯',bg:'#FFF0EC',desc:'Every NSC & IEB subject with senior specialist tutors.',link:'/matric-tutor-cape-town/'},
  {name:'Cambridge & IGCSE',icon:'🌍',bg:'#EAF9E7',desc:'IGCSE, AS & A-Level with Cambridge specialists.',link:'/igcse-tutor-cape-town/'},
  {name:'Engineering',icon:'⚙️',bg:'#EDF3FF',desc:'First-year statics, dynamics, thermo and engineering maths.',link:'/engineering-tutor-cape-town/'},
  {name:'Online — any subject',icon:'💻',bg:'#E6FAF6',desc:'Live whiteboard lessons anywhere in SA or Zambia.',link:'/online-tutor-south-africa/'},
  {name:'Private tutoring',icon:'🎓',bg:'#FFF4DC',desc:'Screened home tutors for any subject across Cape Town.',link:'/private-tutor-cape-town/'}
];

module.exports = { SITE, SUBJECT_PAGES, SUBURBS, POSTS, TUTORS, STORIES, SEED_REVIEWS, FAQS, SUBJECT_CARDS };
