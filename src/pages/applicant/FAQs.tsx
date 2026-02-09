import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Search, MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const faqCategories = [
    {
        title: "General Questions",
        questions: [
            {
                q: "What is Smart BankFlow?",
                a: "Smart BankFlow is an AI-powered digital lending platform that uses OCR and intelligent algorithms to fast-track your loan application, providing instant eligibility assessments and seamless document management."
            },
            {
                q: "Who can apply for a loan?",
                a: "Any salaried or self-employed individual with valid identity and income proofs can apply. Specific eligibility depends on your credit profile and chosen loan type."
            },
            {
                q: "Is my data secure?",
                a: "Yes, we use industry-standard encryption and secure cloud infrastructure to protect your personal and financial documents."
            }
        ]
    },
    {
        title: "Documents & OCR",
        questions: [
            {
                q: "What documents are required?",
                a: "Typically, you need your Aadhaar card for identity, PAN card for tax verification, and the last 6 months of bank statements or salary slips."
            },
            {
                q: "How does the OCR work?",
                a: "When you upload a document, our AI scans the image/PDF, extracts relevant fields (like name, PAN number, or income), and automatically populates your application form."
            },
            {
                q: "What if the OCR fails to read my document?",
                a: "You can always manually edit the fields if the AI misses any detail. Ensuring a high-quality, clear scan of the document helps improve OCR accuracy."
            }
        ]
    },
    {
        title: "Eligibility & Approval",
        questions: [
            {
                q: "How is the Approval Probability calculated?",
                a: "Our AI analyzes your Debt-to-Income (DTI) ratio, monthly income brackets, and credit health to provide a real-time assessment of your application's success."
            },
            {
                q: "Does a 'Low Risk' preview guarantee approval?",
                a: "While a 'Low Risk' assessment indicates a very high chance of success, final approval depends on a comprehensive verification of your credit score and documents by a loan officer."
            }
        ]
    }
];

export default function FAQs() {
    return (
        <ApplicantLayout>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground">Everything you need to know about the smart loan process.</p>
                </div>

                {/* Search */}
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Search for answers..." />
                </div>

                <div className="space-y-8">
                    {faqCategories.map((category, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-accent" />
                                {category.title}
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {category.questions.map((faq, fidx) => (
                                    <AccordionItem key={fidx} value={`item-${idx}-${fidx}`} className="border rounded-lg px-4 bg-card">
                                        <AccordionTrigger className="hover:no-underline font-medium text-left">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground pb-4">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* Support CTA */}
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-8 text-center space-y-4">
                        <h3 className="font-bold text-lg">Still have questions?</h3>
                        <p className="text-muted-foreground mb-6">If you can't find the answer you're looking for, our support team is here to help.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="outline" className="gap-2">
                                <MessageCircle className="w-4 h-4" />
                                Live Chat
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Phone className="w-4 h-4" />
                                Contact Us
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ApplicantLayout>
    );
}
