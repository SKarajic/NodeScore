import {expect} from 'chai';
import {describe, it} from 'mocha';
import NodeScore from '../src';
import {getJSON} from '../src/lib/util';
import fs from 'fs-extra';
require('dotenv').config();

let key = process.env.API_KEY;
let ns = new NodeScore(key);

describe('Competition', () => {
    it('should get Competitions', (done) => {
        ns.competitions()
        .then((comps) => {
            expect(typeof JSON.parse(JSON.stringify(comps[0])).wrapper)
                .to.equal('undefined');
            expect(Array.isArray(comps)).to.equal(true);
            expect(typeof comps[0].name).to.equal('string');
            done();
        })
        .catch((err) => console.log(err));
    });

    it('should get Competition with id 1322', (done) => {
        ns.competition(1322)
        .then((comp) => {
            expect(parseInt(comp.id)).to.equal(1322);
            done();
        })
        .catch((err) => console.log(err));
    });
    it('should should fail getting Competition with id 1', (done) => {
        ns.competition(1)
        .catch((err) => {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });
    it('should get Competition from Standings', (done) => {
        ns.standings(1322)
        .then((stands) => stands[0].competition())
        .then((comp) => {
            expect(comp.id).to.equal(1322);
            done();
        })
        .catch((err) => console.log(err));
    });
});

describe('Standings', () => {
    it('should get Standings', (done) => {
        ns.standings(1322)
        .then((stands) => {
            expect(typeof JSON.parse(JSON.stringify(stands[0])).wrapper)
                .to.equal('undefined');
            expect(Array.isArray(stands)).to.equal(true);
            expect(typeof stands[0].season).to.equal('string');
            done();
        })
        .catch((err) => console.log(err));
    });

    it('should get Standings from Competition', (done) => {
        ns.competition(1322)
        .then((comp) => comp.standings())
        .then((stands) => {
            const stand = stands[0];

            expect(Array.isArray(stands)).to.equal(true);
            expect(stand.compId).to.equal(1322);
            expect(typeof stand.wins()).to.equal('number');
            expect(typeof stand.draws()).to.equal('number');
            expect(typeof stand.losses()).to.equal('number');
            expect(typeof stand.gamesPlayed()).to.equal('number');
            expect(typeof stand.goalsScored()).to.equal('number');
            expect(typeof stand.goalsAccepted()).to.equal('number');
            expect(typeof stand.goalDifference()).to.equal('number');
            done();
        })
        .catch((err) => console.log(err));
    });

    it('should should fail getting Standings from Competition with id 1',
    (done) => {
        ns.standings(1)
        .catch((err) => {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });
});

describe('Teams', () => {
    it('should get Team with id 9002', (done) => {
        ns.team(9002)
        .then((team) => {
            // TODO
            done();
        })
        .catch((err) => console.log(err));
    });
});

describe('Utilities', () => {
    it('should fail parsing a JSON', (done) => {
        getJSON('http://lorempixel.com/20/20/')
            .catch((err) => {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
    });

    it('should fail getting something', (done) => {
        getJSON('http://alinkwithnoendpoint.kr/')
            .catch((err) => {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
    });
});
