import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { LoanTypeSelector, loanTypes } from "@/components/loan/LoanTypeSelector";
import { SmartDocumentUpload, useSmartDocumentUpload, ExtractedData } from "@/components/loan/SmartDocumentUpload";
import { AIEligibilityPreview } from "@/components/loan/AIEligibilityPreview";

const steps = [
  { id: 1, name: "Loan Type", icon: CreditCard },
  { id: 2, name: "Upload Documents", icon: Upload },
  { id: 3, name: "Personal Details", icon: User },
  { id: 4, name: "Employment", icon: Briefcase },
  { id: 5, name: "Loan Details", icon: FileText },
  { id: 6, name: "AI Preview", icon: Sparkles },
  { id: 7, name: "Review", icon: CheckCircle2 },
];

export default function LoanApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string>("salaried");
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    pan: "",
    aadhaar: "",
    dateOfBirth: "",
    maritalStatus: "",
    dependents: "",
    residentialType: "",
    address: "",
    // Employment - Salaried
    companyName: "",
    designation: "",
    monthlyIncome: "",
    workExperience: "",
    // Employment - Self-employed
    businessName: "",
    annualTurnover: "",
    yearsInBusiness: "",
    // Loan Details
    loanAmount: "",
    loanTenure: "",
    loanPurpose: "",
    propertyValue: "",
    downPayment: "",
    propertyLocation: "",
    interestType: "",
    vehicleCost: "",
    dealerName: "",
    // Consent
    agreeTerms: false,
    agreeCredit: false,
  });

  const handleDataExtracted = useCallback((data: ExtractedData) => {
    setFormData((prev) => ({
      ...prev,
      fullName: data.fullName || prev.fullName,
      pan: data.pan || prev.pan,
      aadhaar: data.aadhaar || prev.aadhaar,
      dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
      address: data.address || prev.address,
      companyName: data.companyName || prev.companyName,
      designation: data.designation || prev.designation,
      monthlyIncome: data.monthlyIncome || prev.monthlyIncome,
    }));

    toast({
      title: "Data Auto-filled",
      description: "We've automatically filled your information from the uploaded document.",
    });
  }, [toast]);

  const {
    documents,
    handleDocumentUpload,
    handleRemoveDocument,
    requiredDocumentsVerified,
    uploadProgress,
  } = useSmartDocumentUpload(handleDataExtracted);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "Your loan application has been submitted successfully. You will receive updates via SMS and email.",
    });
    navigate("/applicant/track");
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedLoanType !== null;
      case 2:
        return requiredDocumentsVerified;
      case 3:
        return formData.fullName && formData.pan && formData.aadhaar;
      case 4:
        return employmentType === "salaried"
          ? formData.companyName && formData.monthlyIncome
          : formData.businessName && formData.annualTurnover;
      case 5:
        return formData.loanAmount && formData.loanTenure;
      case 7:
        return formData.agreeTerms && formData.agreeCredit;
      default:
        return true;
    }
  };

  const selectedLoan = loanTypes.find((l) => l.id === selectedLoanType);

  return (
    <ApplicantLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Apply for a Loan</h1>
          <p className="text-muted-foreground">
            Upload your documents first — we'll auto-fill your application using AI
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Step Indicators */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 ${
                  step.id === currentStep
                    ? "text-accent"
                    : step.id < currentStep
                    ? "text-accent/70"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step.id === currentStep
                      ? "bg-accent text-accent-foreground"
                      : step.id < currentStep
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium text-center max-w-[80px]">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Loan Type Selection */}
            {currentStep === 1 && (
              <Card>
                <CardContent className="pt-6">
                  <LoanTypeSelector
                    selectedLoanType={selectedLoanType}
                    onSelect={setSelectedLoanType}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Document Upload with OCR */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Documents</CardTitle>
                  <CardDescription>
                    Our AI will automatically extract information and fill your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SmartDocumentUpload
                    documents={documents}
                    onDocumentUpload={handleDocumentUpload}
                    onDataExtracted={handleDataExtracted}
                    onRemoveDocument={handleRemoveDocument}
                  />

                  {uploadProgress > 0 && (
                    <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Documents Verified</span>
                        <span className="text-sm text-accent">{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Personal Details (Auto-filled) */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Personal Details
                    {formData.fullName && (
                      <span className="text-xs font-normal text-accent bg-accent/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Auto-filled
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Review and confirm your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name (as per PAN)</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        className={formData.fullName ? "border-accent/50 bg-accent/5" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input
                        id="pan"
                        placeholder="ABCDE1234F"
                        value={formData.pan}
                        onChange={(e) => updateFormData("pan", e.target.value.toUpperCase())}
                        maxLength={10}
                        className={formData.pan ? "border-accent/50 bg-accent/5" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input
                        id="aadhaar"
                        placeholder="XXXX XXXX 1234"
                        value={formData.aadhaar}
                        onChange={(e) => updateFormData("aadhaar", e.target.value)}
                        className={formData.aadhaar ? "border-accent/50 bg-accent/5" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        placeholder="DD/MM/YYYY"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                        className={formData.dateOfBirth ? "border-accent/50 bg-accent/5" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={formData.maritalStatus}
                        onValueChange={(value) => updateFormData("maritalStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dependents">Number of Dependents</Label>
                      <Select
                        value={formData.dependents}
                        onValueChange={(value) => updateFormData("dependents", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4+">4 or more</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Residential Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                        className={formData.address ? "border-accent/50 bg-accent/5" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="residentialType">Residential Type</Label>
                      <Select
                        value={formData.residentialType}
                        onValueChange={(value) => updateFormData("residentialType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="parental">Parental</SelectItem>
                          <SelectItem value="company">Company Provided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Employment Details */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Employment Details
                    {formData.companyName && (
                      <span className="text-xs font-normal text-accent bg-accent/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Auto-filled
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Tell us about your employment and income
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={employmentType}
                    onValueChange={setEmploymentType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salaried" id="salaried" />
                      <Label htmlFor="salaried" className="cursor-pointer">
                        Salaried
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self-employed" id="self-employed" />
                      <Label htmlFor="self-employed" className="cursor-pointer">
                        Self-Employed
                      </Label>
                    </div>
                  </RadioGroup>

                  <Separator />

                  {employmentType === "salaried" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => updateFormData("companyName", e.target.value)}
                          className={formData.companyName ? "border-accent/50 bg-accent/5" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          placeholder="Enter your designation"
                          value={formData.designation}
                          onChange={(e) => updateFormData("designation", e.target.value)}
                          className={formData.designation ? "border-accent/50 bg-accent/5" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          placeholder="Enter monthly income"
                          value={formData.monthlyIncome}
                          onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
                          className={formData.monthlyIncome ? "border-accent/50 bg-accent/5" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workExperience">Work Experience</Label>
                        <Select
                          value={formData.workExperience}
                          onValueChange={(value) => updateFormData("workExperience", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Enter business name"
                          value={formData.businessName}
                          onChange={(e) => updateFormData("businessName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualTurnover">Annual Turnover (₹)</Label>
                        <Input
                          id="annualTurnover"
                          type="number"
                          placeholder="Enter annual turnover"
                          value={formData.annualTurnover}
                          onChange={(e) => updateFormData("annualTurnover", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearsInBusiness">Years in Business</Label>
                        <Select
                          value={formData.yearsInBusiness}
                          onValueChange={(value) => updateFormData("yearsInBusiness", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select years" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5: Loan Details */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                  <CardDescription>
                    Specify your loan requirements for {selectedLoan?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan Amount Required (₹)</Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        placeholder="Enter loan amount"
                        value={formData.loanAmount}
                        onChange={(e) => updateFormData("loanAmount", e.target.value)}
                      />
                      {selectedLoan && (
                        <p className="text-xs text-muted-foreground">
                          Maximum: {selectedLoan.maxAmount}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loanTenure">Loan Tenure</Label>
                      <Select
                        value={formData.loanTenure}
                        onValueChange={(value) => updateFormData("loanTenure", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenure" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedLoanType === "home" ? (
                            <>
                              <SelectItem value="10">10 years</SelectItem>
                              <SelectItem value="15">15 years</SelectItem>
                              <SelectItem value="20">20 years</SelectItem>
                              <SelectItem value="25">25 years</SelectItem>
                              <SelectItem value="30">30 years</SelectItem>
                            </>
                          ) : selectedLoanType === "vehicle" ? (
                            <>
                              <SelectItem value="1">1 year</SelectItem>
                              <SelectItem value="2">2 years</SelectItem>
                              <SelectItem value="3">3 years</SelectItem>
                              <SelectItem value="5">5 years</SelectItem>
                              <SelectItem value="7">7 years</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="1">1 year</SelectItem>
                              <SelectItem value="2">2 years</SelectItem>
                              <SelectItem value="3">3 years</SelectItem>
                              <SelectItem value="5">5 years</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="loanPurpose">Purpose of Loan</Label>
                      <Input
                        id="loanPurpose"
                        placeholder="Describe the purpose"
                        value={formData.loanPurpose}
                        onChange={(e) => updateFormData("loanPurpose", e.target.value)}
                      />
                    </div>

                    {/* Home Loan Specific */}
                    {selectedLoanType === "home" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="propertyValue">Property Value (₹)</Label>
                          <Input
                            id="propertyValue"
                            type="number"
                            placeholder="Enter property value"
                            value={formData.propertyValue}
                            onChange={(e) => updateFormData("propertyValue", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="downPayment">Down Payment (₹)</Label>
                          <Input
                            id="downPayment"
                            type="number"
                            placeholder="Enter down payment"
                            value={formData.downPayment}
                            onChange={(e) => updateFormData("downPayment", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="propertyLocation">Property Location</Label>
                          <Input
                            id="propertyLocation"
                            placeholder="City, State"
                            value={formData.propertyLocation}
                            onChange={(e) => updateFormData("propertyLocation", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Interest Type</Label>
                          <RadioGroup
                            value={formData.interestType}
                            onValueChange={(value) => updateFormData("interestType", value)}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fixed" id="fixed" />
                              <Label htmlFor="fixed" className="cursor-pointer">
                                Fixed Rate
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="floating" id="floating" />
                              <Label htmlFor="floating" className="cursor-pointer">
                                Floating Rate
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}

                    {/* Vehicle Loan Specific */}
                    {selectedLoanType === "vehicle" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleCost">Vehicle Cost (₹)</Label>
                          <Input
                            id="vehicleCost"
                            type="number"
                            placeholder="Enter vehicle cost"
                            value={formData.vehicleCost}
                            onChange={(e) => updateFormData("vehicleCost", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dealerName">Dealer Name</Label>
                          <Input
                            id="dealerName"
                            placeholder="Enter dealer name"
                            value={formData.dealerName}
                            onChange={(e) => updateFormData("dealerName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="downPaymentVehicle">Down Payment (₹)</Label>
                          <Input
                            id="downPaymentVehicle"
                            type="number"
                            placeholder="Enter down payment"
                            value={formData.downPayment}
                            onChange={(e) => updateFormData("downPayment", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: AI Preview */}
            {currentStep === 6 && (
              <AIEligibilityPreview
                loanType={selectedLoanType || "personal"}
                monthlyIncome={formData.monthlyIncome || formData.annualTurnover}
                loanAmount={formData.loanAmount}
              />
            )}

            {/* Step 7: Review & Submit */}
            {currentStep === 7 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Application</CardTitle>
                  <CardDescription>
                    Please review all details before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Summary */}
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-accent" />
                      {selectedLoan?.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Loan Amount</span>
                        <p className="font-medium">₹{parseInt(formData.loanAmount || "0").toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tenure</span>
                        <p className="font-medium">{formData.loanTenure} years</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-3">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="ml-2 font-medium">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">PAN:</span>
                        <span className="ml-2 font-medium">{formData.pan}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Aadhaar:</span>
                        <span className="ml-2 font-medium">{formData.aadhaar}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">DOB:</span>
                        <span className="ml-2 font-medium">{formData.dateOfBirth || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Employment Info */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-3">Employment Details</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 font-medium capitalize">{employmentType}</span>
                      </div>
                      {employmentType === "salaried" ? (
                        <>
                          <div>
                            <span className="text-muted-foreground">Company:</span>
                            <span className="ml-2 font-medium">{formData.companyName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Monthly Income:</span>
                            <span className="ml-2 font-medium">
                              ₹{parseInt(formData.monthlyIncome || "0").toLocaleString("en-IN")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-muted-foreground">Business:</span>
                            <span className="ml-2 font-medium">{formData.businessName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Annual Turnover:</span>
                            <span className="ml-2 font-medium">
                              ₹{parseInt(formData.annualTurnover || "0").toLocaleString("en-IN")}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-3">Uploaded Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {documents
                        .filter((d) => d.status === "verified")
                        .map((doc) => (
                          <span
                            key={doc.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {doc.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => updateFormData("agreeTerms", checked as boolean)}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm font-normal cursor-pointer leading-tight">
                        I confirm that all information provided is accurate and complete. I understand that
                        providing false information may result in rejection of my application.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeCredit"
                        checked={formData.agreeCredit}
                        onCheckedChange={(checked) => updateFormData("agreeCredit", checked as boolean)}
                      />
                      <Label htmlFor="agreeCredit" className="text-sm font-normal cursor-pointer leading-tight">
                        I authorize Smart BankFlow to access my credit report and verify my information with
                        relevant agencies for the purpose of processing this loan application.
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              Submit Application
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </ApplicantLayout>
  );
}
