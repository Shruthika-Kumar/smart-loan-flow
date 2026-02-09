const userData = localStorage.getItem("user");
console.log("User data from localStorage:", userData);

if (userData) {
    const user = JSON.parse(userData);
    console.log("Parsed user object:", user);
    console.log("User ID:", user.id || user._id);
}

const formData = {
    loanPurpose: "Education Loan",
    loanAmount: "48",
    loanTenure: "2",
    fullName: "Rajesh Kumar Sharma"
};

console.log("Form data:", formData);
console.log("Loan purpose:", formData.loanPurpose);
