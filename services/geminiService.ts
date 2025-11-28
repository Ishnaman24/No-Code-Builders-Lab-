import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Movie } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

// Schema Definition for Recommendations
const movieSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    year: { type: Type.STRING },
    genre: { type: Type.ARRAY, items: { type: Type.STRING } },
    plot: { type: Type.STRING },
    rating: { type: Type.STRING },
    director: { type: Type.STRING },
  },
  required: ["title", "year", "genre", "plot", "rating"],
};

const recommendationSchema: Schema = {
  type: Type.ARRAY,
  items: movieSchema,
};

// Schema for Detailed Movie Info
const detailedMovieSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    year: { type: Type.STRING },
    genre: { type: Type.ARRAY, items: { type: Type.STRING } }, // Added genre to ensure complete data
    cast: { type: Type.ARRAY, items: { type: Type.STRING } },
    criticReviews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING },
          snippet: { type: Type.STRING },
          score: { type: Type.STRING },
        },
      },
    },
    watchProviders: { type: Type.ARRAY, items: { type: Type.STRING } },
    rating: { type: Type.STRING },
    plot: { type: Type.STRING },
    director: { type: Type.STRING },
  },
};

// Helper to generate a "scraped" poster URL using a search proxy
const getPosterUrl = (title: string) => {
  const query = encodeURIComponent(`${title} official movie poster high resolution vertical`);
  // Using Bing's thumbnail proxy to effectively "scrape" the search result for an image
  return `https://tse2.mm.bing.net/th?q=${query}&w=600&h=900&c=7&rs=1&p=0`;
};

export const getRecommendations = async (selectedGenres: string[]): Promise<Movie[]> => {
  const prompt = `Recommend 8 distinct movies that fit the following genres: ${selectedGenres.join(', ')}. 
  Ensure they are highly rated and diverse. Provide the output in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
        temperature: 0.7,
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Enrich with IDs and official poster URLs
    return data.map((m: any, idx: number) => ({
      ...m,
      id: `gen-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: getPosterUrl(m.title),
    }));

  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return [];
  }
};

export const getMovieDeepDive = async (movieTitle: string): Promise<Partial<Movie>> => {
  const prompt = `Provide detailed information for the movie "${movieTitle}". 
  Include the main cast (top 5), 3 short critic review snippets with sources, 
  available streaming platforms (e.g. Netflix, Hulu, Disney+), genres, and an aggregate rating.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: detailedMovieSchema,
      },
    });

    const details = JSON.parse(response.text || "{}");
    
    // Ensure the image URL is also refreshed/available in details if needed, 
    // though usually passed from state. We add it here just in case.
    return {
      ...details,
      imageUrl: getPosterUrl(movieTitle)
    };
  } catch (error) {
    console.error("Gemini Details Error:", error);
    return {};
  }
};