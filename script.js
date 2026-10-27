"use strict";

const examples = [
  {
    title: "Exposed application secret",
    label: "CRITICAL FINDING",
    severityClass: "critical",
    description: "A sensitive credential appears in the application's source code.",
    file: "src/config/payments.ts",
    code: '<span class="code-num">18</span> const apiKey = <span class="code-alert">"sk_••••••"</span>;\n<span class="code-num">19</span> export { apiKey };',
    impact: "The credential could be misused if someone gains access to the code.",
    fix: "Rotate the key and move it into secure server-side configuration.",
    guidance: "Exposed credential in src/config/payments.ts: Rotate the compromised credential; replace hardcoded secrets with a secure server-side secret store; ensure it is not bundled into client-side JavaScript; inspect commit history and deployment logs. Verify the change without printing any secret."
  },
  {
    title: "Authorization needs review",
    label: "POTENTIAL HIGH RISK",
    severityClass: "high",
    description: "An API route may lack an explicit ownership check for requested records.",
    file: "app/api/orders/route.ts",
    code: '<span class="code-num">31</span> const order = await db.order.findUnique({\n<span class="code-num">32</span>   where: { id: orderId }\n<span class="code-num">33</span> });',
    impact: "Without a separate authorization check, one account could potentially access another account's records.",
    fix: "Verify user identity and record ownership on the server for every request.",
    guidance: "Potential access-control gap in app/api/orders/route.ts: Review the full request authentication and authorization flow. Confirm every order is scoped to the authenticated account on the server. Add tests showing one account cannot access another account's order. Do not assume the isolated code snippet proves a vulnerability."
  },
  {
    title: "Dependency with known advisory",
    label: "DEPENDENCY REVIEW",
    severityClass: "medium",
    description: "A package version in the dependency manifest may match a known security advisory.",
    file: "package.json",
    code: '<span class="code-num">14</span> "dependencies": {\n<span class="code-num">15</span>   "sample-lib": <span class="code-alert">"1.2.3"</span>\n<span class="code-num">16</span> }',
    impact: "A vulnerable dependency can introduce risk when the affected feature is reachable.",
    fix: "Review the advisory and upgrade to a supported, fixed version.",
    guidance: "Dependency review: Identify the exact installed version using the lockfile. Confirm whether the relevant advisory applies, upgrade to a patched version, run tests, and rescan. The package name and version shown in this illustrative report are placeholders."
  }
];

const tabs = [...document.querySelectorAll("[data-finding]")];
const title = document.getElementById("finding-title");
const description = document.getElementById("finding-description");
const file = document.getElementById("finding-file");
const code = document.getElementById("finding-code");
const impact = document.getElementById("finding-impact");
const fix = document.getElementById("finding-fix");
const details = document.getElementById("finding-details");
const findingLabel = document.getElementById("finding-label");
const findingStep = document.getElementById("finding-step");
const copyButton = document.getElementById("copy-fix");
let activeFinding = 0;

function selectFinding(index, focus = false) {
  activeFinding = index;
  const finding = examples[index];
  title.textContent = finding.title;
  description.textContent = finding.description;
  file.textContent = finding.file;
  // This is only a static, bundled demonstration. Never insert untrusted data as HTML.
  code.innerHTML = `<code>${finding.code}</code>`;
  impact.textContent = finding.impact;
  fix.textContent = finding.fix;
  findingStep.textContent = `${String(index + 1).padStart(2, "0")} / 03`;
  findingLabel.textContent = finding.label;
  details.setAttribute("aria-labelledby", tabs[index].id);
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  copyButton.querySelector("span").textContent = "Copy fix guidance";
  if (focus) tabs[index].focus();
}

for (const tab of tabs) {
  tab.addEventListener("click", () => selectFinding(Number(tab.dataset.finding)));
  tab.addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Number(tab.dataset.finding);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    selectFinding(next, true);
  });
}

copyButton.addEventListener("click", async () => {
  const value = examples[activeFinding].guidance;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard not available");
    await navigator.clipboard.writeText(value);
    copyButton.querySelector("span").textContent = "Copied to clipboard";
  } catch {
    copyButton.querySelector("span").textContent = "Copy unavailable";
  }
});

const menuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  mobileNav.classList.remove("open");
  mobileNav.inert = true;
}
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  if (expanded) return closeMenu();
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  mobileNav.inert = false;
  mobileNav.classList.add("open");
});
mobileNav.querySelectorAll("a, button").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => { if (window.innerWidth > 800) closeMenu(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
document.addEventListener("click", event => {
  if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

const launchDialog = document.getElementById("announcement-modal");
document.querySelectorAll(".launch-trigger").forEach(button => button.addEventListener("click", () => {
  closeMenu();
  launchDialog.showModal();
}));
const policyDialog = document.getElementById("policy-modal");
const policyTitle = document.getElementById("policy-title");
const policyCopy = document.getElementById("policy-copy");
document.querySelectorAll(".policy-trigger").forEach(button => button.addEventListener("click", () => {
  const privacy = button.dataset.policy === "privacy";
  policyTitle.textContent = privacy ? "Privacy, before anything else." : "Terms, before launch.";
  policyCopy.textContent = privacy
    ? "This landing page preview does not collect source code, GitHub credentials, or payments. A complete privacy policy and data-handling details will be published before scanning is enabled."
    : "Risklume's security assessment and checkout are not currently active. Service terms, scope, and limitations will be published before public access begins.";
  policyDialog.showModal();
}));
for (const dialog of [launchDialog, policyDialog]) {
  dialog.addEventListener("click", event => {
    // Clicking the shaded backdrop closes the dialog, without interfering with inner content.
    if (event.target === dialog) dialog.close();
  });
}

document.getElementById("copyright-year").textContent = new Date().getFullYear();

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("in-view"));
} else if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .07 });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}