import { StatusCodes } from "http-status-codes";
import { Configuration, OpenAIApi } from "openai";
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
    origin: '*',
    methods: ['POST', 'GET', 'HEAD'],
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

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
        response.status(400).json({ error: "Fucked up" });
    }
};