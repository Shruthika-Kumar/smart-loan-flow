import { useState, useEffect } from "react";
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
import api from "@/lib/api";
import { Link } from "react-router-dom";

export default function ApplicationTracking() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const response = await api.get(`/loans/user/${user.id}`);
        setLoans(response.data);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this application?")) return;
    try {
      await api.patch(`/loans/${id}/status`, { status: "Rejected", notes: "Cancelled by user" });
      setLoans(prev => prev.map(l => l._id === id ? { ...l, status: "Rejected" } : l));
    } catch (error) {
      console.error("Error cancelling loan:", error);
    }
  };

  const formatCurrency = (amount: number) => {
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
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Track Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor the status of your loan applications in real-time
          </p>
        </div>

        {/* Applications */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your applications...</p>
          </div>
        ) : loans.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No loan applications yet</p>
              <Button asChild className="shadow-lg">
                <Link to="/applicant/apply">Apply for Your First Loan</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {loans.map((loan, index) => (
              <motion.div
                key={loan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card hover-lift border-l-4 border-l-accent">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{loan.purpose || "Loan Application"}</CardTitle>
                        <StatusBadge status={getStatusBadge(loan.status)} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {loan._id?.substring(0, 12)}... • Applied on {formatDate(loan.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(loan.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        Tenure: {loan.tenure} years
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Simplified Timeline */}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center relative z-10">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-risk-low text-white">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <p className="text-xs mt-2 text-center max-w-[80px] text-foreground font-medium">
                            Submitted
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(loan.createdAt)}
                          </p>
                        </div>

                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${loan.status === "Pending" ? "bg-status-processing text-white animate-pulse" : "bg-risk-low text-white"
                            }`}>
                            <Clock className="h-5 w-5" />
                          </div>
                          <p className="text-xs mt-2 text-center max-w-[80px] text-foreground font-medium">
                            Review
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {loan.status === "Pending" ? "In Progress" : formatDate(loan.createdAt)}
                          </p>
                        </div>

                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${loan.status === "Approved" ? "bg-risk-low text-white" :
                            loan.status === "Rejected" ? "bg-risk-high text-white" :
                              "bg-muted text-muted-foreground"
                            }`}>
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <p className={`text-xs mt-2 text-center max-w-[80px] ${loan.status === "Pending" ? "text-muted-foreground" : "text-foreground font-medium"
                            }`}>
                            Decision
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {loan.status === "Pending" ? "-" : loan.status}
                          </p>
                        </div>
                      </div>
                      {/* Progress Line */}
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
                        <div
                          className="h-full bg-risk-low transition-all duration-500"
                          style={{
                            width: loan.status === "Approved" ? "100%" : loan.status === "Rejected" ? "100%" : "50%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Status</h4>
                      <div className={`flex items-start gap-3 p-3 rounded-lg ${loan.status === "Approved" ? "bg-risk-low/10" :
                        loan.status === "Rejected" ? "bg-risk-high/10" :
                          "bg-status-processing/10"
                        }`}>
                        {loan.status === "Approved" ? (
                          <CheckCircle2 className="h-4 w-4 text-risk-low mt-0.5" />
                        ) : loan.status === "Rejected" ? (
                          <AlertCircle className="h-4 w-4 text-risk-high mt-0.5" />
                        ) : (
                          <Clock className="h-4 w-4 text-status-processing mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">
                            {loan.status === "Approved" && `Your ${loan.purpose} application has been approved!`}
                            {loan.status === "Rejected" && `Your ${loan.purpose} application was not approved.`}
                            {loan.status === "Pending" && `Your ${loan.purpose} application is under review.`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(loan.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {loan.status === "Pending" && (
                        <>
                          <Button variant="outline" size="sm">
                            Upload Documents
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-risk-high hover:bg-risk-high/10"
                            onClick={() => handleCancel(loan._id)}
                          >
                            Cancel Application
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ApplicantLayout>
  );
}
