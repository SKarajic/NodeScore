import {
    Competition,
    Standing,
    Team,
    Player,
    getJSON,
    createObject,
} from './lib';
import Promise from 'promise';
import fs from 'fs-extra';
import {watch, unwatch, callWatchers} from 'watchjs';

/** Class representing wrapper object. */
export default module.exports = class NodeScore {
    /**
     * creates a NodeScore wrapper object
     * 
     * @param {string} key - the API Key from http://football-api.com/ 
     */
    constructor(key) {
        this.url = 'http://api.football-api.com/2.0/';
        this.auth = `?Authorization=${key}`;
        this.cacheManager = {
            competitions: {},
            standings: {},
            teams: {},
            players: {},
        };
    };

    /**
     * returns one competition in promise form
     * 
     * @param {number} id - the id of the competition
     * @return {Promise<Competition, Error>} returns a
     * Promise containing  a Competition object.
     */
    competition(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            let {competitions: cache} = this.cacheManager;
            id = (typeof id !== 'undefined' && id !== null) ? id : '';
            const url = `${this.url}competitions/${id}${this.auth}`;
            getData(cache, 'competitions', id, url)
                .then((competition) => resolve(
                    createObject(Competition, self, competition)))
                .catch((err) => reject(err));
        });
    }

    /**
     * returns multiple competitions in promise form
     * 
     * @return {Promise<Competition[], Error>} returns a
     * Promise containing an array of Competition objects.
     */
    competitions() {
        let self = this;
        return new Promise((resolve, reject) => {
            const url = `${this.url}competitions/${this.auth}`;
            getJSON(url)
                .then((competition) => resolve(
                    createObject(Competition, self, competition)))
                .catch((err) => reject(err));
        });
    }

    /**
     * returns one or multiple standings in promise form
     * 
     * @param {number} compId - the id of the competition
     * @return {Promise<Standing[], Error>} returns a
     * Promise containing either a Standing object or an array of Standing
     * objects.
     */
    standings(compId) {
        let self = this;
        return new Promise((resolve, reject) => {
            let {standings: cache} = this.cacheManager;
            const url = `${this.url}standings/${compId}${this.auth}`;
            getData(cache, 'standings', compId, url)
                .then((standing) => resolve(
                    createObject(Standing, self, standing)))
                .catch((err) => reject(err));
        });
    }

    /**
     * returns one team in promise form
     * 
     * @param {number} id - the id of the team
     * @return {Promise<Team, Error>} returns a
     * Promise containing  a Competition object.
     */
    team(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            let {teams: cache} = this.cacheManager;
            id = (typeof id !== 'undefined' && id !== null) ? id : '';
            const url = `${this.url}team/${id}${this.auth}`;
            getData(cache, 'teams', id, url)
                .then((team) => resolve(
                    createObject(Team, self, team)))
                .catch((err) => reject(err));
        });
    }

    /**
     * returns one player in promise form
     * 
     * @param {number} id - the id of the player
     * @return {Promise<Player, Error>} returns a
     * Promise containing  a Player object.
     */
    player(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            let {players: cache} = this.cacheManager;
            id = (typeof id !== 'undefined' && id !== null) ? id : '';
            const url = `${this.url}player/${id}${this.auth}`;
            getData(cache, 'players', id, url)
                .then((player) => resolve(
                    createObject(Player, self, player)))
                .catch((err) => reject(err));
        });
    }
};

/**
 * 
 * @param {*} cache 
 * @param {*} type 
 * @param {*} id 
 * @param {*} url 
 * 
 * @return {*}
 */
function getData(cache, type, id, url) {
    return new Promise((resolve, reject) => {
        let reqData;
        if (
            cache[id] == undefined ||
            cache[id].expiration <= new Date().getTime()
        ) {
            cache[id] = {
                request: true,
                expiration: new Date().getTime() + 24 * 3600 * 1000,
            };
            getJSON(url)
                .then((data) => {
                    resolve(data);
                    reqData = data;
                    return fs.ensureDir(`./.cache/${type}`);
                })
                .then(() => {
                    fs.writeJSON(`./.cache/${type}/${id}.json`, reqData);
                    cache[id].request = false;
                })
                .catch((err) => {
                    cache[id].request = false;
                    reject(err);
                });
        } else if (cache[id].request) {
            watch(cache[id], 'request', () => {
                if (!cache[id].request) {
                    unwatch(cache[id], 'request');
                    fs.readJSON(`./.cache/${type}/${id}.json`)
                        .then((data) => resolve(data))
                        .catch((err) => reject(err));
                }
            });
        } else {
            fs.readJSON(`./.cache/${type}/${id}.json`)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        }
    });
}
