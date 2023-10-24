import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.NYTIMES_API_KEY;

export async function getSectionStories(req: Request, res: Response) {
  const section = req.params.section;

  try {
    const apiUrl = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${apiKey}`;
    const response: AxiosResponse = await axios.get(apiUrl);

    if (response.data.status === "OK") {
      res.json(response.data);
    } else {
      throw new Error(
        `Failed to fetch top stories from NY Times for section: ${section}`
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
//helper function
async function fetchStories(
  section: string,
  maxResults: number
): Promise<{ section: string; data: any[] }> {
  try {
    const apiUrl = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${apiKey}`;
    const response: AxiosResponse = await axios.get(apiUrl);

    if (response.data.status === "OK") {
      const stories =
        maxResults > 0
          ? response.data.results.slice(0, maxResults)
          : response.data.results;
      return { section, data: stories };
    } else {
      throw new Error(
        `Failed to fetch top stories from NY Times for section: ${section}`
      );
    }
  } catch (error) {
    console.error(error.message);
    throw new Error(
      `Failed to fetch top stories from NY Times for section: ${section}`
    );
  }
}
const sections = ["arts", "science", "us"];
export async function getAllTopStories(req: Request, res: Response) {
  try {
    const maxResults = 5; // Default to 5 results per section
    const storyPromises = sections.map((section) =>
      fetchStories(section, maxResults)
    );
    const stories = await Promise.all(storyPromises);

    res.json({
      status: "OK",
      copyright:
        "Copyright (c) 2023 The New York Times Company. All Rights Reserved.",
      last_updated: new Date().toISOString(),
      num_results: sections.length * maxResults,
      results: stories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
