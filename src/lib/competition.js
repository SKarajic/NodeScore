import Standing from './standing';

/** Class representing a competition. */
export default class Competition {
    /**
     * creates a **Competition** object
     *
     * @param {NodeScore} wrapper - the API wrapper object
     * @param {object} comp - competition from the JSON
     */
    constructor(wrapper, comp) {
        const {id, name, region} = comp;

        this.wrapper = wrapper;
        this.id = parseInt(id);
        this.name = name;
        this.region = region;
    }

    /**
     * returns multiple **Standing** objects in promise form
     *
     * @return {Promise<Standing[], Error>} returns a Promise containing an
     * array of **Standing** objects.
     */
    standings() {
        return this.wrapper.standings(this.id);
    }

    /** @return {*} */
    toJSON() {
        let copy = Object.assign({}, this);
        delete copy.wrapper;

        return copy;
    }
};
