

## Fix Build Errors & Complete Missing Features

### Problem
1. **Build error**: `src/components/ui/chart.tsx` has TypeScript errors with recharts v3 — the shadcn chart component was written for recharts v2 types
2. **Missing pages**: Pages 6.3 (Course Roadmap) and 6.4 (Learning/Quiz) from the prompt are not implemented
3. **Minor**: The `supabase/functions` directory doesn't exist (non-blocking warning)

### Plan

#### Step 1: Fix chart.tsx build errors
Replace the shadcn chart.tsx component with a version compatible with recharts v3. The key issues are that `payload`, `label`, and `LegendProps` types changed in recharts v3. Will add explicit type casts to fix the TS errors.

#### Step 2: Add Page 6.3 — Course Roadmap (`/course/:id/roadmap`)
- New page showing a vertical list of 10 module cards per course (e.g., "Intro to Java", "OOP Concepts", etc.)
- Each module has a "Start" button linking to Page 6.4
- Uses the course's existing `modules` array from `courses.ts`
- Back button to Course Details
- SIKER branding in header

#### Step 3: Add Page 6.4 — Learning & Quiz (`/course/:id/module/:moduleIndex`)
- Displays placeholder tutor notes section
- "Module Quiz" section with 3-5 MCQs and instant feedback (correct/incorrect highlighting)
- "Back to Modules" button
- SIKER branding in header

#### Step 4: Update routing
- Add new routes in `App.tsx`:
  - `/course/:id/roadmap` → Roadmap page
  - `/course/:id/module/:moduleIndex` → Learning page
- Update the "Enroll" button flow: after enrollment success, "Done" navigates to the roadmap (or dashboard keeps the current behavior, and enrolled courses in the sidebar link to the roadmap)

#### Step 5: Create `supabase/functions` directory
- Add an empty `.keep` file to prevent the build warning

### Technical Details
- Chart fix: Cast `payload` and `label` props with `as any` in the tooltip/legend content components to satisfy recharts v3 types
- New pages follow existing patterns: framer-motion fade-in, cream background, rounded-2xl cards, SIKER header
- Quiz data will be hardcoded per module with sample MCQs

