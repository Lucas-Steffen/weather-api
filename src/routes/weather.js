import axios from 'axios';
import express from 'express'
import { redis } from '../config/redisConnection.js';
export const router = express();

router.get('/weather', async(req, res) =>{
    const { city } = req.query;
    const apiUrl = process.env.WEATHER_API_URL

    if(!city){
        return res.status(400).json({
            error: "City is required!"
        })
    }

    const cacheKey = `weather:${city}`
    const cached = await redis.get(cacheKey);

    if(cached){
        console.log(`Cache found for ${city}`)
        return res.json(JSON.parse(cached))
    }
    const response = await axios.get(
        `${apiUrl}${city}?key=${process.env.WEATHER_API_KEY}`
    )

    const data = response.data;

    await redis.set(cacheKey, JSON.stringify(data), {
        EX: 60 * 60 * 12
    });

    res.json(data)
})