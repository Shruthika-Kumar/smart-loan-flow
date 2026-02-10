import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Settings,
  Bell,
  Activity,
  Database,
  Sliders,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  ChevronRight,
  Lock,
} from "lucide-react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah.johnson@bank.com", role: "Loan Officer", status: "active", lastLogin: "Jan 16, 2024 09:15 AM" },
  { id: 2, name: "David Chen", email: "david.chen@bank.com", role: "Senior Officer", status: "active", lastLogin: "Jan 16, 2024 08:30 AM" },
  { id: 3, name: "Priya Mehta", email: "priya.mehta@bank.com", role: "Risk Analyst", status: "active", lastLogin: "Jan 15, 2024 05:45 PM" },
  { id: 4, name: "Arun Kumar", email: "arun.kumar@bank.com", role: "Credit Manager", status: "active", lastLogin: "Jan 16, 2024 10:00 AM" },
  { id: 5, name: "Meena Patel", email: "meena.patel@bank.com", role: "Admin", status: "active", lastLogin: "Jan 16, 2024 07:00 AM" },
  { id: 6, name: "Ravi Shankar", email: "ravi.shankar@bank.com", role: "Loan Officer", status: "inactive", lastLogin: "Dec 28, 2023 04:30 PM" },
];

const auditLogs = [
  { time: "Jan 16, 10:30 AM", user: "Sarah Johnson", action: "Approved loan LN-2024-002544", ip: "192.168.1.45" },
  { time: "Jan 16, 09:15 AM", user: "David Chen", action: "Rejected loan LN-2024-002541", ip: "192.168.1.52" },
  { time: "Jan 16, 08:30 AM", user: "Meena Patel", action: "Updated risk threshold settings", ip: "192.168.1.10" },
  { time: "Jan 15, 05:45 PM", user: "Priya Mehta", action: "Escalated LN-2024-002546 to manager", ip: "192.168.1.38" },
  { time: "Jan 15, 04:00 PM", user: "Arun Kumar", action: "Overrode risk assessment for LN-2024-002540", ip: "192.168.1.61" },
  { time: "Jan 15, 02:30 PM", user: "System", action: "AI model v2.4.1 deployed", ip: "-" },
  { time: "Jan 15, 11:00 AM", user: "Meena Patel", action: "Added user Ravi Shankar", ip: "192.168.1.10" },
];

const loginActivity = [
  { time: "Jan 16, 10:00 AM", user: "Arun Kumar", action: "Login", ip: "192.168.1.61", status: "success" },
  { time: "Jan 16, 09:15 AM", user: "Sarah Johnson", action: "Login", ip: "192.168.1.45", status: "success" },
  { time: "Jan 16, 08:30 AM", user: "David Chen", action: "Login", ip: "192.168.1.52", status: "success" },
  { time: "Jan 16, 08:15 AM", user: "Unknown", action: "Failed Login", ip: "103.24.18.92", status: "failed" },
  { time: "Jan 16, 07:00 AM", user: "Meena Patel", action: "Login", ip: "192.168.1.10", status: "success" },
  { time: "Jan 15, 05:45 PM", user: "Priya Mehta", action: "Login", ip: "192.168.1.38", status: "success" },
];

export default function AdminSettings() {
  const [dtiThreshold, setDtiThreshold] = useState([40]);
  const [fraudSensitivity, setFraudSensitivity] = useState([50]);
  const [minCreditScore, setMinCreditScore] = useState([650]);

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">System configuration, user management, and compliance</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" />Users</TabsTrigger>
            <TabsTrigger value="roles" className="gap-2"><Shield className="h-4 w-4" />Roles</TabsTrigger>
            <TabsTrigger value="thresholds" className="gap-2"><Sliders className="h-4 w-4" />Thresholds</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="audit" className="gap-2"><Activity className="h-4 w-4" />Audit Logs</TabsTrigger>
            <TabsTrigger value="model" className="gap-2"><Database className="h-4 w-4" />AI Model</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">User Management</CardTitle>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Login</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.status === "active" ? "default" : "secondary"} className={user.status === "active" ? "bg-risk-low" : ""}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{user.lastLogin}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-risk-high"><Trash2 className="h-4 w-4" /></Button>
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

          {/* Role Assignment */}
          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { role: "Loan Officer", permissions: ["View applications", "Approve up to ₹10L", "Add notes", "Request documents"], count: 3 },
                { role: "Senior Officer", permissions: ["All Officer permissions", "Approve up to ₹50L", "Escalate cases", "Override risk"], count: 1 },
                { role: "Risk Analyst", permissions: ["View risk data", "Generate risk reports", "Configure thresholds", "Model monitoring"], count: 1 },
                { role: "Credit Manager", permissions: ["All Officer permissions", "Approve up to ₹2Cr", "Manual override", "Performance review"], count: 1 },
                { role: "Admin", permissions: ["Full system access", "User management", "Configuration", "Audit logs"], count: 1 },
              ].map((r, i) => (
                <motion.div key={r.role} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{r.role}</CardTitle>
                        <p className="text-sm text-muted-foreground">{r.count} user{r.count > 1 ? "s" : ""}</p>
                      </div>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-1" />Edit</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {r.permissions.map((p) => (
                          <div key={p} className="flex items-center gap-2 text-sm">
                            <Lock className="h-3 w-3 text-accent" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Risk Thresholds */}
          <TabsContent value="thresholds">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Thresholds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Maximum DTI Ratio</Label>
                      <span className="font-mono text-sm font-medium">{dtiThreshold[0]}%</span>
                    </div>
                    <Slider value={dtiThreshold} onValueChange={setDtiThreshold} max={60} min={20} step={1} />
                    <p className="text-xs text-muted-foreground">Applications exceeding this ratio will be flagged as high risk</p>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Minimum Credit Score</Label>
                      <span className="font-mono text-sm font-medium">{minCreditScore[0]}</span>
                    </div>
                    <Slider value={minCreditScore} onValueChange={setMinCreditScore} max={800} min={500} step={10} />
                    <p className="text-xs text-muted-foreground">Applications below this score require manual review</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fraud Detection Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Fraud Sensitivity</Label>
                      <span className="font-mono text-sm font-medium">{fraudSensitivity[0]}%</span>
                    </div>
                    <Slider value={fraudSensitivity} onValueChange={setFraudSensitivity} max={100} min={10} step={5} />
                    <p className="text-xs text-muted-foreground">Higher sensitivity catches more fraud but increases false positives</p>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-reject high fraud score</Label>
                        <p className="text-xs text-muted-foreground mt-1">Automatically reject applications above 80% fraud probability</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Duplicate PAN detection</Label>
                        <p className="text-xs text-muted-foreground mt-1">Flag applications with duplicate PAN numbers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "SLA breach alerts", desc: "Notify when applications exceed SLA time limits", enabled: true },
                  { label: "High risk alerts", desc: "Notify officers when high risk applications are assigned", enabled: true },
                  { label: "Fraud detection alerts", desc: "Immediate notification for fraud flagged applications", enabled: true },
                  { label: "Daily summary email", desc: "Send daily processing summary to all officers", enabled: false },
                  { label: "Escalation notifications", desc: "Notify managers when cases are escalated", enabled: true },
                  { label: "Model performance alerts", desc: "Alert when AI model accuracy drops below threshold", enabled: false },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-2">
                    <div>
                      <Label>{n.label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
                    </div>
                    <Switch defaultChecked={n.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audit Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log, i) => (
                          <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="py-3 px-4 text-sm font-mono">{log.time}</td>
                            <td className="py-3 px-4 text-sm font-medium">{log.user}</td>
                            <td className="py-3 px-4 text-sm">{log.action}</td>
                            <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{log.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Login Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">IP Address</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginActivity.map((log, i) => (
                          <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="py-3 px-4 text-sm font-mono">{log.time}</td>
                            <td className="py-3 px-4 text-sm font-medium">{log.user}</td>
                            <td className="py-3 px-4 text-sm">{log.action}</td>
                            <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{log.ip}</td>
                            <td className="py-3 px-4">
                              <Badge variant={log.status === "success" ? "default" : "destructive"} className={log.status === "success" ? "bg-risk-low" : ""}>
                                {log.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Model */}
          <TabsContent value="model">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Model Version</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="font-medium">CreditRisk-v2.4.1</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Deployed</span><span className="font-mono text-sm">Jan 15, 2024</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Accuracy</span><span className="font-medium text-risk-low">94.2%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Precision</span><span className="font-medium">91.8%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Recall</span><span className="font-medium">89.5%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">F1 Score</span><span className="font-medium">90.6%</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Previous Version</span><span className="font-mono text-sm text-muted-foreground">v2.3.8</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Training Data</span><span className="font-mono text-sm">125,000 samples</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Performance Monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { metric: "Accuracy", value: 94.2, threshold: 90 },
                    { metric: "Precision", value: 91.8, threshold: 85 },
                    { metric: "Recall", value: 89.5, threshold: 85 },
                    { metric: "AUC-ROC", value: 96.1, threshold: 90 },
                  ].map((m) => (
                    <div key={m.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{m.metric}</span>
                        <span className={`font-medium ${m.value >= m.threshold ? "text-risk-low" : "text-risk-high"}`}>
                          {m.value}%
                        </span>
                      </div>
                      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.value >= m.threshold ? "bg-risk-low" : "bg-risk-high"}`}
                          style={{ width: `${m.value}%` }}
                        />
                        <div
                          className="absolute top-0 w-0.5 h-full bg-foreground/50"
                          style={{ left: `${m.threshold}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Threshold: {m.threshold}%</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OfficerLayout>
  );
}
