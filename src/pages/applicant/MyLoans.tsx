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

const activeLoans = [
  {
    id: "LN-2024-001189",
    type: "Personal Loan",
    principalAmount: 350000,
    outstandingAmount: 285000,
    interestRate: 11.5,
    emi: 12450,
    tenure: 36,
    remainingTenure: 28,
    nextEmiDate: "Feb 05, 2024",
    status: "disbursed" as const,
    repaymentSchedule: [
      { month: "Jan 2024", principal: 8200, interest: 4250, total: 12450, status: "paid" },
      { month: "Feb 2024", principal: 8350, interest: 4100, total: 12450, status: "upcoming" },
      { month: "Mar 2024", principal: 8500, interest: 3950, total: 12450, status: "upcoming" },
      { month: "Apr 2024", principal: 8650, interest: 3800, total: 12450, status: "upcoming" },
      { month: "May 2024", principal: 8800, interest: 3650, total: 12450, status: "upcoming" },
    ],
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MyLoans() {
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
        {activeLoans.map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{loan.type}</CardTitle>
                    <StatusBadge status={loan.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{loan.id}</p>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CreditCard className="h-4 w-4" />
                      Principal Amount
                    </div>
                    <p className="text-xl font-bold">
                      {formatCurrency(loan.principalAmount)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      Outstanding
                    </div>
                    <p className="text-xl font-bold text-risk-medium">
                      {formatCurrency(loan.outstandingAmount)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Percent className="h-4 w-4" />
                      Interest Rate
                    </div>
                    <p className="text-xl font-bold">{loan.interestRate}% p.a.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      Monthly EMI
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(loan.emi)}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Loan Repayment Progress
                    </span>
                    <span className="font-medium">
                      {loan.tenure - loan.remainingTenure} of {loan.tenure} EMIs paid
                    </span>
                  </div>
                  <Progress
                    value={((loan.tenure - loan.remainingTenure) / loan.tenure) * 100}
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Paid: {formatCurrency(loan.principalAmount - loan.outstandingAmount)}
                    </span>
                    <span>Remaining: {formatCurrency(loan.outstandingAmount)}</span>
                  </div>
                </div>

                {/* Next EMI */}
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next EMI Due</p>
                    <p className="text-lg font-semibold">{loan.nextEmiDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">
                      {formatCurrency(loan.emi)}
                    </p>
                  </div>
                </div>

                {/* Repayment Schedule */}
                <div className="space-y-3">
                  <h4 className="font-medium">Repayment Schedule</h4>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-xs">Month</TableHead>
                          <TableHead className="text-xs text-right">Principal</TableHead>
                          <TableHead className="text-xs text-right">Interest</TableHead>
                          <TableHead className="text-xs text-right">Total EMI</TableHead>
                          <TableHead className="text-xs text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loan.repaymentSchedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(row.interest)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(row.total)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`text-xs font-medium ${
                                  row.status === "paid"
                                    ? "text-risk-low"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {row.status === "paid" ? "✓ Paid" : "Upcoming"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full">
                    View Complete Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* No Loans State */}
        {activeLoans.length === 0 && (
          <Card className="p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Loans</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any active loans at the moment.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Apply for a Loan
            </Button>
          </Card>
        )}
      </div>
    </ApplicantLayout>
  );
}
