import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Meteor.startup(function() {
  r = new Resumable({
    target: '/gridfs/fs/_resumable',
    generateUniqueIdentifier: function(file){ return `${new Mongo.ObjectID()}`; },
    fileParameterName: 'file',
    chunkSize: 2*1024*1024 - 1024,
    testChunks: true,
    testMethod: 'HEAD',
    permanentErrors: [204, 404, 415, 500, 501],
    simultaneousUploads: 3,
    maxFiles: undefined,
    maxFilesErrorCallback: undefined,
    prioritizeFirstAndLastChunk: false,
    query: undefined,
    headers: {},
    maxChunkRetries: 5,
    withCredentials: true,
  });
  r.on('fileAdded', function (file) {
      Meteor.call('fileInsert', file.uniqueIdentifier, file.fileName, file.file.type, function (error) {
        if (error) { return console.error("File creation failed!", error); }
        r.upload();
      });
  });  
});  

Template.home.rendered = function() {
  r.assignBrowse($("#someElement"));
}