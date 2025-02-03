import { app } from '@azure/functions';
import { insertEntity } from '../services/tableService.js';

app.http('createEvent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        context.log('Received POST request to create a new event.');

        if (!req.body) {
            return {
                status: 400,
                body: JSON.stringify({
                    message: 'Please pass a request body.',
                }),
            };
        }
        const body = await req.json();
        context.log('req body: ', body);

        const { title, image, description, date, time, location } = body;

        if (!title || !image || !description || !date || !time || !location) {
            return {
                status: 400,
                body: JSON.stringify({
                    message:
                        'Please pass all required fields to create an event (title, image, description, date, time, location)',
                }),
            };
        }

        const entity = {
            PartitionKey: { _: 'Event' },
            RowKey: { _: new Date().getTime().toString() },
            title: { _: title },
            image: { _: image },
            description: { _: description },
            date: { _: date },
            time: { _: time },
            location: { _: location },
        };

        context.log('entity: ', entity);

        const result = await insertEntity('Events', entity);

        context.log('result: ', result);

        return {
            status: 201,
            body: JSON.stringify({
                message: 'Event created successfully.',
                event: result,
            }),
        };
    },
});
