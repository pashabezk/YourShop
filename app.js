const express = require("express");
// const myModel = require("./models/model");
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/"); // создаем объект MongoClient и передаем ему строку подключения

const app = express();

app.set("view engine", "pug"); // подключаем движок Pug

app.use(express.static(__dirname + "/public")); // подключение статичных файлов

app.use("/contact", function(request, response) {
	console.log('\n\ncontact');
	response.render("contact", {
		title: "Мои контакты",
		emailsVisible: true,
		emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
		phone: "+1234567890"
	});
}); 

app.get("/", async function(request, response) {
	console.log('\n\nindex');
	// response.send("main");
	const products = await getRandomProducts();
	response.render("index", {products: products});
});

// функция старта приложения
async function start() {
	try {
		app.listen(3000); // запуск прослушивания сервера
	}
	catch(e) {
		console.log(e);
	}
}

async function getRandomProducts() {
	var products = [];
	try {
		await mongoClient.connect();
		const db = mongoClient.db("yourshop");
		const collection = db.collection("products");
		const result = collection.aggregate([{ $sample: { size: 15 } }]);
		// const result = collection.find({subCategory: "Wristbands"}).limit(15);
		await result.forEach(product => {
			products.push(product);
			// console.log(product);
			console.log(product.id + " " + product.productDisplayName);
		});

	}catch(err) {
		console.log(err);
	} finally {
		await mongoClient.close();
		return products;
	}
}


start();
