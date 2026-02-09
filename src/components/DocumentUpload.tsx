import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileText,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertCircle,
    Eye,
    Trash2,
    Plus,
    FileUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { performOCR } from "@/lib/ocr";

interface DocumentUploadProps {
    documentType?: "aadhaar" | "pan" | "bank" | "auto";
    onUploadSuccess?: (document: any) => void;
}

export default function DocumentUpload({
    documentType = "auto",
    onUploadSuccess,
}: DocumentUploadProps) {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedDocument, setUploadedDocument] = useState<any>(null);
    const [extractedData, setExtractedData] = useState<any>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const currentFile = acceptedFiles[0];
            setUploading(true);
            setProgress(0);

            try {
                // 1. Perform Real OCR in the Browser
                console.log("Starting browser-side OCR...");
                const ocrResult = await performOCR(currentFile, documentType, (p) => {
                    setProgress(p);
                });

                if (!ocrResult.success) {
                    throw new Error(ocrResult.error || "OCR failed");
                }

                // 2. Prepare Form Data with extracted info
                const formData = new FormData();
                formData.append("document", currentFile);
                formData.append("documentType", ocrResult.detectedType || documentType);
                formData.append("extractedData", JSON.stringify(ocrResult.parsedData));
                formData.append("rawText", ocrResult.rawText);
                formData.append("confidence", ocrResult.confidence.toString());

                // 3. Upload to Backend
                const response = await api.post("/documents/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                setProgress(100);
                setUploadedDocument(response.data.document);
                setExtractedData(response.data.document.parsedData);

                toast({
                    title: "Status: Success",
                    description: "Document processed and verified",
                });

                if (onUploadSuccess) {
                    onUploadSuccess(response.data.document);
                }
            } catch (error: any) {
                console.error("OCR/Upload error:", error);
                toast({
                    title: "Upload Failed",
                    description: error.message || "Something went wrong",
                    variant: "destructive",
                });
            } finally {
                setUploading(false);
            }
        },
        [documentType, onUploadSuccess, toast]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    const resetUpload = () => {
        setUploadedDocument(null);
        setExtractedData(null);
        setProgress(0);
    };

    const getDocumentTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            Aadhaar: "Aadhaar Card",
            PAN: "PAN Card",
            BankStatement: "Bank Statement",
            Other: "Document",
        };
        return labels[type] || type;
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!uploadedDocument ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative group overflow-hidden rounded-2xl p-1 justify-center transition-all duration-300"
                    >
                        <div
                            {...getRootProps()}
                            className={`
                                relative z-10 w-full rounded-[calc(1rem-3px)] py-10 px-6 text-center cursor-pointer transition-all duration-300
                                ${isDragActive ? 'bg-gradient-to-r from-primary to-accent bg-opacity-10' : 'bg-muted/10 border-2 border-dashed border-border/50 hover:bg-muted/20 hover:border-primary/30'}
                                ${uploading ? 'pointer-events-none' : ''}
                            `}
                        >
                            <input {...getInputProps()} />

                            <div className="flex flex-col items-center gap-4">
                                <motion.div
                                    animate={uploading ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={`p-4 rounded-full ${uploading ? 'bg-primary/10' : 'bg-background shadow-xl border border-border group-hover:scale-110 transition-transform duration-500'}`}
                                >
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    ) : (
                                        <FileUp className="w-8 h-8 text-primary" />
                                    )}
                                </motion.div>

                                <div className="space-y-1">
                                    <h4 className="text-base font-bold tracking-tight">
                                        {uploading ? 'Analyzing Document...' : isDragActive ? 'Release to Upload' : 'Click or Drag to Upload'}
                                    </h4>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {uploading ? 'Running OCR extraction...' : 'Supports PDF, JPG, PNG (Max 10MB)'}
                                    </p>
                                </div>

                                {uploading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full max-w-[200px] mt-2 space-y-2"
                                    >
                                        <Progress value={progress} className="h-1.5 bg-primary/20" />
                                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{progress}% Processed</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background rounded-2xl border-2 border-risk-low/30 shadow-xl shadow-risk-low/5 overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-risk-low/10 rounded-full">
                                        <CheckCircle2 className="w-5 h-5 text-risk-low" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold tracking-tight">Success!</p>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            {uploadedDocument.confidence}% match confidence
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetUpload}
                                    className="h-8 rounded-xl hover:bg-risk-high/10 hover:text-risk-high text-muted-foreground transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                            </div>

                            <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                                <p className="text-xs font-bold text-muted-foreground truncate">{uploadedDocument.fileName}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
