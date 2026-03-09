const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "API_KEY";

// test route
app.get("/", (req, res) => {
  res.send("TaskMate AI Server Running");
});

app.post("/api/ai-breakdown", async (req, res) => {
  const { title } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Break this task into 5 short actionable steps:\n" + title
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (!data.candidates) {
      return res.status(500).json({ error: "Gemini failed" });
    }

    const text = data.candidates[0].content.parts[0].text;

    res.json({ result: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});