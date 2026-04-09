

## SIKER — Peaceful Education Learning Portal

### Design System
- **Palette**: Off-white (#F9FAFB) backgrounds, soft sage green buttons/accents, muted periwinkle blues, white cards
- **Style**: `rounded-2xl` corners, generous whitespace, soft shadows
- **Animations**: Framer Motion fade-ins, slide transitions, shake on errors
- **Branding**: "SIKER" logo text on every page header

### Backend (Supabase via Lovable Cloud)
- **Auth**: Email/password signup via Supabase Auth
- **Tables**:
  - `profiles` (id, user_id FK→auth.users, username, role ENUM('student','tutor'), mobile_number) with composite unique on (username, role)
  - `user_roles` (id, user_id, role) for RBAC
  - `courses` (id, title, description, image_url, provider, skills, rating, reviews_count, level, duration)
  - `enrollments` (id, student_id, course_id, enrolled_at)
  - `assignments` (id, tutor_id, title, type, content_url, course_name, due_date, status, created_at)
  - `tutor_resources` (id, tutor_id, name, image_url, uploaded_at)
- **RLS**: Role-segregated policies — students see only student data, tutors see only tutor data
- **Storage buckets**: `student-uploads`, `tutor-materials`, `assignment-files`

### Pages

#### Page 1: Landing Page (`/`)
- Header with "SIKER" logo + rounded search bar
- Hero section with "Welcome to SIKER" heading, subtitle, large oval "Sign In / Sign Up" button
- Popular Courses infinite-sliding carousel (Java, C++, JavaScript, Python cards with colored circle icons)
- Guard: clicking course while logged out shows soft modal "Sign in to see full details"

#### Page 2: Role Selection (`/select-role`)
- "Who's Logging in?" heading
- Two large minimalist circles: "TUTOR!" and "STUDENT"
- Chevron-shaped "Continue" button, disabled until role selected
- Selected role stored in global context

#### Page 3: Sign In (`/sign-in`)
- Centered white card, "Sign In" heading, "Signing In As [Role]" subheading
- Username + Password fields (with show/hide eye icon toggle, Caps Lock warning)
- Sage green "Sign In" button
- Validates against DB with role check — shows "Account role mismatch" or generic "Invalid username or password"
- "Forgot Password?" → Page 4, "Create Account" → Page 5
- Google & Apple social login icons (visual, using Lovable Cloud auth)
- Shake animation on error via framer-motion

#### Page 4: Reset Password (`/reset-password`)
- Centered card: Username, New Password (eye toggle), Confirm Password (eye toggle), math captcha
- Checks username exists in DB for the selected role
- Validates password match, updates in DB
- Success toast + redirect to Sign In
- Loading spinner on "Done" button

#### Page 5: Create Account (`/create-account`)
- Centered card: Email, Username, Password (6 chars exactly), Math Captcha
- Validates email format, alphanumeric username, checks uniqueness
- Creates auth user + profile with role
- Success animation → redirect to Student Dashboard (Page 6) or Tutor Dashboard (Page 7)

#### Page 6: Student Dashboard (`/dashboard/student`)
- Header: hamburger menu + avatar + "Welcome, [name]!" + subtitle
- Search bar filtering courses in real-time
- Grid of 20 predefined course cards with images, provider, skills, rating, level, duration, "View Course Details" button
- Hamburger opens sidebar "My Learning" — shows enrolled courses or "No courses enrolled"

#### Page 6.1: Course Details (`/course/:id`)
- Back button, course image, title
- Sections: Objectives, Prerequisites, Structured Content, Assessments, Progress Tracking, Certification
- "Enroll" button at bottom

#### Page 6.2: Enrollment Success (`/enrollment-success`)
- Confirmation message with course name
- Schedule card: Start Date (today), End Date (+4 months)
- "Done" button → back to dashboard, updates enrolled courses state

#### Page 7: Tutor Dashboard (`/dashboard/tutor`)
- Fixed sidebar: SIKER logo, Dashboard, My Courses, Assignments, Resources (Lucide icons)
- Header: "Welcome back, [Name]!" + "Upload Notes" button (max 5 images, name the upload)
- Main grid:
  - Weekly schedule (Mon-Fri) with color-coded blocks (Live Lectures, Grading, Office Hours)
  - Upcoming Today list with timestamps
  - Active Courses summary cards (students count, new submissions)
- Analytics row: Performance line chart (recharts), Attention Required alerts
- Activity feed: Recent submissions + messages

#### Page 7.1: My Courses (`/dashboard/tutor/courses`)
- Grid of tutor's assigned courses with student enrollment counts and new submissions

#### Page 7.2: Assignments (`/dashboard/tutor/assignments`)
- Empty state: illustration + "No assignments created yet" + "+ Create Assignment" button
- Active state: list/grid of assignment cards with title, type, date, edit/delete icons
- Create modal: title field, choice of Quiz Link or Document upload, validation (PDF/DOCX/images, 10MB limit), loading bar
- CRUD operations with Supabase, success toasts

#### Page 7.3: Resources (`/dashboard/tutor/resources`)
- Grid gallery of uploaded note images with dates
- Click to view in popup/lightbox
- Empty state: "Not uploaded any notes" + "Okay" button → back to dashboard

### Global State & Routing
- `UserContext` providing role, auth status, user info, enrolled courses
- Protected routes: student routes blocked for tutors and vice versa
- Role persists through auth flow (Pages 2→3→4/5→6/7)
- React Router with all routes defined

