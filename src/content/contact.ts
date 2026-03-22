import { defineContactPage } from "./define";
import { ContactPageContent } from "./types";

// EDIT HERE: contact page copy and social feed cards.
export const contactPageContent: ContactPageContent = defineContactPage({
  eyebrow: "Contact",
  title: "Let's build something useful",
  summary:
    "For research, engineering, or collaboration inquiries, reach out by email.",
  contactLabel: "Contact Me",
  phoneNumber: "+1 (613) 720-6629",
  copyButtonLabel: "Copy email",
  copySuccessLabel: "Copied",
  copyErrorLabel: "Copy failed",
  contactDescription: "Email: johnmsurette@gmail.com. Phone: +1 (613) 720-6629.",
  availabilityEyebrow: "Availability",
  availabilityTitle: "Inquiries and opportunities",
  availabilitySummary:
    "Reach out with context on the project, role, or research collaboration and include a clear timeline if one exists.",
  responseWindowLabel: "By inquiry",
  timezoneLabel: "Eastern Time (ET)",
  preferredContactLabel: "Email",
  socialFeedEyebrow: "Profiles",
  socialFeedTitle: "Profiles and activity",
  socialFeedSummary: "Primary public profiles plus a live GitHub activity snapshot.",
  socialPosts: [
    {
      id: "github-profile",
      platform: "GitHub",
      handle: "github.com/Nervoload",
      publishedLabel: "Code profile",
      title: "GitHub",
      excerpt: "Repositories, commit activity, and public engineering work.",
      href: "https://github.com/Nervoload",
      accentClassName: "bg-emerald-700",
      github: {
        username: "Nervoload",
        profileUrl: "https://github.com/Nervoload",
      },
    },
    {
      id: "linkedin-profile",
      platform: "LinkedIn",
      handle: "linkedin.com/in/johnmsurette",
      publishedLabel: "Professional profile",
      title: "LinkedIn",
      excerpt: "Background, experience history, and broader professional profile.",
      href: "https://www.linkedin.com/in/johnmsurette",
      accentClassName: "bg-sky-700",
    },
  ],
});
