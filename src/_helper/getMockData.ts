const fs = require('fs');

export function getMockData(table) {
    try {
        const data = JSON.parse(fs.readFileSync('../mock/serveplus.json', 'utf8'));
        return data.find(x => x.type == 'table' && name == table)
    } catch (err) {
        console.error(err);
    }
}