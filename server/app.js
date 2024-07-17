import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import express from "express";
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const PORT = process.env.PORT || 5400;
const app = express();

const API_URL = "https://v6.exchangerate-api.com/v6/";
const apiKey = process.env.API_KEY;

// MIDDLEWARES
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 50, // 50 req from an IP in 15 min
}));
// app.use(cors({
//     origin: ["http://localhost:5173"]
// }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// REQ HANDLERS
app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.get("/api/convert", (req, res) => {
    res.send("Server running!")
})

app.post("/api/convert", async (req, res) => {
    try {
        const { from, to, amount } = req.body;
        // console.log(req.body)

        if (!from || !to || !amount) {
            return res.status(400).json({ message: "Invalid data!" })
        }

        // constructing the api url
        const url = `${API_URL}${apiKey}/pair/${from}/${to}/${amount}`
        console.log(url)
        const response = await axios.get(url);

        if (!response.data || response.data.result !== "success") {
            return res.status(400).json({ message: "Error converting currency" })
        }

        res.status(201).json({
            from: response.data.base_code,
            to: response.data.target_code,
            conversionRate: response.data.conversion_rate,
            convertedAmount: response.data.conversion_result,
        });
    } catch (error) {
        res.status(400).json({ message: "failed to convert", error: error });
    }
})

// Start the server
app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));