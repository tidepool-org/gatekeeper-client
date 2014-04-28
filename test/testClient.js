/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

var salinity = require('salinity');
var expect = salinity.expect;
var sinon = salinity.sinon;

describe('client.js', function() {
  var token;
  var hosts;
  var request = sinon.stub();

  var httpClient = require('amoeba').httpClient({}, request);
  var tokenGetter = function(fn){ fn(null, token); };
  var hostGetter = { get: function(){ return hosts; } };

  var client;

  beforeEach(function() {
    token = '1234';
    hosts = [{ protocol: 'http', host: 'localhost:1234' }];
    request.reset();

    client = require('../lib').client(httpClient, tokenGetter, hostGetter);
  });

  describe('userInGroup', function() {
    it('does a request', function(done) {
      request.callsArgWith(1, null, { statusCode: 200 }, { "view": {} });

      client.userInGroup('1234', 'abcd', function(err, result) {
        expect(result).to.deep.equal({ view: {} });
        expect(request).calledWith(
          sinon.match({
            url: 'http://localhost:1234/access/abcd/1234',
            method: 'GET',
            headers: { 'x-tidepool-session-token': '1234'}
          }),
          sinon.match.func
        );
        done(err);
      });
    });

    it('passes back error codes', function(done) {
      request.callsArgWith(1, null, { statusCode: 401 }, 'billybobbump');

      client.userInGroup('1234', 'abcd', function(err, result) {
        expect(result).to.not.exist;
        expect(err).to.deep.equal({ statusCode: 401, message: 'billybobbump' });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/abcd/1234',
                        method: 'GET',
                        headers: { 'x-tidepool-session-token': '1234'}
                      }),
          sinon.match.func
        );
        done();
      });
    });
  });

  describe('usersInGroup', function() {
    it('does a request', function(done) {
      request.callsArgWith(1, null, { statusCode: 200 }, { "view": {} });

      client.usersInGroup('abcd', function(err, result) {
        expect(result).to.deep.equal({ view: {} });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/abcd',
                        method: 'GET',
                        headers: { 'x-tidepool-session-token': '1234'}
                      }),
          sinon.match.func
        );
        done(err);
      });
    });

    it('passes back error codes', function(done) {
      request.callsArgWith(1, null, { statusCode: 401 }, 'billybobbump');

      client.usersInGroup('abcd', function(err, result) {
        expect(result).to.not.exist;
        expect(err).to.deep.equal({ statusCode: 401, message: 'billybobbump' });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/abcd',
                        method: 'GET',
                        headers: { 'x-tidepool-session-token': '1234'}
                      }),
          sinon.match.func
        );
        done();
      });
    });
  });

  describe('groupsForUser', function() {
    it('does a request', function(done) {
      request.callsArgWith(1, null, { statusCode: 200 }, { "view": {} });

      client.groupsForUser('1234', function(err, result) {
        expect(result).to.deep.equal({ view: {} });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/groups/1234',
                        method: 'GET',
                        headers: { 'x-tidepool-session-token': '1234'}
                      }),
          sinon.match.func
        );
        done(err);
      });
    });

    it('passes back error codes', function(done) {
      request.callsArgWith(1, null, { statusCode: 401 }, 'billybobbump');

      client.groupsForUser('1234', function(err, result) {
        expect(result).to.not.exist;
        expect(err).to.deep.equal({ statusCode: 401, message: 'billybobbump' });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/groups/1234',
                        method: 'GET',
                        headers: { 'x-tidepool-session-token': '1234'}
                      }),
          sinon.match.func
        );
        done();
      });
    });
  });

  describe('setPermissions', function() {
    it('does a request', function(done) {
      request.callsArgWith(1, null, { statusCode: 200 }, { "view": {} });

      client.setPermissions('1234', 'abcd', { view: {} }, function(err, result) {
        expect(result).to.deep.equal({ view: {} });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/abcd/1234',
                        method: 'POST',
                        headers: { 'x-tidepool-session-token': '1234', 'content-type': 'application/json' },
                        body: JSON.stringify({ view: {} })
                      }),
          sinon.match.func
        );
        done(err);
      });
    });

    it('passes back error codes', function(done) {
      request.callsArgWith(1, null, { statusCode: 401 }, 'billybobbump');

      client.setPermissions('1234', 'abcd', { view: {} }, function(err, result) {
        expect(result).to.not.exist;
        expect(err).to.deep.equal({ statusCode: 401, message: 'billybobbump' });
        expect(request).calledWith(
          sinon.match({
                        url: 'http://localhost:1234/access/abcd/1234',
                        method: 'POST',
                        headers: { 'x-tidepool-session-token': '1234', 'content-type': 'application/json' },
                        body: JSON.stringify({ view: {} })
                      }),
          sinon.match.func
        );
        done();
      });
    });
  });
});