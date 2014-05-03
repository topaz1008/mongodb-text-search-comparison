'use strict';

var Q = require('q'),
    util = require('util');

/**
 * Wraps find() with a promise, and converts the results cursor to an array.
 */
exports.find = function (collection, query, fields, options) {
    var deferred = Q.defer();

    collection.find(query, fields, options, function (error, dbresponse) {
        if (error) { return deferred.reject(error); }

        dbresponse.toArray(function (error, results) {
            if (error) { return deferred.reject(error); }

            return deferred.resolve(results);
        });
    });

    return deferred.promise;
};

/**
 * Checks if the results are an explain object.
 *
 * @param results {Array|Object}
 * @returns {Boolean}
 */
exports.isExplanation = function (results) {
    return (
        typeof results[0] === 'object' &&
        typeof results[0].n === 'number' &&
        typeof results[0].nscanned === 'number'
    );
};

/**
 * Formats an explain() object
 *
 * @param explain {Object}
 * @returns {String}
 */
exports.formatExplanation = function (explain) {
    var template = 'Number of results: "%d"\n' +
        'Scanned: "%d"\n' +
        'Scanned objects: "%d"\n' +
        'Time (ms): "%d"' +
        '\n';

    return util.format(template,
        explain.n,
        explain.nscanned,
        explain.nscannedObjects,
        explain.millis
    );
};

module.exports = exports;
