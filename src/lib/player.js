import {createDateObject} from './util';

/** Class representing a player. */
export default class Player {
    /**
     * creates a **Player** object
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} player - team from the JSON
     */
    constructor(wrapper, player) {
        const p = player;
        this.id = parseInt(p.id);
        this.firstName = p.firstname;
        this.lastName = p.lastname;
        this.age = parseInt(p.age);
        this.height = p.height == null ? null : parseHeight(p.height);
        this.weight = p.weight == null ? null : parseWeight(p.weight);
        this.birthDate = createDateObject(p.birthdate);
        this.birthPlace = p.birthplace;
        this.birthCounrty = p.birthcountry;
        this.position = p.position;
        this.teamId = parseInt(p.teamid);
        this.teamName = p.team;
        this.nationality = p.nationality;
    }
}

/**
 * creates height integer from string from JSON
 *
 * @param {string} heightString - the heightstring from the JSON
 * @return {number} - the int created from the heightstring
 */
function parseHeight(heightString) {
    let ss = heightString.split(' cm');
    return parseInt(ss);
}

/**
 * creates weight integer from string from JSON
 *
 * @param {string} weightString - the weightstring from the JSON
 * @return {number} - the int created from the weightstring
 */
function parseWeight(weightString) {
    let ss = weightString.split(' kg');
    return parseInt(ss);
}
