Business logic flow prompts
Dashboard → Quest click
When the user taps the quest card on the dashboard, 
define the following interaction flow:

1. Card scales down to 0.97 on press (spring animation, 
   200ms), then navigates to Quest Detail screen.

2. Quest Detail screen slides in from the right 
   (standard iOS push navigation, 350ms ease-out).

3. If the quest has less than 24 hours remaining, 
   show a persistent amber banner at the top of 
   Quest Detail: "Deadline tomorrow — complete by 
   11:59pm or your stake is redirected." 
   Banner is dismissible with an X.

4. If the quest is already completed this week, 
   the "Confirm completion" button is replaced with 
   a green static state: checkmark icon + 
   "Completed this week" — non-tappable, 
   no hover state.

5. If the user has already requested a reschedule 
   this month, "Request reschedule" button is 
   greyed out with tooltip on long press: 
   "One reschedule per month — resets on the 1st."

State to track: quest_status 
(active / completed / expired / rescheduled)

Quest → Confirm completion button
When the user taps "Confirm completion":

1. Show a bottom sheet modal (slides up, 
   300ms spring). Modal contains:
   — Heading: "Confirm your quest"
   — Body: "Your group will be notified. 
     The $50 voucher will be unlocked 
     within 24 hours."
   — Two buttons: solid purple "Yes, I did it" 
     and ghost "Cancel".

2. On "Yes, I did it":
   — Full-screen success state: 
     purple gradient background, 
     white checkmark animation (Lottie, 600ms), 
     heading "Quest complete", 
     subtext "Your group has been notified. 
     Voucher incoming.", 
     single button "Back to home" in white outline.
   — Haptic feedback: success notification pattern.
   — Push notification sent to group members: 
     "[Name] completed this week's quest 🎯"

3. On cancel: bottom sheet dismisses downward, 
   returns to Quest Detail unchanged.

4. Error state (if verification fails): 
   inline red banner below the button: 
   "We couldn't verify this — try again or 
   contact support." Button returns to active state.

State transitions: active → confirming → completed
Do not allow double submission — disable button 
immediately on first tap.

Quest → Request reschedule button
When the user taps "Request reschedule":

1. Bottom sheet slides up with:
   — Heading: "Reschedule this quest"
   — Body: "Your group won't be penalised. 
     You get one reschedule per month. 
     The quest timer resets to 7 days."
   — Text input field: "Reason (optional)" 
     with placeholder "Unexpected expense, 
     illness, travel…"
   — Character counter: 0/120 shown bottom-right 
     of input, turns amber at 100+.
   — Two buttons: purple "Reschedule" and 
     ghost "Cancel".

2. On confirm:
   — Quest card on dashboard updates: 
     amber "Rescheduled" badge replaces 
     "3 days left" badge.
   — Timer resets to 7 days from today.
   — Group dashboard shows: 
     "[Name] rescheduled this week — 
     no penalty applied."
   — Reschedule counter for the month 
     decrements by 1 (stored in user state).

3. If reschedule limit reached (1/month used):
   Button is disabled. On tap: 
   toast notification at bottom: 
   "Reschedule limit reached — 
   resets on [date of next month 1st]."

Group view → Member row tap
When the user taps a member row in the group view:

1. Slide to Member Profile screen (push right).

2. Member Profile contains:
   — Avatar, name, "member since" date.
   — Their streak history as a 
     12-week calendar grid: 
     green tiles = completed, 
     red = missed, gray = upcoming, 
     amber = rescheduled.
   — Their saved amount (only visible if that 
     member has set privacy to "visible" — 
     otherwise shows "Private").
   — Quest completion rate as a single 
     percentage stat.
   — A "Nudge" button: sends a push notification 
     to that member: "[Your name] is cheering 
     you on this week 👊"
     Limit: one nudge per member per week. 
     After use: button becomes ghost + 
     "Nudged this week" label.

3. Tapping your own row (the current user): 
   navigates to personal Settings / 
   Profile screen instead of Member Profile.

Privacy rule: never show another member's 
exact balance or transaction history — 
only streak status and completion rate.

New vault → Launch vault button
When the user taps "Launch vault":

1. Validate all required fields inline 
   before submission:
   — Goal name: required, min 2 chars. 
     Error: red border + 
     "Give your vault a name" below field.
   — Target amount: required, numeric, min $10. 
     Error: "Enter a target amount (min $10)"
   — Deadline: required, must be future date. 
     Error: "Pick a date in the future"
   — Goal type: required, has default so 
     rarely errors.
   — Friends: optional but if 0 added, 
     show a soft amber warning (not blocking): 
     "Vaults work best with a group — 
     add at least one friend?" with 
     "Add friend" and "Continue solo" options.

2. On valid submission:
   — Loading state on button: 
     spinner replaces text, button disabled.
   — Success: confetti animation (subtle, 
     purple/violet particles, 1.2s), 
     then navigate to Dashboard with 
     the new vault now showing as active.
   — Invited friends receive push notification: 
     "[Name] invited you to a savings pact 
     on Kova. Tap to join."

3. Friend invite chips:
   — Tapping "Add" opens contact picker 
     or search field.
   — Each chip has an X to remove.
   — Max 6 friends per vault.
   — If a friend is already in another 
     active vault with you, show gray chip 
     with "Already in a pact" tooltip.

Insights → Recommended quest tap
When the user taps a recommended quest row 
in the Insights screen:

1. Quest Preview bottom sheet slides up:
   — Shows the AI-generated quest in full.
   — Purple sparkle badge "Recommended for you".
   — Quest title, body explanation, 
     and estimated time to complete.
   — Two buttons: 
     "Add to this week" (purple solid) and 
     "See other options" (ghost).

2. "Add to this week":
   — Replaces current active quest 
     (if not yet started) OR 
     adds as a bonus quest 
     (if current quest is in progress).
   — Navigate to Quest Detail for the new quest.
   — Dashboard updates immediately.

3. "See other options":
   — Sheet expands to show 3 alternative 
     AI-generated quests in a scrollable list.
   — Each has a one-line rationale: 
     "Based on your month-end pattern" or 
     "Targets your investment avoidance".
   — Tapping any one confirms it as the quest.

UX refinement prompts
Reducing visual clutter
Audit the Kova app for visual clutter and apply 
the following reduction principles across all screens:

1. ONE primary action per screen.
   Every screen should have exactly one solid 
   purple CTA button. All secondary actions 
   (reschedule, cancel, view more) must be 
   ghost buttons or text links — never two 
   solid buttons competing on the same screen.

2. Section labels only where content changes type.
   Remove any section label that precedes only 
   one item. Labels are for grouping 3+ items 
   or separating fundamentally different 
   content types (e.g. stats vs. list vs. action).

3. Badge restraint.
   Maximum 2 badges visible on any single card. 
   If a card currently shows 3+ badges 
   (AI-generated + deadline + status), 
   consolidate: deadline + status merge into 
   one contextual badge that changes color 
   by urgency (green → amber → red).

4. Empty states over hidden elements.
   Never hide a section when it has no data. 
   Instead show a minimal empty state: 
   icon + one-line prompt. 
   Example: no group members yet → 
   single gray users icon + 
   "Invite friends to start your pact."

5. Progress indicators only when actionable.
   Remove progress bars that show 100% 
   or 0% with no action available. 
   Only show progress when the user 
   can do something to change it this week.

6. Muted text hierarchy.
   Three text levels only: 
   primary (#1A1A2E), 
   secondary (#6B7280), 
   muted (#9CA3AF). 
   Never use more than 3 type sizes per card. 
   Remove any labels that restate information 
   already shown in a nearby heading.

Typography and spacing consistency
Apply consistent spacing and type rules 
across all Kova screens:

SPACING SYSTEM (8pt grid):
— Screen edge padding: 20px left/right
— Between sections: 24px
— Between cards: 12px
— Inside card padding: 16px
— Between card rows: 12px
— Between label and content: 8px
— Button height: 52px
— Bottom nav height: 64px + safe area inset

TYPOGRAPHY SCALE (5 sizes only):
— Display: 28px / 700 — screen headings only
— Title: 20px / 600 — card headings
— Body: 14px / 400 — descriptions, body copy
— Caption: 12px / 500 — labels, badges, metadata
— Micro: 11px / 500 uppercase tracked — 
  section labels only

RULES:
— Never use bold (700) inside body copy — 
  use color or size contrast instead.
— All amounts ($696, 85%, 6 weeks) 
  use Title or Display size, never Body.
— Section labels always uppercase, 
  tracked +0.06em, muted color — 
  never the same weight as body text.
— Line height: 1.5 for body, 1.2 for 
  display and title sizes.

Touch target and interaction rules
Audit all interactive elements in Kova 
for touch usability:

MINIMUM TOUCH TARGETS:
— All tappable elements: 44x44px minimum 
  hit area (Apple HIG standard).
— Bottom nav items: full column width tap 
  area, not just the icon.
— Member rows in group view: 
  full row is tappable, not just the name.
— Chevrons and arrows: 
  extend tap area 12px beyond visual bounds.

FEEDBACK RULES:
— Every tap must have a visual response 
  within 100ms.
— Cards: scale(0.97) on press, spring back.
— Buttons: darken fill by 10% on press.
— Destructive actions (miss confirmation, 
  remove friend): require a second tap to confirm — 
  never single-tap destructive.
— Disabled states: 40% opacity, 
  no press animation, 
  cursor: not-allowed on web.

GESTURE RULES:
— Swipe right on any detail screen = back.
— Swipe down on bottom sheets = dismiss.
— Long press on streak pips = 
  tooltip showing that week's quest title.
— Pull to refresh on Dashboard and Group view.
— No horizontal scroll unless 
  content clearly bleeds off-screen 
  (vault card row only).

Error and empty state design
Define error and empty states for all 
key screens in Kova:

EMPTY STATES:
Dashboard — no active vault:
  Centered illustration (abstract purple vault shape), 
  heading "Start your first pact", 
  body "Set a goal, invite your group, 
  and stake the pool.", 
  single purple CTA "Create a vault".

Group view — no members yet:
  Users icon in muted gray, 
  "Invite friends to start your pact", 
  text link "Send invites".

Quest — no quest this week:
  Target icon muted, 
  "Your next quest is being generated", 
  body "The AI creates your quest each Monday 
  based on last week's spending.", 
  no CTA — informational only.

Insights — fewer than 3 weeks of data:
  Chart icon muted, 
  "Not enough data yet", 
  body "Complete 3 quests and 
  your behaviour patterns will appear here.", 
  progress indicator: "2 of 3 quests done".

ERROR STATES:
Network error (any screen): 
  Inline banner at top (not full-screen takeover): 
  red border, wifi-off icon, 
  "No connection — showing last saved data", 
  retry link on right.

Payment/pool error: 
  Bottom sheet (not inline): 
  heading "Something went wrong", 
  body explains specifically what failed, 
  two options: retry and contact support. 
  Never show a raw error code to the user.

Form validation: 
  Inline, below the specific field that errored. 
  Never a modal for form errors. 
  Red border on field, 
  red caption text below, 
  field label turns red. 
  Scroll to first error automatically on submit.

Accessibility and contrast
Apply accessibility standards to all Kova screens:

COLOR CONTRAST (WCAG AA minimum):
— Body text on white card: 
  #1A1A2E on #FFFFFF = 17.5:1 ✓
— Body text on lavender bg: 
  #1A1A2E on #F0EFFE — verify passes 4.5:1.
— Purple text on white: 
  #7B61FF on #FFFFFF = check — if failing 4.5:1, 
  darken to #5B41DF for text use only.
— White text on purple gradient cards: 
  verify at darkest point of gradient.
— Amber badge text (#92400E) 
  on amber bg (#FEF3C7): verify 4.5:1.
— Never use color as the only 
  differentiator — pair with icon or label 
  (e.g. green pip + checkmark, 
  not just green pip alone).

MOTION:
— All animations respect 
  prefers-reduced-motion: reduce.
— If reduced motion: 
  replace scale/slide animations with 
  instant opacity crossfade (150ms).
— Lottie animations: 
  provide static fallback frame.

SCREEN READER:
— All icon-only buttons have aria-label.
— Streak pips: aria-label reads 
  "Week 1: completed, Week 2: missed, 
  Week 3: upcoming" — not just colored dots.
— Progress bars: aria-valuenow, 
  aria-valuemin, aria-valuemax set.
— Bottom nav: 
  active tab has aria-current="page".
— Amount fields: 
  currency announced in aria-label 
  ("696 dollars saved of 1200 dollar goal").