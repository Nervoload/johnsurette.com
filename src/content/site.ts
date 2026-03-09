import { defineSiteMeta } from "./define";

// EDIT HERE: owner-level contact info and footer links.
export const siteMeta = defineSiteMeta({
  ownerName: "John Surette",
  ownerEmail: "johnmsurette@gmail.com",
  footerTagline: "Computational neuroscience researcher and full-stack engineer.",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/johnmsurette" },
    { label: "GitHub", href: "https://github.com/Nervoload" },
  ],
});
