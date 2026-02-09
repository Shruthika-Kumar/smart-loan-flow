import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
    FileText,
    Search,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Clock,
    UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
    {
        title: "Document Upload",
        description: "Upload your Aadhaar, PAN, and Bank Statements. Our AI will automatically extract your data using OCR.",
        icon: FileText,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Profile Completion",
        description: "Verify the extracted information and fill in any additional personal or professional details.",
        icon: UserCheck,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        title: "Instant Eligibility",
        description: "View your real-time approval probability and suggested loan amount based on your financial profile.",
        icon: Sparkles,
        color: "text-accent",
        bg: "bg-accent/10"
    },
    {
        title: "Verification",
        description: "Our loan officers will verify your documents and credit score for final authorization.",
        icon: Search,
        color: "text-warning",
        bg: "bg-warning/10"
    },
    {
        title: "Approval & Disbursement",
        description: "Once approved, your sanction letter is generated and funds are disbursed to your linked account.",
        icon: ShieldCheck,
        color: "text-green-500",
        bg: "bg-green-500/10"
    }
];

export default function HowToApply() {
    return (
        <ApplicantLayout>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">How to Apply</h1>
                    <p className="text-muted-foreground text-lg">
                        Our smart loan process is designed to be fast, transparent, and completely digital.
                    </p>
                </div>

                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 items-start">
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${step.bg}`}>
                                    <step.icon className={`w-6 h-6 ${step.color}`} />
                                </div>
                                {index !== steps.length - 1 && (
                                    <div className="w-0.5 h-full bg-border my-2" />
                                )}
                            </div>
                            <Card className="flex-1 mt-1">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Step {index + 1}</span>
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="p-8 gradient-primary rounded-2xl text-white text-center space-y-6">
                    <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
                    <p className="opacity-90">It takes less than 5 minutes to complete your digital application.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary" className="font-semibold">
                            <Link to="/applicant/apply">
                                Apply for Loan Now
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                            Watch Video Guide
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Processing Time</h4>
                                <p className="text-sm text-muted-foreground">3-5 Business Days for final approval</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Auto-Disbursement</h4>
                                <p className="text-sm text-muted-foreground">Funds transferred within 24 hours of approval</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ApplicantLayout>
    );
}
