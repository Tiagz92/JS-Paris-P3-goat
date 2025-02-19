import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import type { ErrorRequestHandler } from "express";
import express from "express";

import advertRouter from "./modules/advert/advertRoutes";
import reservationRouter from "./modules/reservation/reservationRoutes";
import slotRouter from "./modules/slot/slotRoutes";
import router from "./router";
import logger from "./utils/logger";

// Load the express module to create a web application
const app = express();

// Configure it

/* ************************************************************************* */

// CORS Handling: Why is the current code present and do I need to define specific allowed origins for my project?

// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers that blocks requests from a different domain than the server.
// You may find the following magic line in forums:

// app.use(cors());

// You should NOT do that: such code uses the `cors` module to allow all origins, which can pose security issues.
// For this pedagogical template, the CORS code allows CLIENT_URL in development mode (when process.env.CLIENT_URL is defined).

// If you need to allow extra origins, you can add something like this:

/*
app.use(
  cors({
    origin: ["http://mysite.com", "http://another-domain.com"],
  }),
);
*/

// With ["http://mysite.com", "http://another-domain.com"]
// to be replaced with an array of your trusted origins

app.use(
	cors({
		origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
		optionsSuccessStatus: 200,
		credentials: true,
	}),
);

/* ************************************************************************* */

// Request Parsing: Understanding the purpose of this part

// Request parsing is necessary to extract data sent by the client in an HTTP request.
// For example to access the body of a POST request.
// The current code contains different parsing options as comments to demonstrate different ways of extracting data.

// 1. `express.json()`: Parses requests with JSON data.
// 2. `express.urlencoded()`: Parses requests with URL-encoded data.
// 3. `express.text()`: Parses requests with raw text data.
// 4. `express.raw()`: Parses requests with raw binary data.

// Uncomment one or more of these options depending on the format of the data sent by your client:

app.use(express.json());
app.use((req, res, next) => {
	if (req.method === "POST") {
		logger.debug("Request URL:", req.url);
		logger.debug("Request Headers:", req.headers);
		logger.debug("Request Body:", req.body);
	}
	next();
});
app.use(express.urlencoded({ extended: true }));
// app.use(express.text());
// app.use(express.raw());

/* ************************************************************************* */

// Serve server resources
// Define the path to the public folder
const publicFolderPath = path.join(__dirname, "../../server/public");

// Serve server resources (including /upload)
if (fs.existsSync(publicFolderPath)) {
	app.use("/upload", express.static(path.join(publicFolderPath, "upload")));
	app.use(express.static(publicFolderPath));
}

// Import the API router

// Mount the API router under the "/api" endpoint

// Import the API router and mount it under the "/api" endpoint
app.use(router);

/* ************************************************************************* */

// Production-ready setup: What is it for?

// The code includes sections to set up a production environment where the client and server are executed from the same processus.

// What it's for:
// - Serving client static files from the server, which is useful when building a single-page application with React.
// - Redirecting unhandled requests (e.g., all requests not matching a defined API route) to the client's index.html. This allows the client to handle client-side routing.

// Serve server resources

app.use("/public", express.static(path.join(__dirname, "public")));

// Serve client resources

const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
	app.use(express.static(clientBuildPath));

	// Redirect unhandled requests to the client index file

	app.get("*", (_, res) => {
		res.sendFile("index.html", { root: clientBuildPath });
	});
}

/* ************************************************************************* */

// Middleware for Error Logging
// Important: Error-handling middleware should be defined last, after other app.use() and routes calls.

// Define a middleware function to log errors
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
	logger.error(err);
	logger.error("on req:", req.method, req.path);
	next(err);
};

// Mount the logErrors middleware globally
app.use(logErrors);

/* ************************************************************************* */

export default app;
