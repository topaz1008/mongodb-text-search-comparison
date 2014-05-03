mongodb-text-search
====================================

A benchmark/comparison Node.js application which compares the performance of a text search query using regex patterns, and using the new $text operator and index type.

The $text operator and index requires MongoDB >= v2.6

To run the application

* Run `npm install` to install dependencies.
* Change the database configuration in `src/config.js` to match your environment.
* Make sure MongoDB is running.
* Run `node src/import.js` to import the test data and create the text index.
* Run `node src/find.js` to output the explain() output on each query.

Refer to the MongoDB documentation for more information about text indexes, the $text and $meta operators.

http://docs.mongodb.org/manual/core/index-text/

Test Data Credits
----------------------------------------------------
"War and Peace by Leo Tolstoy" in plain text format which is used as the test data was downloaded from: Project Gutenberg - http://www.gutenberg.org/

The original file was edited/normalized to make it easier to split up and import.

Original license is in `ebook_license.txt` or in http://www.gutenberg.org/license
