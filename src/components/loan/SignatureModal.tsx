import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    loanId: string;
    onSuccess: () => void;
}

export function SignatureModal({ isOpen, onClose, loanId, onSuccess }: SignatureModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sigPad = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigPad.current?.clear();
    };

    const handleSign = async () => {
        if (sigPad.current?.isEmpty()) {
            toast.error("Please provide a signature");
            return;
        }

        setIsSubmitting(true);
        try {
            const signatureData = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");

            await api.patch(`/loans/${loanId}/sign`, { signatureData });

            toast.success("Loan signed successfully!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error signing loan:", error);
            toast.error(error.response?.data?.message || "Failed to sign loan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Sign Sanction Letter</DialogTitle>
                    <DialogDescription>
                        By signing below, you agree to the terms and conditions of the loan as outlined in your sanction letter.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-border rounded-lg bg-white overflow-hidden">
                        <SignatureCanvas
                            ref={sigPad}
                            penColor="black"
                            canvasProps={{
                                width: 450,
                                height: 200,
                                className: "sigCanvas cursor-crosshair",
                            }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <p className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Secure digital signature
                        </p>
                        <Button variant="ghost" size="sm" onClick={clear} className="h-7 text-xs gap-1">
                            <RotateCcw className="w-3 h-3" /> Clear Pad
                        </Button>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSign} disabled={isSubmitting} className="gradient-primary">
                        {isSubmitting ? "Signing..." : "Confirm & Sign"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
