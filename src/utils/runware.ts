import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const RUNWARE_API_KEY = process.env.EXPO_PUBLIC_RUNWARE_API_KEY!;
const RUNWARE_API_URL = "https://api.runware.ai/v1";

if (!RUNWARE_API_KEY) {
    throw new Error(
        "EXPO_PUBLIC_RUNWARE_API_KEY is missing. Please add it to your .env.local file."
    );
}

export interface RunwareImageParams {
    positivePrompt: string;
    negativePrompt?: string;
    model?: string;
    width?: number;
    height?: number;
    steps?: number;
    CFGScale?: number;
    numberResults?: number;
}

export interface RunwareImage {
    taskType: string;
    taskUUID: string;
    imageUUID: string;
    imageURL: string;
    seed?: number;
}

export async function requestImageGeneration(params: RunwareImageParams): Promise<RunwareImage[]> {
    const taskUUID = uuidv4();
    
    const payload = [
        {
            taskType: "authentication",
            apiKey: RUNWARE_API_KEY,
        },
        {
            taskType: "imageInference",
            taskUUID: taskUUID,
            ...params,
        }
    ];

    try {
        const response = await fetch(RUNWARE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Runware returns an error property if something went wrong
        if (data.error) {
            throw new Error(data.error.message || JSON.stringify(data.error));
        }

        // The response data contains an array of results
        if (data.data && Array.isArray(data.data)) {
            // Filter to find the response for our specific imageInference task
            const imageResults = data.data.filter(
                (result: any) => result.taskUUID === taskUUID && result.imageURL
            );
            return imageResults;
        }

        return [];
    } catch (error) {
        console.error("Runware API Error:", error);
        throw error;
    }
}
