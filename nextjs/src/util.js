import Cors from 'cors';
import { Configuration } from 'openai';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = Cors({
    origin: '*',
    methods: ['POST', 'GET', 'HEAD'],
});

export const openAiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

export const createProductString = (products) => {
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