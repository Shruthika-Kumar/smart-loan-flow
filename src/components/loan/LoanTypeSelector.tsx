import { motion } from "framer-motion";
import {
  Home,
  Car,
  GraduationCap,
  Wallet,
  Building2,
  Percent,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface LoanType {
  id: string;
  name: string;
  icon: typeof Home;
  rate: string;
  maxTenure: string;
  description: string;
  maxAmount: string;
  features: string[];
}

export const loanTypes: LoanType[] = [
  {
    id: "home",
    name: "Home Loan",
    icon: Home,
    rate: "8.5% - 10.5%",
    maxTenure: "30 years",
    description: "Purchase or construct your dream home",
    maxAmount: "₹5 Cr",
    features: ["Property purchase", "Construction", "Plot + Construction"],
  },
  {
    id: "vehicle",
    name: "Vehicle Loan",
    icon: Car,
    rate: "9.0% - 12.5%",
    maxTenure: "7 years",
    description: "Finance your new or used vehicle",
    maxAmount: "₹1 Cr",
    features: ["New cars", "Used cars", "Two-wheelers"],
  },
  {
    id: "education",
    name: "Education Loan",
    icon: GraduationCap,
    rate: "7.5% - 11.0%",
    maxTenure: "15 years",
    description: "Invest in your future with education financing",
    maxAmount: "₹75 L",
    features: ["India & abroad", "Tuition + living", "Moratorium period"],
  },
  {
    id: "personal",
    name: "Personal Loan",
    icon: Wallet,
    rate: "10.5% - 18.0%",
    maxTenure: "5 years",
    description: "Quick funds for personal needs",
    maxAmount: "₹40 L",
    features: ["No collateral", "Quick disbursal", "Flexible tenure"],
  },
  {
    id: "business",
    name: "Business Loan",
    icon: Building2,
    rate: "11.0% - 16.0%",
    maxTenure: "10 years",
    description: "Grow your business with capital",
    maxAmount: "₹2 Cr",
    features: ["Working capital", "Expansion", "Equipment finance"],
  },
];

interface LoanTypeSelectorProps {
  selectedLoanType: string | null;
  onSelect: (loanTypeId: string) => void;
}

export function LoanTypeSelector({ selectedLoanType, onSelect }: LoanTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Select Loan Type</h2>
        <p className="text-sm text-muted-foreground">
          Choose the type of loan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loanTypes.map((loan) => {
          const isSelected = selectedLoanType === loan.id;
          return (
            <motion.div
              key={loan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => onSelect(loan.id)}
                className={`cursor-pointer transition-all h-full ${
                  isSelected
                    ? "border-2 border-accent bg-accent/5 shadow-md"
                    : "hover:border-muted-foreground/30 hover:shadow-sm"
                }`}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Icon & Selection indicator */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <loan.icon className="w-6 h-6" />
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                        </motion.div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-semibold text-base">{loan.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {loan.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Percent className="w-3.5 h-3.5 text-accent" />
                            <span>{loan.rate}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Interest Rate Range</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span>{loan.maxTenure}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Maximum Tenure</TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5">
                      {loan.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 bg-muted text-xs rounded-full text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Max Amount */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Max Amount</span>
                        <span className="font-semibold text-accent">{loan.maxAmount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
