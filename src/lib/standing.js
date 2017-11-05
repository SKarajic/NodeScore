import Competition from './competition';
import Team from './team';

/** Class representing team's standing. */
export default class Standing {
    /**
    *
    * @param {NodeScore} wrapper - the API wrapper object
    * @param {Object} standing - standing from the JSON
    */
    constructor(wrapper, standing) {
        const s = standing;
        this.wrapper = wrapper;
        this.compId = parseInt(s.comp_id);
        this.season = s.season;
        this.round = s.round;
        this.stageId = parseInt(s.stage_id);
        this.compGroup = s.comp_group;
        this.country = s.country;
        this.teamId = parseInt(s.team_id);
        this.teamName = s.team_name;
        this.status = s.status;
        this.recentForm = s.recent_form;
        this.position = parseInt(s.position);
        this.points = parseInt(s.points);
        this.description = s.description;
        this.home = new Home(s);
        this.away = new Away(s);
    }

    /**
     * returns the competition of this standing in promise form
     *
     * @return {Promise<Competition, Error>} returns a
     * Promise containing a Competition object.
     */
    competition() {
        return this.wrapper.competition(this.compId);
    }

    /**
     * returns the team of this standing in promise form
     *
     * @return {Promise<Team, Error>} returns a
     * Promise containing a Team object.
     */
    team() {
        return this.wrapper.team(this.teamId);
    }

    /**
     * returns total wins
     * @return {number} total wins
     */
    wins() {
        return parseInt(this.home.wins + this.away.wins);
    };

    /**
     * returns total draws
     * @return {number} total draws
     */
    draws() {
        return parseInt(this.home.draws + this.away.draws);
    };

    /**
     * returns total losses
     * @return {number} total losses
     */
    losses() {
        return parseInt(this.home.losses + this.away.losses);
    };

    /**
     * returns total games played
     * @return {number} total games played
     */
    gamesPlayed() {
        return parseInt(this.home.gamesPlayed + this.away.gamesPlayed);
    };

    /**
     * returns total goals scored
     * @return {number} total goals scored
     */
    goalsScored() {
        return parseInt(this.home.goalsScored + this.away.goalsScored);
    };

    /**
     * returns total goals accepted
     * @return {number} total goals accepted
     */
    goalsAccepted() {
        return parseInt(this.home.goalsAccepted + this.away.goalsAccepted);
    };

    /**
     * returns goal difference
     * @return {number} goal difference
     */
    goalDifference() {
        return parseInt(this.goalsScored() - this.goalsAccepted());
    };

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
};

/** Class representing team's standing statistics on the home side. */
class Home {
    /**
     * creates a **Home** object to be used as an inner class
     * for the **Standing** class.
     *
     * @param {*} standing - standing from the JSON
     */
    constructor(standing) {
        const s = standing;
        this.wins = parseInt(s.home_w);
        this.draws = parseInt(s.home_d);
        this.losses = parseInt(s.home_l);
        this.gamesPlayed = parseInt(s.home_gp);
        this.goalsScored = parseInt(s.home_gs);
        this.goalsAccepted = parseInt(s.home_ga);
    }
}

/** Class representing team's standing statistics on the away side. */
class Away {
    /**
     * creates an **Away** object to be used as an inner class
     * for the **Standing** class.
     *
     * @param {*} standing - standing from the JSON
     */
    constructor(standing) {
        const s = standing;
        this.wins = parseInt(s.away_w);
        this.draws = parseInt(s.away_d);
        this.losses = parseInt(s.away_l);
        this.gamesPlayed = parseInt(s.away_gp);
        this.goalsScored = parseInt(s.away_gs);
        this.goalsAccepted = parseInt(s.away_ga);
    }
}
