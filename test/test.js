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
            .catch((err) => done(err));
    });
    it('should get Competition with id 1322', (done) => {
        ns.competition(1322)
            .then((comp) => {
                expect(parseInt(comp.id)).to.equal(1322);
                done();
            })
            .catch((err) => done(err));
    });
    it('should get Competition cache with id 1322', (done) => {
        ns.competition(1322)
            .then((comp) => {
                expect(parseInt(comp.id)).to.equal(1322);
                done();
            })
            .catch((err) => done(err));
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
            .catch((err) => done(err));
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
            .catch((err) => done(err));
    });
    it('should get Standings cache', (done) => {
        ns.standings(1322)
            .then((stands) => {
                expect(typeof JSON.parse(JSON.stringify(stands[0])).wrapper)
                    .to.equal('undefined');
                expect(Array.isArray(stands)).to.equal(true);
                expect(typeof stands[0].season).to.equal('string');
                done();
            })
            .catch((err) => done(err));
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
                expect(typeof stand.home.gamesPlayed).to.equal('number');
                expect(typeof stand.away.gamesPlayed).to.equal('number');
                done();
            })
            .catch((err) => done(err));
    });
    it('should should fail getting Standings from Competition', (done) => {
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
                expect(team.id).to.equal(9002);
                expect(typeof JSON.parse(JSON.stringify(team)).wrapper)
                .to.equal('undefined');
                expect(typeof team.statistics.wins()).to.equal('number');
                expect(typeof team.statistics.draws()).to.equal('number');
                expect(typeof team.statistics.losses()).to.equal('number');
                expect(typeof team.statistics.goals()).to.equal('object');
                expect(typeof team.statistics.home.wins).to.equal('number');
                done();
            })
            .catch((err) => done(err));
    });
    it('should get Team cache with id 9002', (done) => {
        ns.team(9002)
            .then((team) => {
                expect(team.id).to.equal(9002);
                done();
            })
            .catch((err) => done(err));
    });
    it('should get Team from Standing', (done) => {
        ns.standings(1322)
            .then((stands) => stands[0].team())
            .then((team) => {
                expect(typeof team.id).to.equal('number');
                done();
            })
            .catch((err) => done(err));
    });
    it('should should fail getting Team with no id', (done) => {
        ns.team()
            .catch((err) => {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
    });
});

describe('Player', () => {
    it('should get Player with id 237', (done) => {
        ns.player(237)
            .then((player) => {
                expect(player.id).to.equal(237);
                done();
            })
            .catch((err) => done(err));
    });
    it('should get Player cache with id 237', (done) => {
        ns.player(237)
            .then((player) => {
                expect(player.id).to.equal(237);
                done();
            })
            .catch((err) => done(err));
    });
    it('should get Player from Team through Squad', (done) => {
        ns.team(9002)
            .then((team) => team.squad.members[0].player())
            .then((player) => {
                expect(typeof player.id).to.equal('number');
                done();
            })
            .catch((err) => done(err));
    });
    it('should get Player from Team through TransferIn', (done) => {
        ns.team(9002)
            .then((team) => team.transfers.in[1].player())
            .then((player) => {
                expect(typeof player.id).to.equal('number');
                done();
            })
            .catch((err) => done(err));
    });
    it('should fail getting Player from Team through TransferIn', (done) => {
        ns.team(9002)
            .then((team) => team.transfers.in[0].player())
            .catch((err) => {
                expect(err).to.be.an.instanceOf(Error);
                expect(err.statusCode).to.equal(404);
                done();
            });
    });
    it('should fail getting Player with no id', (done) => {
        ns.player()
        .catch((err) => {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });
});

describe('Matches', () => {
    it('should get Matches', (done) => {
        ns.matches()
            .then((matches) => {
                done();
            })
            .catch((err) => done(err));
    });
});

describe('Utilities', () => {
    it('should fail parsing a JSON', (done) => {
        getJSON(process.env.XML_URL)
            .catch((err) => {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
    }).timeout(30000);
    it('should fail getting something', (done) => {
        getJSON('http://alinkwithnoendpoint.kr/')
            .catch((err) => {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
    });
});

after(() => fs.remove('./.cache'))
