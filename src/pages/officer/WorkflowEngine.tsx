import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";

const workflowStages = [
  { name: "Submitted", count: 12, icon: FileText, color: "bg-status-processing" },
  { name: "Doc Verified", count: 8, icon: CheckCircle2, color: "bg-risk-low" },
  { name: "Risk Assessed", count: 15, icon: AlertTriangle, color: "bg-risk-medium" },
  { name: "Officer Review", count: 22, icon: UserCheck, color: "bg-primary" },
  { name: "Manager Approval", count: 5, icon: UserCheck, color: "bg-chart-5" },
  { name: "Disbursed", count: 196, icon: CheckCircle2, color: "bg-risk-low" },
];

const activeCases = [
  {
    id: "LN-2024-002547",
    name: "Rajesh Kumar",
    stage: "Officer Review",
    stageIndex: 3,
    sla: "2h 15m",
    slaStatus: "on-track",
    assignedTo: "Sarah Johnson",
    priority: "normal",
    lastAction: "AI Risk Assessment completed",
    lastActionTime: "30 min ago",
  },
  {
    id: "LN-2024-002546",
    name: "Priya Sharma",
    stage: "Manager Approval",
    stageIndex: 4,
    sla: "45m",
    slaStatus: "warning",
    assignedTo: "David Chen",
    priority: "high",
    lastAction: "Escalated by officer",
    lastActionTime: "1h ago",
  },
  {
    id: "LN-2024-002545",
    name: "Mohammed Ali",
    stage: "Risk Assessed",
    stageIndex: 2,
    sla: "4h 30m",
    slaStatus: "on-track",
    assignedTo: "Sarah Johnson",
    priority: "high",
    lastAction: "High risk flagged",
    lastActionTime: "2h ago",
  },
  {
    id: "LN-2024-002543",
    name: "Suresh Patel",
    stage: "Doc Verified",
    stageIndex: 1,
    sla: "6h",
    slaStatus: "on-track",
    assignedTo: "David Chen",
    priority: "normal",
    lastAction: "Documents verified",
    lastActionTime: "3h ago",
  },
  {
    id: "LN-2024-002542",
    name: "Kavitha Nair",
    stage: "Officer Review",
    stageIndex: 3,
    sla: "15m",
    slaStatus: "breach",
    assignedTo: "Sarah Johnson",
    priority: "urgent",
    lastAction: "SLA breach imminent",
    lastActionTime: "5h ago",
  },
];

const escalationChain = [
  { level: "L1 - Loan Officer", authority: "Up to ₹10L", sla: "8 hours" },
  { level: "L2 - Senior Officer", authority: "Up to ₹50L", sla: "16 hours" },
  { level: "L3 - Credit Manager", authority: "Up to ₹2Cr", sla: "24 hours" },
  { level: "L4 - Risk Head", authority: "Unlimited", sla: "48 hours" },
];

const auditTrail = [
  { time: "10:30 AM", action: "Application LN-2024-002547 assigned to Sarah Johnson", user: "System", type: "assignment" },
  { time: "10:45 AM", action: "Document verification completed for LN-2024-002543", user: "David Chen", type: "verification" },
  { time: "11:00 AM", action: "LN-2024-002546 escalated to Manager Approval", user: "Sarah Johnson", type: "escalation" },
  { time: "11:15 AM", action: "AI Risk Assessment triggered for LN-2024-002547", user: "System", type: "assessment" },
  { time: "11:30 AM", action: "SLA warning: LN-2024-002542 nearing breach", user: "System", type: "warning" },
  { time: "11:45 AM", action: "LN-2024-002544 approved and sent for disbursement", user: "Sarah Johnson", type: "approval" },
];

const auditTypeColors: Record<string, string> = {
  assignment: "border-status-processing text-status-processing",
  verification: "border-risk-low text-risk-low",
  escalation: "border-risk-medium text-risk-medium",
  assessment: "border-primary text-primary",
  warning: "border-risk-high text-risk-high",
  approval: "border-risk-low text-risk-low",
};

const slaColors: Record<string, string> = {
  "on-track": "text-risk-low",
  warning: "text-risk-medium",
  breach: "text-risk-high",
};

export default function WorkflowEngine() {
  const totalStages = 6;

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workflow Engine</h1>
          <p className="text-muted-foreground">Loan lifecycle management and case tracking</p>
        </div>

        {/* Pipeline Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loan Processing Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              {workflowStages.map((stage, i) => (
                <div key={stage.name} className="flex items-center flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex-1 text-center"
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full ${stage.color} flex items-center justify-center mb-2`}>
                      <stage.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium mb-1">{stage.name}</p>
                    <p className="text-lg font-bold">{stage.count}</p>
                  </motion.div>
                  {i < workflowStages.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Cases & Escalation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cases */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Active Cases</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Case</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Stage</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SLA</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCases.map((c, i) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <Link to={`/officer/applications/${c.id}`} className="font-mono text-sm text-accent hover:underline">
                              {c.id}
                            </Link>
                            <p className="text-xs text-muted-foreground">{c.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">{c.stage}</Badge>
                        </td>
                        <td className="py-3 px-4 w-32">
                          <Progress value={((c.stageIndex + 1) / totalStages) * 100} className="h-2" />
                          <span className="text-xs text-muted-foreground">{c.stageIndex + 1}/{totalStages}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-mono text-sm font-medium ${slaColors[c.slaStatus]}`}>
                            {c.sla}
                          </span>
                          {c.slaStatus === "breach" && (
                            <Badge variant="destructive" className="ml-2 text-xs">Breach</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">{c.assignedTo}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/officer/applications/${c.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Escalation Chain */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Escalation Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {escalationChain.map((level, i) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary"
                >
                  <p className="font-medium text-sm">{level.level}</p>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Authority: {level.authority}</span>
                    <span>SLA: {level.sla}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Audit Trail */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today's Audit Trail</CardTitle>
            <Button variant="outline" size="sm">View Full Log</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditTrail.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                    {entry.time}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm">{entry.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">By: {entry.user}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${auditTypeColors[entry.type]}`}>
                    {entry.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OfficerLayout>
  );
}
