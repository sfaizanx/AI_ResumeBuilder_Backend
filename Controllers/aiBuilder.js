const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const ai = new GoogleGenerativeAI(process.env.API_KEY);

const aiJobDesc = async (req, res) => {
  const { jobDesc } = req.body;
  if (!jobDesc) return res.status(400).send({ error: "Job title is required" });

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result =
      await model.generateContent(`I am creating a resume. My job title is: ${jobDesc}.
Please write a professional and impactful Objective for this role, suitable for a resume.
Keep it concise and clear, within approximately 70 words.`);
    const response = await result.response;
    const text = response.text();
    res.send({ description: text });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).send({ error: "Failed to generate description" });
  }
};

const getResume = async (req, res) => {
  const { jobdetails } = req.body;
  if (!jobdetails)
    return res.status(400).send({ error: "Job-details is required" });

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `From the following description, generate a JSON in this format:
- personalInfo: firstName, lastName, email, phone, address, linkedIn, portfolio, jobTitle
- education: [institution, degree, field, startDate, endDate, description]
- experience: [company, position, startDate, endDate, description, current]
- skills: [array of skills]
- projects: [name, description, technologies, link]
- languages: [language, proficiency]
- resumeScore: // score from 0 to 100 based on all json values
- workExperienceAI: // Suggest improvements for work experience. Focus on action verbs, quantified impact, achievements, etc all in 15 words,
- skillsAI: // Recommend adding technical or industry-specific skills like not involved in skills section etc. all in 15 words,
- atsAI: "Good // Is this resume ATS-compatible? show what more user can add values that make ats-friendly resume all in 15 words"

Only return raw JSON without any extra explanation.

Description: ${jobdetails}`
    );

    const response = await result.response;

    let text = await response.text();

    // ✅ Clean Markdown fences like ```json and ```
    if (text.startsWith("```json") || text.startsWith("```")) {
      text = text.replace(/```json\s*|```/g, "").trim();
    }

    // ✅ Optional: Try to locate first and last curly braces if extra junk remains
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");
    if (startIndex !== -1 && endIndex !== -1) {
      text = text.substring(startIndex, endIndex + 1);
    }

    // ✅ Parse the cleaned JSON
    const parsed = JSON.parse(text);

    return res.send({ jobdet: parsed });
  } catch (error) {
    console.error("Gemini Error", error.message);
    return res
      .status(500)
      .send({ error: "Failed to generate or parse resume data" });
  }
};

const getTitle = async (req, res) => {
  const { jobTitle } = req.body;
  if (!jobTitle) {
    return res.status(400).send({ error: "Job title is required" });
  }

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `The user entered this job title: "${jobTitle}". Suggest a more professional or industry-standard job title that enhances resume appeal. 
Provide only one refined title without any extra explanation.`
    );

    const response = await result.response;
    const text = response.text().trim();
    res.send({ suggestedTitle: text });
  } catch (error) {
    console.error("Gemini title suggestion error:", error.message);
    res.status(500).send({ error: "Failed to suggest job title" });
  }
};

module.exports = {
  aiJobDesc,
  getResume,
  getTitle
};
