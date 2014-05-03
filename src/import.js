'use strict';

var fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    config = require('./config');

var warAndPeace = fs.readFileSync(config.WAR_AND_PEACE, { flag: 'r' }).toString(),
    // Split to paragraphs
    paragraphs = warAndPeace.match(/^(.|\n)*?\n$/gm),
    length = paragraphs.length;

console.log('Number of paragraphs', paragraphs.length);

MongoClient.connect(config.MONGO_SERVER, {}, function (error, db) {
    if (error) { throw error; }

    // Create documents from the text's paragraphs.
    var i, trimmed,
        documents = [];
    for (i = 0; i < length; i++) {
        // Trim whitespace from the ends of the string.
        trimmed = paragraphs[i].trim();
        if (trimmed === '') { continue; }

        // Replace all new lines with a space.
        documents.push({
            paragraph: i,
            book: 'War and Peace',
            content: trimmed.replace(/\n/g, ' ')
        });
    }

    // Create a text index on the collection before importing the data.
    var collection = db.collection(config.COLLECTION_NAME);
    collection.ensureIndex({ content: 'text' }, {
        name: 'text_search_idx',
        weights: {
            content: 1 // 1 is the default weight
        }

    }, function (error, index) {
        if (error) { throw error; }

        // Batch insert the paragraphs.
        console.log('Inserting document', documents.length);
        collection.insert(documents, function (error, dbresponse) {
            if (error) { throw error; }
            console.log('Text index created and data imported successfully.');

            db.close();
        });
    });
});
