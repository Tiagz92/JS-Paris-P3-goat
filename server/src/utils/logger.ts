type LogLevel = "debug" | "info" | "warn" | "error";

const logger = {
	debug: (...args: unknown[]) => {
		if (process.env.NODE_ENV !== "production") {
			console.debug(...args);
		}
	},
	info: (...args: unknown[]) => {
		console.info(...args);
	},
	warn: (...args: unknown[]) => {
		console.warn(...args);
	},
	error: (...args: unknown[]) => {
		console.error(...args);
	},
};

export default logger;
