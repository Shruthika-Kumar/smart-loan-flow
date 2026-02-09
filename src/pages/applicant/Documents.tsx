import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import DocumentUpload from "@/components/DocumentUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    CreditCard,
    Building2,
    File,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    Upload,
    History,
    Search,
    Download,
    Eye,
} from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function Documents() {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchDocuments(parsedUser.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchDocuments = async (userId: string) => {
        try {
            const response = await api.get(`/documents/user/${userId}`);
            setDocuments(response.data);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast({
                title: "Error",
                description: "Failed to load documents",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (document: any) => {
        setDocuments((prev) => [document, ...prev]);
        toast({
            title: "Success",
            description: `${document.documentType} uploaded successfully`,
        });
    };

    const handleView = (doc: any) => {
        if (doc.fileUrl) {
            window.open(doc.fileUrl, "_blank");
        } else {
            toast({
                title: "Preview Unavailable",
                description: "This document cannot be previewed",
                variant: "destructive",
            });
        }
    };

    const handleDownload = async (doc: any) => {
        try {
            if (doc.fileUrl) {
                const link = document.createElement("a");
                link.href = doc.fileUrl;
                link.download = doc.fileName || "document";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast({
                    title: "Download Started",
                    description: `Downloading ${doc.fileName}`,
                });
            }
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Could not download the document",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (documentId: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            await api.delete(`/documents/${documentId}`);
            setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
            toast({
                title: "Document Deleted",
                description: "Document has been removed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete document",
                variant: "destructive",
            });
        }
    };

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case "Aadhaar":
                return <CreditCard className="w-6 h-6 text-primary" />;
            case "PAN":
                return <FileText className="w-6 h-6 text-accent" />;
            case "BankStatement":
                return <Building2 className="w-6 h-6 text-primary" />;
            default:
                return <File className="w-6 h-6 text-muted-foreground" />;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="w-5 h-5 text-risk-low" />;
            case "failed":
                return <XCircle className="w-5 h-5 text-risk-high" />;
            default:
                return (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Clock className="w-5 h-5 text-status-processing" />
                    </motion.div>
                );
        }
    };

    const getVerificationBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-risk-low/20 text-risk-low hover:bg-risk-low/30 border-none px-3 py-1">Verified</Badge>;
            case "rejected":
                return <Badge className="bg-risk-high/20 text-risk-high hover:bg-risk-high/30 border-none px-3 py-1">Rejected</Badge>;
            default:
                return <Badge className="bg-status-processing/20 text-status-processing hover:bg-status-processing/30 border-none px-3 py-1">Pending Review</Badge>;
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uploadCards = [
        {
            id: "aadhaar",
            title: "Aadhaar Card",
            type: "Aadhaar",
            icon: <CreditCard className="w-8 h-8 text-primary" />,
            bgColor: "bg-primary/5",
            borderColor: "hover:border-primary/50",
            description: "Used for identity and address verification"
        },
        {
            id: "pan",
            title: "PAN Card",
            type: "PAN",
            icon: <FileText className="w-8 h-8 text-accent" />,
            bgColor: "bg-accent/5",
            borderColor: "hover:border-accent/50",
            description: "Used for financial and tax verification"
        },
        {
            id: "bank",
            title: "Bank Statement",
            type: "BankStatement",
            icon: <Building2 className="w-8 h-8 text-primary" />,
            bgColor: "bg-primary/5",
            borderColor: "hover:border-primary/50",
            description: "Latest 6 months bank statement (PDF preferred)"
        }
    ] as const;

    return (
        <ApplicantLayout>
            <div className="max-w-7xl mx-auto space-y-10 py-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-8 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                    Document Center
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Securely upload and manage your digital documents. Verified files accelerate your loan approval process.
                            </p>
                        </div>
                        <div className="flex gap-4 p-2 bg-background/40 backdrop-blur-md rounded-2xl border border-white/20">
                            <div className="text-center px-4 py-2">
                                <p className="text-2xl font-bold text-primary">{documents.length}</p>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Total Files</p>
                            </div>
                            <div className="w-px h-10 bg-border/50 self-center" />
                            <div className="text-center px-4 py-2">
                                <p className="text-2xl font-bold text-risk-low">
                                    {documents.filter(d => d.verificationStatus === 'verified').length}
                                </p>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Verified</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <Tabs defaultValue="upload" className="w-full space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-1 bg-muted/30 rounded-2xl border border-border/50 backdrop-blur-sm">
                        <TabsList className="bg-transparent h-12 p-1 gap-2">
                            <TabsTrigger
                                value="upload"
                                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg h-10 px-6 gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Add Documents
                            </TabsTrigger>
                            <TabsTrigger
                                value="my-documents"
                                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg h-10 px-6 gap-2"
                            >
                                <History className="w-4 h-4" />
                                My Documents
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-full md:w-80 group pr-4">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search by name or type..."
                                className="pl-10 h-10 bg-background/50 border-none rounded-xl focus-visible:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Upload Tab Container */}
                        <TabsContent value="upload" className="mt-0 outline-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            >
                                {uploadCards.map((card, idx) => (
                                    <motion.div
                                        key={card.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group"
                                    >
                                        <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${card.borderColor} hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-primary/10`}>
                                            <div className="p-8">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className={`p-4 rounded-2xl ${card.bgColor} transform group-hover:scale-110 transition-transform duration-500`}>
                                                        {card.icon}
                                                    </div>
                                                    <Badge variant="outline" className="opacity-50 group-hover:opacity-100 transition-opacity">Required</Badge>
                                                </div>
                                                <div className="space-y-1 mb-8">
                                                    <h3 className="text-xl font-bold tracking-tight">{card.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {card.description}
                                                    </p>
                                                </div>

                                                <div className="relative z-10 bg-muted/20 rounded-2xl border border-dashed border-border group-hover:border-primary/30 transition-colors overflow-hidden">
                                                    <DocumentUpload
                                                        documentType={card.id as any}
                                                        onUploadSuccess={handleUploadSuccess}
                                                    />
                                                </div>
                                            </div>

                                            {/* Decorative Background Element */}
                                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl group-hover:from-primary/10 group-hover:to-accent/10 transition-colors" />
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        {/* My Documents Tab Container */}
                        <TabsContent value="my-documents" className="mt-0 outline-none">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                        <div className="w-16 h-16 bg-muted rounded-full mb-4" />
                                        <p className="text-muted-foreground">Syncing documents...</p>
                                    </div>
                                ) : filteredDocuments.length === 0 ? (
                                    <Card className="border-dashed py-24 bg-muted/10">
                                        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="p-6 bg-muted rounded-full">
                                                <File className="w-12 h-12 text-muted-foreground/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold tracking-tight">No matching files found</h3>
                                                <p className="text-muted-foreground max-w-sm">
                                                    We couldn't find any documents matching your search. Try adjusting your filters or upload a new file.
                                                </p>
                                            </div>
                                            <Button onClick={() => window.location.hash = 'upload'} variant="outline" className="rounded-xl">
                                                Upload First Document
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {filteredDocuments.map((doc, idx) => (
                                            <motion.div
                                                key={doc._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <Card className="group hover:border-primary/30 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm">
                                                    <CardContent className="p-0">
                                                        <div className="flex flex-col md:flex-row">
                                                            <div className="flex flex-1 items-center gap-6 p-6">
                                                                <div className="relative group-hover:scale-110 transition-transform duration-500">
                                                                    <div className="p-4 bg-background rounded-2xl shadow-sm border border-border group-hover:border-primary/20">
                                                                        {getDocumentIcon(doc.documentType)}
                                                                    </div>
                                                                    <div className="absolute -bottom-1 -right-1">
                                                                        {getStatusIcon(doc.status)}
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1 space-y-1 pr-4 min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-3">
                                                                        <h3 className="text-lg font-bold truncate tracking-tight">{doc.fileName}</h3>
                                                                        {getVerificationBadge(doc.verificationStatus)}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                                                                        <span className="flex items-center gap-1.5 capitalize">
                                                                            <Badge variant="outline" className="bg-muted font-bold tracking-wide scale-90 -ml-1">
                                                                                {doc.documentType}
                                                                            </Badge>
                                                                        </span>
                                                                        <span className="opacity-30">•</span>
                                                                        <span>{new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                                        {doc.confidence && (
                                                                            <>
                                                                                <span className="opacity-30">•</span>
                                                                                <span className="text-primary font-bold">{doc.confidence}% Confidence</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-row md:flex-col items-center justify-center gap-2 p-6 bg-muted/30 border-t md:border-t-0 md:border-l border-border/50">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-xl hover:bg-background hover:text-primary transition-colors"
                                                                        onClick={() => handleView(doc)}
                                                                        title="View Document"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-xl hover:bg-background hover:text-primary transition-colors"
                                                                        onClick={() => handleDownload(doc)}
                                                                        title="Download Document"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-xl hover:bg-risk-high/10 hover:text-risk-high transition-colors text-muted-foreground/50"
                                                                    onClick={() => handleDelete(doc._id)}
                                                                    title="Delete Document"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Preview Footer */}
                                                        {doc.parsedData && (
                                                            <div className="p-6 pt-0">
                                                                <div className="bg-background/80 rounded-2xl p-6 border border-border group-hover:border-primary/10 transition-colors">
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-8">
                                                                        {Object.entries(doc.parsedData).map(([key, value]) => {
                                                                            if (key === "documentType" || !value) return null;
                                                                            return (
                                                                                <div key={key} className="space-y-1">
                                                                                    <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest">
                                                                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                                                                    </p>
                                                                                    <p className="font-bold text-sm truncate text-foreground/90">
                                                                                        {value as string}
                                                                                    </p>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </ApplicantLayout>
    );
}
