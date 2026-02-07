import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Car,
  GraduationCap,
  Wallet,
  Building2,
  User,
  Briefcase,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  CreditCard,
  Percent,
  Clock,
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
import { GaugeChart } from "@/components/ui/gauge-chart";
import { Separator } from "@/components/ui/separator";

const loanTypes = [
  {
    id: "home",
    name: "Home Loan",
    icon: Home,
    rate: "8.5% - 10.5%",
    maxTenure: "30 years",
    description: "Purchase or construct your dream home",
  },
  {
    id: "vehicle",
    name: "Vehicle Loan",
    icon: Car,
    rate: "9.0% - 12.5%",
    maxTenure: "7 years",
    description: "Finance your new or used vehicle",
  },
  {
    id: "education",
    name: "Education Loan",
    icon: GraduationCap,
    rate: "7.5% - 11.0%",
    maxTenure: "15 years",
    description: "Invest in your future with education financing",
  },
  {
    id: "personal",
    name: "Personal Loan",
    icon: Wallet,
    rate: "10.5% - 18.0%",
    maxTenure: "5 years",
    description: "Quick funds for personal needs",
  },
  {
    id: "business",
    name: "Business Loan",
    icon: Building2,
    rate: "11.0% - 16.0%",
    maxTenure: "10 years",
    description: "Grow your business with capital",
  },
];

const steps = [
  { id: 1, name: "Loan Type", icon: CreditCard },
  { id: 2, name: "Personal Details", icon: User },
  { id: 3, name: "Employment", icon: Briefcase },
  { id: 4, name: "Loan Details", icon: FileText },
  { id: 5, name: "Documents", icon: Upload },
  { id: 6, name: "AI Preview", icon: Sparkles },
  { id: 7, name: "Review", icon: CheckCircle2 },
];

export default function LoanApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string>("salaried");
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    pan: "",
    aadhaar: "",
    maritalStatus: "",
    dependents: "",
    residentialType: "",
    // Employment - Salaried
    companyName: "",
    designation: "",
    monthlyIncome: "",
    workExperience: "",
    // Employment - Self-employed
    businessName: "",
    annualTurnover: "",
    yearsInBusiness: "",
    // Loan Details - Home
    propertyValue: "",
    downPayment: "",
    propertyLocation: "",
    loanTenure: "",
    interestType: "",
    // Loan Details - Vehicle
    vehicleCost: "",
    dealerName: "",
    // Loan Details - Education
    universityName: "",
    courseDuration: "",
    tuitionFees: "",
    coApplicant: "",
    // Loan Details - Business
    loanPurpose: "",
    collateralValue: "",
  });

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

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ApplicantLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Apply for a Loan
          </h1>
          <p className="text-muted-foreground">
            Complete the application in a few simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step, index) => (
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
                <span className="text-xs font-medium">{step.name}</span>
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
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Loan Type</CardTitle>
                    <CardDescription>
                      Choose the type of loan that best fits your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {loanTypes.map((loan) => (
                        <motion.div
                          key={loan.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedLoanType(loan.id)}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                            selectedLoanType === loan.id
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          }`}
                        >
                          <div className="space-y-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                selectedLoanType === loan.id
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <loan.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{loan.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {loan.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Percent className="h-3 w-3 text-accent" />
                                <span>{loan.rate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-accent" />
                                <span>{loan.maxTenure}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>
                    Provide your personal information for verification
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input
                        id="aadhaar"
                        placeholder="1234 5678 9012"
                        value={formData.aadhaar}
                        onChange={(e) => updateFormData("aadhaar", e.target.value)}
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

            {/* Step 3: Employment Details */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                  <CardDescription>
                    Tell us about your employment and income
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Employment Type Toggle */}
                  <RadioGroup
                    value={employmentType}
                    onValueChange={setEmploymentType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salaried" id="salaried" />
                      <Label htmlFor="salaried" className="cursor-pointer">Salaried</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self-employed" id="self-employed" />
                      <Label htmlFor="self-employed" className="cursor-pointer">Self-Employed</Label>
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          placeholder="Enter your designation"
                          value={formData.designation}
                          onChange={(e) => updateFormData("designation", e.target.value)}
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workExperience">Work Experience (Years)</Label>
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

            {/* Step 4: Loan-Specific Details */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                  <CardDescription>
                    Provide specific details about your loan requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Home Loan Fields */}
                  {selectedLoanType === "home" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Label htmlFor="loanTenure">Loan Tenure</Label>
                        <Select
                          value={formData.loanTenure}
                          onValueChange={(value) => updateFormData("loanTenure", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 years</SelectItem>
                            <SelectItem value="15">15 years</SelectItem>
                            <SelectItem value="20">20 years</SelectItem>
                            <SelectItem value="25">25 years</SelectItem>
                            <SelectItem value="30">30 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Interest Type</Label>
                        <RadioGroup
                          value={formData.interestType}
                          onValueChange={(value) => updateFormData("interestType", value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <Label htmlFor="fixed" className="cursor-pointer">Fixed Rate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="floating" id="floating" />
                            <Label htmlFor="floating" className="cursor-pointer">Floating Rate</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Loan Fields */}
                  {selectedLoanType === "vehicle" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div className="space-y-2">
                        <Label htmlFor="loanTenureVehicle">Loan Tenure</Label>
                        <Select
                          value={formData.loanTenure}
                          onValueChange={(value) => updateFormData("loanTenure", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 year</SelectItem>
                            <SelectItem value="2">2 years</SelectItem>
                            <SelectItem value="3">3 years</SelectItem>
                            <SelectItem value="5">5 years</SelectItem>
                            <SelectItem value="7">7 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Default/Personal Loan Fields */}
                  {(!selectedLoanType || selectedLoanType === "personal" || selectedLoanType === "education" || selectedLoanType === "business") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount Required (₹)</Label>
                        <Input
                          id="loanAmount"
                          type="number"
                          placeholder="Enter loan amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanPurpose">Purpose of Loan</Label>
                        <Input
                          id="loanPurpose"
                          placeholder="Describe the purpose"
                          value={formData.loanPurpose}
                          onChange={(e) => updateFormData("loanPurpose", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanTenureGeneral">Loan Tenure</Label>
                        <Select
                          value={formData.loanTenure}
                          onValueChange={(value) => updateFormData("loanTenure", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 year</SelectItem>
                            <SelectItem value="2">2 years</SelectItem>
                            <SelectItem value="3">3 years</SelectItem>
                            <SelectItem value="5">5 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5: Document Upload */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload the required documents for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "PAN Card", required: true },
                      { name: "Aadhaar Card", required: true },
                      { name: "Salary Slips (3 months)", required: true },
                      { name: "Bank Statement (6 months)", required: true },
                      { name: "Form 16 / ITR", required: false },
                      { name: "Address Proof", required: false },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="p-4 border-2 border-dashed border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {doc.name}
                              {doc.required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, JPG or PNG, max 5MB
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Browse
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: AI Preview */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    AI Eligibility Preview
                  </CardTitle>
                  <CardDescription>
                    Based on your profile, here's our AI-powered assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Gauges */}
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-muted/30 rounded-xl">
                        <GaugeChart
                          value={82}
                          label="Approval Probability"
                          size="lg"
                          variant="risk"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Based on credit history and income
                        </p>
                      </div>
                      <div className="text-center p-6 bg-muted/30 rounded-xl">
                        <GaugeChart
                          value={725}
                          max={900}
                          label="Estimated Credit Score"
                          size="lg"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Good credit standing
                        </p>
                      </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <p className="text-sm font-medium text-accent">
                          Risk Category: Low Risk
                        </p>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Suggested Loan Amount</span>
                          <span className="font-semibold">₹42,00,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated EMI</span>
                          <span className="font-semibold">₹35,840/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interest Rate</span>
                          <span className="font-semibold">8.75% p.a.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processing Time</span>
                          <span className="font-semibold">3-5 business days</span>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          AI Recommendations
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Consider a 20-year tenure for lower EMI</li>
                          <li>• Your DTI ratio is healthy at 28%</li>
                          <li>• Adding a co-applicant could increase eligibility</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  {/* Personal Info Summary */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-3">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{formData.fullName || "John Doe"}</span>
                      <span className="text-muted-foreground">PAN:</span>
                      <span>{formData.pan || "ABCDE1234F"}</span>
                      <span className="text-muted-foreground">Aadhaar:</span>
                      <span>{formData.aadhaar || "XXXX XXXX 1234"}</span>
                    </div>
                  </div>

                  {/* Loan Details Summary */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-3">Loan Details</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Loan Type:</span>
                      <span className="capitalize">{selectedLoanType || "Home"} Loan</span>
                      <span className="text-muted-foreground">Amount:</span>
                      <span>₹45,00,000</span>
                      <span className="text-muted-foreground">Tenure:</span>
                      <span>{formData.loanTenure || "20"} years</span>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        I confirm that all the information provided is accurate and I authorize Smart BankFlow to verify my details with relevant authorities.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="consent" />
                      <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                        I agree to the Terms of Service and Privacy Policy, and consent to receive communications regarding my application.
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
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedLoanType}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </ApplicantLayout>
  );
}
