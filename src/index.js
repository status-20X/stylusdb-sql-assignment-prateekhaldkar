// src/index.js

const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

// / Helper functions for different JOIN types
// function performInnerJoin(/* parameters */) {
//     // Logic for INNER JOIN
//     // ...
// }
 
// function performLeftJoin(/* parameters */) {
//     // Logic for LEFT JOIN
//     // ...
// }

// function performRightJoin(/* parameters */) {
//     // Logic for RIGHT JOIN
//     // ...
// }

function evaluateCondition(row, clause) {
    const { field, operator, value } = clause;
    switch (operator) {
        case '=': return row[field] === value;
        case '!=': return row[field] !== value;
        case '>': return row[field] > value;
        case '<': return row[field] < value;
        case '>=': return row[field] >= value;
        case '<=': return row[field] <= value;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

async function executeSELECTQuery(query) {
    const { fields, table, whereClause } = parseQuery(query);
    const data = await readCSV(`${table}.csv`);
    
    // Filtering based on WHERE clause
    const filteredData = whereClause
        ? data.filter(row => {
            const [field, value] = whereClause.split('=').map(s => s.trim());
            return row[field] === value;
        })
        : data;

    // Selecting the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}

// / Now we will have joinTable, joinCondition in the parsed query
// const { fields, table, whereClauses, joinTable, joinCondition } = parseQuery(query);
// let data = await readCSV(`${table}.csv`);

// // Perform INNER JOIN if specified
// if (joinTable && joinCondition) {
//     const joinData = await readCSV(`${joinTable}.csv`);
//     data = data.flatMap(mainRow => {
//         return joinData
//             .filter(joinRow => {
//                 const mainValue = mainRow[joinCondition.left.split('.')[1]];
//                 const joinValue = joinRow[joinCondition.right.split('.')[1]];
//                 return mainValue === joinValue;
//             })
//             .map(joinRow => {
//                 return fields.reduce((acc, field) => {
//                     const [tableName, fieldName] = field.split('.');
//                     acc[field] = tableName === table ? mainRow[fieldName] : joinRow[fieldName];
//                     return acc;
//                 }, {});
//             });
//     });
// }

// // Apply WHERE clause filtering after JOIN (or on the original data if no join)
// const filteredData = whereClauses.length > 0
//     ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
//     : data;

module.exports = executeSELECTQuery;