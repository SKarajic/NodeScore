import {
    Competition,
    Standing,
    Team,
    Player,
    Match,
    getJSON,
    createObject,
    createStringFromDate,
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
            init: [false, false],
            competitions: {},
            standings: {},
            teams: {},
            players: {},
            matches: {},
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
            id = (typeof id !== 'undefined' && id !== null) ? id : '';
            const url = `${this.url}competitions/${id}${this.auth}`;
            this.getData('competitions', id, url, (24 * 3600 * 1000))
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
            this.getData('competitions', 'all', url, (24 * 3600 * 1000))
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
            const url = `${this.url}standings/${compId}${this.auth}`;
            this.getData('standings', compId, url, (2 * 3600 * 1000))
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
            id = (typeof id !== 'undefined' && id !== null) ? id : '';
            const url = `${this.url}team/${id}${this.auth}`;
            this.getData('teams', id, url, (2 * 3600 * 1000))
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
            id = (typeof id !== 'undefined' && id !== null) ? id : '';
            const url = `${this.url}player/${id}${this.auth}`;
            this.getData('players', id, url, (2 * 3600 * 1000))
                .then((player) => resolve(
                    createObject(Player, self, player)))
                .catch((err) => reject(err));
        });
    }

    /**
     * returns live matches in promise form
     *
     * @return {Promise<Match[], Error>} returns a
     * Promise containing  a Player object.
     */
    matches() {
        let self = this;
        let fromDate = new Date();
        let toDate = new Date();
        fromDate.setDate(fromDate.getDate() - 2);
        toDate.setDate(toDate.getDate() + 7);

        let fromDateString = createStringFromDate(fromDate);
        let toDateString = createStringFromDate(toDate);

        return new Promise((resolve, reject) => {
            const url = `${this.url}matches${this.auth}`
                + `&from_date=${fromDateString}`
                + `&to_date=${toDateString}`;
            this.getData('matches', 'all', url, (8000))
                .then((matches) => resolve(
                    createObject(Match, self, matches)))
                .catch((err) => reject(err));
        });
    }

    /**
     *
     * @param {*} type
     * @param {*} id
     * @param {*} url
     * @param {*} time
     *
     * @return {*}
     */
    getData(type, id, url, time) {
        return new Promise((resolve, reject) => {
            this.checkCache(() => {
                let cache = this.cacheManager[type];
                let reqData;
                if (
                    cache[id] == undefined ||
                    cache[id].expiration <= new Date().getTime()
                ) {
                    cache[id] = {
                        request: true,
                        expiration: new Date().getTime() + time,
                    };
                    getJSON(url)
                        .then((data) => {
                            resolve(data);
                            reqData = data;
                            return fs.ensureDir(`./.cache/${type}`);
                        })
                        .then(() => {
                            fs.writeJSON(
                                `./.cache/${type}/${id}.json`,
                                reqData,
                                {spaces: 4}
                            );
                            cache[id].request = false;
                            fs.writeJSON(
                                `./.cache/manager.json`,
                                this.cacheManager,
                                {spaces: 4}
                            );
                        })
                        .catch((err) => {
                            cache[id].request = false;
                            fs.writeJSON(
                                `./.cache/manager.json`,
                                this.cacheManager,
                                {spaces: 4}
                            );
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
        });
    }

    /**
     *
     * @param {*} callback
     */
    checkCache(callback) {
        if (!this.cacheManager.init[0]) {
            if (!this.cacheManager.init[1]) {
                this.cacheManager.init[1] = true;
                fs.readJSON('./.cache/manager.json')
                    .then((data) => {
                        this.cacheManager.init[0] = true;
                        this.cacheManager.init[1] = false;
                        this.cacheManager = data;
                        callback();
                    })
                    .catch(() => {
                        this.cacheManager.init[0] = true;
                        this.cacheManager.init[1] = false;
                        callback();
                    });
            } else {
            }
        } else {
            callback();
        }
    }
};
