/**
 * Enhanced EMI and Eligibility Calculations for AI Preview
 */

export interface EligibilityInput {
    monthlyIncome: number;
    existingEMIs: number;
    requestedAmount: number;
    tenureYears: number;
    interestRate: number;
}

export interface EligibilityResult {
    estimatedEMI: number;
    dtiRatio: number;
    riskCategory: "Low" | "Medium" | "High";
    approvalProbability: number;
    suggestedLoanAmount: number;
    recommendations: string[];
}

export const calculateEMI = (principal: number, annualRate: number, years: number): number => {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    if (r === 0) return principal / n;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
};

export const calculateEligibility = (input: EligibilityInput): EligibilityResult => {
    const { monthlyIncome, existingEMIs, requestedAmount, tenureYears, interestRate } = input;

    const estimatedEMI = calculateEMI(requestedAmount, interestRate, tenureYears);
    const totalDebt = existingEMIs + estimatedEMI;
    const dtiRatio = monthlyIncome > 0 ? Math.round((totalDebt / monthlyIncome) * 100) : 100;

    // Scoped suggested amount (max 50% DTI capacity)
    const maxEMIAllowed = (monthlyIncome * 0.5) - existingEMIs;
    const suggestedLoanAmount = Math.max(0, Math.round((maxEMIAllowed * (Math.pow(1 + (interestRate / 12 / 100), tenureYears * 12) - 1)) / ((interestRate / 12 / 100) * Math.pow(1 + (interestRate / 12 / 100), tenureYears * 12))));

    // Heuristic for approval probability
    let probability = 100 - (dtiRatio * 1.2);
    if (monthlyIncome > 150000) probability += 10;
    if (monthlyIncome < 30000) probability -= 15;
    probability = Math.min(95, Math.max(10, Math.round(probability)));

    const riskCategory = dtiRatio < 35 ? "Low" : dtiRatio < 50 ? "Medium" : "High";

    const recommendations = [];
    if (dtiRatio > 45) {
        recommendations.push("Consider a co-applicant to share the debt burden");
        recommendations.push(`Increasing tenure to ${tenureYears + 5} years could lower your DTI`);
    } else if (dtiRatio < 20) {
        recommendations.push("You have strong repayment capacity for a higher amount");
    }

    if (riskCategory === "Low") {
        recommendations.push("Excellent credit potential. You may qualify for lower rates.");
    }

    return {
        estimatedEMI,
        dtiRatio,
        riskCategory,
        approvalProbability: probability,
        suggestedLoanAmount: Math.round(suggestedLoanAmount / 10000) * 10000,
        recommendations: recommendations.length > 0 ? recommendations : ["Your profile looks stable for this request"]
    };
};
