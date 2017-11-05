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
            id: m.localteam_id,
            name: m.localteam_name,
            score: m.localteam_score,
            penalty: m.penalty_local,
        };
        this.visitor = {
            id: m.visitorteam_id,
            name: m.visitorteam_name,
            score: m.visitorteam_score,
            penalty: m.penalty_visitor,
        };
    }
}
