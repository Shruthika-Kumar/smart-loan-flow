import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    Upload,
    CheckCircle2,
    AlertCircle,
    LogIn,
    Clock,
    ArrowRight
} from "lucide-react";

const activities = [
    {
        id: 1,
        type: "upload",
        title: "Document Uploaded",
        description: "PAN Card scan uploaded for verification",
        time: "2 hours ago",
        icon: Upload,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: 2,
        type: "status",
        title: "Loan Application Submitted",
        description: "Home Loan application (HB5432) submitted successfully",
        time: "5 hours ago",
        icon: FileText,
        color: "text-accent",
        bg: "bg-accent/10"
    },
    {
        id: 3,
        type: "verification",
        title: "KYC Verified",
        description: "Identity verification completed via Aadhaar OCR",
        time: "1 day ago",
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        id: 4,
        type: "auth",
        title: "Login Session",
        description: "Logged in from Chrome on Windows 11",
        time: "1 day ago",
        icon: LogIn,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        id: 5,
        type: "alert",
        title: "Incomplete Profile",
        description: "Please upload your latest salary slip to improve eligibility score",
        time: "2 days ago",
        icon: AlertCircle,
        color: "text-warning",
        bg: "bg-warning/10"
    }
];

export default function ActivityLog() {
    return (
        <ApplicantLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Activity Log</h1>
                    <p className="text-muted-foreground">Track all recent actions and updates on your account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent" />
                            Recent Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                            {activities.map((activity) => (
                                <div key={activity.id} className="relative flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-background shadow-sm ${activity.bg}`}>
                                            <activity.icon className={`h-5 w-5 ${activity.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold">{activity.title}</h4>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border flex justify-center">
                            <button className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
                                Load older activities
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ApplicantLayout>
    );
}
