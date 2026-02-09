import { GaugeChart } from "@/components/ui/gauge-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { calculateEligibility } from "@/lib/calculations";

interface AIEligibilityPreviewProps {
  loanType: string;
  monthlyIncome: string;
  loanAmount: string; // Made required for real calculations
  tenureYears?: number;
}

export function AIEligibilityPreview({ loanType, monthlyIncome, loanAmount, tenureYears = 5 }: AIEligibilityPreviewProps) {
  // Use real calculation logic
  const income = parseInt(monthlyIncome) || 0;
  const requestedPrincipal = parseInt(loanAmount) || 0;
  const interestRate = loanType === "home" ? 8.75 : loanType === "personal" ? 12.5 : 10.5;

  const result = calculateEligibility({
    monthlyIncome: income,
    existingEMIs: 0, // Placeholder, can be expanded if we extract current EMIs
    requestedAmount: requestedPrincipal,
    tenureYears: tenureYears,
    interestRate: interestRate
  });

  const { approvalProbability, dtiRatio, riskCategory, estimatedEMI, suggestedLoanAmount, recommendations } = result;
  const creditScore = 742; // Still simulated as it needs a bureau integration

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
              className={`p-4 rounded-lg border ${riskCategory === "Low"
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
                  className={`text-sm font-medium ${riskCategory === "Low"
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
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
