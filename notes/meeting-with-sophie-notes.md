### Post-Meeting Debrief: Zodiac’s Position

- Customer (Mari/Marie, Director of Crewing) refused to compromise: build everything, no MVP
- Frustration that she objected to “promotion management” when they already use two systems today
  - Currently split across OS and the intranet; a single system is strictly better, not worse
- Richard and Kieran showed no backbone: agreed to full scope with no pushback
- Deadline pressure: requirements, designs, and estimates needed almost immediately, with a plan due Friday

### How Promotion Currently Works

- Ratings: crew operators handle directly, no workflow; moving to mining offices
- Junior officers/engineers: promotion done via joining approval workflow in OS, up to GFM only
- Senior officers and top four: done via intranet workflow, routed to Tech/Ops heads or department directors
- Ranks within ranks (e.g. E3 to E2, Fitter B to Fitter A): salary increase requires justification and approval
- Intranet form is manual: years in rank, past eval scores, license held, vessel-type experience, then sent for approval
  - Pain point: gets stuck with individuals, generates weeks of reminder memos before resolution
  - After approval, promotion is still done manually in OS (not auto-triggered)

### What to Actually Build

- Agreed the simple version is the right starting point: a form triggered at the point of promotion
  - Pre-populate: years in rank, past eval scores, link to evaluation page, license held, link to documents
  - Small free-text/attachment section for additional context
  - Workflow mirrors existing joining/applicant approval: configurable approvers, skip/pause/reject/approve
  - Notification via email with a link; workflow bar visible in UI
- End state: “Approved for Promotion” status; actual rank change remains a manual step
  - Avoids auto-promoting at the wrong moment (sign-on, mid-contract, pre-sign-on)
- Promotions dashboard (ranked candidates by eval score, license, vessel experience) is a separate, later workstream
  - Evaluation and experience modules already being built will feed into it naturally
- Multiple current entry points (crew directory rank change, promote button, evaluations) are a mess
  - Either consolidate to one place or make every entry point trigger the same consistent modal
- Seniority and inactive/active date-stamping raised as a related gap
  - Currently no audit log for status changes; intranet tracks dates and reasons, OS does not
  - Seniority resets after ~12 months out; payroll team manually adjusts additional earnings to compensate
  - Not in the top-five priority list but was quietly included under digital documents/letters
- New workflow engine (Peter’s): likely to be mandated even for this, adding scope and time
  - James lost the same argument for evaluations with Dalisay; expecting the same outcome here

### Next Steps

- **Produce a visual prototype of the promotion form and workflow** (James)
  - Share back for review before Friday's planning meeting.
- **Gather requirements, designs, and estimates from the team on promotion management** (James)
  - Needed urgently ahead of Friday's plan presentation.

---

Chat with meeting transcript: https://notes.granola.ai/t/9075aa1d-7fbf-4946-b4fb-c1bbee37512b