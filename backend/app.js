import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./utils/AppError.js";

export const app = express();

app.disable("x-powered-by");
app.use(express.json());

// Resource routers are mounted here: app.use("/api/trips", tripRoutes);

app.use(() => {
    throw new AppError(404, "NOT_FOUND", "Route not found");
});
app.use(errorHandler);

// Listen only when run directly (npm start), not when imported by tests
if (import.meta.main) {
    const port = process.env.PORT ?? 3000;
    app.listen(port, () => console.info(`API listening on port ${port}`));
}
