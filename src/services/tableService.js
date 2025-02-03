import azure from 'azure-storage';

const tableService = azure.createTableService(
    'eventspll',
    process.env.AZURE_STORAGE_ACCESS_KEY
);

export const insertEntity = (tableName, entity) => {
    return new Promise((resolve, reject) => {
        tableService.insertEntity(
            tableName,
            entity,
            {
                echoContent: true,
                payloadFormat: 'application/json;odata=nometadata',
            },
            (error, result, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export const queryEntities = (tableName, query) => {
    return new Promise((resolve, reject) => {
        tableService.queryEntities(
            tableName,
            query,
            null,
            { payloadFormat: 'application/json;odata=nometadata' },
            (error, result, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.body);
                }
            }
        );
    });
};
