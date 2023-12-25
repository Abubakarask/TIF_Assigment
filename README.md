# Overview
This documentation provides details on the API endpoints, instructions on how to run the server locally, and examples of requests and responses.

## Usage
1. Clone the repository:
```bash
git clone https://github.com/Abubakarask/return_journey.git
cd return_journey
```

## TaskI --> Javascript Assignment
### i) Navigate to folder Task-I
```bash
cd Task-I
```

### ii) Run the three scripts:
```
node task1.js
node task2.js
node task3.js
```

## TaskII --> Nodejs and Typescript Assignment
### i) Navigate to folder Task-II from folder return_journey
```bash
cd Task-II
```

### ii) Install and dependencies using npm or yarn
```bash
npm i
yarn
```

### iii) To run the server use:
```bash
npm run dev
yarn dev
```

## Endpoints
1. ### GET /api/products

#### Description: Retrieve a list of products.
#### Example Request:
```bash
curl http://localhost:3600/api/products
```
#### Example Response:
```
{
  success: true,
  content: [
    { id: 1, name: "Product 1", price: 19.99 },
    { id: 2, name: "Product 2", price: 29.99 },
  ],
}
```

2. ### GET /api/products/:id

#### Description - Retrieve details of a specific product by ID.
#### Example Request:
```bash
curl http://localhost:3600/api/products/1 
```
#### Example Response:
```
{
  success: true,
  content: { id: 1, name: "Product 1", price: 19.99 },
};
```

3. ### POST /api/products

#### Description: Create a new product.
#### Example Request:
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"New Product\", \"price\": 39.99}" http://localhost:3600/api/products
```
#### Example Response:
```
{
  success: true,
  content: { id: 3, name: "New Product", price: 39.99 },
};
```

4. ### PUT /api/products/:id

#### Description - Update details of a specific product by ID.
#### Example Request:
```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"name\": \"Updated Product\", \"price\": 39.99}" http://localhost:3600/api/products/3
```
#### Example Response:
```
{
  success: true,
  content: { id: 3, name: "Updated Product", price: 39.99 },
};
```

5. ### DELETE /api/products/:id

#### Description - Delete a product by ID.
#### Example Request:
```bash
curl -X DELETE http://localhost:3600/api/products/3
```
#### Example Response:
```
{
  success: true,
  content: { id: 3, name: "Updated Product", price: 39.99 },
};
```
