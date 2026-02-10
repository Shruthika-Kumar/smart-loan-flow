import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Shield,
} from "lucide-react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const approvalData = [
  { month: "Aug", approved: 125, rejected: 32, total: 178 },
  { month: "Sep", approved: 112, rejected: 28, total: 165 },
  { month: "Oct", approved: 142, rejected: 35, total: 198 },
  { month: "Nov", approved: 158, rejected: 38, total: 212 },
  { month: "Dec", approved: 175, rejected: 42, total: 235 },
  { month: "Jan", approved: 192, rejected: 45, total: 258 },
];

const riskReport = [
  { category: "Low Risk", count: 142, percentage: 55 },
  { category: "Medium Risk", count: 89, percentage: 34 },
  { category: "High Risk", count: 27, percentage: 11 },
];

const riskColors = ["hsl(145, 85%, 34%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

const officerPerformance = [
  { name: "Sarah Johnson", reviewed: 85, approved: 68, rejected: 12, avgTime: "1.8 days", satisfaction: 94 },
  { name: "David Chen", reviewed: 72, approved: 55, rejected: 14, avgTime: "2.1 days", satisfaction: 89 },
  { name: "Priya Mehta", reviewed: 64, approved: 52, rejected: 8, avgTime: "1.6 days", satisfaction: 96 },
  { name: "Arun Kumar", reviewed: 58, approved: 44, rejected: 10, avgTime: "2.4 days", satisfaction: 85 },
];

const processingTimeData = [
  { month: "Aug", avgDays: 3.2 },
  { month: "Sep", avgDays: 2.8 },
  { month: "Oct", avgDays: 2.5 },
  { month: "Nov", avgDays: 2.3 },
  { month: "Dec", avgDays: 2.6 },
  { month: "Jan", avgDays: 2.4 },
];

const fraudReport = [
  { month: "Aug", detected: 8, confirmed: 5, falsePositive: 3 },
  { month: "Sep", detected: 12, confirmed: 9, falsePositive: 3 },
  { month: "Oct", detected: 6, confirmed: 4, falsePositive: 2 },
  { month: "Nov", detected: 9, confirmed: 6, falsePositive: 3 },
  { month: "Dec", detected: 11, confirmed: 8, falsePositive: 3 },
  { month: "Jan", detected: 5, confirmed: 4, falsePositive: 1 },
];

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

export default function Reports() {
  const [dateRange, setDateRange] = useState("6m");

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive performance and compliance reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="approval" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="approval" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Approval
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-2">
              <Shield className="h-4 w-4" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="fraud" className="gap-2">
              <Shield className="h-4 w-4" />
              Fraud
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Users className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="processing" className="gap-2">
              <Clock className="h-4 w-4" />
              Processing
            </TabsTrigger>
          </TabsList>

          {/* Approval Rate Report */}
          <TabsContent value="approval">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                  <p className="text-3xl font-bold text-risk-low">74.4%</p>
                  <p className="text-xs text-muted-foreground mt-1">+2.1% vs last period</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Total Processed</p>
                  <p className="text-3xl font-bold">1,246</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Disbursed Volume</p>
                  <p className="text-3xl font-bold text-accent">₹84.5 Cr</p>
                  <p className="text-xs text-muted-foreground mt-1">+15.3% growth</p>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Approval Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={approvalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Bar dataKey="approved" fill="hsl(145, 85%, 34%)" radius={[4, 4, 0, 0]} name="Approved" />
                        <Bar dataKey="rejected" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Rejected" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Report */}
          <TabsContent value="risk">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Classification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskReport}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                            label={({ category, percentage }) => `${category}: ${percentage}%`}
                          >
                            {riskReport.map((_, i) => (
                              <Cell key={i} fill={riskColors[i]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={chartTooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {riskReport.map((r, i) => (
                      <div key={r.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{r.category}</span>
                          <span>{r.count} applications ({r.percentage}%)</span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${r.percentage}%`, backgroundColor: riskColors[i] }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Fraud Report */}
          <TabsContent value="fraud">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fraud Detection Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fraudReport}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="confirmed" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Confirmed Fraud" />
                      <Bar dataKey="falsePositive" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="False Positive" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-risk-high" /><span className="text-sm text-muted-foreground">Confirmed</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-risk-medium" /><span className="text-sm text-muted-foreground">False Positive</span></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Officer Performance */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Officer Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Officer</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reviewed</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approved</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rejected</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg. Time</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officerPerformance.map((officer, i) => (
                        <motion.tr
                          key={officer.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="py-3 px-4 font-medium">{officer.name}</td>
                          <td className="py-3 px-4">{officer.reviewed}</td>
                          <td className="py-3 px-4 text-risk-low font-medium">{officer.approved}</td>
                          <td className="py-3 px-4 text-risk-high font-medium">{officer.rejected}</td>
                          <td className="py-3 px-4 font-mono text-sm">{officer.avgTime}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-risk-low rounded-full" style={{ width: `${officer.satisfaction}%` }} />
                              </div>
                              <span className="text-sm font-medium">{officer.satisfaction}%</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processing Time */}
          <TabsContent value="processing">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={processingTimeData}>
                      <defs>
                        <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" days" />
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} days`, "Avg. Processing Time"]} />
                      <Area type="monotone" dataKey="avgDays" stroke="hsl(217, 91%, 60%)" fillOpacity={1} fill="url(#colorTime)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OfficerLayout>
  );
}
