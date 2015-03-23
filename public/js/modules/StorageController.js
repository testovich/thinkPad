var xhr = require('./xhr');
var Events = require('../../bower_components/simple-event-emitter/EventSystem');

var Storage = function () {
    this.notes = [];
    this.init();
};

Storage.prototype.init = function () {
    xhr.get(function (resp) {
        this.notes = resp;

        if (this.notes.length) {
            Events.publish('notes.init', this.notes, true);
            Events.publish('loader.hide');
        }
    }.bind(this));
};

Storage.prototype.getNote = function (key) {
    var note = this.notes.filter(function(note){
        return note.key === key;
    })[0];

    Events.publish('note.show', note);
};

Storage.prototype.removeNote = function (key) {
    xhr.post('remove', {key: key}, function (resp) {
        for (var i = 0; i < this.notes.length; i++) {
            if (this.notes[i].key === key) {
                this.notes.splice(i, 1);
                break;
            }
        }

        Events.publish('note.remove', this.notes);
        Events.publish('loader.hide');
    }.bind(this));
};

Storage.prototype.setNote = function (note) {
    xhr.post('add', note, function (resp) {
        this.notes.push({
            item:note,
            key:JSON.parse(resp).key
        });

        Events.publish('note.add', this.notes);
        Events.publish('loader.hide');
    }.bind(this));
};

Storage.prototype.getAll = function () {
    return this.notes;
};

window.Storage = new Storage();