import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    MessageCircle,
    Phone,
    Mail,
    Clock,
    Send,
    Ticket,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SupportCenter() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Ticket Raised",
            description: "Our support team will get back to you within 24 hours.",
        });
    };

    return (
        <ApplicantLayout>
            <div className="space-y-8 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold">Support Center</h1>
                    <p className="text-muted-foreground">We're here to help you with any issues or queries about your loan application.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Contact */}
                    <div className="space-y-6 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Contact</CardTitle>
                                <CardDescription>Get in touch via our direct channels</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Call Us (Toll-Free)</p>
                                        <p className="text-sm text-muted-foreground">1800-SMART-BANK</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Email Support</p>
                                        <p className="text-sm text-muted-foreground">help@bankflow.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">WhatsApp Support</p>
                                        <p className="text-sm text-muted-foreground">+91 98765-43210</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-accent/5 border-accent/20">
                            <CardContent className="p-6 space-y-2">
                                <div className="flex items-center gap-2 text-accent font-semibold">
                                    <Clock className="w-4 h-4" />
                                    Support Hours
                                </div>
                                <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM to 7:00 PM</p>
                                <p className="text-sm text-muted-foreground">Saturday: 10:00 AM to 4:00 PM</p>
                                <p className="text-xs text-accent mt-2 font-medium italic">Closed on Sundays & Public Holidays</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Raise a Ticket */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Send className="w-5 h-5 text-accent" />
                                    Raise a Support Ticket
                                </CardTitle>
                                <CardDescription>Tell us more about the issue you're facing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Issue Category</Label>
                                            <Input id="subject" placeholder="e.g. OCR Verification, EMI Dispute" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="loanId">Loan Application ID (Optional)</Label>
                                            <Input id="loanId" placeholder="e.g. HB5432" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Detailed Description</Label>
                                        <Textarea id="message" placeholder="Describe your problem in detail..." className="min-h-[120px]" required />
                                    </div>
                                    <Button type="submit" className="w-full gap-2">
                                        <Send className="w-4 h-4" />
                                        Submit Ticket
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Existing Tickets */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Ticket className="w-5 h-5 text-accent" />
                                    Your Active Tickets
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 border border-border rounded-lg flex items-center justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <AlertCircle className="w-4 h-4 text-warning" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">TKT-8842: OCR failed for PAN Card</p>
                                                <p className="text-xs text-muted-foreground">Raised 1 day ago • Assigned to Officer Sarah</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold uppercase">In Progress</span>
                                    </div>

                                    <div className="p-4 border border-border rounded-lg flex items-center justify-between opacity-60">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">TKT-8839: Loan Type change request</p>
                                                <p className="text-xs text-muted-foreground">Resolved 3 days ago</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase">Resolved</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ApplicantLayout>
    );
}
