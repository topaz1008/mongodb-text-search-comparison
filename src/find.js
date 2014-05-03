'use strict';

var util = require('util'),
    MongoClient = require('mongodb').MongoClient,
    dbUtils = require('./dbutils'),
    config = require('./config');

MongoClient.connect(config.MONGO_SERVER, {}, function (error, db) {
    if (error) { throw error; }

    // Regex query
    var regexQuery = { content: /.*Belova.*/i };
    var regexOptions = {
        explain: true,
        skip: 0,
        limit: 0
    };

    // Phrase matching using regex (uncomment)
    //var regexQuery = { $and: [{ content: /.*Belova.*/i }, { content: /.*replied.*/i }] };

    // Text search query, options, and text score
    // $search can use phrase matching using "" syntax. e.g. "\"belova replied\""
    // and negation using the - (minus) char. e.g. "belova -replied"
    var textQuery = { $text: { $search: "belova" } },
        // Return text score
        textScore = { score: { $meta: "textScore" } };
    var textOptions = {
        explain: true,
        sort: textScore, // Sort by text score
        skip: 0,
        limit: 0
    };

    var collection = db.collection(config.COLLECTION_NAME);

    // Explain regex query
    dbUtils.find(collection, regexQuery, {}, regexOptions).then(function (results) {
        if (dbUtils.isExplanation(results)) {
            // Log regex query explanation
            console.log('Regex query response', dbUtils.formatExplanation(results[0]));
        } else {
            // Log results
            console.log('Regex query response', util.inspect(results, { colors: true, depth: 1 }));
        }

        // Then text query
        return dbUtils.find(collection, textQuery, textScore, textOptions);

    }).then(function (results) {
        if (dbUtils.isExplanation(results)) {
            // Log text query explanation
            console.log('Text search query response', dbUtils.formatExplanation(results[0]));
        } else {
            // Log results
            console.log('Text search query response', util.inspect(results, { colors: true, depth: 1 }));
        }

        // Close connection.
        db.close();

    }).fail(function (error) {
        console.error('Got database error', error);
    });
});
