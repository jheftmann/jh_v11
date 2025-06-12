// --- Prevent Overlap Logic (easy to undo) ---
if (typeof window._prevOverlaySectionBottom === 'number' && top < window._prevOverlaySectionBottom) {
  top = window._prevOverlaySectionBottom + 50; // Add 50px vertical space when pushed down
}
section.style.top = top + 'px';
const sectionHeight = section.offsetHeight;
if (top + sectionHeight > maxBottom) {
  maxBottom = top + sectionHeight;
}
window._prevOverlaySectionBottom = top + sectionHeight;
// --- End Prevent Overlap Logic --- 