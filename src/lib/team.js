import {createDateObject} from './util';
import Player from './player';

/** Class representing a team. */
export default class Team {
    /**
     * creates a **Team** object
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} team - team from the JSON
     */
    constructor(wrapper, team) {
        const t = team;

        this.wrapper = wrapper;
        this.id = parseInt(t.team_id);
        this.isNational = (t.is_national == 'True');
        this.founded = parseInt(t.founded);
        let leagues = [];
        t.leagues.split(',')
            .forEach((league) => leagues.push(parseInt(league)));

        /** @type {number[]} */
        this.leagues = leagues;

        /**
         * @typedef {Object} venue
         * @property {number} id - id of the venue
         * @property {string} name - name of the venue
         * @property {string} city - city of the venue
         * @property {string} address - address of the venue
         * @property {string} surface - surface of the venue
         * @property {number} capacity - capacity of the venue
        */
        const venue = {
            id: parseInt(t.venue_id),
            name: t.venue_name,
            city: t.venue_city,
            address: t.venue_address,
            surface: t.venue_surface,
            capacity: parseInt(t.venue_capacity),
        };
        this.venue = venue;

        /**
         * @typedef {Object} coach
         * @property {number} id - id of the coach
         * @property {string} name - name of the coach
         */
        const coach = {
            id: parseInt(t.coach_id),
            name: t.coach_name,
        };
        this.coach = coach;
        this.squad = new Squad(wrapper, team);
        this.transfers = createTransfers(wrapper, team);
        this.statistics = new Statistics(t.statistics[0]);
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
}

/** Class representing a squad member. */
class Member {
    /**
     * creates a **Member** object to be used as an inner class
     * for the **Team** class.
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} player - player from the JSON
     */
    constructor(wrapper, player) {
        const p = player;

        this.wrapper = wrapper;
        this.id = parseInt(p.id);
        this.age = parseInt(p.age);
        this.name = p.name;
        this.number = parseInt(p.number);
        this.position = p.position;
        this.injured = (p.injured == 'True');
        this.minutes = parseInt(p.minutes);
        this.appearences = parseInt(p.appearences);
        this.lineups = parseInt(p.lineups);
        this.goals = parseInt(p.goals);
        this.assists = parseInt(p.assists);
        this.cards = {
            yellow: parseInt(p.yellowcards),
            red: parseInt(p.redcards),
        };
        this.substitute = {
            in: parseInt(p.substitute_in),
            out: parseInt(p.substitute_out),
            onBench: parseInt(p.substitutes_on_bench),
        };
        /** @type {Sidelined[]} */
        this.sidelined = [];
    }

    /**
     * returns one player in promise form
     *
     * @return {Promise<Competition, Error>} returns a
     * Promise containing a **Player** object.
     */
    player() {
        return this.wrapper.player(this.id);
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
}

/** Class representing a sidelined squad member. */
class Sidelined {
    /**
     * creates a **Sidelined** object to be used as an inner class
     * for the **Member** class.
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} sidelined - sidelined from the JSON
     */
    constructor(wrapper, sidelined) {
        const s = sidelined;

        this.description = s.description;
        this.startDate = createDateObject(s.startdate);
        this.endDate = s.enddate == '' ? null : createDateObject(s.enddate);
    }
}

/** Class representing a squad. */
class Squad {
    /**
     * creates a **Squad** object to be used as an inner class
     * for the **Team** class.
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} team - team from the JSON
     */
    constructor(wrapper, team) {
        this.members = createMembers(wrapper, team);
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
}

/** Class representing a transfer. */
class Transfer {
    /**
     * creates a **Transfer** object to be used as an inner class
     * for the **Team** class.
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} player - player from the JSON
     */
    constructor(wrapper, player) {
        const {id, name, date} = player;

        this.wrapper = wrapper;
        this.id = parseInt(id);
        this.name = name;
        this.date = createDateObject(date);
    }

    /**
     * returns one player in promise form
     *
     * @return {Promise<Player, Error>} returns a
     * Promise containing a **Player** object.
     */
    player() {
        return this.wrapper.player(this.id);
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
}

/** Class representing a transfer in. */
class TransferIn extends Transfer {
    /**
     * creates a **TransferIn** object to be used as an inner class
     * for the **Team** class.
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} player - player from the JSON
     */
    constructor(wrapper, player) {
        const {team_id, from_team} = player;
        super(wrapper, player);

        this.from = {
            teamId: parseInt(team_id),
            teamName: from_team,
        };
    }
}

/** Class representing a transfer in. */
class TransferOut extends Transfer {
    /**
     * creates a **TransferOut** object to be used as an inner class
     * for the **Team** class.
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {Object} player - player from the JSON
     */
    constructor(wrapper, player) {
        const {team_id, to_team} = player;
        super(wrapper, player);

        this.to = {
            teamId: parseInt(team_id),
            teamName: to_team,
        };
    }
}

/** Class representing a team's statistics */
class Statistics {
    /**
     * creates a **Statistics** object to be used as an inner class
     * for the **Team** class.
     *
     * @param {Object} statistics - statistics from the JSON
     */
    constructor(statistics) {
        const st = statistics;
        const home = {
            wins: filterInt(st.wins_home),
            draws: filterInt(st.draws_home),
            losses: filterInt(st.losses_home),
            goals: {
                scored: filterInt(st.goals_home),
                conceded: filterInt(st.goals_conceded_home),
            },
        };
        const away = {
            wins: filterInt(st.wins_away),
            draws: filterInt(st.draws_away),
            losses: filterInt(st.losses_away),
            goals: {
                scored: filterInt(st.goals_away),
                conceded: filterInt(st.goals_conceded_away),
            },
        };
        this.home = home;
        this.away = away;
    }

    /**
     * returns total amount of wins
     *
     * @return {number} - total amount of wins
     */
    wins() {
        return this.home.wins + this.away.wins;
    }

    /**
     * returns total amount of draws
     *
     * @return {number} - total amount of draws
     */
    draws() {
        return this.home.draws + this.away.draws;
    }

    /**
     * returns total amount of losses
     *
     * @return {number} - total amount of losses
     */
    losses() {
        return this.home.losses + this.away.losses;
    }

    /**
     * returns total amount of goals scored and conceded
     *
     * @return {goals} - total amount of goals scored and conceded
     */
    goals() {
        const scored = '';

        /**
         * @typedef {Object} goals
         * @property {number} scored
         * @property {number} conceded
         */
        const goals = {
            scored: this.home.goals.scored + this.away.goals.scored,
            conceded: this.home.goals.conceded + this.away.goals.conceded,
        };
        return goals;
    }
}

/**
 * creates an array of members
 *
 * @param {NodeScore} wrapper - the API wrapper object
 * @param {Object} team - team from the JSON
 * @return {Member[]} - an array of **Member** objects
 */
function createMembers(wrapper, team) {
    let members = [];
    team.squad.forEach((member) => {
        let pushMember = new Member(wrapper, member);
        let slPlayer;
        team.sidelined.forEach((sl) => {
            if (member.id == sl.id) {
                pushMember.sidelined.push(new Sidelined(wrapper, sl));
            }
        });
        members.push(pushMember);
    });
    return members;
}

/**
 * creates a **transfers** object containing an array of **TransferIn**
 * objects and an array of **TransferOut** objects
 *
 * @param {NodeScore} wrapper - the API wrapper object
 * @param {Object} team - team from the JSON
 * @return {transfers} - an object containing an array of **TransferIn**
 * objects and an array of **TransferOut** objects
 */
function createTransfers(wrapper, team) {
    /**
     * @typedef {Object} transfers a transfer object
     * @property {TransferIn[]} in The players that transfered in
     * @property {TransferOut[]} out The players that transfered out
     */
    let transfers = {
        in: [],
        out: [],
    };

    team.transfers_in.forEach((transferIn) =>
        transfers.in.push(new TransferIn(wrapper, transferIn)));


    team.transfers_out.forEach((transferOut) =>
        transfers.out.push(new TransferOut(wrapper, transferOut)));

    return transfers;
}

/**
 * filters and creates a number out of a string
 *
 * @param {string} val - the string containing the int
 * @return {number} an int created from a string
 */
function filterInt(val) {
    return (val == '-' || val == '') ? 0: parseInt(val);
}
