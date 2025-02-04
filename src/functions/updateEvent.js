import { app } from '@azure/functions';
import { getEntityById, updateEntity } from '../services/tableService.js';

app.http('updateEvent', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'events/{id}',
    handler: async (request, context) => {
        context.log('Received PUT request to update an event.');

        try {
            const id = request.params.id;

            if (!id) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Please provide an event ID.' }),
                };
            }

            if (!request.body) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Please pass a request body.' }),
                };
            }

            const body = await request.json();
            const { title, image, description, date, time, location } = body;

            // Get the existing event
            const existingEvent = await getEntityById('Events', 'Event', id);

            if (!existingEvent) {
                return {
                    status: 404,
                    body: JSON.stringify({ message: 'Event not found.' }),
                };
            }

            // Prepare the update entity
            const entity = {
                PartitionKey: { _: 'Event' },
                RowKey: { _: id },
                title: { _: title || existingEvent.title._ },
                image: { _: image || existingEvent.image._ },
                description: { _: description || existingEvent.description._ },
                date: { _: date || existingEvent.date._ },
                time: { _: time || existingEvent.time._ },
                location: { _: location || existingEvent.location._ },
            };

            // Update the entity
            await updateEntity('Events', entity);

            return {
                status: 200,
                body: JSON.stringify({
                    message: 'Event updated successfully.',
                    event: entity,
                }),
            };
        } catch (error) {
            context.error('Error updating event:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }
    },
});
