// src/queryParser.js

function parseJoinClause(query) {
    const joinRegex = /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
    const joinMatch = query.match(joinRegex);

    if (joinMatch) {
        return {
            joinType: joinMatch[1].trim(),
            joinTable: joinMatch[2].trim(),
            joinCondition: {
                left: joinMatch[3].trim(),
                right: joinMatch[4].trim()
            }
        };
    }

    return {
        joinType: null,
        joinTable: null,
        joinCondition: null
    };
}


function parseQuery(query) {
    const selectRegex = /SELECT (.+) FROM (.+)/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table] = match;
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim()
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseWhereClause(whereString) {
    const conditions = whereString.split(/ AND | OR /i);
    return conditions.map(condition => {
        const [field, operator, value] = condition.split(/\s+/);
        return { field, operator, value };
    });
}

module.exports = parseQuery;