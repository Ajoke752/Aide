// routes/medicineRoutes.js
const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { OpenAI } = require("openai");
const fs = require("fs");

const Medicine = mongoose.model("Medicine");
const requireLogin = require("../middleware/requireLogin"); // Simple middleware

// --- OpenAI Setup ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Multer Setup (for file uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// --- THE AI CHAIN ENDPOINT ---
// We use 'fields' to accept a photo AND an audio file
router.post(
  "/add",
  requireLogin, // (Create this middleware to check req.user)
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const photo = req.files.photo[0];
      const audio = req.files.audio[0];

      // --- 1. Get Photo URL ---
      const photoUrl = `${process.env.SERVER_URL}/uploads/${photo.filename}`;

      // --- 2. AI Step: Transcribe Audio (STT) ---
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audio.path),
        model: "whisper-1",
      });
      const userInstruction = transcription.text;

      // --- 3. AI Step: Understand Instruction (LLM) ---
      const llmResponse = await openai.chat.completions.create({
        model: "gpt-4o", // Or gpt-3.5-turbo for speed
        response_format: { type: "json_object" }, // Critical for clean output
        messages: [
          {
            role: "system",
            content: `You are a medical scheduler. A user will give you a natural language instruction.
            Convert it to a JSON object. The only valid times are "morning", "afternoon", "evening".
            Also extract the medicine's name if they say it.
            Example: "I take one pill in the morning and two at night"
            Output: {"name": "pill", "schedule": [{"time": "morning", "dose": 1}, {"time": "evening", "dose": 2}]}`,
          },
          {
            role: "user",
            content: userInstruction,
          },
        ],
      });

      const aiData = JSON.parse(llmResponse.choices[0].message.content);

      // --- 4. Save to Database ---
      const newMedicine = new Medicine({
        user: req.user.id,
        photoUrl: photoUrl,
        name: aiData.name || "Medicine",
        schedule: aiData.schedule,
      });

      await newMedicine.save();

      // --- 5. Clean up files ---
      fs.unlinkSync(photo.path);
      fs.unlinkSync(audio.path);

      res.status(201).send(newMedicine);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to add medicine. " + err.message });
    }
  }
);

// --- Endpoint for the Dashboard ---
router.get("/today", requireLogin, async (req, res) => {
  const medicines = await Medicine.find({ user: req.user.id });
  // (Add logic to filter by what's needed today)
  res.send(medicines);
});

module.exports = router;
