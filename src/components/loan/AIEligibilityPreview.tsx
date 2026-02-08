import { GaugeChart } from "@/components/ui/gauge-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AIEligibilityPreviewProps {
  loanType: string;
  monthlyIncome: string;
  loanAmount?: string;
}

export function AIEligibilityPreview({ loanType, monthlyIncome, loanAmount }: AIEligibilityPreviewProps) {
  // Simulate AI calculations based on inputs
  const income = parseInt(monthlyIncome) || 0;
  const approvalProbability = income > 100000 ? 85 : income > 50000 ? 72 : income > 25000 ? 58 : 35;
  const creditScore = 742; // Simulated
  const dtiRatio = 28;
  const riskCategory = approvalProbability > 75 ? "Low" : approvalProbability > 50 ? "Medium" : "High";

  const suggestedLoanAmount = Math.round((income * 60) / 10000) * 10000;
  const estimatedEMI = Math.round((suggestedLoanAmount * 0.0085));
  const interestRate = loanType === "home" ? 8.75 : loanType === "personal" ? 12.5 : 10.5;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Gauges */}
          <div className="space-y-6">
            <div className="text-center p-6 bg-muted/30 rounded-xl">
              <GaugeChart
                value={approvalProbability}
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
                value={creditScore}
                max={900}
                label="Estimated Credit Score"
                size="lg"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {creditScore >= 750 ? "Excellent" : creditScore >= 650 ? "Good" : "Fair"} credit standing
              </p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {/* Risk Category */}
            <div
              className={`p-4 rounded-lg border ${
                riskCategory === "Low"
                  ? "bg-risk-low/10 border-risk-low/30"
                  : riskCategory === "Medium"
                  ? "bg-risk-medium/10 border-risk-medium/30"
                  : "bg-risk-high/10 border-risk-high/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {riskCategory === "Low" ? (
                  <Shield className="w-4 h-4 text-risk-low" />
                ) : riskCategory === "Medium" ? (
                  <AlertTriangle className="w-4 h-4 text-risk-medium" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-risk-high" />
                )}
                <span
                  className={`text-sm font-medium ${
                    riskCategory === "Low"
                      ? "text-risk-low"
                      : riskCategory === "Medium"
                      ? "text-risk-medium"
                      : "text-risk-high"
                  }`}
                >
                  Risk Category: {riskCategory} Risk
                </span>
              </div>
            </div>

            {/* DTI Ratio */}
            <div className="p-4 border border-border rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Debt-to-Income Ratio</span>
                <span className={`font-medium ${dtiRatio < 40 ? "text-risk-low" : "text-risk-medium"}`}>
                  {dtiRatio}%
                </span>
              </div>
              <Progress value={dtiRatio} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {dtiRatio < 40 ? "✓ Within healthy range" : "⚠ Consider reducing existing debt"}
              </p>
            </div>

            {/* Loan Estimates */}
            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Suggested Loan Amount</span>
                <span className="font-semibold">{formatCurrency(suggestedLoanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Estimated EMI</span>
                <span className="font-semibold">{formatCurrency(estimatedEMI)}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Interest Rate</span>
                <span className="font-semibold">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Processing Time</span>
                <span className="font-semibold">3-5 business days</span>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                AI Recommendations
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  Consider a 20-year tenure for lower EMI burden
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  Your DTI ratio is healthy at {dtiRatio}%
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  Adding a co-applicant could increase eligibility by 25%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
