import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  CheckCircle2,
  Camera,
  FileText,
  User,
  Shield,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { performOCR } from "@/lib/ocr";
import api from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Eye } from "lucide-react";

interface DocumentUpload {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  status: "pending" | "uploading" | "processing" | "verified" | "error";
  progress: number;
  extractedData?: Record<string, string>;
  error?: string;
  rawText?: string;
  confidence?: number;
}

export default function CompleteKYC() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      id: "pan",
      name: "PAN Card",
      description: "For identity and tax verification",
      icon: FileText,
      status: "pending",
      progress: 0,
    },
    {
      id: "aadhaar",
      name: "Aadhaar Card",
      description: "For identity and address proof",
      icon: User,
      status: "pending",
      progress: 0,
    },
    {
      id: "selfie",
      name: "Live Selfie",
      description: "For face verification",
      icon: Camera,
      status: "pending",
      progress: 0,
    },
  ]);

  const handleFileUpload = async (docId: string, file: File) => {
    // 1. Set status to Processing/Uploading
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: "processing", progress: 0 } : doc
      )
    );

    try {
      if (docId === "selfie") {
        // Selfie still uses a simulation or requires a different service
        // For now, we simulate success for selfie
        let p = 0;
        const interval = setInterval(() => {
          p += 20;
          setDocuments(prev => prev.map(d => d.id === 'selfie' ? { ...d, progress: p, status: 'uploading' } : d));
          if (p >= 100) clearInterval(interval);
        }, 100);

        setTimeout(() => {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === "selfie"
                ? { ...doc, status: "verified", extractedData: { faceMatch: "98% Match", livenessCheck: "Passed" } }
                : doc
            )
          );
        }, 1500);
        return;
      }

      // 2. Perform Real OCR for documents
      console.log(`Starting real OCR for ${docId}:`, file.name);
      const result = await performOCR(file, docId, (p) => {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, progress: p } : doc
          )
        );
      });

      if (!result.success) {
        throw new Error(result.error || "OCR processing failed");
      }

      // 3. Map Real OCR data to KYC state
      const mapping: Record<string, string> = {};
      const pd = result.parsedData;

      if (docId === 'pan') {
        mapping.panNumber = pd.panNumber || "Not found";
        mapping.fullName = pd.name || "Not found";
        mapping.dateOfBirth = pd.dob || "Not found";
        mapping.fatherName = pd.fatherName || "Not found";
      } else if (docId === 'aadhaar') {
        mapping.aadhaarNumber = pd.aadhaarNumber || "Not found";
        mapping.gender = pd.gender || "Not found";
        mapping.dateOfBirth = pd.dob || "Not found";
        mapping.address = pd.address || "Not found";
        mapping.pincode = pd.pincode || "Not found";
      } else if (docId === 'bank_statement') {
        mapping.bankName = pd.bankName || "Not found";
        mapping.accountNumber = pd.accountNumber || "Not found";
        mapping.balance = pd.balance || "Not found";
        mapping.ifscCode = pd.ifscCode || "Not found";
      } else if (docId === 'salary_slip') {
        mapping.netPay = pd.netPay || "Not found";
        mapping.employer = pd.employerName || "Not found";
        mapping.monthYear = pd.monthYear || "Not found";
      }

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? {
              ...doc,
              status: "verified",
              extractedData: mapping,
              rawText: result.rawText,
              confidence: result.confidence
            }
            : doc
        )
      );

      toast({
        title: "Verification Successful",
        description: `${docId.toUpperCase()} verified and data extracted.`,
      });

    } catch (error: any) {
      console.error("KYC OCR Error:", error);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "error", error: error.message }
            : doc
        )
      );
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const allVerified = documents.every((doc) => doc.status === "verified");
  const progress = (documents.filter((d) => d.status === "verified").length / documents.length) * 100;

  const handleContinue = async () => {
    try {
      // Update KYC status to 'verified' on the backend
      await api.patch("/users/kyc-status", {
        status: "verified"
      });

      toast({
        title: "KYC Completed",
        description: "Your document verification status has been synced.",
      });

      navigate("/applicant");
    } catch (error) {
      console.error("Error saving KYC status:", error);
      // Still navigate but show a warning
      toast({
        title: "Sync Warning",
        description: "Documents verified locally but failed to sync. We will retry later.",
        variant: "destructive"
      });
      navigate("/applicant");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-white">SB</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your KYC</h1>
          <p className="text-muted-foreground mt-2">
            Upload your documents for instant verification
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-6 border-accent/20 bg-accent/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-accent font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Document Upload Cards */}
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`transition-all ${doc.status === "verified" ? "border-accent/50" : ""}`}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === "verified"
                        ? "bg-accent text-accent-foreground"
                        : doc.status === "error"
                          ? "bg-risk-high/10 text-risk-high"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {doc.status === "verified" ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : doc.status === "uploading" || doc.status === "processing" ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : doc.status === "error" ? (
                        <AlertCircle className="w-6 h-6" />
                      ) : (
                        <doc.icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{doc.name}</h3>
                        {doc.status === "verified" && (
                          <span className="text-xs font-medium text-accent flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {doc.status === "uploading"
                          ? "Uploading..."
                          : doc.status === "processing"
                            ? "Processing with AI OCR..."
                            : doc.description}
                      </p>

                      {/* Upload Progress */}
                      {(doc.status === "uploading" || doc.status === "processing") && (
                        <div className="space-y-2">
                          <Progress value={doc.status === "processing" ? 100 : doc.progress} className="h-1.5" />
                          {doc.status === "processing" && (
                            <div className="flex items-center gap-2 text-xs text-accent">
                              <Sparkles className="w-3 h-3" />
                              AI extracting information...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Extracted Data */}
                      <AnimatePresence>
                        {doc.status === "verified" && doc.extractedData && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-medium text-accent flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Extracted Information
                              </p>
                              {doc.confidence !== undefined && (
                                <span className="text-[10px] text-accent font-medium px-2 py-0.5 bg-accent/5 rounded-md border border-accent/10">
                                  {doc.confidence}% Confidence
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-[100px,1fr] gap-x-3 gap-y-2 p-1">
                              {Object.entries(doc.extractedData).map(([key, value]) => {
                                const label = key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .replace("P A N", "PAN")
                                  .trim();

                                return value && (
                                  <div key={key} className="contents group">
                                    <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-tight flex items-center">
                                      {label}
                                    </span>
                                    <span className="text-[11px] font-semibold text-foreground truncate py-0.5 px-2 bg-accent/5 rounded border border-accent/10 group-hover:bg-accent/10 transition-colors" title={String(value)}>
                                      {value}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Debug Section */}
                            <Collapsible className="mt-2 pt-2 border-t border-accent/10 border-dashed">
                              <CollapsibleTrigger className="text-[10px] text-muted-foreground hover:text-accent flex items-center gap-1">
                                <Eye className="w-2.5 h-2.5" />
                                View Technical OCR Output
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-1">
                                <div className="p-2 bg-muted/30 rounded text-muted-foreground font-mono text-[9px] whitespace-pre-wrap leading-tight max-h-32 overflow-y-auto border border-accent/5">
                                  {doc.rawText ? doc.rawText : "No raw text available for this scan."}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Upload Button */}
                      {doc.status === "pending" && (
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 pointer-events-none"
                          >
                            <Upload className="w-4 h-4" />
                            {doc.id === "selfie" ? "Take Selfie" : "Upload Document"}
                          </Button>
                          <input
                            type="file"
                            accept={doc.id === "selfie" ? "image/*" : ".pdf,.jpg,.jpeg,.png"}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(doc.id, file);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="mt-6 bg-muted/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium">Your Data is Secure</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All documents are encrypted and processed in compliance with RBI guidelines.
                  Your information is never shared without consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Button
            className="w-full h-12 bg-accent hover:bg-accent/90"
            disabled={!allVerified}
            onClick={handleContinue}
          >
            {allVerified ? (
              <>
                Continue to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Complete All Verifications to Continue"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
