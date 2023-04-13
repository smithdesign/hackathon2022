import { StatusCodes } from "http-status-codes";
import { OpenAIApi } from "openai";
import { cors, createProductString, openAiConfig, runMiddleware } from "@/src/util";

const openai = new OpenAIApi(openAiConfig);

export default async function handler(request, response) {
    await runMiddleware(request, response, cors);

    if (request.method !== 'POST') {
        return response.status(StatusCodes.BAD_REQUEST).send('');
    }

    const products = request?.body?.products ?? null;

    if (!products) {
        return response.status(StatusCodes.BAD_REQUEST).send(`No products were included in the request.`);
    }

    if (products.length < 2) {
        return response.status(StatusCodes.BAD_REQUEST).send(`You must specify at least 2 products to compare. Received ${products.length} products`);
    }

    const productPrompt = createProductString(products);

    try {
        const openApiResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: productPrompt,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        response.status(200).json({ data: openApiResponse.data.choices[0].text });
    } catch (error) {
        console.error('There was a problem with the request', error);
        response.status(400).json({ error: "There was a problem with the request" });
    }
};