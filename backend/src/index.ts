import "dotenv/config";
import app from './app'
import { config } from "./config/env";

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
