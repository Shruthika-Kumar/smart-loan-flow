import { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateAmortizationSchedule, MonthlyPayment } from "@/lib/amortization";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

interface AmortizationScheduleProps {
    principal: number;
    annualRate: number;
    tenureYears: number;
}

export function AmortizationSchedule({
    principal,
    annualRate,
    tenureYears,
}: AmortizationScheduleProps) {
    const [showTable, setShowTable] = useState(false);

    const schedule = useMemo(
        () => calculateAmortizationSchedule(principal, annualRate, tenureYears),
        [principal, annualRate, tenureYears]
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const chartData = useMemo(() => {
        // Group by year to avoid cluttering the chart if tenure is long
        const yearlyData = [];
        for (let i = 0; i < schedule.length; i += 12) {
            const yearIndex = Math.floor(i / 12) + 1;
            const monthData = schedule[Math.min(i + 11, schedule.length - 1)];
            yearlyData.push({
                year: `Year ${yearIndex}`,
                Principal: monthData.principal,
                Interest: monthData.interest,
                Balance: monthData.balance,
            });
        }
        return yearlyData;
    }, [schedule]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Loan Repayment Visualization</CardTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value), ""]}
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="Principal"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorPrincipal)"
                                    stackId="1"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Interest"
                                    stroke="#f59e0b"
                                    fillOpacity={1}
                                    fill="url(#colorInterest)"
                                    stackId="1"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-4 italic">
                        * Visualization shows monthly interest vs principal breakdown averaged over each year.
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Detailed Schedule</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTable(!showTable)}
                        className="gap-2"
                    >
                        {showTable ? (
                            <>
                                Hide Details <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Show Monthly Breakdown <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>

                {showTable && (
                    <ScrollArea className="h-[400px] border rounded-lg">
                        <Table>
                            <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                                <TableRow>
                                    <TableHead className="w-[80px]">Month</TableHead>
                                    <TableHead>Principal</TableHead>
                                    <TableHead>Interest</TableHead>
                                    <TableHead>Total EMI</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedule.map((row) => (
                                    <TableRow key={row.month} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium">{row.month}</TableCell>
                                        <TableCell>{formatCurrency(row.principal)}</TableCell>
                                        <TableCell>{formatCurrency(row.interest)}</TableCell>
                                        <TableCell className="font-semibold">{formatCurrency(row.payment)}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {formatCurrency(row.balance)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}

// Helper to provide ScrollArea if not imported
function ScrollArea({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`overflow-auto ${className}`}>{children}</div>;
}
