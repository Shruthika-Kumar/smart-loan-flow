import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileSearch,
  UserCheck,
  CreditCard,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const applications = [
  {
    id: "LN-2024-001234",
    type: "Home Loan",
    amount: "₹45,00,000",
    appliedDate: "Jan 15, 2024",
    status: "processing" as const,
    currentStep: 3,
    timeline: [
      { step: "Submitted", date: "Jan 15, 2024", status: "completed", icon: CheckCircle2 },
      { step: "Document Verification", date: "Jan 16, 2024", status: "completed", icon: FileSearch },
      { step: "AI Risk Assessment", date: "Jan 17, 2024", status: "current", icon: Clock },
      { step: "Officer Review", date: "-", status: "pending", icon: UserCheck },
      { step: "Decision", date: "-", status: "pending", icon: CreditCard },
      { step: "Disbursement", date: "-", status: "pending", icon: Banknote },
    ],
    remarks: [
      { date: "Jan 16, 2024", message: "All documents verified successfully", type: "success" },
      { date: "Jan 17, 2024", message: "AI assessment in progress, estimated 2-3 hours", type: "info" },
    ],
    estimatedTime: "2-3 business days",
  },
  {
    id: "LN-2024-001189",
    type: "Personal Loan",
    amount: "₹3,50,000",
    appliedDate: "Dec 28, 2023",
    status: "approved" as const,
    currentStep: 6,
    timeline: [
      { step: "Submitted", date: "Dec 28, 2023", status: "completed", icon: CheckCircle2 },
      { step: "Document Verification", date: "Dec 28, 2023", status: "completed", icon: FileSearch },
      { step: "AI Risk Assessment", date: "Dec 29, 2023", status: "completed", icon: Clock },
      { step: "Officer Review", date: "Dec 30, 2023", status: "completed", icon: UserCheck },
      { step: "Approved", date: "Dec 30, 2023", status: "completed", icon: CreditCard },
      { step: "Disbursed", date: "Jan 02, 2024", status: "completed", icon: Banknote },
    ],
    remarks: [
      { date: "Dec 30, 2023", message: "Loan approved at 11.5% interest rate", type: "success" },
      { date: "Jan 02, 2024", message: "Amount disbursed to your bank account", type: "success" },
    ],
    estimatedTime: "Completed",
  },
];

export default function ApplicationTracking() {
  return (
    <ApplicantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Track Applications
          </h1>
          <p className="text-muted-foreground">
            Monitor the status of your loan applications
          </p>
        </div>

        {/* Applications */}
        <div className="space-y-6">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{app.type}</CardTitle>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {app.id} • Applied on {app.appliedDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{app.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      Est. completion: {app.estimatedTime}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Timeline */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {app.timeline.map((step, stepIndex) => (
                        <div
                          key={step.step}
                          className="flex flex-col items-center relative z-10"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.status === "completed"
                                ? "bg-risk-low text-white"
                                : step.status === "current"
                                ? "bg-status-processing text-white animate-pulse"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <step.icon className="h-5 w-5" />
                          </div>
                          <p
                            className={`text-xs mt-2 text-center max-w-[80px] ${
                              step.status === "pending"
                                ? "text-muted-foreground"
                                : "text-foreground font-medium"
                            }`}
                          >
                            {step.step}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.date}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
                      <div
                        className="h-full bg-risk-low transition-all duration-500"
                        style={{
                          width: `${((app.currentStep - 1) / (app.timeline.length - 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Recent Updates</h4>
                    {app.remarks.map((remark, remarkIndex) => (
                      <div
                        key={remarkIndex}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          remark.type === "success"
                            ? "bg-risk-low/10"
                            : remark.type === "warning"
                            ? "bg-risk-medium/10"
                            : "bg-status-processing/10"
                        }`}
                      >
                        {remark.type === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-risk-low mt-0.5" />
                        ) : remark.type === "warning" ? (
                          <AlertCircle className="h-4 w-4 text-risk-medium mt-0.5" />
                        ) : (
                          <Clock className="h-4 w-4 text-status-processing mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{remark.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {remark.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Upload Documents
                    </Button>
                    <Button variant="ghost" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </ApplicantLayout>
  );
}
