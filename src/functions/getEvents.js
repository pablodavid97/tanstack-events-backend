import { app } from '@azure/functions';
import azure from 'azure-storage';
import { queryEntities } from '../services/tableService.js';

app.http('getEvents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Received GET request for events.');

        try {
            let query = new azure.TableQuery().where(
                'PartitionKey eq ?',
                'Event'
            );

            const events = await queryEntities('Events', query);

            return {
                status: 200,
                body: JSON.stringify({ events: events.value }),
            };
        } catch (error) {
            return {
                status: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }
    },
});
