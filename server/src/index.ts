import app from "./app";
const port = 3310;

app.listen(port, () => {
	console.info(`Server is running on port ${port}`);
});
