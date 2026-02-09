export interface MonthlyPayment {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    totalInterest: number;
    balance: number;
}

export const calculateAmortizationSchedule = (
    principal: number,
    annualRate: number,
    tenureYears: number
): MonthlyPayment[] => {
    const monthlyRate = annualRate / 12 / 100;
    const numberOfPayments = tenureYears * 12;

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const schedule: MonthlyPayment[] = [];
    let remainingBalance = principal;
    let totalInterest = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        remainingBalance -= principalPayment;
        totalInterest += interestPayment;

        // Ensure balance doesn't go negative due to rounding
        const finalBalance = Math.max(0, remainingBalance);

        schedule.push({
            month: i,
            payment: Number(monthlyPayment.toFixed(2)),
            principal: Number(principalPayment.toFixed(2)),
            interest: Number(interestPayment.toFixed(2)),
            totalInterest: Number(totalInterest.toFixed(2)),
            balance: Number(finalBalance.toFixed(2))
        });
    }

    return schedule;
};
