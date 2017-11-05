import {createDateObject} from './util';

/** */
export default class Match {
    /**
     *
     * @param {*} wrapper
     * @param {*} match
     */
    constructor(wrapper, match) {
        const m = match;

        this.wrapper = wrapper;
        this.id = parseInt(m.id);
        this.compId = parseInt(m.comp_id);
        this.date = createDateObject(m.formatted_date);
        this.season = m.season;
        this.week = parseInt(m.week);
        this.venue = m.venue;
        this.venueId = parseInt(m.venue_id);
        this.venueCity = m.venue_city;
        this.status = m.status;
        this.timer = m.timer;
        this.time = m.time;
        this.htScore = m.ht_score;
        this.ftScore = m.ft_score;
        this.etScore = m.et_score;
        this.local = {
            id: parseInt(m.localteam_id),
            name: m.localteam_name,
            score: parseInt(m.localteam_score),
            penalty: m.penalty_local,
        };
        this.visitor = {
            id: parseInt(m.visitorteam_id),
            name: m.visitorteam_name,
            score: parseInt(m.visitorteam_score),
            penalty: m.penalty_visitor,
        };
        let events = [];
        m.events.forEach((event) => {
            events.push(new Event(wrapper, event));
        });
        this.events = events;
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
}

/**  */
class Event {
    /**
     * 
     * @param {*} wrapper 
     * @param {*} event 
     */
    constructor(wrapper, event) {
        const e = event;

        this.wrapper = wrapper;
        this.id = parseInt(e.id);
        this.type = e.type;
        this.time = {
            minute: parseInt(e.minute),
            extra: parseInt(e.extra_min),
        };
        this.team = e.team;
        this.playerId = parseInt(e.player_id);
        this.playerName = e.player;
        this.assistId = parseInt(e.assist_id);
        this.assistName = e.assist;
        this.result = e.result;
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
}
