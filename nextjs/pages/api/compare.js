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

const createProductString = (products) => {
    let query = 'Compare between ';
    products.forEach((product, i) => {
        if (i === 0) {
            query += `${product.brand} ${product.name}`;
        } else {
            query += ` and ${product.brand} ${product.name}`;
        }
    });

    return query;
}

async function runQuery(productPrompt) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: productPrompt,
            temperature: 0,
            max_tokens: 100,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        console.log(response);

        return response.json(completion.data);
    } catch (error) {
        console.log(error)
        return error;
    }
}

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
        console.error('Fucked up', error);
        response.status(400).json({ error: "Fucked up" });
    }
};