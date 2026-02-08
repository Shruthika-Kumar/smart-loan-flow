import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export interface ExtractedData {
  fullName?: string;
  pan?: string;
  aadhaar?: string;
  dateOfBirth?: string;
  address?: string;
  fatherName?: string;
  companyName?: string;
  designation?: string;
  monthlyIncome?: string;
  accountNumber?: string;
  bankName?: string;
  averageBalance?: string;
  creditScore?: string;
}

interface DocumentUploadItem {
  id: string;
  name: string;
  required: boolean;
  status: "pending" | "uploading" | "processing" | "verified" | "error";
  progress: number;
  fileName?: string;
  extractedData?: ExtractedData;
  errorMessage?: string;
}

interface SmartDocumentUploadProps {
  documents: DocumentUploadItem[];
  onDocumentUpload: (docId: string, file: File) => void;
  onDataExtracted: (data: ExtractedData) => void;
  onRemoveDocument: (docId: string) => void;
}

// Simulated OCR data extraction based on document type
const simulateOCRExtraction = (docId: string): ExtractedData => {
  const ocrData: Record<string, ExtractedData> = {
    pan: {
      fullName: "RAJESH KUMAR SHARMA",
      pan: "ABCDE1234F",
      dateOfBirth: "15/08/1985",
      fatherName: "MOHAN LAL SHARMA",
    },
    aadhaar: {
      fullName: "Rajesh Kumar Sharma",
      aadhaar: "XXXX XXXX 7890",
      address: "123, Green Park Colony, Sector 15, New Delhi - 110016",
      dateOfBirth: "15/08/1985",
    },
    salary_slip: {
      companyName: "Tech Solutions Pvt Ltd",
      designation: "Senior Software Engineer",
      monthlyIncome: "125000",
    },
    bank_statement: {
      bankName: "HDFC Bank",
      accountNumber: "XXXX XXXX 4567",
      averageBalance: "285000",
    },
    form16: {
      companyName: "Tech Solutions Pvt Ltd",
      pan: "ABCDE1234F",
    },
    credit_report: {
      creditScore: "742",
    },
  };

  return ocrData[docId] || {};
};

export function SmartDocumentUpload({
  documents,
  onDocumentUpload,
  onDataExtracted,
  onRemoveDocument,
}: SmartDocumentUploadProps) {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = useCallback(
    (docId: string, e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      const file = e.dataTransfer.files[0];
      if (file) {
        onDocumentUpload(docId, file);
      }
    },
    [onDocumentUpload]
  );

  const handleFileSelect = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onDocumentUpload(docId, file);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Header with AI Badge */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">AI-Powered Document Processing</span>
        </div>
        <span className="text-sm text-muted-foreground">
          Upload documents to auto-fill your application
        </span>
      </div>

      {/* Document Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className={`relative overflow-hidden transition-all ${
                doc.status === "verified"
                  ? "border-accent/50 bg-accent/5"
                  : doc.status === "error"
                  ? "border-risk-high/50 bg-risk-high/5"
                  : dragOver === doc.id
                  ? "border-accent border-dashed bg-accent/5"
                  : "hover:border-muted-foreground/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(doc.id);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(doc.id, e)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      doc.status === "verified"
                        ? "bg-accent text-accent-foreground"
                        : doc.status === "error"
                        ? "bg-risk-high/10 text-risk-high"
                        : doc.status === "uploading" || doc.status === "processing"
                        ? "bg-status-processing/10 text-status-processing"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {doc.status === "verified" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : doc.status === "error" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : doc.status === "uploading" || doc.status === "processing" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">
                        {doc.name}
                        {doc.required && <span className="text-risk-high ml-1">*</span>}
                      </h4>
                      {doc.status === "verified" && (
                        <button
                          onClick={() => onRemoveDocument(doc.id)}
                          className="p-1 hover:bg-muted rounded-md transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    {/* Status-based content */}
                    {doc.status === "pending" && (
                      <div className="mt-2">
                        <label
                          className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 hover:bg-muted/30 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Drop file or click to upload
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileSelect(doc.id, e)}
                          />
                        </label>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          PDF, JPG or PNG (max 5MB)
                        </p>
                      </div>
                    )}

                    {(doc.status === "uploading" || doc.status === "processing") && (
                      <div className="mt-2 space-y-2">
                        <Progress value={doc.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {doc.status === "processing" ? (
                            <>
                              <Sparkles className="w-3 h-3 text-accent" />
                              AI extracting information...
                            </>
                          ) : (
                            `Uploading... ${doc.progress}%`
                          )}
                        </p>
                      </div>
                    )}

                    {doc.status === "verified" && doc.fileName && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span className="truncate">{doc.fileName}</span>
                          <button className="p-1 hover:bg-muted rounded">
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {doc.status === "error" && (
                      <div className="mt-2">
                        <p className="text-xs text-risk-high">{doc.errorMessage || "Upload failed"}</p>
                        <label className="text-xs text-accent cursor-pointer hover:underline">
                          Try again
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileSelect(doc.id, e)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Data Preview */}
                <AnimatePresence>
                  {doc.status === "verified" && doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-border"
                    >
                      <p className="text-xs font-medium text-accent mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Extracted & Auto-filled
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {Object.entries(doc.extractedData).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>{" "}
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Hook for managing document uploads with OCR simulation
export function useSmartDocumentUpload(onDataExtracted: (data: ExtractedData) => void) {
  const [documents, setDocuments] = useState<DocumentUploadItem[]>([
    { id: "pan", name: "PAN Card", required: true, status: "pending", progress: 0 },
    { id: "aadhaar", name: "Aadhaar Card", required: true, status: "pending", progress: 0 },
    { id: "salary_slip", name: "Salary Slip (3 months)", required: true, status: "pending", progress: 0 },
    { id: "bank_statement", name: "Bank Statement (6 months)", required: true, status: "pending", progress: 0 },
    { id: "form16", name: "Form 16 / ITR", required: false, status: "pending", progress: 0 },
    { id: "address_proof", name: "Address Proof", required: false, status: "pending", progress: 0 },
  ]);

  const handleDocumentUpload = useCallback(
    (docId: string, file: File) => {
      // Start uploading
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "uploading", progress: 0, fileName: file.name }
            : doc
        )
      );

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Start processing
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === docId ? { ...doc, status: "processing", progress: 100 } : doc
            )
          );

          // Simulate OCR
          setTimeout(() => {
            const extractedData = simulateOCRExtraction(docId);
            
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === docId
                  ? { ...doc, status: "verified", extractedData }
                  : doc
              )
            );

            // Notify parent of extracted data
            onDataExtracted(extractedData);
          }, 1500 + Math.random() * 1000);
        } else {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === docId ? { ...doc, progress: Math.min(progress, 100) } : doc
            )
          );
        }
      }, 100);
    },
    [onDataExtracted]
  );

  const handleRemoveDocument = useCallback((docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, status: "pending", progress: 0, fileName: undefined, extractedData: undefined }
          : doc
      )
    );
  }, []);

  const requiredDocumentsVerified = documents
    .filter((d) => d.required)
    .every((d) => d.status === "verified");

  const uploadProgress = (documents.filter((d) => d.status === "verified").length / documents.length) * 100;

  return {
    documents,
    handleDocumentUpload,
    handleRemoveDocument,
    requiredDocumentsVerified,
    uploadProgress,
  };
}
