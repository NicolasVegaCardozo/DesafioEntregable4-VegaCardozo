import express from 'express';
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import { __dirname } from './path.js';
import path from 'path';

const PORT = 8080;
const app = express();

// Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


// Conexion con socket.io

io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

	socket.on('newProduct', async product => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});
});


// Routes
app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);

app.use('/api/static', express.static(path.join(__dirname, '/public')));

app.get("/api/static", (req, res) => {    
    res.render("realTimeProducts", {
        rutaCss: "realTimeProducts",
        rutaJs: "realTimeProducts"
    })
})

