import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  UserX,
  Copy,
  Eye,
  Search,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

const fraudDistribution = [
  { range: "0-10%", count: 145 },
  { range: "10-20%", count: 52 },
  { range: "20-30%", count: 28 },
  { range: "30-50%", count: 18 },
  { range: "50-70%", count: 8 },
  { range: "70-100%", count: 5 },
];

const fraudTrend = [
  { month: "Aug", alerts: 8 },
  { month: "Sep", alerts: 12 },
  { month: "Oct", alerts: 6 },
  { month: "Nov", alerts: 9 },
  { month: "Dec", alerts: 11 },
  { month: "Jan", alerts: 5 },
];

const flaggedApplications = [
  {
    id: "LN-2024-002541",
    name: "Amit Verma",
    fraudScore: 72,
    type: "Identity Mismatch",
    detail: "PAN name does not match Aadhaar name",
    severity: "high",
    loanType: "Personal Loan",
    amount: "₹3,50,000",
    flaggedDate: "Jan 13, 2024",
  },
  {
    id: "LN-2024-002539",
    name: "Ramesh Yadav",
    fraudScore: 85,
    type: "Duplicate PAN",
    detail: "PAN number already associated with another active application",
    severity: "critical",
    loanType: "Home Loan",
    amount: "₹42,00,000",
    flaggedDate: "Jan 12, 2024",
  },
  {
    id: "LN-2024-002537",
    name: "Sunita Devi",
    fraudScore: 58,
    type: "Income Anomaly",
    detail: "Declared income significantly higher than bank statement average",
    severity: "medium",
    loanType: "Vehicle Loan",
    amount: "₹6,50,000",
    flaggedDate: "Jan 11, 2024",
  },
  {
    id: "LN-2024-002536",
    name: "Karan Malhotra",
    fraudScore: 65,
    type: "Document Tampering",
    detail: "Salary slip shows inconsistent font patterns — possible edit",
    severity: "high",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    flaggedDate: "Jan 11, 2024",
  },
  {
    id: "LN-2024-002534",
    name: "Pooja Reddy",
    fraudScore: 45,
    type: "Address Mismatch",
    detail: "Residential address differs across submitted documents",
    severity: "low",
    loanType: "Education Loan",
    amount: "₹8,00,000",
    flaggedDate: "Jan 10, 2024",
  },
];

const identityMismatches = [
  { field: "Name (PAN vs Aadhaar)", count: 4, severity: "high" },
  { field: "DOB Mismatch", count: 2, severity: "medium" },
  { field: "Address Discrepancy", count: 6, severity: "low" },
  { field: "Photo Mismatch", count: 1, severity: "critical" },
];

const severityColor: Record<string, string> = {
  critical: "bg-risk-high text-white",
  high: "bg-risk-high/80 text-white",
  medium: "bg-risk-medium text-white",
  low: "bg-risk-low text-white",
};

export default function FraudMonitoring() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = flaggedApplications.filter((app) => {
    const matchSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = severityFilter === "all" || app.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fraud Monitoring</h1>
          <p className="text-muted-foreground">Detect and investigate suspicious applications</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Active Alerts" value="5" subtitle="Requires investigation" icon={AlertTriangle} variant="danger" />
          <KPICard title="Identity Mismatches" value="13" subtitle="This month" icon={UserX} variant="warning" />
          <KPICard title="Duplicate Detections" value="3" subtitle="Active flags" icon={Copy} variant="danger" />
          <KPICard title="Resolution Rate" value="87%" subtitle="Last 30 days" icon={Shield} variant="accent" trend={{ value: 5.2, label: "improvement" }} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fraud Probability Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fraudDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Applications">
                      {fraudDistribution.map((entry, i) => {
                        const idx = i;
                        const fill =
                          idx < 2 ? "hsl(145, 85%, 34%)" : idx < 4 ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)";
                        return <rect key={i} fill={fill} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Fraud Alerts Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fraudTrend}>
                    <defs>
                      <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="alerts" stroke="hsl(0, 84%, 60%)" fillOpacity={1} fill="url(#colorFraud)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Identity Mismatch Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identity Mismatch Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {identityMismatches.map((item) => (
                <div key={item.field} className="p-4 rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.field}</span>
                    <Badge className={severityColor[item.severity]} variant="default">
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <Progress
                    value={(item.count / 10) * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flagged Applications */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-lg">Flagged Applications</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loan ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicant</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fraud Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app, i) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="py-3 px-4 font-mono text-sm">{app.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-xs text-muted-foreground">{app.loanType} • {app.amount}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-2 rounded-full overflow-hidden bg-muted">
                            <div
                              className={`h-full ${app.fraudScore > 60 ? "bg-risk-high" : app.fraudScore > 40 ? "bg-risk-medium" : "bg-risk-low"}`}
                              style={{ width: `${app.fraudScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-sm font-medium">{app.fraudScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">{app.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground max-w-[250px] truncate">{app.detail}</td>
                      <td className="py-3 px-4">
                        <Badge className={severityColor[app.severity]} variant="default">
                          {app.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/officer/applications/${app.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Investigate
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </OfficerLayout>
  );
}
