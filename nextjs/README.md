## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Endpoints

### POST /api/compare
#### Input
```js
{
    products: []
}
```

#### Returns
Text from ChatGPT comparing products sent. Must send at least 2 products to compare

### POST /api/ask
#### Input
```js
{
    query: "Your question"
}
```

#### Returns
Text from ChatGPT answering your question.


