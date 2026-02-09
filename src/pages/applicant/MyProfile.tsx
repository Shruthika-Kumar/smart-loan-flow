import { useState, useEffect } from "react";
import { ApplicantLayout } from "@/components/layout/ApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Briefcase, Shield, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function MyProfile() {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        mobile: "",
        address: "",
        companyName: "",
        designation: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            const userData = response.data;
            setUser(userData);

            // Initial form data from backend
            const initialData = {
                username: userData.username || userData.fullName || "",
                email: userData.email || "",
                mobile: userData.mobile || userData.phone || "",
                address: userData.address || "",
                companyName: userData.companyName || "",
                designation: userData.designation || ""
            };

            // Check if there's fresher data in OCR storage (simulating auto-sync)
            const ocrData = localStorage.getItem("extracted_data");
            if (ocrData) {
                const parsedOCR = JSON.parse(ocrData);
                if (parsedOCR.fullName) initialData.username = parsedOCR.fullName;
                if (parsedOCR.pan) initialData.username = parsedOCR.fullName; // Name often comes from PAN
                if (parsedOCR.address) initialData.address = parsedOCR.address;
                if (parsedOCR.companyName) initialData.companyName = parsedOCR.companyName;
                if (parsedOCR.designation) initialData.designation = parsedOCR.designation;
            }

            setFormData(initialData);
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Fallback to local storage if API fails (for demo/development)
            const localData = localStorage.getItem("user");
            if (localData) {
                const parsed = JSON.parse(localData);
                setUser(parsed);
                setFormData({
                    username: parsed.username || parsed.fullName || "",
                    email: parsed.email || "",
                    mobile: parsed.mobile || "9876543210",
                    address: parsed.address || "123, Green Valley, Bangalore",
                    companyName: parsed.companyName || "Tech Solutions Pvt Ltd",
                    designation: parsed.designation || "Senior Developer"
                });
            }
        }
    };

    const handleSave = async () => {
        try {
            const response = await api.put("/users/profile", {
                fullName: formData.username,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                companyName: formData.companyName,
                designation: formData.designation
            });

            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setIsEditing(false);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully to the cloud.",
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: "Save Failed",
                description: "Could not sync profile with server.",
                variant: "destructive"
            });
        }
    };

    if (!user) return null;

    return (
        <ApplicantLayout>
            <div className="space-y-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">My Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your personal and professional information</p>
                    </div>
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="gap-2 shadow-lg hover-lift"
                        size="lg"
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Personal Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-accent" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={formData.username}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        value={formData.email}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mobile Number</Label>
                                    <Input
                                        value={formData.mobile}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Residential Address</Label>
                                    <Input
                                        value={formData.address}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card className="glass-card hover-lift">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-accent" />
                                Account Status
                            </CardTitle>
                            <CardDescription>Overview of your account verification and progress</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium">KYC Verified</span>
                                </div>
                                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Level 2</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Profile Completion</span>
                                    <span className="font-semibold">85%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full w-[85%]" />
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <p className="text-xs text-muted-foreground">Last Login: {new Date().toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">Account Type: Individual Applicant</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Details */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-accent" />
                                Employment Details
                            </CardTitle>
                            <CardDescription>Details extracted from your latest salary slip</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current Employer</Label>
                                    <Input
                                        value={formData.companyName}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Designation</Label>
                                    <Input
                                        value={formData.designation}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ApplicantLayout>
    );
}
