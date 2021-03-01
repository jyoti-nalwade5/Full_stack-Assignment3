const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const productsDB = [
    {
        id: 1,
        name: 'Slim Fit Jeans',
        pricePerUnit: 10,
        category: 'Jeans',
        imageUrl: 'https://media.gq-magazine.co.uk/photos/5eb40b3aa7a089b1a9138b86/master/w_1024%2cc_limit/20200507-jeans-14.jpg',
    },
    {
        id: 2,
        name: 'Blue Shirt',
        pricePerUnit: 30,
        category: 'Shirts',
        imageUrl: 'https://media.tractorsupply.com/is/image/TractorSupplyCompany/1497240?$456$',
    },
    {
        id: 3,
    	name: "Puma Jacket",
        pricePerUnit: 20,
        category: 'Jackets',
        imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1750,h_1750/global/595615/02/fnd/IND/fmt/png/Ferrari-Hooded-Kids\'-Sweat-Jacket',
    },
];

const resolvers = {
    Query: {
        productList,
    },
    Mutation: {
        addProduct,
    },
};

function productList() {
    return productsDB;
}

function addProduct(_, { product }) {
    product.id = productsDB.length + 1;
    productsDB.push(product);
    return product;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
	console.log('App started on port 3000');
});