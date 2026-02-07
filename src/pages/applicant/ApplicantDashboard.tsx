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
} from "lucide-react";
import { Link } from "react-router-dom";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { Progress } from "@/components/ui/progress";

const recentApplications = [
  {
    id: "LN-2024-001234",
    type: "Home Loan",
    amount: "₹45,00,000",
    status: "processing" as const,
    date: "Jan 15, 2024",
  },
  {
    id: "LN-2024-001189",
    type: "Personal Loan",
    amount: "₹3,50,000",
    status: "approved" as const,
    date: "Dec 28, 2023",
  },
];

const notifications = [
  {
    id: 1,
    message: "Your home loan application is under review by the credit team.",
    time: "2 hours ago",
    type: "info",
  },
  {
    id: 2,
    message: "Document verification completed successfully.",
    time: "1 day ago",
    type: "success",
  },
  {
    id: 3,
    message: "Additional income proof required for LN-2024-001234.",
    time: "2 days ago",
    type: "warning",
  },
];

export default function ApplicantDashboard() {
  return (
    <ApplicantLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, John
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

        {/* Profile Completion */}
        <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Complete Your Profile</h3>
                <p className="text-sm text-primary-foreground/80">
                  A complete profile increases your loan approval chances by 40%
                </p>
              </div>
              <div className="flex items-center gap-4 min-w-[200px]">
                <Progress value={75} className="flex-1 h-2 bg-primary-foreground/20" />
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Active Applications"
            value="2"
            subtitle="In progress"
            icon={FileText}
            variant="accent"
          />
          <KPICard
            title="Total Loan Amount"
            value="₹48.5L"
            subtitle="Across all loans"
            icon={CreditCard}
          />
          <KPICard
            title="Credit Score"
            value="742"
            subtitle="Excellent"
            icon={TrendingUp}
            variant="accent"
            trend={{ value: 12, label: "vs last month" }}
          />
          <KPICard
            title="Next EMI Due"
            value="₹28,450"
            subtitle="Due in 15 days"
            icon={Banknote}
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Eligibility & Health */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Financial Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Probability */}
              <div className="text-center">
                <GaugeChart
                  value={78}
                  label="Loan Approval Probability"
                  size="lg"
                  variant="risk"
                />
              </div>

              {/* DTI Ratio */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Debt-to-Income Ratio</span>
                  <span className="font-medium text-risk-low">32%</span>
                </div>
                <Progress value={32} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Recommended: Below 40%
                </p>
              </div>

              {/* Suggested Loan Range */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Suggested Loan Range</p>
                <p className="text-2xl font-bold text-accent">
                  ₹25L - ₹55L
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on your income and credit profile
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="lg:col-span-2">
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
              <div className="space-y-4">
                {recentApplications.map((app, index) => (
                  <motion.div
                    key={app.id}
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
                        <p className="font-medium">{app.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.id} • {app.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{app.amount}</p>
                      <StatusBadge status={app.status} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* EMI Preview */}
              <div className="mt-6 p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-3">EMI Preview - Home Loan</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">₹38,450</p>
                    <p className="text-xs text-muted-foreground">Monthly EMI</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">8.5%</p>
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">20 yrs</p>
                    <p className="text-xs text-muted-foreground">Tenure</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
            <Button variant="ghost" size="sm">
              Mark all as read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === "success"
                        ? "bg-risk-low/10 text-risk-low"
                        : notification.type === "warning"
                        ? "bg-risk-medium/10 text-risk-medium"
                        : "bg-status-processing/10 text-status-processing"
                    }`}
                  >
                    {notification.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : notification.type === "warning" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ApplicantLayout>
  );
}
