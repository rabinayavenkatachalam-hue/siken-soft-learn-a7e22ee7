import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import SelectRole from "./pages/SelectRole";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import CreateAccount from "./pages/CreateAccount";
import StudentDashboard from "./pages/StudentDashboard";
import CourseDetails from "./pages/CourseDetails";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import TutorDashboard from "./pages/TutorDashboard";
import TutorHome from "./pages/tutor/TutorHome";
import TutorCourses from "./pages/tutor/TutorCourses";
import TutorResources from "./pages/tutor/TutorResources";
import TutorAssignments from "./pages/tutor/TutorAssignments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/enrollment-success" element={<EnrollmentSuccess />} />
            <Route path="/dashboard/tutor" element={<TutorDashboard />}>
              <Route index element={<TutorHome />} />
              <Route path="courses" element={<TutorCourses />} />
              <Route path="resources" element={<TutorResources />} />
              <Route path="assignments" element={<TutorAssignments />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
