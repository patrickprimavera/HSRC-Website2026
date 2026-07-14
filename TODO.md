# TODO - Premium UI upgrade (admin.html)

## Plan (UI-only)
- [ ] Add premium statistic summary cards above the table/search panel (computed client-side from already-loaded rows; no new fetch).
- [ ] Add a right-side user details panel (opens when clicking ANY rendered row) showing applicant details + overall progress.
- [ ] Add animated step progress bar inside the side panel using the same already-loaded status data.
- [ ] Render passport thumbnail + click-to-open preview modal (UI-only).
- [ ] Replace the plain “Open File” link text with a premium “📄 View File” button without changing the URL or target.
- [ ] Add approve confirmation modal; on confirm, call existing updateStepStatus() exactly as existing onclick does.
- [ ] Add reject modal with dropdown + conditional textbox; on confirm, call existing updateStepStatus() exactly as existing onclick does.
- [ ] Add quick filter chips (All/Pending/Approved/Rejected) filtering the existing already-rendered rows client-side (no reload).
- [ ] Improve empty state with modern icon/description.
- [ ] Improve table UI: sticky header, hover, alternate colors, rounded container, smooth animations (CSS only).
- [ ] Redesign buttons: Approve/Reject/View File/Search/Clear/Loading (CSS only, keep onclick/IDs).
- [ ] Add responsive behavior: side panel full screen on mobile.
- [ ] Accessibility: spacing, readable fonts, contrast.
- [ ] Verification checklist: search/load/clear/approve/reject/view file/loading overlay all still work; IDs/functions unchanged; no backend changes.

## Implementation notes / guardrails
- Must NOT modify JS business logic or existing functions: loadSubmissions(), renderRows(), updateStepStatus(), normalizeStatus(), clearFilter(), showLoading(), setStatus().
- Must NOT modify fetch requests or payload/action values.
- Must NOT rename IDs, JS variables, or functions.
- Must NOT remove existing event listeners or HTML elements referenced by JS.

