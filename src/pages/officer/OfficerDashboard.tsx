import { motion } from "framer-motion";
import {
  FileStack,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";

const monthlyData = [
  { month: "Jul", applications: 145, approved: 98, rejected: 25 },
  { month: "Aug", applications: 178, approved: 125, rejected: 32 },
  { month: "Sep", applications: 165, approved: 112, rejected: 28 },
  { month: "Oct", applications: 198, approved: 142, rejected: 35 },
  { month: "Nov", applications: 212, approved: 158, rejected: 38 },
  { month: "Dec", applications: 235, approved: 175, rejected: 42 },
  { month: "Jan", applications: 258, approved: 192, rejected: 45 },
];

const riskDistribution = [
  { name: "Low Risk", value: 45, color: "hsl(145, 85%, 34%)" },
  { name: "Medium Risk", value: 35, color: "hsl(38, 92%, 50%)" },
  { name: "High Risk", value: 20, color: "hsl(0, 84%, 60%)" },
];

const loanTypeData = [
  { type: "Home", count: 85, amount: 425 },
  { type: "Personal", count: 125, amount: 187 },
  { type: "Vehicle", count: 68, amount: 102 },
  { type: "Business", count: 45, amount: 315 },
  { type: "Education", count: 32, amount: 64 },
];

const recentApplications = [
  {
    id: "LN-2024-002547",
    name: "Rajesh Kumar",
    type: "Home Loan",
    amount: "₹55,00,000",
    risk: "low" as const,
    status: "pending" as const,
    sla: "2h 15m",
  },
  {
    id: "LN-2024-002546",
    name: "Priya Sharma",
    type: "Personal Loan",
    amount: "₹4,50,000",
    risk: "medium" as const,
    status: "review" as const,
    sla: "4h 30m",
  },
  {
    id: "LN-2024-002545",
    name: "Mohammed Ali",
    type: "Business Loan",
    amount: "₹25,00,000",
    risk: "high" as const,
    status: "pending" as const,
    sla: "1h 45m",
  },
  {
    id: "LN-2024-002544",
    name: "Anita Desai",
    type: "Vehicle Loan",
    amount: "₹8,00,000",
    risk: "low" as const,
    status: "approved" as const,
    sla: "-",
  },
  {
    id: "LN-2024-002543",
    name: "Suresh Patel",
    type: "Education Loan",
    amount: "₹12,00,000",
    risk: "low" as const,
    status: "processing" as const,
    sla: "6h 00m",
  },
];

export default function OfficerDashboard() {
  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Executive Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of loan processing and risk metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/officer/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Total Applications"
            value="258"
            subtitle="This month"
            icon={FileStack}
            trend={{ value: 12.5, label: "vs last month" }}
          />
          <KPICard
            title="Pending Review"
            value="47"
            subtitle="Awaiting action"
            icon={Clock}
            variant="warning"
          />
          <KPICard
            title="High Risk Cases"
            value="18"
            subtitle="Requires attention"
            icon={AlertTriangle}
            variant="danger"
          />
          <KPICard
            title="Fraud Alerts"
            value="5"
            subtitle="Active alerts"
            icon={Users}
            variant="danger"
          />
          <KPICard
            title="SLA Compliance"
            value="94.2%"
            subtitle="On track"
            icon={TrendingUp}
            variant="accent"
            trend={{ value: 2.1, label: "improvement" }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Loan Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(145, 85%, 34%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(145, 85%, 34%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
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
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="hsl(217, 91%, 60%)"
                      fillOpacity={1}
                      fill="url(#colorApplications)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke="hsl(145, 85%, 34%)"
                      fillOpacity={1}
                      fill="url(#colorApproved)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-processing" />
                  <span className="text-sm text-muted-foreground">Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-low" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loan Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="type"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "count" ? `${value} applications` : `₹${value}L`,
                      name === "count" ? "Count" : "Amount",
                    ]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="amount" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/officer/applications">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      SLA Timer
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm">{app.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{app.name}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {app.type}
                      </td>
                      <td className="py-4 px-4 font-medium">{app.amount}</td>
                      <td className="py-4 px-4">
                        <RiskBadge level={app.risk} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-mono text-sm ${
                            app.sla !== "-" ? "text-risk-medium" : "text-muted-foreground"
                          }`}
                        >
                          {app.sla}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          Review
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-risk-low/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-risk-low" />
              </div>
              <div>
                <p className="text-2xl font-bold">192</p>
                <p className="text-sm text-muted-foreground">Approved this month</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-risk-high/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-risk-high" />
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Rejected this month</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.4 days</p>
                <p className="text-sm text-muted-foreground">Avg. processing time</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </OfficerLayout>
  );
}
