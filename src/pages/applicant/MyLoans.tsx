import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Calculator,
  CreditCard,
  Calendar,
  Percent,
  ArrowUpRight,
} from "lucide-react";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { Link } from "react-router-dom";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MyLoans() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const response = await api.get(`/loans/user/${user.id}`);
          // Filter only approved loans
          const approvedLoans = response.data.filter((loan: any) => loan.status === "Approved");
          setLoans(approvedLoans);
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <ApplicantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Loans</h1>
            <p className="text-muted-foreground">
              Manage your active loans and repayments
            </p>
          </div>
        </div>

        {/* Active Loans */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your loans...</p>
          </div>
        ) : loans.length === 0 ? (
          <Card className="p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Loans</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any approved loans at the moment.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/applicant/apply">Apply for a Loan</Link>
            </Button>
          </Card>
        ) : (
          loans.map((loan, index) => (
            <motion.div
              key={loan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{loan.purpose || "Loan"}</CardTitle>
                      <StatusBadge status="approved" />
                    </div>
                    <p className="text-sm text-muted-foreground">{loan._id?.substring(0, 16)}...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Sanction Letter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      Prepay
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CreditCard className="h-4 w-4" />
                        Loan Amount
                      </div>
                      <p className="text-xl font-bold">
                        {formatCurrency(loan.amount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        Tenure
                      </div>
                      <p className="text-xl font-bold">{loan.tenure} years</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Percent className="h-4 w-4" />
                        Status
                      </div>
                      <p className="text-xl font-bold text-risk-low">Approved</p>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="p-4 bg-risk-low/10 border border-risk-low/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Loan Approved</p>
                    <p className="text-lg font-semibold">
                      Your {loan.purpose} application for {formatCurrency(loan.amount)} has been approved!
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Disbursement will be processed within 2-3 business days.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Agreement
                    </Button>
                    <Button variant="ghost" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </ApplicantLayout>
  );
}
