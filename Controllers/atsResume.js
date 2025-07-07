const fs = require("fs");
const pdfparser = require("pdf-parse");
const mammoth = require("mammoth");

const keywords = {
  IT: [
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "SQL",
    "MsSQL",
    "MySQL",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Git",
    "CI/CD",
    "Agile",
    "REST API",
    "GraphQL",
    "Microservices",
    "DevOps",
    "Unit Testing",
    "Integration Testing",
    "Performance Optimization",
    "Code Review",
    "Version Control",
    "SDLC",
  ],
  Finance: [
    "Financial Analysis",
    "Budgeting",
    "Forecasting",
    "Financial Reporting",
    "Accounting Principles",
    "Taxation",
    "Regulatory Compliance",
    "Risk Management",
    "Investment Analysis",
    "Portfolio Management",
    "Financial Modeling",
    "Data Analysis",
    "Excel",
    "SQL",
    "SAP",
    "QuickBooks",
    "Cost Control",
    "Cash Flow Management",
    "Auditing",
    "Financial Planning",
    "Strategic Planning",
    "Business Intelligence",
  ],
  Marketing: [
    "Digital Marketing",
    "SEO",
    "SEM",
    "Content Marketing",
    "Social Media Marketing",
    "Email Marketing",
    "PPC Advertising",
    "Marketing Analytics",
    "Brand Management",
    "Public Relations",
    "Event Planning",
    "Market Research",
    "Copywriting",
    "Visual Communication",
    "UX",
    "CRM",
    "Sales Enablement",
    "Lead Generation",
    "Conversion Rate Optimization",
    "Affiliate Marketing",
    "Influencer Marketing",
  ],
  Sales: [
    "Sales Strategy",
    "Lead Generation",
    "CRM",
    "Negotiation",
    "Closing Techniques",
    "Account Management",
    "Sales Forecasting",
    "Market Research",
    "Competitive Analysis",
    "Product Knowledge",
    "Presentation Skills",
    "Pipeline Management",
    "Sales Reporting",
  ],
  healthcare: [
    "Patient Care",
    "Clinical Skills",
    "Medical Terminology",
    "Healthcare Regulations",
    "Electronic Health Records",
    "Patient Assessment",
    "Treatment Planning",
    "Medication Administration",
    "Infection Control",
    "Health Education",
    "Cultural Competence",
    "Patient Advocacy",
    "Quality Improvement",
  ],
  HR: [
    "Recruitment",
    "Talent Acquisition",
    "Onboarding",
    "Employee Relations",
    "HR Policies",
    "Performance Management",
    "Compensation & Benefits",
    "Payroll",
    "Labor Laws",
    "HR Compliance",
    "Succession Planning",
    "Training & Development",
    "Employee Engagement",
    "Exit Interviews",
    "Conflict Resolution",
    "Diversity & Inclusion",
    "HRIS",
    "Employer Branding",
    "Workforce Planning",
    "Organizational Development",
  ],
};

const atsScore = async (req, res) => {
  const file = req.file;
  const domain = req.body.domain;

  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  if (!domain || !keywords[domain]) {
    return res.status(400).json({ error: "Invalid or missing domain" });
  }

  try {
    const dataBuffer = fs.readFileSync(file.path);

    let text = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfparser(dataBuffer);
      text = data.text;
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Remove file after parsing
    fs.unlinkSync(file.path);

    // Normalize and clean text
    text = text.replace(/\s+/g, " ").trim();
    const lowerText = text.toLowerCase();

    // Select domain-specific keywords
    const domainKeywords = keywords[domain];
    let matchedKeywords = [];

    domainKeywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    });

    const score = Math.round(
      (matchedKeywords.length / domainKeywords.length) * 100
    );

    // Build suggestions
    const missingKeywords = domainKeywords.filter(
      (kw) => !matchedKeywords.includes(kw)
    );

    const suggestions = [];
    if (score < 70) {
      suggestions.push("Consider adding more keywords relevant to your target domain.");
    }
    if (!lowerText.includes("experience")) {
      suggestions.push("Include an 'Experience' section to improve ATS relevance.");
    }
    if (!lowerText.includes("skills")) {
      suggestions.push("Add a 'Skills' section with clear bullet points.");
    }

    // Final response
    return res.status(200).json({
      atsScore: score,
      matchedKeywords,
      missingKeywords,
      suggestions,
      success: true,
      message: "Files uploaded successfully!",
    });
  } catch (error) {
    console.error("Error parsing file:", error);
    return res.status(500).json({ error: "Failed to parse file" });
  }
};


module.exports = {
  atsScore,
};
