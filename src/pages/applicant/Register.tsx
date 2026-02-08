import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Shield, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pan: "",
    aadhaar: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeDataConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const passwordStrength = () => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "One number", met: /[0-9]/.test(formData.password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/applicant/verify-otp");
    }, 1500);
  };

  const progress = currentStep === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl font-bold">SB</span>
              </div>
              <span className="text-2xl font-semibold">Smart BankFlow</span>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Start Your Journey to Financial Freedom
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-md">
              Create your account in minutes. Upload documents once, apply for multiple loans seamlessly.
            </p>
            <div className="space-y-4">
              {[
                "Secure document storage",
                "One-time KYC verification",
                "Instant loan eligibility check",
                "24/7 application tracking",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-white">SB</span>
                </div>
                <span className="text-lg font-semibold">Smart BankFlow</span>
              </div>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Step {currentStep} of 2: {currentStep === 1 ? "Personal Information" : "Security Setup"}
              </CardDescription>
              <Progress value={progress} className="h-1 mt-4" />
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name (as per PAN)</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <div className="flex gap-2">
                        <div className="w-20 h-11 flex items-center justify-center bg-muted rounded-md text-sm font-medium">
                          +91
                        </div>
                        <Input
                          id="phone"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="h-11 flex-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input
                          id="pan"
                          placeholder="ABCDE1234F"
                          value={formData.pan}
                          onChange={(e) => updateField("pan", e.target.value.toUpperCase().slice(0, 10))}
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadhaar">Aadhaar (Last 4)</Label>
                        <Input
                          id="aadhaar"
                          placeholder="1234"
                          value={formData.aadhaar}
                          onChange={(e) => updateField("aadhaar", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="h-11"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          className="h-11 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Progress 
                        value={passwordStrength()} 
                        className={`h-1.5 ${
                          passwordStrength() <= 25 ? "[&>div]:bg-risk-high" :
                          passwordStrength() <= 50 ? "[&>div]:bg-risk-medium" :
                          "[&>div]:bg-risk-low"
                        }`}
                      />
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {passwordRequirements.map((req) => (
                          <div key={req.label} className="flex items-center gap-1.5 text-xs">
                            {req.met ? (
                              <Check className="w-3 h-3 text-risk-low" />
                            ) : (
                              <X className="w-3 h-3 text-muted-foreground" />
                            )}
                            <span className={req.met ? "text-risk-low" : "text-muted-foreground"}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="h-11"
                        required
                      />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-risk-high flex items-center gap-1">
                          <X className="w-3 h-3" /> Passwords do not match
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => updateField("agreeTerms", checked as boolean)}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
                          I agree to the{" "}
                          <a href="#" className="text-accent hover:underline">Terms of Service</a>
                          {" "}and{" "}
                          <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="consent"
                          checked={formData.agreeDataConsent}
                          onCheckedChange={(checked) => updateField("agreeDataConsent", checked as boolean)}
                          required
                        />
                        <Label htmlFor="consent" className="text-sm font-normal cursor-pointer leading-tight">
                          I consent to the processing of my personal data for credit assessment and KYC verification
                        </Label>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  {currentStep === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-accent hover:bg-accent/90"
                    disabled={isLoading || (currentStep === 2 && (!formData.agreeTerms || !formData.agreeDataConsent))}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : currentStep === 1 ? (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/applicant/login" className="text-accent hover:text-accent/80 font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
