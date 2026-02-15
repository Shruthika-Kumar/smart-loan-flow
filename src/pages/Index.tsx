import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Brain,
  Zap,
  Building2,
  CheckCircle2,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-lg font-bold text-white">SB</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                Smart BankFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#solutions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Solutions
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/applicant/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/applicant/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Loan Decisioning
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Smart Loans,{" "}
                <span className="text-accent">Instant Decisions</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Upload your documents once. Our AI extracts your information,
                auto-fills your application, and gives you instant eligibility.
                No more tedious form-filling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8">
                  <Link to="/applicant/register">
                    Apply for a Loan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12">
                  <Link to="/officer/login">Officer Portal</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  Bank-grade Security
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 text-accent" />
                  RBI Compliant
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  100% Digital
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl" />
                <Card className="relative bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Document Upload</p>
                          <p className="text-sm text-muted-foreground">AI extracts your data</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-accent ml-auto" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Auto-fill Application</p>
                          <p className="text-sm text-muted-foreground">No manual entry needed</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-accent ml-auto" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Zap className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Instant Eligibility</p>
                          <p className="text-sm text-muted-foreground">Know in seconds</p>
                        </div>
                        <div className="ml-auto px-3 py-1 bg-accent/10 rounded-full text-accent text-sm font-medium">
                          85%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Your Loan in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system makes loan applications faster and easier than ever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: FileText,
                title: "Upload Documents",
                description: "Upload your PAN, Aadhaar, salary slips, and bank statements. Our OCR technology reads them instantly.",
              },
              {
                step: 2,
                icon: Sparkles,
                title: "AI Auto-fills",
                description: "Your application form is automatically filled with extracted data. Just review and confirm.",
              },
              {
                step: 3,
                icon: CheckCircle2,
                title: "Get Approved",
                description: "Receive instant eligibility assessment and loan approval. Funds disbursed within 24-48 hours.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="absolute -top-4 left-8">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 mt-4">
                      <item.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for scale, designed for compliance, powered by AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Risk Assessment",
                description: "Machine learning models analyze 100+ data points for accurate credit decisioning",
              },
              {
                icon: Shield,
                title: "Fraud Detection",
                description: "Real-time anomaly detection and identity verification to prevent fraud",
              },
              {
                icon: Zap,
                title: "Instant Decisions",
                description: "Reduce processing time from days to minutes with automated workflows",
              },
              {
                icon: Building2,
                title: "Regulatory Compliance",
                description: "Built-in compliance with RBI guidelines and complete audit trails",
              },
              {
                icon: Users,
                title: "Multi-Role Access",
                description: "Separate portals for applicants, officers, analysts, and managers",
              },
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                description: "Comprehensive dashboards for monitoring KPIs and portfolio health",
              },
              {
                icon: Clock,
                title: "SLA Tracking",
                description: "Automated SLA monitoring with escalation and notification systems",
              },
              {
                icon: FileText,
                title: "Smart OCR",
                description: "Automatic document reading and data extraction with high accuracy",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "₹5,000Cr+", label: "Loans Processed" },
              { value: "2.5M+", label: "Applications" },
              { value: "94%", label: "SLA Compliance" },
              { value: "< 5 min", label: "Avg. Decision Time" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section id="solutions" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loans for Every Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're buying a home, car, or growing your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Home Loan", rate: "8.5% onwards", tenure: "Up to 30 years", amount: "Up to ₹5 Cr" },
              { name: "Vehicle Loan", rate: "9.0% onwards", tenure: "Up to 7 years", amount: "Up to ₹1 Cr" },
              { name: "Personal Loan", rate: "10.5% onwards", tenure: "Up to 5 years", amount: "Up to ₹40 L" },
              { name: "Education Loan", rate: "7.5% onwards", tenure: "Up to 15 years", amount: "Up to ₹75 L" },
              { name: "Business Loan", rate: "11.0% onwards", tenure: "Up to 10 years", amount: "Up to ₹2 Cr" },
              { name: "Gold Loan", rate: "7.0% onwards", tenure: "Up to 3 years", amount: "Up to ₹50 L" },
            ].map((loan, index) => (
              <motion.div
                key={loan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg hover:border-accent/30 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 group-hover:text-accent transition-colors">{loan.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interest Rate</span>
                        <span className="font-medium">{loan.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tenure</span>
                        <span className="font-medium">{loan.tenure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium text-accent">{loan.amount}</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 group-hover:bg-accent/10 group-hover:text-accent" asChild>
                      <Link to="/applicant/apply">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Your Loan?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who got their loans approved in minutes, not days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="h-12 px-8">
              <Link to="/applicant/register">
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 h-12">
              Talk to an Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Home Loan</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Personal Loan</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Vehicle Loan</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Business Loan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">EMI Calculator</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Eligibility Check</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">SB</span>
              </div>
              <span className="font-semibold text-foreground">Smart BankFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Smart BankFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
