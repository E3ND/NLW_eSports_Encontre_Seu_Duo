import express from "express";
import { PrismaClient } from '@prisma/client'
import cors from 'cors';

import { convertHours } from "./utils/convert-hours-string-to-minutes";
import { convertMinutes } from "./utils/convert-minutes-to-hour-string";

const app = express();
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

app.get('/games', async(request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.status(200).json(games);
});

app.post('/games/:id/ads', async(request, response) => {
    const gameId = request.params.id;
    const body: any = request.body;
    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hoursStart: convertHours(body.hoursStart),
            hourEnd: convertHours(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return response.status(201).json(ad);
});

app.get('/games/:id/ads', async(request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        where: {
            gameId,
        },
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hoursStart: true,
            hourEnd: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.status(201).json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hoursStart: convertMinutes(ad.hoursStart),
            hourEnd: convertMinutes(ad.hourEnd),
        }
    }));
});

app.get('/ads/:id/discord', async(request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        where: {
            id: adId
        },
        select: {
            discord: true,
        }
    })

    return response.status(201).json({
        discord: ad.discord
    });
});

app.listen(3333);