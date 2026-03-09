import { defineProject } from "./define";
import { CardPalette, ProjectEntry, ProjectsPageContent } from "./types";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const initialsFromTitle = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "PR";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase() || "PR";
  }
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const projectPalettes = {
  pastelRed: {
    accent: "#d86a7d",
    palette: { deep: "#4a1f2b", mid: "#a84862", bright: "#fff2f4", line: "#f6c6d0" },
  },
  vibrantLime: {
    accent: "#8ddf2c",
    palette: { deep: "#20340d", mid: "#4f8f16", bright: "#f6ffe8", line: "#d7f3ae" },
  },
  aqua: {
    accent: "#24c8c9",
    palette: { deep: "#10393d", mid: "#1f7f86", bright: "#ebffff", line: "#bdeef0" },
  },
  magenta: {
    accent: "#d84fd3",
    palette: { deep: "#43153d", mid: "#8e2f87", bright: "#fff0fe", line: "#f0c3eb" },
  },
  amber: {
    accent: "#f2b532",
    palette: { deep: "#4a2b0d", mid: "#b46d13", bright: "#fff8e8", line: "#f6ddb0" },
  },
} satisfies Record<string, { accent: string; palette: CardPalette }>;

const monogramIcon = (title: string, accent: string, palette: CardPalette) => {
  const initials = escapeXml(initialsFromTitle(title));
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
    <defs>
      <linearGradient id='monogramBg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${accent}' stop-opacity='0.92'/>
        <stop offset='100%' stop-color='${palette.mid}' stop-opacity='0.92'/>
      </linearGradient>
    </defs>
    <rect x='8' y='8' width='80' height='80' rx='24' fill='url(#monogramBg)'/>
    <rect x='13' y='13' width='70' height='70' rx='20' stroke='${palette.line}' stroke-opacity='0.55'/>
    <text x='48' y='58' text-anchor='middle' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='30' font-weight='700' fill='${palette.line}'>${initials}</text>
  </svg>`;
};

const iconFrame = (accent: string, palette: CardPalette, body: string) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
  <rect x='8' y='8' width='80' height='80' rx='24' fill='${palette.bright}' fill-opacity='0.92'/>
  <rect x='8' y='8' width='80' height='80' rx='24' stroke='${accent}' stroke-opacity='0.42' stroke-width='2'/>
  <g stroke='${accent}' fill='none' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'>
    ${body}
  </g>
</svg>`;

const iconSuite = {
  audio: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<rect x='22' y='28' width='52' height='40' rx='10'/><path d='M34 40v16'/><path d='M48 36v24'/><path d='M62 44v12'/><path d='M24 72h48' opacity='0.7'/>",
    ),
  neural: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      `<circle cx='30' cy='32' r='4' fill='${accent}'/><circle cx='62' cy='30' r='4' fill='${accent}'/><circle cx='28' cy='62' r='4' fill='${accent}'/><circle cx='64' cy='62' r='4' fill='${accent}'/><path d='M30 32 62 30 64 62 28 62 30 32'/><path d='M30 32 64 62'/><path d='M62 30 28 62'/>`,
    ),
  imaging: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<circle cx='48' cy='48' r='18'/><circle cx='48' cy='48' r='9' opacity='0.75'/><path d='M20 48h14'/><path d='M62 48h14'/><path d='M48 20v14'/><path d='M48 62v14'/>",
    ),
  aviation: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<path d='M18 52h60'/><path d='M34 52 48 28 62 52'/><path d='M48 52v18'/><circle cx='48' cy='28' r='4' fill='${accent}'/>",
    ),
};

const mediaTexture = (title: string, accent: string, palette: CardPalette, motif: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 400'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${palette.deep}'/>
          <stop offset='100%' stop-color='${palette.mid}'/>
        </linearGradient>
        <radialGradient id='halo' cx='50%' cy='48%' r='52%'>
          <stop offset='0%' stop-color='${palette.bright}' stop-opacity='0.95'/>
          <stop offset='100%' stop-color='${palette.bright}' stop-opacity='0'/>
        </radialGradient>
      </defs>
      <rect width='720' height='400' rx='32' fill='url(#bg)'/>
      <rect x='22' y='22' width='676' height='356' rx='26' fill='none' stroke='${palette.line}' stroke-opacity='0.38' stroke-width='2'/>
      <circle cx='360' cy='190' r='132' fill='url(#halo)' opacity='0.28'/>
      <g stroke='${accent}' stroke-opacity='0.86' fill='none' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
        ${motif}
      </g>
      <text x='44' y='64' fill='${palette.bright}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' letter-spacing='4'>PROJECT PREVIEW</text>
      <text x='44' y='108' fill='white' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='36' font-weight='700'>${escapeXml(title)}</text>
    </svg>
  `)}`;

// EDIT HERE: projects page header copy.
export const projectsPageContent: ProjectsPageContent = {
  eyebrow: "Projects",
  title: "Research, Systems, and Product Work.",
  summary: "Selected projects across computational neuroscience, data engineering, and product development.",
};

// EDIT HERE: add or update projects below.
export const projects = [
  defineProject({
    id: "transfr-audio-macos-transfer-automation",
    title: "Transf.r Audio",
    subtitle: "macOS automation for cross-platform audio project transfer",
    summary:
      "A macOS application that automates multitrack session transfers across music software workflows.",
    details:
      "Built a macOS app using Swift and C++ to reduce manual audio project transfer work. The system uses robotic process automation to batch export and import multitrack sessions, reducing transfer time to 20 minutes from workflows that previously took more than an hour. Product direction came from more than 100 interviews with industry professionals focused on compatibility and collaboration constraints in music software.",
    tags: ["Swift", "C++", "macOS", "Robotic Process Automation"],
    accent: projectPalettes.aqua.accent,
    palette: projectPalettes.aqua.palette,
    media: [
      mediaTexture(
        "Transf.r Audio",
        projectPalettes.aqua.accent,
        projectPalettes.aqua.palette,
        "<rect x='238' y='122' width='244' height='146' rx='22'/><path d='M292 170v48'/><path d='M360 154v80'/><path d='M428 182v24'/>",
      ),
    ],
    links: [],
      front: {
        dateLabel: "May 2024 - Feb 2025",
        status: "Archived",
      frontFamily: "signal",
        popoutPreset: "ribbonArc",
        popoutIntensity: 0.84,
      iconSvg: iconSuite.audio(projectPalettes.aqua.accent, projectPalettes.aqua.palette),
      },
  }),
  defineProject({
    id: "neurodegeneration-lesion-modeling-with-tvb",
    title: "Neurodegeneration Lesion Modeling",
    subtitle: "Alzheimer's cortical lesion modeling with deep learning feature extraction",
    summary:
      "Modeled cortical lesions and trained neural networks to learn salient cortical features for biomarker classification.",
    details:
      "Modeled Alzheimer's Disease cortical lesions using The Virtual Brain Library and trained neural networks in PyTorch to learn salient cortical features. This work improved neurodegenerative biomarker classification accuracy by roughly 110 percent according to the reported research results.",
    tags: ["The Virtual Brain Library", "PyTorch", "Neural Networks"],
    accent: projectPalettes.pastelRed.accent,
    palette: projectPalettes.pastelRed.palette,
    media: [
      mediaTexture(
        "Neurodegeneration Lesion Modeling",
        projectPalettes.pastelRed.accent,
        projectPalettes.pastelRed.palette,
        "<circle cx='360' cy='190' r='84'/><circle cx='360' cy='190' r='42' opacity='0.75'/><path d='M278 190h-44'/><path d='M486 190h-44'/><path d='M360 108v-44'/><path d='M360 316v-44'/>",
      ),
    ],
    links: [],
      front: {
        dateLabel: "Feb 2025 - Jun 2025",
        status: "Archived",
      frontFamily: "atlas",
        popoutPreset: "orbitalCore",
        popoutIntensity: 0.72,
      iconSvg: iconSuite.neural(projectPalettes.pastelRed.accent, projectPalettes.pastelRed.palette),
      },
  }),
  defineProject({
    id: "meeg-mri-cloud-pipelines-and-cnn-lesion-signatures",
    title: "MEEG/MRI Deep Learning Pipelines",
    subtitle: "Cloud Python pipelines for Parkinson's and Alzheimer's detection",
    summary:
      "Built processing pipelines and trained convolutional neural networks on high-dimensional MEEG and MRI datasets.",
    details:
      "Built cloud Python processing pipelines for high-dimensional Parkinson's and Alzheimer's MEEG and MRI datasets and trained convolutional neural networks in PyTorch to identify lesion signatures. The work covers dataset processing, model training, and evaluation workflows.",
    tags: ["Python", "PyTorch", "Convolutional Neural Networks", "MEEG", "MRI"],
    accent: projectPalettes.magenta.accent,
    palette: projectPalettes.magenta.palette,
    media: [
      mediaTexture(
        "MEEG/MRI Deep Learning Pipelines",
        projectPalettes.magenta.accent,
        projectPalettes.magenta.palette,
        "<path d='M214 230c42-82 94-122 146-122s104 40 146 122'/><path d='M214 230c38 44 86 66 146 66s108-22 146-66'/><circle cx='292' cy='182' r='10'/><circle cx='360' cy='138' r='10'/><circle cx='428' cy='182' r='10'/><circle cx='360' cy='248' r='10'/>",
      ),
    ],
    links: [],
      front: {
        dateLabel: "Feb 2025 - Jun 2025",
        status: "Archived",
      frontFamily: "forge",
        popoutPreset: "nodeConstellation",
        popoutIntensity: 0.7,
      iconSvg: iconSuite.imaging(projectPalettes.magenta.accent, projectPalettes.magenta.palette),
      },
  }),
  defineProject({
    id: "aviation-demand-data-platform",
    title: "Aviation Demand Data Platform",
    subtitle: "Databricks pipelines and PowerBI dashboards for aviation analytics",
    summary:
      "Engineered passenger-demand pipelines and dashboards with measurable ETL performance improvements.",
    details:
      "Engineered flight passenger-demand data pipelines with Azure Databricks and performed machine learning algorithm analysis with Python and MS SQL Server. Built PowerBI dashboards and interactive notebooks for stakeholders. The work reduced ETL runtime by 40 percent compared to pre-migration and supported statistical analysis across 20 years of data to correlate airport expansion with passenger demand.",
    tags: ["Azure Databricks", "PySpark", "Python", "MS SQL Server", "PowerBI"],
    accent: projectPalettes.amber.accent,
    palette: projectPalettes.amber.palette,
    media: [
      mediaTexture(
        "Aviation Demand Data Platform",
        projectPalettes.amber.accent,
        projectPalettes.amber.palette,
        "<path d='M218 236h284'/><path d='M312 236 360 134 408 236'/><path d='M360 236v70'/><path d='M250 274h220' opacity='0.7'/>",
      ),
    ],
    links: [],
      front: {
        dateLabel: "Apr 2023 - Dec 2023",
        status: "Archived",
      frontFamily: "lattice",
        popoutPreset: "pillarArray",
        popoutIntensity: 0.66,
      iconSvg: iconSuite.aviation(projectPalettes.amber.accent, projectPalettes.amber.palette),
      },
  }),
] satisfies ProjectEntry[];

export const createProjectMonogramIcon = monogramIcon;
