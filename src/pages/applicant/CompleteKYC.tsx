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

interface DocumentUpload {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  status: "pending" | "uploading" | "processing" | "verified" | "error";
  progress: number;
  extractedData?: Record<string, string>;
}

export default function CompleteKYC() {
  const navigate = useNavigate();
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

  const simulateUpload = (docId: string) => {
    // Start uploading
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: "uploading", progress: 0 } : doc
      )
    );

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId ? { ...doc, progress: Math.min(progress, 100) } : doc
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        // Start processing
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, status: "processing" } : doc
          )
        );

        // Simulate OCR processing
        setTimeout(() => {
          const extractedData: Record<string, string> = {};
          if (docId === "pan") {
            extractedData.panNumber = "ABCDE1234F";
            extractedData.fullName = "RAJESH KUMAR SHARMA";
            extractedData.dateOfBirth = "15/08/1985";
            extractedData.fatherName = "MOHAN LAL SHARMA";
          } else if (docId === "aadhaar") {
            extractedData.aadhaarNumber = "XXXX XXXX 7890";
            extractedData.address = "123, Green Park, New Delhi - 110016";
            extractedData.gender = "Male";
          } else if (docId === "selfie") {
            extractedData.faceMatch = "98% Match";
            extractedData.livenessCheck = "Passed";
          }

          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === docId
                ? { ...doc, status: "verified", extractedData }
                : doc
            )
          );
        }, 2000);
      }
    }, 150);
  };

  const allVerified = documents.every((doc) => doc.status === "verified");
  const progress = (documents.filter((d) => d.status === "verified").length / documents.length) * 100;

  const handleContinue = () => {
    navigate("/applicant");
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
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        doc.status === "verified"
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
                            <p className="text-xs font-medium text-accent mb-2 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Extracted Information
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(doc.extractedData).map(([key, value]) => (
                                <div key={key}>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </p>
                                  <p className="text-sm font-medium">{value}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Upload Button */}
                      {doc.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => simulateUpload(doc.id)}
                        >
                          <Upload className="w-4 h-4" />
                          {doc.id === "selfie" ? "Take Selfie" : "Upload Document"}
                        </Button>
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
