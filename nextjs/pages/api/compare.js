import { StatusCodes } from "http-status-codes";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createProductString = (products) => {
    let query = 'Compare between ';
    products.forEach((product, i) => {
        if(i === 0) {
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

        return response.json(completion.data.choices[0].text);
    } catch (error) {
        return response.json(error);
    }
}

export default async (request, response) => {
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

    runQuery(productPrompt);
  };