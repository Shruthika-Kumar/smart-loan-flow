import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Shield, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [verificationMethod, setVerificationMethod] = useState<"phone" | "email">("phone");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length !== 6) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/applicant/complete-kyc");
    }, 1500);
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const maskedPhone = "••••••7890";
  const maskedEmail = "j•••@example.com";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-white">SB</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Identity</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a verification code to your registered{" "}
            {verificationMethod === "phone" ? "phone" : "email"}
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Enter Verification Code</CardTitle>
            <CardDescription>
              Code sent to {verificationMethod === "phone" ? maskedPhone : maskedEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Verification Method Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setVerificationMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  verificationMethod === "phone"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setVerificationMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  verificationMethod === "email"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend code in{" "}
                    <span className="font-medium text-foreground">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend Code
                  </button>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-accent hover:bg-accent/90"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Secure Verification</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your OTP is valid for 10 minutes. Never share this code with anyone.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
