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

module.exports = function(httpClient, tokenGetter, hostGetter) {
  pre.notNull(httpClient, 'Must provide an httpClient');
  pre.notNull(tokenGetter, 'Must provide a tokenGetter');
  pre.notNull(hostGetter, 'Must provide a hostGetter');

  httpClient = httpClient.withConfigOverrides({ hostGetter: hostGetter });

  return {
    userInGroup: function(userId, groupId, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/permissions/%s/%s', groupId, userId)
        .withToken(tokenGetter())
        .whenStatusPassBody(200)
        .whenStatusPassNull(404)
        .go(callback);
    },
    usersInGroup: function(groupId, callback) {
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/permissions/%s', groupId)
        .withToken(tokenGetter())
        .whenStatusPassBody(200)
        .go(callback);
    },
    groupsForUser: function(userId, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/permissions/group/%s', userId)
        .withToken(tokenGetter())
        .whenStatusPassBody(200)
        .go(callback);
    },
    setPermissions: function(userId, groupId, permissions, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/permissions/%s/%s', groupId, userId)
        .withMethod('POST')
        .withToken(tokenGetter())
        .withJson(permissions)
        .whenStatusPassBody(200)
        .go(callback);
    }
  }
};