import { defineAboutPage, defineTimelineScene } from "./define";
import { AboutPageContent, TimelineEntry } from "./types";

// EDIT HERE: about page intro copy and timeline scenes.
export const aboutPageContent: AboutPageContent = defineAboutPage({
  eyebrow: "About",
  title: "Computational neuroscience researcher and full-stack engineer",
  summary:
    "I build machine learning systems and data pipelines with a focus on computational neuroscience. My work spans neurodegeneration modeling, high-dimensional MEEG and MRI processing, and product engineering, from research prototypes in Python and PyTorch to macOS applications in Swift and C++.",
  highlights: [
    "Computational neuroscience research using The Virtual Brain Library and deep learning in PyTorch",
    "Cloud-scale data pipelines and analytics with Azure Databricks, PySpark, SQL, and PowerBI",
    "Product-building experience as a technical co-founder, including macOS app development and automation",
  ],
});

export const timelineEntries = [
  defineTimelineScene({
    id: "uottawa-dual-degree",
    year: "2022-Present",
    title: "Honours BSc in Biomedical Science and Computer Science",
    summary:
      "Dual-degree training across biology and computing, with a strong academic record and systems-focused coursework.",
    foreground: "#1b2a41",
    midground: "#2e4a62",
    background: "#eef3f9",
    detail: {
      kicker: "University of Ottawa",
      body: "I am completing an Honours Bachelor of Science in Biomedical Science and Computer Science, combining foundational biomedical training with core computer science depth. My coursework includes data structures and algorithms, machine learning, advanced databases, operating systems, and neuromorphic computing.",
      studioNote:
        "GPA listed as 3.9/4.0. The full course list remains in resume-specific materials rather than this timeline.",
      assetLabel: "Education",
      assetGradient: "linear-gradient(145deg, rgba(27,42,65,0.28), rgba(46,74,98,0.22), rgba(255,255,255,0.92))",
    },
    nowActions: [],
  }),
  defineTimelineScene({
    id: "transport-canada-data-engineering-internship",
    year: "2023",
    title: "Data engineering internship in aviation analytics",
    summary:
      "Built and optimized cloud data pipelines and dashboards for Canadian airport and airline stakeholders.",
    foreground: "#2a1e36",
    midground: "#4b2d57",
    background: "#f5f1f7",
    detail: {
      kicker: "Transport Canada",
      body: "As a Data Engineer Intern, I engineered flight and passenger-demand data pipelines using Azure Databricks, Python, MS SQL Server, and PowerBI. I focused on ETL performance improvements, cloud processing with PySpark, and long-horizon analysis to connect infrastructure expansion with demand patterns.",
      studioNote: "This work reduced ETL runtime by 40% and supported analysis across 20 years of data.",
      assetLabel: "Industry",
      assetGradient: "linear-gradient(148deg, rgba(42,30,54,0.28), rgba(75,45,87,0.22), rgba(255,255,255,0.92))",
    },
    nowActions: [],
  }),
  defineTimelineScene({
    id: "transfr-audio-cofounder-cto",
    year: "2024-2025",
    title: "Co-founded a product for cross-platform audio project transfer",
    summary:
      "Built a macOS application to automate multi-track session transfers and reduce manual workflow time.",
    foreground: "#0e2a2a",
    midground: "#1d4b4b",
    background: "#ecf7f7",
    detail: {
      kicker: "Transf.r Audio",
      body: "I co-founded Transf.r Audio and led technical execution as Chief Technical Officer. We validated a recurring compatibility problem in music software through 100-plus interviews, then built a macOS app in Swift and C++ using robotic process automation to batch export and import multitrack sessions, reducing transfers to 20 minutes from workflows that previously took more than an hour.",
      studioNote:
        "The company received competition recognition and pre-seed support, but no public product link or current status is included here.",
      assetLabel: "Startup",
      assetGradient: "linear-gradient(150deg, rgba(14,42,42,0.26), rgba(29,75,75,0.22), rgba(255,255,255,0.92))",
    },
    nowActions: [],
  }),
  defineTimelineScene({
    id: "unsw-computational-neuroscience-research",
    year: "2025",
    title: "Computational neuroscience research in neurodegeneration",
    summary:
      "Modeled cortical lesions and trained deep learning models on MEEG and MRI data to identify disease signatures.",
    foreground: "#2b1f1a",
    midground: "#5a3b2e",
    background: "#fbf3ee",
    detail: {
      kicker: "University of New South Wales",
      body: "As a Research Assistant in Computational Neuroscience, I modeled Alzheimer's Disease cortical lesions using The Virtual Brain Library and trained neural networks in PyTorch to learn salient cortical features. I also built cloud Python processing pipelines on high-dimensional Parkinson's and Alzheimer's MEEG and MRI datasets and trained convolutional neural networks to identify lesion signatures.",
      studioNote:
        "The resume reports roughly 110% improvement in biomarker classification accuracy, while evaluation details remain in research materials rather than this site.",
      assetLabel: "Research",
      assetGradient: "linear-gradient(154deg, rgba(43,31,26,0.26), rgba(90,59,46,0.2), rgba(255,255,255,0.92))",
    },
    nowActions: [],
  }),
  defineTimelineScene({
    id: "unsw-exchange-program",
    year: "2024-2025",
    title: "Exchange term focused on algorithms, AI, and neurobiology",
    summary:
      "Completed an exchange term with strong academic performance across algorithms, AI, and neurobiology coursework.",
    foreground: "#1a2233",
    midground: "#31405e",
    background: "#f1f4fa",
    detail: {
      kicker: "University of New South Wales (Exchange)",
      body: "During an exchange term, I took advanced coursework spanning analysis of algorithms, artificial intelligence, cellular and molecular neurobiology, and microeconomics. The listed result for that period is a WAM of 94 out of 100.",
      studioNote:
        "This is presented as a University of Ottawa exchange at UNSW, with coursework emphasized over program administration details.",
      assetLabel: "Exchange",
      assetGradient: "linear-gradient(146deg, rgba(26,34,51,0.26), rgba(49,64,94,0.22), rgba(255,255,255,0.92))",
    },
    nowActions: [],
  }),
] satisfies TimelineEntry[];
