import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Banknote,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { AmortizationSchedule } from "@/components/loan/AmortizationSchedule";
import { SignatureModal } from "@/components/loan/SignatureModal";
import { calculateEligibility, EligibilityResult } from "@/lib/calculations";

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedLoanForSigning, setSelectedLoanForSigning] = useState<string | null>(null);
  const [actionableDocs, setActionableDocs] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [documents, setDocuments] = useState<any[]>([]); // Added documents state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setLoading(true);

          // 1. Fetch Latest Profile (for real-time KYC/Profile status)
          const userRes = await api.get("/users/profile");
          const latestUser = userRes.data;
          setUser(latestUser);
          localStorage.setItem("user", JSON.stringify(latestUser));

          // 2. Fetch Loans
          const loansRes = await api.get(`/loans/user/${latestUser.id || latestUser._id}`);
          const fetchedLoans = loansRes.data;
          setLoans(fetchedLoans);

          // 3. Fetch Documents
          const docsRes = await api.get(`/documents/user/${latestUser.id || latestUser._id}`);
          setDocuments(docsRes.data); // Set general documents state
          const needsAction = docsRes.data.filter((doc: any) => doc.status === 're-upload_required');
          setActionableDocs(needsAction);

        } else {
          // No user data in localStorage, set loading to false
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loans.length > 0) {
      // Find the most recent loan with income information
      const latestLoan = [...loans].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      if (latestLoan && latestLoan.monthlyIncome) {
        const result = calculateEligibility({
          monthlyIncome: latestLoan.monthlyIncome,
          existingEMIs: 0,
          requestedAmount: latestLoan.amount,
          tenureYears: latestLoan.tenure || 5,
          interestRate: 8.5,
        });
        setEligibility(result);
      }
    }
  }, [loans]);

  const fetchUserDocuments = async (userId: string) => {
    try {
      const response = await api.get(`/documents/user/${userId}`);
      const needsAction = response.data.filter((doc: any) => doc.status === 're-upload_required');
      setActionableDocs(needsAction);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchUserLoans = async (userId: string) => {
    try {
      const response = await api.get(`/loans/user/${userId}`);
      setLoans(response.data);
    } catch (error: any) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs from real data
  const activeLoans = loans.filter(loan => loan.status === "Pending").length;
  const approvedLoans = loans.filter(loan => loan.status === "Approved");
  const totalLoanAmount = approvedLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const recentLoans = loans.slice(0, 2);

  const calculateTotalEMI = () => {
    return approvedLoans.reduce((total, loan) => {
      const monthlyEMI = loan.amount / (loan.tenure * 12);
      return total + monthlyEMI;
    }, 0);
  };

  const totalMonthlyEMI = calculateTotalEMI();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status: string): "pending" | "approved" | "rejected" | "processing" => {
    const statusMap: Record<string, "pending" | "approved" | "rejected" | "processing"> = {
      "Pending": "processing",
      "Approved": "approved",
      "Rejected": "rejected"
    };
    return statusMap[status] || "pending";
  };

  return (
    <ApplicantLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.username || user?.fullName || "User"}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your loan applications and financial health.
            </p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/applicant/apply">
              <FileText className="mr-2 h-4 w-4" />
              Apply for New Loan
            </Link>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Apply Now", icon: FileText, href: "/applicant/apply", color: "text-blue-500", bg: "bg-blue-500/10" },
            { name: "Track Status", icon: Clock, href: "/applicant/track", color: "text-accent", bg: "bg-accent/10" },
            { name: "Upload Docs", icon: Banknote, href: "/applicant/documents", color: "text-green-500", bg: "bg-green-500/10" },
            { name: "My Profile", icon: UserCheck, href: "/applicant/profile", color: "text-purple-500", bg: "bg-purple-500/10" }
          ].map((action) => (
            <Link key={action.name} to={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Card className="glass-card hover:border-accent/50 transition-all cursor-pointer group hover-lift">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className={`p-3 rounded-xl ${action.bg} group-hover:scale-110 transition-transform`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <span className="text-sm font-semibold">{action.name}</span>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0 shadow-xl hover:shadow-2xl transition-all duration-300 glow-primary">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <UserCheck className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold">Profile Verification</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      {user?.kycStatus === 'verified' ? '✓ Your profile is fully verified' : 'Complete your KYC to unlock higher loan limits'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs uppercase tracking-wider opacity-70">Completion</p>
                    <p className="text-3xl font-bold">
                      {user?.kycStatus === 'verified' ? '100%' : '85%'}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg"
                    disabled={user?.kycStatus === 'verified'}
                  >
                    <Link to="/applicant/kyc">
                      {user?.kycStatus === 'verified' ? '✓ Verified' : 'Complete KYC'}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4 w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-white h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: user?.kycStatus === 'verified' ? '100%' : '85%' }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Required Alerts */}
        {actionableDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-risk-high/10 border border-risk-high/20 rounded-xl p-4 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-risk-high/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-risk-high" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-risk-high">Action Required</h3>
              <p className="text-sm text-risk-high/80">
                {actionableDocs.length} document{actionableDocs.length > 1 ? 's' : ''} require re-upload. Please visit the documents section to correct them.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="bg-risk-high text-white hover:bg-risk-high/90"
                  onClick={() => navigate("/applicant/documents")}
                >
                  Go to Documents
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Active Applications"
            value={activeLoans.toString()}
            icon={FileText}
            subtitle="In progress"
          />
          <KPICard
            title="Total Approved"
            value={formatCurrency(totalLoanAmount)}
            icon={TrendingUp}
            subtitle="Check eligibility for more"
            variant="accent"
          />
          <KPICard
            title="Monthly EMI"
            value={formatCurrency(totalMonthlyEMI)}
            icon={CreditCard}
            subtitle="Next due in 12 days"
            variant="danger"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Eligibility & Health */}
          <Card className="lg:col-span-1 glass-card hover-lift">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Financial Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Probability */}
              <div className="text-center">
                <GaugeChart
                  value={eligibility ? eligibility.approvalProbability : 78}
                  label="Loan Approval Probability"
                  size="lg"
                  variant="risk"
                />
              </div>

              {/* DTI Ratio */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Debt-to-Income Ratio</span>
                  <span className={`font-medium ${eligibility && eligibility.dtiRatio < 40 ? 'text-risk-low' : 'text-risk-medium'}`}>
                    {eligibility ? `${eligibility.dtiRatio}%` : "32%"}
                  </span>
                </div>
                <Progress value={eligibility ? eligibility.dtiRatio : 32} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {eligibility ? (eligibility.dtiRatio < 40 ? "✓ Healthy range" : "⚠ Above recommendation") : "Recommended: Below 40%"}
                </p>
              </div>

              {/* Suggested Loan Range */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Suggested Loan Range</p>
                <p className="text-2xl font-bold text-accent">
                  {eligibility ? `₹${(eligibility.suggestedLoanAmount * 0.5 / 100000).toFixed(0)}L - ₹${(eligibility.suggestedLoanAmount / 100000).toFixed(0)}L` : "₹25L - ₹55L"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {eligibility ? "Based on your verified income data" : "Based on your income and credit profile"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="lg:col-span-2 glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/applicant/track">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading your applications...
                </div>
              ) : recentLoans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No loan applications yet</p>
                  <Button asChild>
                    <Link to="/applicant/apply">Apply for Your First Loan</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLoans.map((loan, index) => (
                    <motion.div
                      key={loan._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{loan.purpose || "Loan Application"}</p>
                          <p className="text-sm text-muted-foreground">
                            {loan._id?.substring(0, 12)}... • {formatDate(loan.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                        <StatusBadge status={getStatusBadge(loan.status)} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* EMI Preview */}
              {recentLoans.length > 0 && (
                <div className="mt-6 p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-3">EMI Preview - {recentLoans[0].purpose}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        ₹{Math.round(recentLoans[0].amount / (recentLoans[0].tenure * 12)).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly EMI (approx)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">8.5%</p>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{recentLoans[0].tenure} yrs</p>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                    </div>
                  </div>
                  {recentLoans[0].status === "Approved" && recentLoans[0].signatureStatus !== "signed" && (
                    <div className="mt-4">
                      <Button
                        className="w-full gradient-primary gap-2"
                        onClick={() => setSelectedLoanForSigning(recentLoans[0]._id)}
                      >
                        <UserCheck className="w-4 h-4" />
                        Sign Sanction Letter
                      </Button>
                    </div>
                  )}
                  {recentLoans[0].signatureStatus === "signed" && (
                    <div className="mt-4 p-2 bg-green-50 text-green-700 text-xs rounded border border-green-200 flex items-center justify-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Agreement Digitally Signed
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Button variant="ghost" size="sm">
                Mark all
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading...
                </div>
              ) : loans.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="space-y-3">
                  {loans.slice(0, 3).map((loan, index) => (
                    <motion.div
                      key={loan._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${loan.status === "Approved"
                          ? "bg-risk-low/10 text-risk-low"
                          : loan.status === "Rejected"
                            ? "bg-risk-high/10 text-risk-high"
                            : "bg-status-processing/10 text-status-processing"
                          }`}
                      >
                        {loan.status === "Approved" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : loan.status === "Rejected" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">
                          Application {loan.status}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {loan.purpose} - {formatCurrency(loan.amount)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repayment Schedule */}
          <div className="lg:col-span-2">
            {recentLoans.length > 0 && recentLoans[0].status === "Approved" ? (
              <AmortizationSchedule
                principal={recentLoans[0].amount}
                annualRate={8.5}
                tenureYears={recentLoans[0].tenure}
              />
            ) : (
              <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20 border-dashed">
                <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <CardTitle className="text-lg text-muted-foreground">Amortization Schedule</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Once your loan is approved, you'll see a detailed breakdown of your interest and principal payments here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={!!selectedLoanForSigning}
        onClose={() => setSelectedLoanForSigning(null)}
        loanId={selectedLoanForSigning || ""}
        onSuccess={() => user && fetchUserLoans(user.id)}
      />
    </ApplicantLayout>
  );
}
