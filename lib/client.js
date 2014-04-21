/*
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

      httpClient.requestToPath('/authorized/%s/%s', groupId, userId)
        .withToken(tokenGetter())
        .whenStatusParseJson(200)
        .go(callback);
    },
    usersInGroup: function(groupId, callback) {
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/authorized/%s', groupId)
        .withToken(tokenGetter())
        .whenStatusParseJson(200)
        .go(callback);
    },
    groupsForUser: function(userId, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/authorized/group/%s', userId)
        .withToken(tokenGetter())
        .whenStatusParseJson(200)
        .go(callback);
    },
    setPermissions: function(userId, groupId, permissions, callback) {
      pre.notNull(userId, 'Must provide a userId');
      pre.notNull(groupId, 'Must provide a groupId');
      pre.notNull(callback, 'Must provide a callback');

      httpClient.requestToPath('/authorized/%s/%s', groupId, userId)
        .withMethod('POST')
        .withToken(tokenGetter())
        .withJson(permissions)
        .whenStatusParseJson(200)
        .go(callback);
    }
  }
};