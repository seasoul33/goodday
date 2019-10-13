const mongoAgent = require('./mongoAgent.js')


export function init(IPPort) {
    mongoAgent.mongoInit(IPPort);
}

export async function registerUser(username, password) {
    return await mongoAgent.registerUser(username, password);
}

export async function searchUser(username) {
    return await mongoAgent.searchUser(username);
}
