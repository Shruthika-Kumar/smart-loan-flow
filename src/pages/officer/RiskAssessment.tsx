import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Filter,
  Download,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const riskByLoanType = [
  { type: "Home", low: 58, medium: 30, high: 12 },
  { type: "Personal", low: 35, medium: 40, high: 25 },
  { type: "Vehicle", low: 52, medium: 33, high: 15 },
  { type: "Business", low: 28, medium: 38, high: 34 },
  { type: "Education", low: 62, medium: 28, high: 10 },
];

const defaultTrend = [
  { month: "Aug", rate: 3.2 },
  { month: "Sep", rate: 3.5 },
  { month: "Oct", rate: 3.1 },
  { month: "Nov", rate: 2.8 },
  { month: "Dec", rate: 3.0 },
  { month: "Jan", rate: 2.6 },
];

const dtiBySegment = [
  { segment: "Salaried <5L", dti: 32 },
  { segment: "Salaried 5-15L", dti: 28 },
  { segment: "Salaried >15L", dti: 22 },
  { segment: "Self-Employed", dti: 38 },
  { segment: "Business", dti: 42 },
];

const riskDistribution = [
  { name: "Low Risk", value: 142, color: "hsl(145, 85%, 34%)" },
  { name: "Medium Risk", value: 89, color: "hsl(38, 92%, 50%)" },
  { name: "High Risk", value: 27, color: "hsl(0, 84%, 60%)" },
];

const heatMapData = [
  { x: 1, y: 1, z: 12, label: "Home/Low" },
  { x: 1, y: 2, z: 8, label: "Home/Med" },
  { x: 1, y: 3, z: 3, label: "Home/High" },
  { x: 2, y: 1, z: 6, label: "Personal/Low" },
  { x: 2, y: 2, z: 14, label: "Personal/Med" },
  { x: 2, y: 3, z: 9, label: "Personal/High" },
  { x: 3, y: 1, z: 10, label: "Vehicle/Low" },
  { x: 3, y: 2, z: 7, label: "Vehicle/Med" },
  { x: 3, y: 3, z: 4, label: "Vehicle/High" },
  { x: 4, y: 1, z: 5, label: "Business/Low" },
  { x: 4, y: 2, z: 11, label: "Business/Med" },
  { x: 4, y: 3, z: 15, label: "Business/High" },
];

const highRiskCases = [
  {
    id: "LN-2024-002545",
    name: "Mohammed Ali",
    loanType: "Business Loan",
    amount: "₹25,00,000",
    creditScore: 580,
    dti: 52,
    riskLevel: "high" as const,
    reason: "High DTI, Low credit score",
  },
  {
    id: "LN-2024-002541",
    name: "Amit Verma",
    loanType: "Personal Loan",
    amount: "₹3,50,000",
    creditScore: 610,
    dti: 48,
    riskLevel: "high" as const,
    reason: "Income inconsistency flagged",
  },
  {
    id: "LN-2024-002538",
    name: "Vikram Singh",
    loanType: "Home Loan",
    amount: "₹65,00,000",
    creditScore: 595,
    dti: 55,
    riskLevel: "high" as const,
    reason: "Property valuation concern",
  },
  {
    id: "LN-2024-002535",
    name: "Neha Gupta",
    loanType: "Business Loan",
    amount: "₹18,00,000",
    creditScore: 620,
    dti: 46,
    riskLevel: "high" as const,
    reason: "Business revenue declining",
  },
];

export default function RiskAssessment() {
  const [timeRange, setTimeRange] = useState("30d");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Risk Assessment</h1>
            <p className="text-muted-foreground">Portfolio risk analysis and monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="High Risk Cases"
            value="27"
            subtitle="Active portfolio"
            icon={AlertTriangle}
            variant="danger"
            trend={{ value: -8.3, label: "vs last month" }}
          />
          <KPICard
            title="Avg. Credit Score"
            value="712"
            subtitle="New applications"
            icon={ShieldAlert}
            trend={{ value: 1.5, label: "improvement" }}
          />
          <KPICard
            title="Default Rate"
            value="2.6%"
            subtitle="Trailing 12 months"
            icon={TrendingDown}
            variant="accent"
            trend={{ value: -0.4, label: "vs last quarter" }}
          />
          <KPICard
            title="Avg. DTI Ratio"
            value="31.2%"
            subtitle="Portfolio average"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk by Loan Type */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Risk Distribution by Loan Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskByLoanType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="low" stackId="a" fill="hsl(145, 85%, 34%)" radius={[0, 0, 0, 0]} name="Low Risk" />
                    <Bar dataKey="medium" stackId="a" fill="hsl(38, 92%, 50%)" name="Medium Risk" />
                    <Bar dataKey="high" stackId="a" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="High Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Overall Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Distribution</CardTitle>
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
              <div className="space-y-2 mt-2">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Default Probability Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Default Probability Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={defaultTrend}>
                    <defs>
                      <linearGradient id="colorDefault" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Default Rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(0, 84%, 60%)"
                      fillOpacity={1}
                      fill="url(#colorDefault)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* DTI by Segment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average DTI by Segment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dtiBySegment} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" domain={[0, 60]} />
                    <YAxis type="category" dataKey="segment" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "DTI Ratio"]}
                    />
                    <Bar dataKey="dti" radius={[0, 4, 4, 0]}>
                      {dtiBySegment.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.dti > 40 ? "hsl(0, 84%, 60%)" : entry.dti > 30 ? "hsl(38, 92%, 50%)" : "hsl(145, 85%, 34%)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Heat Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Heat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[0.5, 4.5]}
                    ticks={[1, 2, 3, 4]}
                    tickFormatter={(v) => ["", "Home", "Personal", "Vehicle", "Business"][v]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[0.5, 3.5]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) => ["", "Low", "Medium", "High"][v]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ZAxis type="number" dataKey="z" range={[100, 600]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "z") return [`${value} cases`, "Count"];
                      return [value, name];
                    }}
                  />
                  <Scatter data={heatMapData} fill="hsl(var(--primary))">
                    {heatMapData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.y === 3
                            ? "hsl(0, 84%, 60%)"
                            : entry.y === 2
                            ? "hsl(38, 92%, 50%)"
                            : "hsl(145, 85%, 34%)"
                        }
                        fillOpacity={0.7}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* High Risk Cases Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">High Risk Cases</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/officer/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loan ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicant</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credit Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DTI</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reason</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskCases.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="py-3 px-4 font-mono text-sm">{c.id}</td>
                      <td className="py-3 px-4 font-medium">{c.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{c.loanType}</td>
                      <td className="py-3 px-4 font-medium">{c.amount}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-risk-high">{c.creditScore}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-risk-high">{c.dti}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge level={c.riskLevel} />
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground max-w-[200px]">{c.reason}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/officer/applications/${c.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Review
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
