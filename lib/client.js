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

var pre = require('amoeba').pre;

module.exports = function(httpClient, tokenMonster, hostGetter) {
  pre.notNull(httpClient, 'Must provide an httpClient');
  pre.notNull(tokenMonster, 'Must provide a tokenMonster');
  pre.notNull(hostGetter, 'Must provide a hostGetter');

  httpClient = httpClient.withConfigOverrides({ hostGetter: hostGetter });

  function withToken(sadCb, happyCb) {
    tokenMonster(function(err, token){
      if (err != null) {
        sadCb(err);
      } else {
        happyCb(token);
      }
    });
  }

  return {
    userInGroup: function(userId, groupId, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      withToken(callback, function(token) {
        httpClient.requestToPath('/permissions/%s/%s', groupId, userId)
          .withToken(token)
          .whenStatusPassBody(200)
          .whenStatusPassNull(404)
          .go(callback);
      });
    },
    usersInGroup: function(groupId, callback) {
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      withToken(callback, function(token){
        httpClient.requestToPath('/permissions/%s', groupId)
          .withToken(token)
          .whenStatusPassBody(200)
          .go(callback);
      })
    },
    groupsForUser: function(userId, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(callback, 'Must provide a callback');

      withToken(callback, function(token){
        httpClient.requestToPath('/permissions/group/%s', userId)
          .withToken(token)
          .whenStatusPassBody(200)
          .go(callback);
      });
    },
    setPermissions: function(userId, groupId, permissions, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      withToken(callback, function(token){
        httpClient.requestToPath('/permissions/%s/%s', groupId, userId)
          .withMethod('POST')
          .withToken(token)
          .withJson(permissions)
          .whenStatusPassBody(200)
          .go(callback);
      });
    }
  }
};