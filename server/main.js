import { Meteor } from 'meteor/meteor';
import { FileCollection } from 'meteor/vsivsi:file-collection'

myFiles = new FileCollection('myFiles',
  { resumable: true,   // Enable built-in resumable.js upload support
    http: [
      { method: 'get',
        path: '/:md5',  // this will be at route "/gridfs/myFiles/:md5"
        lookup: function (params, query) {  // uses express style url params
          return { md5: params.md5 };       // a query mapping url to myFiles
        }
      }
    ]
  }
);

myFiles.allow({
  insert() { return true; },
  write() { return true; },
  remove() { return true; },
  read() { return true; }
});

Meteor.methods({
  'fileInsert'(uniqueIdentifier, fileName, fileType){
    myFiles.insert({
      _id: uniqueIdentifier,  // This is the ID resumable will use
      filename: fileName,
      contentType: fileType
      });
  }
}); 