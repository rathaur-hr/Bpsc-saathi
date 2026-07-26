import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BPSC Saathi demo data...");

  // ---------- Subjects ----------
  const subjectData = [
    { nameEn: "Bihar History", nameHi: "बिहार का इतिहास", category: "bihar-special" },
    { nameEn: "Bihar Geography", nameHi: "बिहार का भूगोल", category: "bihar-special" },
    { nameEn: "Bihar Polity", nameHi: "बिहार राजव्यवस्था", category: "bihar-special" },
    { nameEn: "Bihar Economy", nameHi: "बिहार अर्थव्यवस्था", category: "bihar-special" },
    { nameEn: "Indian History", nameHi: "भारतीय इतिहास", category: "general" },
    { nameEn: "Indian Polity", nameHi: "भारतीय राजव्यवस्था", category: "general" },
    { nameEn: "Geography", nameHi: "भूगोल", category: "general" },
    { nameEn: "General Science", nameHi: "सामान्य विज्ञान", category: "general" },
    { nameEn: "Indian Economy", nameHi: "भारतीय अर्थव्यवस्था", category: "general" },
    { nameEn: "Current Affairs", nameHi: "समसामयिकी", category: "general" },
  ];

  const subjects: Record<string, string> = {};
  for (const s of subjectData) {
    const created = await prisma.subject.upsert({
      where: { id: s.nameEn.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: s.nameEn.toLowerCase().replace(/\s+/g, "-"), ...s },
    });
    subjects[s.nameEn] = created.id;
  }

  // ---------- Topics ----------
  const topicData: { subject: string; titleEn: string; titleHi: string; phase: "PRELIMS" | "MAINS" }[] = [
    // Bihar History
    { subject: "Bihar History", titleEn: "Mauryan Empire in Bihar", titleHi: "बिहार में मौर्य साम्राज्य", phase: "PRELIMS" },
    { subject: "Bihar History", titleEn: "Gupta Period", titleHi: "गुप्त काल", phase: "PRELIMS" },
    { subject: "Bihar History", titleEn: "Ancient Bihar - Magadha & Vaishali Republics", titleHi: "प्राचीन बिहार - मगध एवं वैशाली गणराज्य", phase: "PRELIMS" },
    { subject: "Bihar History", titleEn: "Medieval Bihar", titleHi: "मध्यकालीन बिहार", phase: "PRELIMS" },
    { subject: "Bihar History", titleEn: "Revolt of 1857 in Bihar", titleHi: "बिहार में 1857 का विद्रोह", phase: "MAINS" },
    { subject: "Bihar History", titleEn: "Champaran Satyagraha", titleHi: "चंपारण सत्याग्रह", phase: "MAINS" },
    { subject: "Bihar History", titleEn: "Non-Cooperation & Civil Disobedience Movement in Bihar", titleHi: "बिहार में असहयोग एवं सविनय अवज्ञा आंदोलन", phase: "MAINS" },
    { subject: "Bihar History", titleEn: "Quit India Movement in Bihar", titleHi: "बिहार में भारत छोड़ो आंदोलन", phase: "MAINS" },
    { subject: "Bihar History", titleEn: "Freedom Movement in Bihar - Overview", titleHi: "बिहार में स्वतंत्रता आंदोलन - सिंहावलोकन", phase: "MAINS" },
    { subject: "Bihar History", titleEn: "Expansion of Western Education in Bihar", titleHi: "बिहार में पाश्चात्य शिक्षा का विस्तार", phase: "MAINS" },

    // Bihar Geography
    { subject: "Bihar Geography", titleEn: "Physiography of Bihar", titleHi: "बिहार का भौतिक स्वरूप", phase: "PRELIMS" },
    { subject: "Bihar Geography", titleEn: "Rivers and Drainage System", titleHi: "नदियाँ और अपवाह तंत्र", phase: "PRELIMS" },
    { subject: "Bihar Geography", titleEn: "Climate of Bihar", titleHi: "बिहार की जलवायु", phase: "PRELIMS" },
    { subject: "Bihar Geography", titleEn: "Agriculture & Cropping Pattern in Bihar", titleHi: "बिहार में कृषि एवं फसल पद्धति", phase: "PRELIMS" },
    { subject: "Bihar Geography", titleEn: "Minerals and Industries in Bihar", titleHi: "बिहार में खनिज एवं उद्योग", phase: "PRELIMS" },

    // Bihar Economy
    { subject: "Bihar Economy", titleEn: "Bihar's Economy in the Post-Independence Period", titleHi: "स्वतंत्रता पश्चात बिहार की अर्थव्यवस्था", phase: "MAINS" },
    { subject: "Bihar Economy", titleEn: "Bihar Budget & Economic Survey", titleHi: "बिहार बजट एवं आर्थिक सर्वेक्षण", phase: "MAINS" },
    { subject: "Bihar Economy", titleEn: "Poverty, Employment & Land Reforms in Bihar", titleHi: "बिहार में गरीबी, रोजगार एवं भूमि सुधार", phase: "MAINS" },

    // Bihar Polity
    { subject: "Bihar Polity", titleEn: "Bihar Legislative Assembly", titleHi: "बिहार विधानसभा", phase: "MAINS" },
    { subject: "Bihar Polity", titleEn: "Panchayati Raj in Bihar", titleHi: "बिहार में पंचायती राज", phase: "MAINS" },
    { subject: "Bihar Polity", titleEn: "Bihar Reorganisation Act, 2000", titleHi: "बिहार पुनर्गठन अधिनियम, 2000", phase: "MAINS" },

    // Indian History
    { subject: "Indian History", titleEn: "Ancient India - Overview", titleHi: "प्राचीन भारत - सिंहावलोकन", phase: "PRELIMS" },
    { subject: "Indian History", titleEn: "Medieval India - Overview", titleHi: "मध्यकालीन भारत - सिंहावलोकन", phase: "PRELIMS" },
    { subject: "Indian History", titleEn: "Revolt of 1857", titleHi: "1857 का विद्रोह", phase: "PRELIMS" },
    { subject: "Indian History", titleEn: "Partition of Bengal", titleHi: "बंगाल का विभाजन", phase: "PRELIMS" },
    { subject: "Indian History", titleEn: "Indian National Movement - Key Phases", titleHi: "भारतीय राष्ट्रीय आंदोलन - प्रमुख चरण", phase: "PRELIMS" },
    { subject: "Indian History", titleEn: "Modern History of India & Indian Culture (with reference to Bihar)", titleHi: "भारत का आधुनिक इतिहास एवं भारतीय संस्कृति (बिहार के संदर्भ में)", phase: "MAINS" },

    // Indian Polity
    { subject: "Indian Polity", titleEn: "Preamble and Fundamental Rights", titleHi: "प्रस्तावना और मौलिक अधिकार", phase: "PRELIMS" },
    { subject: "Indian Polity", titleEn: "Directive Principles of State Policy", titleHi: "राज्य के नीति निदेशक तत्व", phase: "PRELIMS" },
    { subject: "Indian Polity", titleEn: "Fundamental Duties", titleHi: "मौलिक कर्तव्य", phase: "PRELIMS" },
    { subject: "Indian Polity", titleEn: "Union and State Legislature", titleHi: "संघ और राज्य विधायिका", phase: "PRELIMS" },
    { subject: "Indian Polity", titleEn: "Indian Judiciary", titleHi: "भारतीय न्यायपालिका", phase: "PRELIMS" },
    { subject: "Indian Polity", titleEn: "73rd & 74th Constitutional Amendments (Panchayati Raj & Municipalities)", titleHi: "73वां एवं 74वां संविधान संशोधन (पंचायती राज एवं नगरपालिका)", phase: "PRELIMS" },
    { subject: "Indian Polity", titleEn: "Indian Polity - Mains Perspective (with reference to Bihar)", titleHi: "भारतीय राजव्यवस्था - मुख्य परीक्षा दृष्टिकोण (बिहार के संदर्भ में)", phase: "MAINS" },

    // Geography
    { subject: "Geography", titleEn: "Physiography of India", titleHi: "भारत का भौतिक स्वरूप", phase: "PRELIMS" },
    { subject: "Geography", titleEn: "Indian Monsoon System", titleHi: "भारतीय मानसून तंत्र", phase: "PRELIMS" },
    { subject: "Geography", titleEn: "Major Rivers of India", titleHi: "भारत की प्रमुख नदियाँ", phase: "PRELIMS" },
    { subject: "Geography", titleEn: "Climate & Natural Vegetation of India", titleHi: "भारत की जलवायु एवं प्राकृतिक वनस्पति", phase: "PRELIMS" },
    { subject: "Geography", titleEn: "World Geography Basics", titleHi: "विश्व भूगोल की मूल बातें", phase: "PRELIMS" },

    // Indian Economy
    { subject: "Indian Economy", titleEn: "Five Year Plans", titleHi: "पंचवर्षीय योजनाएँ", phase: "PRELIMS" },
    { subject: "Indian Economy", titleEn: "Banking & Monetary Policy", titleHi: "बैंकिंग एवं मौद्रिक नीति", phase: "PRELIMS" },
    { subject: "Indian Economy", titleEn: "Major Government Schemes", titleHi: "प्रमुख सरकारी योजनाएँ", phase: "PRELIMS" },
    { subject: "Indian Economy", titleEn: "Union Budget & Fiscal Policy", titleHi: "केंद्रीय बजट एवं राजकोषीय नीति", phase: "PRELIMS" },
    { subject: "Indian Economy", titleEn: "Agriculture Economy of India", titleHi: "भारत की कृषि अर्थव्यवस्था", phase: "PRELIMS" },

    // General Science
    { subject: "General Science", titleEn: "Basic Physics Concepts", titleHi: "भौतिकी की मूल अवधारणाएँ", phase: "PRELIMS" },
    { subject: "General Science", titleEn: "Basic Chemistry Concepts", titleHi: "रसायन विज्ञान की मूल अवधारणाएँ", phase: "PRELIMS" },
    { subject: "General Science", titleEn: "Basic Biology Concepts", titleHi: "जीव विज्ञान की मूल अवधारणाएँ", phase: "PRELIMS" },
    { subject: "General Science", titleEn: "Science & Technology - Current Developments", titleHi: "विज्ञान एवं प्रौद्योगिकी - वर्तमान विकास", phase: "PRELIMS" },

    // Current Affairs
    { subject: "Current Affairs", titleEn: "72nd BPSC Exam Pattern & Marking Scheme", titleHi: "72वीं BPSC परीक्षा पैटर्न एवं अंकन योजना", phase: "PRELIMS" },
    { subject: "Current Affairs", titleEn: "National Current Affairs", titleHi: "राष्ट्रीय समसामयिकी", phase: "PRELIMS" },
    { subject: "Current Affairs", titleEn: "Bihar Current Affairs", titleHi: "बिहार समसामयिकी", phase: "PRELIMS" },
    { subject: "Current Affairs", titleEn: "Government Schemes - Recent Updates", titleHi: "सरकारी योजनाएँ - हालिया अपडेट", phase: "PRELIMS" },
    { subject: "Current Affairs", titleEn: "Awards & Honours", titleHi: "पुरस्कार एवं सम्मान", phase: "PRELIMS" },
    { subject: "Current Affairs", titleEn: "Sports Current Affairs", titleHi: "खेल समसामयिकी", phase: "PRELIMS" },
  ];

  for (const t of topicData) {
    const existing = await prisma.topic.findFirst({ where: { titleEn: t.titleEn, subjectId: subjects[t.subject] } });
    if (!existing) {
      await prisma.topic.create({
        data: { subjectId: subjects[t.subject], titleEn: t.titleEn, titleHi: t.titleHi, examPhase: t.phase },
      });
    }
  }

  // ---------- Questions (PYQ + practice) ----------
  const questionData = [
    {
      subject: "Bihar History", isPYQ: true, pyqYear: 2023, difficulty: "easy",
      questionEn: "Who founded the Gupta Empire?", questionHi: "गुप्त साम्राज्य की स्थापना किसने की?",
      optionAEn: "Chandragupta I", optionBEn: "Samudragupta", optionCEn: "Ashoka", optionDEn: "Harsha",
      optionAHi: "चंद्रगुप्त प्रथम", optionBHi: "समुद्रगुप्त", optionCHi: "अशोक", optionDHi: "हर्ष",
      correctOption: "A",
      explanationEn: "Chandragupta I founded the Gupta Empire around 320 CE.",
      explanationHi: "चंद्रगुप्त प्रथम ने लगभग 320 ई. में गुप्त साम्राज्य की स्थापना की।",
    },
    {
      subject: "Indian Polity", isPYQ: true, pyqYear: 2024, difficulty: "medium",
      questionEn: "How many fundamental rights are guaranteed by the Indian Constitution?",
      questionHi: "भारतीय संविधान द्वारा कितने मौलिक अधिकार दिए गए हैं?",
      optionAEn: "5", optionBEn: "6", optionCEn: "7", optionDEn: "8",
      optionAHi: "5", optionBHi: "6", optionCHi: "7", optionDHi: "8",
      correctOption: "B",
      explanationEn: "There are 6 fundamental rights after the Right to Property was removed.",
      explanationHi: "संपत्ति के अधिकार को हटाने के बाद अब 6 मौलिक अधिकार हैं।",
    },
    {
      subject: "Bihar Geography", isPYQ: true, pyqYear: 2022, difficulty: "medium",
      questionEn: 'Which river is known as the "Sorrow of Bihar"?',
      questionHi: 'किस नदी को "बिहार का शोक" कहा जाता है?',
      optionAEn: "Ganga", optionBEn: "Son", optionCEn: "Kosi", optionDEn: "Gandak",
      optionAHi: "गंगा", optionBHi: "सोन", optionCHi: "कोसी", optionDHi: "गंडक",
      correctOption: "C",
      explanationEn: "The Kosi river is called the Sorrow of Bihar due to frequent flooding.",
      explanationHi: "कोसी नदी को बार-बार आने वाली बाढ़ के कारण बिहार का शोक कहा जाता है।",
    },
    {
      subject: "General Science", isPYQ: false, difficulty: "easy",
      questionEn: "What is the SI unit of force?", questionHi: "बल की SI इकाई क्या है?",
      optionAEn: "Joule", optionBEn: "Newton", optionCEn: "Watt", optionDEn: "Pascal",
      optionAHi: "जूल", optionBHi: "न्यूटन", optionCHi: "वाट", optionDHi: "पास्कल",
      correctOption: "B",
      explanationEn: "Force is measured in Newtons (N).",
      explanationHi: "बल को न्यूटन (N) में मापा जाता है।",
    },
    {
      subject: "Bihar History", isPYQ: true, pyqYear: 2025, difficulty: "easy",
      questionEn: "Bihar was bifurcated to form which new state in 2000?",
      questionHi: "2000 में बिहार के विभाजन से कौन सा नया राज्य बना?",
      optionAEn: "Chhattisgarh", optionBEn: "Uttarakhand", optionCEn: "Jharkhand", optionDEn: "Telangana",
      optionAHi: "छत्तीसगढ़", optionBHi: "उत्तराखंड", optionCHi: "झारखंड", optionDHi: "तेलंगाना",
      correctOption: "C",
      explanationEn: "Jharkhand was carved out of Bihar in November 2000.",
      explanationHi: "नवंबर 2000 में बिहार से झारखंड राज्य बनाया गया।",
    },
    {
      subject: "Indian Economy", isPYQ: true, pyqYear: 2024, difficulty: "hard",
      questionEn: "Which Five Year Plan focused on the 'Growth with Social Justice' objective?",
      questionHi: "किस पंचवर्षीय योजना का उद्देश्य 'सामाजिक न्याय के साथ विकास' था?",
      optionAEn: "Third", optionBEn: "Fourth", optionCEn: "Fifth", optionDEn: "Sixth",
      optionAHi: "तीसरी", optionBHi: "चौथी", optionCHi: "पाँचवीं", optionDHi: "छठी",
      correctOption: "C",
      explanationEn: "The Fifth Five Year Plan (1974-79) emphasized growth with social justice.",
      explanationHi: "पाँचवीं पंचवर्षीय योजना (1974-79) में सामाजिक न्याय के साथ विकास पर बल दिया गया।",
    },
  ];

  for (const q of questionData) {
    const { subject, ...rest } = q;
    const exists = await prisma.question.findFirst({ where: { questionEn: rest.questionEn } });
    if (!exists) {
      await prisma.question.create({ data: { subjectId: subjects[subject], ...rest } });
    }
  }

  // ---------- Current Affairs (seed sample; live ones come via cron) ----------
  const currentAffairsData = [
    { title: "72nd BPSC CCE notification released", category: "Bihar", summary: "Sample seeded entry — replace with live feed once the cron job runs." },
    { title: "Government announces new scheme for skill development", category: "Government Schemes", summary: "Sample seeded entry — replace with live feed once the cron job runs." },
  ];
  for (const ca of currentAffairsData) {
    const exists = await prisma.currentAffair.findFirst({ where: { title: ca.title } });
    if (!exists) await prisma.currentAffair.create({ data: ca });
  }

  // ---------- Bihar Districts (sample subset) ----------
  const districtData = [
    { name: "Patna", headquarters: "Patna", areaSqKm: 3202, population: 5838465, majorRivers: "Ganga, Son, Punpun", keyFacts: "State capital; seat of ancient Pataliputra." },
    { name: "Gaya", headquarters: "Gaya", areaSqKm: 4976, population: 4391418, majorRivers: "Falgu", keyFacts: "Major Buddhist pilgrimage site (Bodh Gaya)." },
    { name: "Muzaffarpur", headquarters: "Muzaffarpur", areaSqKm: 3172, population: 4801062, majorRivers: "Budhi Gandak", keyFacts: "Known for Shahi litchi cultivation." },
    { name: "Bhagalpur", headquarters: "Bhagalpur", areaSqKm: 2569, population: 3037766, majorRivers: "Ganga", keyFacts: "Known as the 'Silk City' of Bihar." },
  ];
  for (const d of districtData) {
    await prisma.biharDistrict.upsert({ where: { name: d.name }, update: {}, create: d });
  }

  // ---------- Demo user (clearly labeled) ----------
  const demoPasswordHash = await bcrypt.hash("Demo@1234", 10);
  await prisma.user.upsert({
    where: { email: "demo@bpscsaathi.com" },
    update: {},
    create: {
      name: "Demo Aspirant",
      email: "demo@bpscsaathi.com",
      passwordHash: demoPasswordHash,
      isVerified: true,
      onboardingCompleted: true,
      targetExamStage: "PRELIMS_MAINS",
      targetYear: 2027,
      prepLevel: "BEGINNER",
    },
  });

  console.log("Seeding complete. Demo login: demo@bpscsaathi.com / Demo@1234 (sample/demo account).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
