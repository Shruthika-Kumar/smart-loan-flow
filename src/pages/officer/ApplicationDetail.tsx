import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Briefcase,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Upload,
  Download,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const applicationData = {
  id: "LN-2024-002547",
  applicant: {
    name: "Rajesh Kumar",
    pan: "ABCPK1234A",
    aadhaar: "XXXX XXXX 5678",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    dob: "15 Mar 1985",
    maritalStatus: "Married",
    dependents: 2,
    address: "123 MG Road, Bangalore, Karnataka 560001",
    residentialType: "Owned",
  },
  employment: {
    type: "Salaried",
    company: "Tech Solutions Pvt Ltd",
    designation: "Senior Software Engineer",
    monthlyIncome: 185000,
    experience: "8 years",
    employmentStartDate: "Jan 2020",
  },
  loan: {
    type: "Home Loan",
    requestedAmount: 5500000,
    approvedAmount: null,
    propertyValue: 7500000,
    downPayment: 2000000,
    tenure: 20,
    interestType: "Floating",
    propertyLocation: "Whitefield, Bangalore",
    purpose: "Purchase of residential property",
  },
  documents: [
    { name: "PAN Card", status: "verified", uploadDate: "Jan 15, 2024" },
    { name: "Aadhaar Card", status: "verified", uploadDate: "Jan 15, 2024" },
    { name: "Salary Slips (3 months)", status: "verified", uploadDate: "Jan 15, 2024" },
    { name: "Bank Statement (6 months)", status: "verified", uploadDate: "Jan 15, 2024" },
    { name: "Property Documents", status: "pending", uploadDate: "Jan 15, 2024" },
    { name: "Form 16", status: "verified", uploadDate: "Jan 15, 2024" },
  ],
  riskAssessment: {
    creditScore: 742,
    riskLevel: "low" as const,
    approvalProbability: 85,
    dtiRatio: 28,
    fraudScore: 12,
    modelConfidence: 92,
    factors: [
      { name: "Credit History", impact: "positive", score: 92 },
      { name: "Income Stability", impact: "positive", score: 88 },
      { name: "Debt-to-Income", impact: "positive", score: 85 },
      { name: "Employment Duration", impact: "positive", score: 78 },
      { name: "Property Valuation", impact: "neutral", score: 70 },
    ],
  },
  timeline: [
    { action: "Application Submitted", date: "Jan 15, 2024 10:30 AM", user: "Applicant" },
    { action: "Documents Uploaded", date: "Jan 15, 2024 11:45 AM", user: "Applicant" },
    { action: "Assigned for Review", date: "Jan 15, 2024 02:00 PM", user: "System" },
    { action: "Document Verification Started", date: "Jan 16, 2024 09:15 AM", user: "Sarah Johnson" },
    { action: "AI Risk Assessment Completed", date: "Jan 16, 2024 09:30 AM", user: "System" },
  ],
  notes: [
    {
      author: "Sarah Johnson",
      date: "Jan 16, 2024",
      content: "Strong income profile. Property documents pending verification from registrar.",
    },
  ],
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ApplicationDetail() {
  const { id } = useParams();

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/officer/applications">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{applicationData.id}</h1>
              <StatusBadge status="review" />
              <RiskBadge level={applicationData.riskAssessment.riskLevel} />
            </div>
            <p className="text-muted-foreground">
              {applicationData.loan.type} • {formatCurrency(applicationData.loan.requestedAmount)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Request Docs
            </Button>
            <Button variant="outline" className="gap-2 text-risk-high border-risk-high/30 hover:bg-risk-high/10">
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button className="gap-2 bg-risk-low hover:bg-risk-low/90">
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="applicant" className="space-y-6">
              <TabsList>
                <TabsTrigger value="applicant" className="gap-2">
                  <User className="h-4 w-4" />
                  Applicant
                </TabsTrigger>
                <TabsTrigger value="employment" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Employment
                </TabsTrigger>
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="risk" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="applicant">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{applicationData.applicant.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">PAN Number</p>
                          <p className="font-mono">{applicationData.applicant.pan}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                          <p className="font-mono">{applicationData.applicant.aadhaar}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p>{applicationData.applicant.dob}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{applicationData.applicant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{applicationData.applicant.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Marital Status</p>
                          <p>{applicationData.applicant.maritalStatus}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dependents</p>
                          <p>{applicationData.applicant.dependents}</p>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Address</p>
                      <p>{applicationData.applicant.address}</p>
                      <Badge variant="outline" className="mt-2">
                        {applicationData.applicant.residentialType}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employment">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Employment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Employment Type</p>
                          <p className="font-medium">{applicationData.employment.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Company Name</p>
                          <p>{applicationData.employment.company}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Designation</p>
                          <p>{applicationData.employment.designation}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Income</p>
                          <p className="text-xl font-bold text-accent">
                            {formatCurrency(applicationData.employment.monthlyIncome)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Experience</p>
                          <p>{applicationData.employment.experience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Employment Since</p>
                          <p>{applicationData.employment.employmentStartDate}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {applicationData.documents.map((doc) => (
                        <div
                          key={doc.name}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded: {doc.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                doc.status === "verified"
                                  ? "border-risk-low/30 text-risk-low"
                                  : "border-risk-medium/30 text-risk-medium"
                              }
                            >
                              {doc.status === "verified" ? "✓ Verified" : "Pending"}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Score Gauges */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <GaugeChart
                          value={applicationData.riskAssessment.approvalProbability}
                          label="Approval Probability"
                          size="md"
                          variant="risk"
                        />
                      </div>
                      <div className="text-center">
                        <GaugeChart
                          value={applicationData.riskAssessment.creditScore}
                          max={900}
                          label="Credit Score"
                          size="md"
                        />
                      </div>
                      <div className="text-center">
                        <GaugeChart
                          value={applicationData.riskAssessment.modelConfidence}
                          label="Model Confidence"
                          size="md"
                          variant="risk"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-medium mb-4">Risk Factor Analysis</h4>
                      <div className="space-y-3">
                        {applicationData.riskAssessment.factors.map((factor) => (
                          <div key={factor.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{factor.name}</span>
                              <span
                                className={`font-medium ${
                                  factor.impact === "positive"
                                    ? "text-risk-low"
                                    : factor.impact === "negative"
                                    ? "text-risk-high"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {factor.score}%
                              </span>
                            </div>
                            <Progress value={factor.score} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DTI & Fraud */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Debt-to-Income Ratio</p>
                        <p className="text-2xl font-bold text-risk-low">
                          {applicationData.riskAssessment.dtiRatio}%
                        </p>
                        <p className="text-xs text-muted-foreground">Healthy (&lt;40%)</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Fraud Probability</p>
                        <p className="text-2xl font-bold text-risk-low">
                          {applicationData.riskAssessment.fraudScore}%
                        </p>
                        <p className="text-xs text-muted-foreground">Low Risk</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Loan Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Type</span>
                    <span className="font-medium">{applicationData.loan.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested</span>
                    <span className="font-medium">
                      {formatCurrency(applicationData.loan.requestedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Value</span>
                    <span className="font-medium">
                      {formatCurrency(applicationData.loan.propertyValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Down Payment</span>
                    <span className="font-medium">
                      {formatCurrency(applicationData.loan.downPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenure</span>
                    <span className="font-medium">{applicationData.loan.tenure} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Type</span>
                    <span className="font-medium">{applicationData.loan.interestType}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Property Location</p>
                  <p className="text-sm">{applicationData.loan.propertyLocation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationData.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {index < applicationData.timeline.length - 1 && (
                          <div className="w-px h-full bg-border" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{event.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} • {event.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Internal Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicationData.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {note.author} • {note.date}
                    </p>
                  </div>
                ))}
                <div className="space-y-2">
                  <Textarea placeholder="Add a note..." className="min-h-[80px]" />
                  <Button size="sm" className="w-full">
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}
