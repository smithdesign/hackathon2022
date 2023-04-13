import { StatusCodes } from "http-status-codes";
import { OpenAIApi } from "openai";
import { cors, openAiConfig, runMiddleware } from "@/src/util";


const openai = new OpenAIApi(openAiConfig);

export default async function handler(request, response) {
    await runMiddleware(request, response, cors);

    if (request.method !== 'POST') {
        return response.status(StatusCodes.BAD_REQUEST).send('');
    }

    const query = request?.body?.query ?? null;

    if (!query) {
        return response.status(StatusCodes.BAD_REQUEST).send(`You must specify a query`);
    }

    try {
        const openApiResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: query,
            temperature: 0,
            max_tokens: 2000,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        response.status(200).json({ data: openApiResponse.data.choices[0].text });
    } catch (error) {
        response.status(400).json({ error: "There was a undexpected problem with the request" });
    }
};