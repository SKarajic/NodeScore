import * as http from 'http';

/** 
 * returns a parsed JSON from URL
 * 
 * @param {string} url - the URL request for the JSON
 * @return {(Promise<Object>|Promise<Object[]>)} returns a parsed JSON
 */
export function getJSON(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const {statusCode} = res;
            if (statusCode !== 200) {
                res.resume();
                reject(new Error(`${statusCode} statuscode.\n` +
                `Url requested: ${url}. \nResponse headers: ` +
                `${JSON.stringify(res.headers)}`));
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

/**
 * returns one or multiple objects of a certain class
 * 
 * @param {class} ClassType - the class you want to create
 * @param {NodeScore} self - the NodeScore wrapper object
 * @param {(object|object[])} values - the values that need
 * to be parsed in the Class
 * @return {(object|object[])} returns one or multiple objects 
 * of a certain class
 */
export function createObject(ClassType, self, values) {
    if (Array.isArray(values)) {
        let objects = [];
        values.forEach(function(obj) {
            objects.push(new ClassType(self, obj));
        });
        return objects;
    } else {
        return new ClassType(self, values);
    }
}
