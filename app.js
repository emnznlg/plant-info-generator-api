const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();
const port = 3000;

const prompt = `Find some information about the plant in this picture, such as the plant name, scientific name, and the regions where it is seen, and give it to me in JSON format. The response you return should only contain JSON data, do not include any other text or explanation. The sample output you should provide is:

{
   "scientific_name": "Tribulus terrestris",
   "common_names": [
      "Puncturevine",
      "Caltrop",
      "Goat's Head",
      "Devil's Weed"
   ],
   "natural_habitat": "Tropical and temperate regions of the world",
   "typical_growing_conditions": {
      "sun_requirements": "Full sun",
      "soil_requirements": "Well-drained soil",
      "drought_tolerance": "High"
   },
   "common_uses": [
      "Traditional medicine",
      "Dietary supplement",
      "Athletic performance enhancer"
   ],
   "interesting_facts_or_historical_significance": "The plant is named 'Tribulus' due to its thorny fruits that can pierce the hooves of animals. While considered a weed in some parts of the world, it is also known as a valuable medicinal plant.",
   "appearance": {
      "growth_habit": "Spreading",
      "height": "Up to 30 cm",
      "leaves": {
         "arrangement": "Opposite",
         "shape": "Oval or elliptical",
         "size": "1 to 2 cm long",
         "texture": "Hairy"
      },
      "flowers": {
         "color": "Yellow",
         "size": "Small",
         "arrangement": "Single or in clusters"
      }
   }
}`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

function encodeImageToBase64(imagePath) {
  const image = fs.readFileSync(imagePath);
  return Buffer.from(image).toString("base64");
}

app.post("/identify", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "No image uploaded!",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageParts = [
      {
        inlineData: {
          data: encodeImageToBase64(req.file.path),
          mimeType: req.file.mimetype,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);

    const response = result.response.candidates[0].content.parts[0].text;

    res.json({
      data: JSON.parse(response),
    });
  } catch (error) {
    res.status(500).send({
      status: "fail",
      message: "Error processing the image",
      error,
    });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
