import type { Locale } from "@/lib/i18n/config";

/**
 * Interface copy for both languages.
 *
 * The Marathi below was written for this site and has NOT yet been reviewed by
 * a native speaker at the school. It should be before launch — particularly the
 * statutory wording in `disclosure`, which mirrors CBSE's Appendix IX. The
 * certificates themselves remain in English because that is how they were
 * issued and filed.
 */
export type Dictionary = {
  nav: {
    home: string;
    about: string;
    aboutSchool: string;
    vision: string;
    mission: string;
    aims: string;
    objectives: string;
    uniqueFeatures: string;
    results: string;
    disclosure: string;
    facilities: string;
    allFacilities: string;
    admissions: string;
    circulars: string;
    explore: string;
    allExplore: string;
    climateTracker: string;
    aiHub: string;
    gallery: string;
    contact: string;
    menu: string;
    close: string;
    skipToContent: string;
    mainNavLabel: string;
    breadcrumbLabel: string;
    languageLabel: string;
  };
  common: {
    readMore: string;
    readFullStory: string;
    enquireNow: string;
    viewAll: string;
    opensInNewTab: string;
    quickLinks: string;
    contactHeading: string;
    officeHours: string;
    sundayClosed: string;
    phone: string;
    email: string;
    address: string;
    board: string;
    affiliationNo: string;
    schoolCode: string;
    allRightsReserved: string;
    developedBy: string;
    photograph: string;
    photographs: string;
  };
  home: {
    heroLead: string;
    campusArea: string;
    classrooms: string;
    laboratories: string;
    teachingStaff: string;
    storyEyebrow: string;
    storyTitle: string;
    resultsEyebrow: string;
    resultsTitle: string;
    resultsIntro: string;
    eventsEyebrow: string;
    eventsTitle: string;
    noEvents: string;
    noEventsBody: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryIntro: string;
    viewFullGallery: string;
    seeAllFeatures: string;
    viewDisclosure: string;
  };
  results: {
    year: string;
    registered: string;
    passed: string;
    passPercentage: string;
    remarks: string;
    classX: string;
    classXIINotApplicable: string;
    countsMissing: string;
    downloadResult: string;
  };
  disclosure: {
    eyebrow: string;
    title: string;
    intro: string;
    sectionA: string;
    sectionB: string;
    sectionBIntro: string;
    sectionC: string;
    sectionD: string;
    sectionE: string;
    view: string;
  };
  admissions: {
    title: string;
    howToApply: string;
    contactOffice: string;
    contactOfficeBody: string;
    documentsTitle: string;
    documentsBody: string;
    feeStructure: string;
    academicCalendar: string;
    makeEnquiry: string;
    enquiryBody: string;
    startEmail: string;
    startEmailNote: string;
    preferVisit: string;
    directions: string;
  };
  circulars: {
    eyebrow: string;
    title: string;
    intro: string;
    upcoming: string;
    noticesTitle: string;
    noEvents: string;
    noCirculars: string;
    kindCircular: string;
    kindEvent: string;
    kindResult: string;
    kindAdmission: string;
  };
  contact: {
    eyebrow: string;
    intro: string;
    officeTitle: string;
    findingUs: string;
    findingUsBody: string;
    mapNote: string;
    openInMaps: string;
    emailOffice: string;
    mapAlt: string;
  };
  gallery: {
    eyebrow: string;
    intro: string;
    videoTitle: string;
    videoBody: string;
    lookingFor: string;
    contactOffice: string;
  };
  explore: {
    eyebrow: string;
    intro: string;
    climateCard: string;
    aiHubCard: string;
    open: string;
  };
  climateTracker: {
    eyebrow: string;
    intro: string;
    classroomNote: string;
  };
  aiHub: {
    eyebrow: string;
    intro: string;
    classroomNote: string;
  };
  notFound: {
    title: string;
    body: string;
  };
};

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    aboutSchool: "About the School",
    vision: "Vision",
    mission: "Mission",
    aims: "Aims",
    objectives: "Objectives",
    uniqueFeatures: "What Makes Us Different",
    results: "CBSE Results",
    disclosure: "Mandatory Public Disclosure",
    facilities: "Facilities",
    allFacilities: "All Facilities",
    admissions: "Admissions",
    circulars: "Circulars & Events",
    explore: "Explore",
    allExplore: "All Learning Tools",
    climateTracker: "Climate Tracker",
    aiHub: "AI Maths & Science Hub",
    gallery: "Gallery",
    contact: "Contact Us",
    menu: "Menu",
    close: "Close",
    skipToContent: "Skip to content",
    mainNavLabel: "Main",
    breadcrumbLabel: "Breadcrumb",
    languageLabel: "Language",
  },
  common: {
    readMore: "Read more",
    readFullStory: "Read the full story",
    enquireNow: "Enquire now",
    viewAll: "View all",
    opensInNewTab: ", opens in a new tab",
    quickLinks: "Quick links",
    contactHeading: "Contact",
    officeHours: "Office hours",
    sundayClosed: "Sunday closed",
    phone: "Phone",
    email: "Email",
    address: "Address",
    board: "Board",
    affiliationNo: "Affiliation number",
    schoolCode: "School code",
    allRightsReserved: "All rights reserved.",
    developedBy: "Developed by",
    photograph: "photograph",
    photographs: "photographs",
  },
  home: {
    heroLead:
      "An English-medium school affiliated to the Central Board of Secondary Education.",
    campusArea: "Campus area",
    classrooms: "Classrooms",
    laboratories: "Laboratories",
    teachingStaff: "Teaching staff",
    storyEyebrow: "Our story",
    storyTitle: "Why this school exists",
    resultsEyebrow: "Board examinations",
    resultsTitle: "Class X results",
    resultsIntro:
      "Published pass percentages, as filed in the school's CBSE mandatory public disclosure.",
    eventsEyebrow: "What's on",
    eventsTitle: "Upcoming events",
    noEvents: "No events published yet",
    noEventsBody:
      "School events are announced here once the office adds them. In the meantime, the school posts regularly on",
    galleryEyebrow: "Life at school",
    galleryTitle: "From the gallery",
    galleryIntro: "Photographs from school events and everyday life on campus.",
    viewFullGallery: "View the full gallery",
    seeAllFeatures: "See everything that sets us apart",
    viewDisclosure: "View the full mandatory public disclosure",
  },
  results: {
    year: "Year",
    registered: "Registered",
    passed: "Passed",
    passPercentage: "Pass percentage",
    remarks: "Remarks",
    classX: "Class X",
    classXIINotApplicable: "Class XII: not applicable.",
    countsMissing:
      "Registered and passed student counts are not recorded in the currently published disclosure.",
    downloadResult: "Download the board result document",
  },
  disclosure: {
    eyebrow: "Appendix IX",
    title: "Mandatory Public Disclosure",
    intro:
      "Published in accordance with the Central Board of Secondary Education's affiliation bye-laws.",
    sectionA: "General information",
    sectionB: "Documents and information",
    sectionBIntro: "Self-attested copies as filed with the Board.",
    sectionC: "Results and academics",
    sectionD: "Staff and teaching",
    sectionE: "School infrastructure",
    view: "View",
  },
  admissions: {
    title: "Joining the school",
    howToApply: "How to apply",
    contactOffice: "Please contact the school office",
    contactOfficeBody:
      "The admission process, eligibility criteria and this year's dates are issued directly by the office. Call or write and they will confirm what applies to your child's class.",
    documentsTitle: "Documents you may be asked for",
    documentsBody:
      "The school office will give you the full list when you enquire. The published fee structure and academic calendar are available below.",
    feeStructure: "Fee structure",
    academicCalendar: "Annual academic calendar",
    makeEnquiry: "Make an enquiry",
    enquiryBody:
      "The quickest route is a phone call during office hours. You can also send an email and the office will reply.",
    startEmail: "Start an email enquiry",
    startEmailNote:
      "Opens your email app with the questions the office will ask already filled in.",
    preferVisit: "Prefer to visit?",
    directions: "Directions and address",
  },
  circulars: {
    eyebrow: "Notice board",
    title: "Circulars & Events",
    intro: "Announcements from the school office.",
    upcoming: "Upcoming events",
    noticesTitle: "Circulars and notices",
    noEvents: "No events published yet",
    noCirculars: "No circulars published yet",
    kindCircular: "Circular",
    kindEvent: "Event",
    kindResult: "Result",
    kindAdmission: "Admission",
  },
  contact: {
    eyebrow: "Get in touch",
    intro: "The school office is open Monday to Saturday.",
    officeTitle: "School office",
    findingUs: "Finding us",
    findingUsBody: "The campus is on Jafrabad Road in Chikhli, near Ranwara Hotel.",
    mapNote:
      "Map data © OpenStreetMap contributors. The marker is placed on Chikhli town; confirm the exact pin with the school office before setting it as a navigation destination.",
    openInMaps: "Open in maps",
    emailOffice: "Email the school office",
    mapAlt: "Map showing the location of the school in Chikhli, Buldhana",
  },
  gallery: {
    eyebrow: "Life at school",
    intro: "photographs from school events and everyday life on campus.",
    videoTitle: "Video",
    videoBody:
      "The school publishes video from events, assemblies and celebrations on its own channels.",
    lookingFor: "Looking for something specific?",
    contactOffice: "Contact the school office",
  },
  explore: {
    eyebrow: "Learning tools",
    intro:
      "Interactive tools students can open in class or at home — built to be poked at, changed, and argued with rather than just read.",
    climateCard:
      "Live climate, forest, orbital and energy figures, each card naming where its number came from.",
    aiHubCard:
      "Interactive formulas, a scientific calculator, a coding animation playground, and a science news feed.",
    open: "Open",
  },
  climateTracker: {
    eyebrow: "Global awareness",
    intro:
      "Four numbers that describe the planet our students are inheriting — tracked live where the data allows it, and clearly marked as an estimate where it does not.",
    classroomNote:
      "Built for classroom discussion. Each card names where its number came from, so students can practise asking that question before believing a figure.",
  },
  aiHub: {
    eyebrow: "Maths & science",
    intro:
      "Work through formulas, calculate, watch code become animation, and read a science feed — four tools on one page.",
    classroomNote:
      "The playground runs the code a student types, so it is a safe place to experiment: nothing is saved and a mistake only affects that browser tab. The news items are written as classroom examples, not real reporting.",
  },
  notFound: {
    title: "We could not find that page",
    body: "The link may be out of date. These are the pages people most often need:",
  },
};

const mr: Dictionary = {
  nav: {
    home: "मुख्यपृष्ठ",
    about: "आमच्याविषयी",
    aboutSchool: "शाळेविषयी",
    vision: "दृष्टिकोन",
    mission: "ध्येय",
    aims: "लक्ष्य",
    objectives: "उद्दिष्टे",
    uniqueFeatures: "आमची वैशिष्ट्ये",
    results: "सीबीएसई निकाल",
    disclosure: "अनिवार्य सार्वजनिक प्रकटीकरण",
    facilities: "सुविधा",
    allFacilities: "सर्व सुविधा",
    admissions: "प्रवेश",
    circulars: "परिपत्रके व कार्यक्रम",
    explore: "शिकण्याची साधने",
    allExplore: "सर्व साधने",
    climateTracker: "हवामान ट्रॅकर",
    aiHub: "एआय गणित व विज्ञान केंद्र",
    gallery: "छायाचित्र दालन",
    contact: "संपर्क",
    menu: "मेनू",
    close: "बंद करा",
    skipToContent: "मजकुराकडे जा",
    mainNavLabel: "मुख्य",
    breadcrumbLabel: "मार्गदर्शक",
    languageLabel: "भाषा",
  },
  common: {
    readMore: "अधिक वाचा",
    readFullStory: "संपूर्ण माहिती वाचा",
    enquireNow: "चौकशी करा",
    viewAll: "सर्व पहा",
    opensInNewTab: ", नवीन टॅबमध्ये उघडते",
    quickLinks: "त्वरित दुवे",
    contactHeading: "संपर्क",
    officeHours: "कार्यालयीन वेळ",
    sundayClosed: "रविवार बंद",
    phone: "दूरध्वनी",
    email: "ईमेल",
    address: "पत्ता",
    board: "मंडळ",
    affiliationNo: "संलग्नता क्रमांक",
    schoolCode: "शाळा संकेतांक",
    allRightsReserved: "सर्व हक्क राखीव.",
    developedBy: "संकेतस्थळ विकसन:",
    photograph: "छायाचित्र",
    photographs: "छायाचित्रे",
  },
  home: {
    heroLead:
      "केंद्रीय माध्यमिक शिक्षण मंडळाशी संलग्न इंग्रजी माध्यमाची शाळा.",
    campusArea: "परिसर क्षेत्रफळ",
    classrooms: "वर्गखोल्या",
    laboratories: "प्रयोगशाळा",
    teachingStaff: "शिक्षक वर्ग",
    storyEyebrow: "आमची वाटचाल",
    storyTitle: "ही शाळा का सुरू झाली",
    resultsEyebrow: "मंडळ परीक्षा",
    resultsTitle: "इयत्ता दहावी निकाल",
    resultsIntro:
      "शाळेच्या सीबीएसई अनिवार्य सार्वजनिक प्रकटीकरणात नोंदविलेली उत्तीर्ण टक्केवारी.",
    eventsEyebrow: "आगामी",
    eventsTitle: "आगामी कार्यक्रम",
    noEvents: "अद्याप कोणतेही कार्यक्रम प्रसिद्ध केलेले नाहीत",
    noEventsBody:
      "कार्यालयाने नोंद केल्यावर शाळेचे कार्यक्रम येथे जाहीर केले जातील. तोपर्यंत शाळा नियमितपणे येथे माहिती देते —",
    galleryEyebrow: "शाळेतील जीवन",
    galleryTitle: "छायाचित्र दालनातून",
    galleryIntro: "शाळेतील कार्यक्रम आणि दैनंदिन जीवनाची छायाचित्रे.",
    viewFullGallery: "संपूर्ण दालन पहा",
    seeAllFeatures: "आमची सर्व वैशिष्ट्ये पहा",
    viewDisclosure: "संपूर्ण अनिवार्य सार्वजनिक प्रकटीकरण पहा",
  },
  results: {
    year: "वर्ष",
    registered: "नोंदणीकृत",
    passed: "उत्तीर्ण",
    passPercentage: "उत्तीर्ण टक्केवारी",
    remarks: "शेरा",
    classX: "इयत्ता दहावी",
    classXIINotApplicable: "इयत्ता बारावी: लागू नाही.",
    countsMissing:
      "सध्या प्रसिद्ध केलेल्या प्रकटीकरणात नोंदणीकृत व उत्तीर्ण विद्यार्थ्यांची संख्या नोंदविलेली नाही.",
    downloadResult: "मंडळ निकालाची कागदपत्रे डाउनलोड करा",
  },
  disclosure: {
    eyebrow: "परिशिष्ट नऊ",
    title: "अनिवार्य सार्वजनिक प्रकटीकरण",
    intro:
      "केंद्रीय माध्यमिक शिक्षण मंडळाच्या संलग्नता नियमावलीनुसार प्रसिद्ध केलेले.",
    sectionA: "सर्वसाधारण माहिती",
    sectionB: "कागदपत्रे व माहिती",
    sectionBIntro: "मंडळाकडे सादर केलेल्या स्वसाक्षांकित प्रती.",
    sectionC: "निकाल व शैक्षणिक माहिती",
    sectionD: "कर्मचारी व अध्यापन",
    sectionE: "शाळेच्या पायाभूत सुविधा",
    view: "पहा",
  },
  admissions: {
    title: "शाळेत प्रवेश",
    howToApply: "अर्ज कसा करावा",
    contactOffice: "कृपया शाळेच्या कार्यालयाशी संपर्क साधा",
    contactOfficeBody:
      "प्रवेश प्रक्रिया, पात्रता निकष आणि या वर्षीच्या तारखा थेट कार्यालयाकडून दिल्या जातात. दूरध्वनी करा किंवा लिहा; आपल्या पाल्याच्या इयत्तेसाठी काय लागू आहे ते कार्यालय सांगेल.",
    documentsTitle: "आवश्यक असू शकणारी कागदपत्रे",
    documentsBody:
      "चौकशी केल्यावर शाळेचे कार्यालय संपूर्ण यादी देईल. प्रसिद्ध केलेले शुल्क तपशील व शैक्षणिक दिनदर्शिका खाली उपलब्ध आहे.",
    feeStructure: "शुल्क तपशील",
    academicCalendar: "वार्षिक शैक्षणिक दिनदर्शिका",
    makeEnquiry: "चौकशी करा",
    enquiryBody:
      "कार्यालयीन वेळेत दूरध्वनी करणे सर्वात जलद मार्ग आहे. आपण ईमेलही पाठवू शकता, कार्यालय उत्तर देईल.",
    startEmail: "ईमेलद्वारे चौकशी सुरू करा",
    startEmailNote:
      "कार्यालय विचारणार असलेले प्रश्न आधीच भरलेले ईमेल आपल्या ईमेल अॅपमध्ये उघडते.",
    preferVisit: "प्रत्यक्ष भेट द्यायची आहे?",
    directions: "पत्ता व मार्ग",
  },
  circulars: {
    eyebrow: "सूचना फलक",
    title: "परिपत्रके व कार्यक्रम",
    intro: "शाळेच्या कार्यालयाकडून सूचना.",
    upcoming: "आगामी कार्यक्रम",
    noticesTitle: "परिपत्रके व सूचना",
    noEvents: "अद्याप कोणतेही कार्यक्रम प्रसिद्ध केलेले नाहीत",
    noCirculars: "अद्याप कोणतीही परिपत्रके प्रसिद्ध केलेली नाहीत",
    kindCircular: "परिपत्रक",
    kindEvent: "कार्यक्रम",
    kindResult: "निकाल",
    kindAdmission: "प्रवेश",
  },
  contact: {
    eyebrow: "संपर्क साधा",
    intro: "शाळेचे कार्यालय सोमवार ते शनिवार सुरू असते.",
    officeTitle: "शाळेचे कार्यालय",
    findingUs: "आम्हाला कसे शोधाल",
    findingUsBody: "शाळेचा परिसर चिखली येथील जाफराबाद रस्त्यावर, रणवारा हॉटेलजवळ आहे.",
    mapNote:
      "नकाशा माहिती © OpenStreetMap योगदानकर्ते. खूण चिखली शहरावर ठेवली आहे; नेव्हिगेशनसाठी वापरण्यापूर्वी अचूक ठिकाण शाळेच्या कार्यालयाकडून निश्चित करून घ्या.",
    openInMaps: "नकाशात उघडा",
    emailOffice: "शाळेच्या कार्यालयाला ईमेल करा",
    mapAlt: "चिखली, बुलढाणा येथील शाळेचे स्थान दर्शविणारा नकाशा",
  },
  gallery: {
    eyebrow: "शाळेतील जीवन",
    intro: "शाळेतील कार्यक्रम आणि दैनंदिन जीवनाची छायाचित्रे.",
    videoTitle: "चित्रफिती",
    videoBody:
      "शाळा कार्यक्रम, प्रार्थनासभा आणि उत्सवांच्या चित्रफिती स्वतःच्या माध्यमांवर प्रसिद्ध करते.",
    lookingFor: "काही विशिष्ट शोधत आहात?",
    contactOffice: "शाळेच्या कार्यालयाशी संपर्क साधा",
  },
  explore: {
    eyebrow: "शिकण्याची साधने",
    intro:
      "वर्गात किंवा घरी उघडता येतील अशी संवादात्मक साधने — केवळ वाचण्यासाठी नव्हे, तर हाताळण्यासाठी, बदलण्यासाठी आणि प्रश्न विचारण्यासाठी तयार केलेली.",
    climateCard:
      "हवामान, जंगल, अवकाश आणि ऊर्जेचे थेट आकडे; प्रत्येक कार्डावर तो आकडा कोठून आला हे नमूद केलेले.",
    aiHubCard:
      "संवादात्मक सूत्रे, वैज्ञानिक कॅल्क्युलेटर, कोडिंग अ‍ॅनिमेशन प्लेग्राउंड आणि विज्ञान वार्तापत्र.",
    open: "उघडा",
  },
  climateTracker: {
    eyebrow: "जागतिक जाणीव",
    intro:
      "आपले विद्यार्थी ज्या पृथ्वीचा वारसा घेत आहेत ती सांगणारे चार आकडे — जिथे शक्य आहे तिथे थेट आकडेवारी, आणि जिथे नाही तिथे स्पष्टपणे अंदाज म्हणून नोंदवलेले.",
    classroomNote:
      "वर्गातील चर्चेसाठी तयार केलेले. प्रत्येक कार्डावर त्याचा आकडा कोठून आला हे नमूद केले आहे, जेणेकरून विद्यार्थ्यांना आकडा स्वीकारण्यापूर्वी हा प्रश्न विचारण्याची सवय लागेल.",
  },
  aiHub: {
    eyebrow: "गणित व विज्ञान",
    intro:
      "सूत्रे सोडवा, गणना करा, कोडचे अ‍ॅनिमेशनमध्ये रूपांतर पाहा आणि विज्ञान वार्ता वाचा — एकाच पानावर चार साधने.",
    classroomNote:
      "प्लेग्राउंड विद्यार्थ्याने लिहिलेला कोड चालवते, त्यामुळे प्रयोग करण्यासाठी ते सुरक्षित आहे: काहीही जतन होत नाही आणि चूक फक्त त्याच ब्राउझर टॅबपुरती मर्यादित राहते. वार्ता वर्गातील उदाहरणे म्हणून लिहिलेल्या आहेत, प्रत्यक्ष बातम्या नाहीत.",
  },
  notFound: {
    title: "ते पृष्ठ सापडले नाही",
    body: "हा दुवा कालबाह्य झालेला असू शकतो. सर्वाधिक आवश्यक असणारी पृष्ठे:",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, mr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
