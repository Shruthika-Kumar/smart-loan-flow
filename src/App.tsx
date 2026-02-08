import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Applicant Portal - Auth
import Login from "./pages/applicant/Login";
import Register from "./pages/applicant/Register";
import VerifyOTP from "./pages/applicant/VerifyOTP";
import CompleteKYC from "./pages/applicant/CompleteKYC";

// Applicant Portal - Main
import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import LoanApplication from "./pages/applicant/LoanApplication";
import ApplicationTracking from "./pages/applicant/ApplicationTracking";
import MyLoans from "./pages/applicant/MyLoans";

// Officer Portal
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import ApplicationList from "./pages/officer/ApplicationList";
import ApplicationDetail from "./pages/officer/ApplicationDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Index />} />

          {/* Applicant Portal - Auth Routes */}
          <Route path="/applicant/login" element={<Login />} />
          <Route path="/applicant/register" element={<Register />} />
          <Route path="/applicant/verify-otp" element={<VerifyOTP />} />
          <Route path="/applicant/complete-kyc" element={<CompleteKYC />} />

          {/* Applicant Portal - Main Routes */}
          <Route path="/applicant" element={<ApplicantDashboard />} />
          <Route path="/applicant/apply" element={<LoanApplication />} />
          <Route path="/applicant/track" element={<ApplicationTracking />} />
          <Route path="/applicant/loans" element={<MyLoans />} />

          {/* Officer Portal Routes */}
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/applications" element={<ApplicationList />} />
          <Route path="/officer/applications/:id" element={<ApplicationDetail />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
