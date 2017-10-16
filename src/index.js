import {
    Competition,
    Standing,
    Team,
    getJSON,
    createObject,
} from './lib';
import Promise from 'promise';

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
            getJSON(url)
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
        return this.competition(null);
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
            getJSON(url)
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
            getJSON(url)
                .then((team) => resolve(
                    createObject(Team, self, team)))
                .catch((err) => reject(err));
        });
    }
};
