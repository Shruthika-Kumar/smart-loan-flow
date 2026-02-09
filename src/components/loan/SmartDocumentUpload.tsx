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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { performOCR } from "@/lib/ocr";

export interface ExtractedData {
  fullName?: string;
  pan?: string;
  aadhaar?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  pincode?: string;
  fatherName?: string;
  companyName?: string;
  designation?: string;
  monthlyIncome?: string;
  monthYear?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  averageBalance?: string;
  totalIncome?: string;
  assessmentYear?: string;
  employerPAN?: string;
  employeePAN?: string;
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
  rawText?: string;
  confidence?: number;
}

interface SmartDocumentUploadProps {
  documents: DocumentUploadItem[];
  onDocumentUpload: (docId: string, file: File) => void;
  onDataExtracted: (data: ExtractedData) => void;
  onRemoveDocument: (docId: string) => void;
}

// Removed simulateOCRExtraction as we now use real OCR

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <Card
              className={`relative overflow-hidden transition-all h-full flex flex-col ${doc.status === "verified"
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
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.status === "verified"
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
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-accent flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Extracted & Auto-filled
                        </p>
                        {doc.status === "verified" && doc.confidence !== undefined && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/5 rounded-md border border-accent/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] text-accent font-medium">{doc.confidence}% Confidence</span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-[110px,1fr] gap-x-3 gap-y-2 p-1 flex-1">
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
                      <Collapsible className="mt-2 pt-2 border-t border-dashed">
                        <CollapsibleTrigger className="text-[10px] text-muted-foreground hover:text-accent flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" />
                          Show Raw OCR Data
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1">
                          <div className="p-2 bg-muted/30 rounded text-muted-foreground font-mono text-[9px] whitespace-pre-wrap leading-tight max-h-32 overflow-y-auto">
                            {doc.rawText ? doc.rawText : "No raw text captured."}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
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
    { id: "form16_itr", name: "Form 16 / ITR", required: false, status: "pending", progress: 0 },
    { id: "address_proof", name: "Address Proof", required: true, status: "pending", progress: 0 },
  ]);

  const handleDocumentUpload = useCallback(
    async (docId: string, file: File) => {
      // 1. Set status to Processing (Browser-side OCR)
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "processing", progress: 0, fileName: file.name }
            : doc
        )
      );

      try {
        // 2. Perform Real OCR
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

        // 3. Map Real OCR data to ExtractedData interface
        const mapping: ExtractedData = {};
        const pd = result.parsedData;

        if (docId === 'pan') {
          mapping.fullName = pd.name;
          mapping.pan = pd.panNumber;
          mapping.dateOfBirth = pd.dob;
          mapping.fatherName = pd.fatherName;
        } else if (docId === 'aadhaar') {
          mapping.fullName = pd.name;
          mapping.aadhaar = pd.aadhaarNumber;
          mapping.dateOfBirth = pd.dob;
          mapping.gender = pd.gender;
          mapping.address = pd.address;
          mapping.pincode = pd.pincode;
        } else if (docId === 'bank_statement') {
          mapping.bankName = pd.bankName;
          mapping.accountNumber = pd.accountNumber;
          mapping.averageBalance = pd.balance;
          mapping.ifscCode = pd.ifscCode;
        } else if (docId === 'salary_slip') {
          mapping.monthlyIncome = pd.netPay;
          mapping.companyName = pd.employerName;
          mapping.monthYear = pd.monthYear;
        } else if (docId === 'form16_itr') {
          mapping.totalIncome = pd.totalIncome;
          mapping.assessmentYear = pd.assessmentYear;
          mapping.employerPAN = pd.employerPAN;
          mapping.employeePAN = pd.employeePAN;
          mapping.pan = pd.employeePAN;
        } else if (docId === 'address_proof') {
          mapping.address = pd.address;
          mapping.fullName = pd.customerName;
          mapping.pincode = pd.pincode;
        }

        // 4. Update state to Verified
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? {
                ...doc,
                status: "verified",
                extractedData: mapping,
                progress: 100,
                rawText: result.rawText,
                confidence: result.confidence
              }
              : doc
          )
        );

        // 5. Notify parent of extracted data
        onDataExtracted(mapping);

      } catch (error: any) {
        console.error("Smart OCR Error:", error);
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? { ...doc, status: "error", errorMessage: error.message }
              : doc
          )
        );
      }
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
