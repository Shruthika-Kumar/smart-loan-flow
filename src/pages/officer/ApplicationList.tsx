import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";

const applications = [
  {
    id: "LN-2024-002547",
    applicantName: "Rajesh Kumar",
    loanType: "Home Loan",
    requestedAmount: 5500000,
    riskLevel: "low" as const,
    fraudScore: 12,
    status: "pending" as const,
    slaTimer: "2h 15m",
    appliedDate: "2024-01-15",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "LN-2024-002546",
    applicantName: "Priya Sharma",
    loanType: "Personal Loan",
    requestedAmount: 450000,
    riskLevel: "medium" as const,
    fraudScore: 35,
    status: "review" as const,
    slaTimer: "4h 30m",
    appliedDate: "2024-01-15",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "LN-2024-002545",
    applicantName: "Mohammed Ali",
    loanType: "Business Loan",
    requestedAmount: 2500000,
    riskLevel: "high" as const,
    fraudScore: 68,
    status: "pending" as const,
    slaTimer: "1h 45m",
    appliedDate: "2024-01-14",
    assignedTo: "David Chen",
  },
  {
    id: "LN-2024-002544",
    applicantName: "Anita Desai",
    loanType: "Vehicle Loan",
    requestedAmount: 800000,
    riskLevel: "low" as const,
    fraudScore: 8,
    status: "approved" as const,
    slaTimer: "-",
    appliedDate: "2024-01-14",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "LN-2024-002543",
    applicantName: "Suresh Patel",
    loanType: "Education Loan",
    requestedAmount: 1200000,
    riskLevel: "low" as const,
    fraudScore: 15,
    status: "processing" as const,
    slaTimer: "6h 00m",
    appliedDate: "2024-01-14",
    assignedTo: "David Chen",
  },
  {
    id: "LN-2024-002542",
    applicantName: "Kavitha Nair",
    loanType: "Home Loan",
    requestedAmount: 7500000,
    riskLevel: "medium" as const,
    fraudScore: 42,
    status: "review" as const,
    slaTimer: "3h 20m",
    appliedDate: "2024-01-13",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "LN-2024-002541",
    applicantName: "Amit Verma",
    loanType: "Personal Loan",
    requestedAmount: 350000,
    riskLevel: "high" as const,
    fraudScore: 72,
    status: "rejected" as const,
    slaTimer: "-",
    appliedDate: "2024-01-13",
    assignedTo: "David Chen",
  },
  {
    id: "LN-2024-002540",
    applicantName: "Deepa Menon",
    loanType: "Business Loan",
    requestedAmount: 5000000,
    riskLevel: "low" as const,
    fraudScore: 18,
    status: "approved" as const,
    slaTimer: "-",
    appliedDate: "2024-01-12",
    assignedTo: "Sarah Johnson",
  },
];

const formatAmount = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString()}`;
};

export default function ApplicationList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesRisk = riskFilter === "all" || app.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Application Management
            </h1>
            <p className="text-muted-foreground">
              Review and process loan applications
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or loan ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Risk Filter */}
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredApplications.length}</span> of{" "}
            <span className="font-medium text-foreground">{applications.length}</span> applications
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button variant="ghost" size="sm" className="gap-1">
              Date <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Loan Type
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Fraud Score
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      SLA
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <Link
                          to={`/officer/applications/${app.id}`}
                          className="font-mono text-sm text-accent hover:underline"
                        >
                          {app.id}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">
                            Applied: {app.appliedDate}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{app.loanType}</td>
                      <td className="py-4 px-4 font-medium">
                        {formatAmount(app.requestedAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <RiskBadge level={app.riskLevel} />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-2 rounded-full overflow-hidden bg-muted`}
                          >
                            <div
                              className={`h-full transition-all ${
                                app.fraudScore > 50
                                  ? "bg-risk-high"
                                  : app.fraudScore > 25
                                  ? "bg-risk-medium"
                                  : "bg-risk-low"
                              }`}
                              style={{ width: `${app.fraudScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono">{app.fraudScore}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-4 px-4">
                        {app.slaTimer !== "-" ? (
                          <Badge
                            variant="outline"
                            className="font-mono text-risk-medium border-risk-medium/30"
                          >
                            {app.slaTimer}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8"
                          >
                            <Link to={`/officer/applications/${app.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Assign to me</DropdownMenuItem>
                              <DropdownMenuItem>Request documents</DropdownMenuItem>
                              <DropdownMenuItem>Escalate</DropdownMenuItem>
                              <DropdownMenuItem className="text-risk-low">
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-risk-high">
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page 1 of 12
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OfficerLayout>
  );
}
