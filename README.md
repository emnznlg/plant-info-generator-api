# Plant Identifier API

This project implements a RESTful API for plant identification using Node.js, Express, and Google's Gemini AI model. The API allows users to upload images of plants and receive identifications and descriptions.

## Features

- Image upload endpoint for plant identification
- Integration with Google's Gemini AI for accurate plant recognition

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (usually comes with Node.js)
- A Google AI Studio account and API key for Gemini

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/plant-identifier-api.git
   cd plant-identifier-api
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

1. Start the server:

   ```
   npm start
   ```

2. The API will be available at `http://localhost:3000` (or the port you specified).

3. To identify a plant, send a POST request to `/identify` with an image file in the `image` field of a multipart form-data body.

4. The API will respond with a JSON object containing the identification and description of the plant.

## API Endpoints

### POST /identify

Identifies a plant from an uploaded image.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `image`: The image file of the plant to identify

**Response:**

- Status: 200 OK
- Content-Type: application/json
- Body: {
  status: "success",
  data: {JSON Object}
  }

## Error Handling

The API includes basic error handling:

- 400 Bad Request: Returned if no image is uploaded
- 500 Internal Server Error: Returned if there's an error processing the image or communicating with the Gemini API
