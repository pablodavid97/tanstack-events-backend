import { app } from '@azure/functions';
import { getEntityById } from '../services/tableService.js';

app.http('getEventById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'events/{id}',
    handler: async (request, context) => {
        context.log('Received GET request for a single event.');
        
        try {
            const id = request.params.id;

            context.log('id: ', id);
            
            if (!id) {
                return {
                    status: 400,
                    body: JSON.stringify({ message: 'Please provide an event ID.' }),
                };
            }

            const event = await getEntityById('Events', 'Event', id);
            
            if (!event) {
                return {
                    status: 404,
                    body: JSON.stringify({ message: 'Event not found.' }),
                };
            }

            return {
                status: 200,
                body: JSON.stringify({ event }),
            };
        } catch (error) {
            context.error('Error retrieving event:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }
    },
});
