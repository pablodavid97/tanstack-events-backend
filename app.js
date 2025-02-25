import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );
    next();
});

app.get('/events', async (req, res) => {
    const { max, search } = req.query;
    const eventsFileContent = await fs.readFile('./data/events.json');
    let events = JSON.parse(eventsFileContent);

    if (search) {
        events = events.filter((event) => {
            const searchableText = `${event.title} ${event.description} ${event.location}`;
            return searchableText.toLowerCase().includes(search.toLowerCase());
        });
    }

    if (max) {
        events = events.slice(events.length - max, events.length);
    }

    res.json({
        events: events.map((event) => ({
            id: event.id,
            title: event.title,
            image: event.image,
            date: event.date,
            location: event.location,
        })),
    });
});

app.post('/events', async (req, res) => {
    const { event } = req.body;

    if (!event) {
        return res.status(400).json({ message: 'Event is required' });
    }

    console.log(event);

    if (
        !event.title?.trim() ||
        !event.description?.trim() ||
        !event.date?.trim() ||
        !event.time?.trim() ||
        !event.image?.trim() ||
        !event.location?.trim()
    ) {
        return res.status(400).json({ message: 'Invalid data provided.' });
    }

    const eventsFileContent = await fs.readFile('./data/events.json');
    const events = JSON.parse(eventsFileContent);

    const newEvent = {
        id: Math.round(Math.random() * 10000).toString(),
        ...event,
    };

    events.push(newEvent);

    await fs.writeFile('./data/events.json', JSON.stringify(events));

    res.json({ event: newEvent });
});

app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { event } = req.body;

    if (!event) {
        return res.status(400).json({ message: 'Event is required' });
    }

    if (
        !event.title?.trim() ||
        !event.description?.trim() ||
        !event.date?.trim() ||
        !event.time?.trim() ||
        !event.image?.trim() ||
        !event.location?.trim()
    ) {
        return res.status(400).json({ message: 'Invalid data provided.' });
    }

    const eventsFileContent = await fs.readFile('./data/events.json');
    const events = JSON.parse(eventsFileContent);

    const eventIndex = events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    events[eventIndex] = {
        id,
        ...event,
    };

    await fs.writeFile('./data/events.json', JSON.stringify(events));

    setTimeout(() => {
        res.json({ event: events[eventIndex] });
    }, 1000);
});

app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;

    const eventsFileContent = await fs.readFile('./data/events.json');
    const events = JSON.parse(eventsFileContent);

    const eventIndex = events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    events.splice(eventIndex, 1);

    await fs.writeFile('./data/events.json', JSON.stringify(events));

    setTimeout(() => {
        res.json({ message: 'Event deleted' });
    }, 1000);
});

export default app;
