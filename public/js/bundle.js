(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/app.js":[function(require,module,exports){
//require('../public/js/modules/panels');
var NotesApp = require('./components/NotesApp');

// Enable touch
React.initializeTouchEvents(true);

React.render(
    React.createElement(NotesApp, null),
    document.getElementById('enter-point')
);
},{"./components/NotesApp":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/NotesApp.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/AddNote.js":[function(require,module,exports){
var xhr = require('../../public/js/modules/xhr');
var Events = require('../../public/bower_components/simple-event-emitter/EventSystem');


var AddForm = React.createClass({displayName: "AddForm",
    getInitialState: function() {
        return {
            isShow: false
        }
    },

    closeHandler: function(e){
       if(e) e.preventDefault();
        this.setState({
            isShow: false
        })
    },

    showHandler: function(){
        this.setState({
            isShow: true
        }, function(){
            React.findDOMNode(this.refs.name).focus();
        });
    },

    submitHandler: function (e) {
        e.preventDefault();

        var note = {
            name: this.refs.name.getDOMNode().value.trim() || 'Без названия от '+new Date().toDateString(),
            description: this.refs.note.getDOMNode().value.trim(),
            publish: new Date().getTime()
        };

        if(!note.description.length) {
            console.log('Недостаточно описания');
            return;
        }

        Events.publish('loader.show');

        this.setState({
            isShow: false
        });

        Storage.setNote(note);

        this.refs.name.getDOMNode().value = '';
        this.refs.note.getDOMNode().value = '';
    },

    render: function () {
        var cx = React.addons.classSet;
        var showState = cx({
            'is-hide': !this.state.isShow,
            'popup__form': true
        });
        return (
            React.createElement("section", {className: showState}, 
                React.createElement("header", {className: "popup__header unselectable"}, 
                    React.createElement("h3", null, "Новая запись"), 
                    React.createElement("a", {href: "#", className: "popup__close", onClick: this.closeHandler}, React.createElement("i", {className: "fa fa-times"}))
                ), 
                React.createElement("form", {className: "form", onSubmit: this.submitHandler}, 
                    React.createElement("div", null, 
                        React.createElement("label", {className: "form__label"}, "Название заметки:"), 
                        React.createElement("input", {type: "text", ref: "name", className: "form__name", placeholder: "Введите название"})
                    ), 
                    React.createElement("div", null, 
                        React.createElement("label", {className: "form__label"}, "Заметка:"), 
                        React.createElement("textarea", {type: "text", ref: "note", className: "form__description", placeholder: "С чего начинается родина?"})
                    ), 
                    React.createElement("div", {className: "text-right"}, 
                        React.createElement("button", {type: "submit", className: "form__submit"}, React.createElement("i", {className: "fa fa-paper-plane-o"}), " Сохранить")
                    )
                )
            )
        );
    }
});

var AddNote = React.createClass({displayName: "AddNote",
    clickHandler: function (e) {
        if(e) e.preventDefault();
        this.refs.form.showHandler();
    },

    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(AddForm, {ref: "form"}), 
                React.createElement("a", {href: "#", className: "note__add", onClick: this.clickHandler}, React.createElement("i", {className: "fa fa-paper-plane-o"}, " "))
            )
        );
    }
});

module.exports = AddNote;
},{"../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/bower_components/simple-event-emitter/EventSystem.js","../../public/js/modules/xhr":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/xhr.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/NotesApp.js":[function(require,module,exports){
var SidebarNav = require('./SidebarNav');
var SidebarInfo = require('./SidebarInfo');
var Main = require('./main/Main');
var AddNote = require('./AddNote');

require('../../public/js/modules/StorageController');

var NotesApp = React.createClass({displayName: "NotesApp",
    touchHandler: function () {
        var d = document.body;
        if(this.state.touchMove - this.state.touchStart > 10) {
            if(d.classList.contains('is--open-right')) {
                d.classList.remove('is--open-right');
                this.setState({touchEnd: false});
            }

            if(this.state.touchEnd) {
                d.classList.add('is--open');
            }
        }

        if(this.state.touchMove - this.state.touchStart < -10) {
            if(d.classList.contains('is--open')){
                d.classList.remove('is--open');
                this.setState({touchEnd: false});
            }

            if(this.state.touchEnd) {
                d.classList.add('is--open-right');
            }
        }
    },

    getInitialState: function () {
        return {
            touchStart: null,
            touchMove: null,
            touchEnd: false
        }
    },

    componentDidMount: function () {
        if(("ontouchstart" in window)){

            document.body.addEventListener('touchstart', function(e) {
                this.setState({touchStart:e.touches[0].clientX});
                this.setState({touchEnd: true});
            }.bind(this), false);

            document.body.addEventListener('touchend', function() {
                document.body.removeEventListener('touchmove', this, false);
            }, false);

            document.body.addEventListener('touchmove', function(e) {
                this.setState({touchMove:e.touches[0].clientX});
                this.touchHandler();
            }.bind(this), false);
        }
    },

    componentWillUnmount: function() {
        document.body.removeEventListener('touchmove', this, false);
    },

    render: function () {
        return (
            React.createElement("div", null, 
                 React.createElement(SidebarNav, null), 
                 React.createElement(Main, null), 
                 React.createElement(SidebarInfo, null), 
                 React.createElement(AddNote, null)
            )
        );
    }
});

module.exports = NotesApp;
},{"../../public/js/modules/StorageController":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/StorageController.js","./AddNote":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/AddNote.js","./SidebarInfo":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/SidebarInfo.js","./SidebarNav":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/SidebarNav.js","./main/Main":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/Main.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/SidebarInfo.js":[function(require,module,exports){
var Events = require('../../public/bower_components/simple-event-emitter/EventSystem');

var InfoHeader = React.createClass({displayName: "InfoHeader",
    close: function(e){
        e.preventDefault();
        var d = document.body;
        d.classList.remove('is--open-right');

        if(d.classList.contains('is--open')){
            d.classList.remove('is--open');
        }
    },

    render: function () {
        return (
            React.createElement("header", {className: "note__header"}, 
                React.createElement("a", {className: "note__close", onClick: this.close}, React.createElement("i", {className: "fa fa-times"})), 
                React.createElement("h3", null, this.props.header)

            )
        );
    }
});

var InfoDescription = React.createClass({displayName: "InfoDescription",
    render: function () {
        return (
            React.createElement("article", {className: "note__description"}, this.props.note)
        );
    }
});

var Info = React.createClass({displayName: "Info",
    getInitialState: function () {
        return {
            note: '',
            header: '',
            show:false
        }
    },

    componentDidMount: function() {
        Events.subscribe('note.show', function(obj){
            this.setState({
                note: obj.item.description,
                header: obj.item.name,
                show: document.body.classList.contains('is--open-right')
            });
        }.bind(this));
    },

    render: function () {
        return (
            React.createElement("aside", {className: "sidebar__info"}, 
                React.createElement("section", {className: "note"}, 
                    React.createElement(InfoHeader, {header: this.state.header}), 
                    React.createElement(InfoDescription, {note: this.state.note})
                )
            )
        );
    }
});

module.exports = Info;
},{"../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/bower_components/simple-event-emitter/EventSystem.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/SidebarNav.js":[function(require,module,exports){
var menu = {
    menu: [
        {
            name:'На сегодня',
            url: '#',
            ico: 'calendar-o'
        },
        {
            name:'На завтра',
            url: '#',
            ico: 'calendar'
        },
        {
            name:'Все заметки',
            url: '#',
            ico: 'database'
        }

    ],
    system: [
        {
            name:'Настройки',
            url: '#',
            ico: 'wrench'
        },
        {
            name:'Выход',
            url: '#',
            ico: 'sign-out'
        }
    ]
};

var NavItem = React.createClass({displayName: "NavItem",
    render: function() {
        var icoClass = 'fa fa-'+this.props.ico;
        return (
            React.createElement("li", {className: "menu__item"}, 
                React.createElement("a", {href: this.props.url, title: this.props.text, className: "menu__link"}, 
                    React.createElement("i", {className: icoClass}), " ", this.props.text
                )
            )
        );
    }
});

var NavList = React.createClass({displayName: "NavList",
    getNavItems: function (item, i) {
        return React.createElement(NavItem, {url: item.url, text: item.name, ico: item.ico, key: i})
    },

    render: function () {
        var items = this.props.menu.map(this.getNavItems);

        var ulClass = 'menu__list';
        if(this.props.separate) ulClass += ' menu__list--separete';

        return (
            React.createElement("ul", {className: ulClass}, 
                items
            )
        );
    }
});

 var Nav = React.createClass({displayName: "Nav",
    getInitialState: function () {
       return {
           menu: menu.menu,
           system: menu.system
       }
    },

    render: function () {
        return (
            React.createElement("aside", {className: "sidebar__nav"}, 
                React.createElement("nav", {className: "menu"}, 
                    React.createElement(NavList, {menu: this.state.menu}), 
                    React.createElement(NavList, {menu: this.state.system, separate: true})
                )
            )
        );
    }
});

module.exports = Nav;
},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/Main.js":[function(require,module,exports){
var Preloader = require('./Preloader');
var MainHead = require('./MainHead');
var Tasks = require('./Tasks');


var Main = React.createClass({displayName: "Main",
    render: function () {
        return (
            React.createElement("section", {className: "cabinet__main"}, 
                React.createElement(Preloader, null), 
                React.createElement(MainHead, null), 
                React.createElement(Tasks, null)
            )
        );
    }
});

module.exports = Main;
},{"./MainHead":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/MainHead.js","./Preloader":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/Preloader.js","./Tasks":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/Tasks.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/MainHead.js":[function(require,module,exports){
var MainHead = React.createClass({displayName: "MainHead",
    componentDidMount: function() {
        var dateEl = this.refs.date.getDOMNode(),
            timeEl = this.refs.time.getDOMNode(),
            now = new Date();


        dateEl.textContent = now.toDateString();
        timeEl.textContent = '/ ' + now.toTimeString().split(' ')[0];

        var timer = now.getTime();

        this.timer = setInterval(function () {
            timer += 1000;
            var time = new Date(timer);
            timeEl.textContent = '/ ' + time.toTimeString().split(' ')[0];
        },1000);
    },

    componentWillUnmount: function () {
        clearInterval(this.timer);
    },

    render: function() {
        return (
            React.createElement("header", {className: "cabinet__header unselectable"}, 
                React.createElement("h1", {className: "cabinet__h text--shadow"}, "Think ", React.createElement("i", {className: "fa fa-terminal"}), " Pad"), 
                React.createElement("dl", {className: "cabinet__today"}, 
                    React.createElement("dt", {className: "is-sx-hidden"}, "На дворе:"), 
                    React.createElement("dd", {ref: "date", className: "text--shadow"}), 
                    React.createElement("dd", {ref: "time", className: "is-sx-hidden text--shadow"})
                )
            )
        );
    }
});

module.exports = MainHead;
},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/Preloader.js":[function(require,module,exports){
var Events = require('../../../public/bower_components/simple-event-emitter/EventSystem');

var Preloader = React.createClass({displayName: "Preloader",
    getInitialState: function() {
        return {
            top: (window.innerHeight - 60)/2,
            isShow: true
        };
    },

    handleResize: function() {
        this.setState({top: (window.innerHeight -60)/2});
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);

        Events.subscribe('loader.show', function(){
            this.setState({
                isShow: true
            });
        }.bind(this));

        Events.subscribe('loader.hide', function(){
            this.setState({
                isShow: false
            });
        }.bind(this));
    },

    render: function () {
        var cx = React.addons.classSet;
        var showState = cx({
            'is-hide': !this.state.isShow,
            'preload__overlay': true,
            'unselectable': true
        });

        return (
            React.createElement("div", {className: showState}, 
                React.createElement("div", {className: "preload__loader", ref: "loader", style: {marginTop: this.state.top+'px'}})
            )
        );
    }
});

module.exports = Preloader;
},{"../../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/bower_components/simple-event-emitter/EventSystem.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/components/main/Tasks.js":[function(require,module,exports){
var xhr = require('../../../public/js/modules/xhr');
var Events = require('../../../public/bower_components/simple-event-emitter/EventSystem');
var getDate = require('../../../public/js/modules/date');




var TasksHead = React.createClass({displayName: "TasksHead",
    toggleHandler: function(e) {
        e.preventDefault();
        document.body.classList.toggle('is--open');
    },

    render: function() {
        return (
            React.createElement("div", {className: "tasks__header unselectable"}, 
                React.createElement("a", {className: "task__add", onClick: this.toggleHandler}, React.createElement("i", {className: "fa fa-bars"}))
            )
        );
    }
});

var TaskTableRow = React.createClass({displayName: "TaskTableRow",
    toggleHandler: function(e){
        e.preventDefault();
        var d = document.body;

        if(!d.classList.contains('is--open-right')){
            d.classList.toggle('is--open-right');
        }

        if(d.classList.contains('is--open')){
            d.classList.remove('is--open');
        }

        Storage.getNote(this.props.note.key);
    },

    removeHandler: function(e) {
        if(e) e.preventDefault();
        Storage.removeNote(this.props.note.key);
        Events.publish('loader.show');
    },

    componentDidMount: function (){
        var publish = this.refs.publish.getDOMNode();
        publish.textContent = getDate(this.props.note.item.publish);

        this.timer = setInterval(function(){
            publish.textContent = getDate(this.props.note.item.publish);
        }.bind(this),60000);
    },

    componentWillUnmount: function () {
        clearInterval(this.timer);
    },

    render: function(){
        return  (
         React.createElement("tr", {className: "task", key: this.props.key}, 
            React.createElement("td", {className: "task__item", "data-label": "Заметка:", "data-full": this.props.note.item.description, onClick: this.toggleHandler}, this.props.note.item.name), 
            React.createElement("td", {className: "task__date", "data-label": "Опубликовано:", ref: "publish", onClick: this.toggleHandler}), 
            React.createElement("td", {className: "task__btns", align: "right"}, React.createElement("a", {href: "#", onClick: this.removeHandler}, " ", React.createElement("i", {className: "fa fa-trash-o is-mx-hidden "})))
         ));
    }
});

var TaskTable = React.createClass({displayName: "TaskTable",
    getInitialState: function () {
        return {
            notes : [],
            header: null
        }
    },

    getTableRow: function(note, i) {
        return  React.createElement(TaskTableRow, {note: note, key: i})
    },

    componentDidMount: function () {
        if (this.isMounted()) {
            Events.subscribe('notes.init', function(notes){
                this.setState({
                    notes: notes
                });
            }.bind(this));

            Events.subscribe('note.add', function(notes){
                   this.setState({
                        notes: notes
                    });
            }.bind(this));

            Events.subscribe('note.remove', function(notes){
                this.setState({
                     notes: notes
                });
            }.bind(this));
        }
    },

    componentWillUnmount: function() {
        Events.clear();
    },

    render: function() {
        var rows = this.state.notes.map(this.getTableRow);
        return (
            React.createElement("div", {className: "tasks__w"}, 
                React.createElement("table", {className: "tasks__list"}, 
                    React.createElement("thead", null, 
                        React.createElement("tr", null, 
                            React.createElement("th", {className: "task__item--title text--shadow unselectable"}, "Мои циничные заметки"), 
                            React.createElement("th", {className: "task__date--title text--shadow unselectable"}, "Создано"), 
                            React.createElement("th", null)
                        )
                    ), 
                    React.createElement("tbody", null, 
                        rows
                    )
                )
            )
        );
    }
});

var Tasks = React.createClass({displayName: "Tasks",
    render: function() {
        return (
            React.createElement("section", {className: "tasks"}, 
                React.createElement(TasksHead, null), 
                React.createElement(TaskTable, null)
            )
        );
    }
});

module.exports = Tasks;
},{"../../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/bower_components/simple-event-emitter/EventSystem.js","../../../public/js/modules/date":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/date.js","../../../public/js/modules/xhr":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/xhr.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/bower_components/simple-event-emitter/EventSystem.js":[function(require,module,exports){
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.EventSystem = factory();
    }
}(this, function() {
    var self = this;

    self.queue = {};

    return {
        publish: function(event, data) {
            var actions = self.queue[event];

            if(!actions || !actions.length) return;

            actions.forEach(function(action, i){
                action.callback(data || {});
                if(action.flag) actions.splice(i,1);
            });
        },

        publishChain: function (events, args) {
            var actions = events.split(' ');

            actions.forEach(function(event, i){
                this.publish(event,args[i])
            }.bind(this));
        },

        subscribe: function(event, callback, once) {
           if (!self.queue[event]) self.queue[event] = [];

           var index = self.queue[event].push({
                flag: !!once,
                callback: callback
            });

            return {
                remove: function () {
                    delete self.queue[event][index];
                }
            }
        },

        clear: function () {
             self.queue = {};
        },

        list: function () {
            return Object.keys(self.queue).map(function(event){
                return {
                    name: event,
                    callbackCount:self.queue[event].length
                }
            });
        }
    }
}));

},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/StorageController.js":[function(require,module,exports){
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
},{"../../bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/bower_components/simple-event-emitter/EventSystem.js","./xhr":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/xhr.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/date.js":[function(require,module,exports){
module.exports = function(time) {
    var today = new Date(),
        timeStamp = new Date(parseInt(time)),
        timeString;

    var getWithTimezone = function (dateObj){
        var utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000* (new Date().getTimezoneOffset()/60)*-1)).getTime();
    };

    var todayTmp = getWithTimezone(today);
    var timeStampTmp = getWithTimezone(timeStamp);

    var dayToday = today.getDay(),
        dayTimestamp = timeStamp.getDay();

    var difference = todayTmp - timeStampTmp;

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24;

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60;

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60;

    var secondsDifference = Math.floor(difference/1000);

    if(daysDifference === 0 && hoursDifference < 1) {
        timeString = minutesDifference+' м '+secondsDifference+' с назад';
    }
    if(daysDifference === 0 && hoursDifference >= 1 && dayToday === dayTimestamp) {
        timeString = 'cегодня в ' + new Date(timeStampTmp).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    if((daysDifference === 1) || (daysDifference === 0 && hoursDifference >= 1 && dayToday !== dayTimestamp)) {
        timeString = 'вчера в ' + new Date(timeStampTmp).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    if(daysDifference > 0) {
        timeString = new Date(timeStampTmp).toLocaleString().split(' ').splice(0,2).join(' ');
    }

    return timeString;
};


},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/public/js/modules/xhr.js":[function(require,module,exports){
module.exports =  (function (){

    var options = {
        url: '/get',
        async: true,
        callback: function() {}
    },

    toParam = function (object) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    },

    extend = function (obj) {
        if (typeof obj !== "object") return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    return {
        get: function (cb, url) {
            if(cb && typeof cb === 'function') {
                options['callback'] = cb;
            }
            else {
                throw 'Callback не задан или имеет не верный тип данных'
            }

            if(url && typeof url === 'string') {
                options['url'] = url;
            }

            var xhr = new XMLHttpRequest();

            xhr.open('GET', options.url, options.async);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4 || xhr.status != 200) return;

                var resp = JSON.parse(xhr.responseText);

                options.callback(resp.data);
            };

            xhr.send(null);
        },
        post: function (url, data, cb){
            if(cb && typeof cb === 'function') {
                options['callback'] = cb;
            }
            else {
                throw 'Параметр Callback не задан или имеет не верный тип данных'
            }

            if(url && typeof url === 'string') {
                options['url'] = url;
            }
            else {
                throw 'Параметр url не задан или имеет не верный тип данных'
            }

            if(data && typeof data === 'object') {
                options['data'] = data;
            }
            else {
                throw 'Параметр data не задан или имеет не верный тип данных'
            }

            var xhr = new XMLHttpRequest();

            xhr.open('POST', '/'+options.url, options.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4 || xhr.status != 200) return;

                options.callback(xhr.responseText);
            };
            xhr.send(toParam(options.data));
        }
    }
})();
},{}]},{},["/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/thinkPad/app/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy90aGlua1BhZC9hcHAvYXBwLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy90aGlua1BhZC9hcHAvY29tcG9uZW50cy9BZGROb3RlLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy90aGlua1BhZC9hcHAvY29tcG9uZW50cy9Ob3Rlc0FwcC5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvdGhpbmtQYWQvYXBwL2NvbXBvbmVudHMvU2lkZWJhckluZm8uanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL3RoaW5rUGFkL2FwcC9jb21wb25lbnRzL1NpZGViYXJOYXYuanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL3RoaW5rUGFkL2FwcC9jb21wb25lbnRzL21haW4vTWFpbi5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvdGhpbmtQYWQvYXBwL2NvbXBvbmVudHMvbWFpbi9NYWluSGVhZC5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvdGhpbmtQYWQvYXBwL2NvbXBvbmVudHMvbWFpbi9QcmVsb2FkZXIuanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL3RoaW5rUGFkL2FwcC9jb21wb25lbnRzL21haW4vVGFza3MuanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL3RoaW5rUGFkL3B1YmxpYy9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1ldmVudC1lbWl0dGVyL0V2ZW50U3lzdGVtLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy90aGlua1BhZC9wdWJsaWMvanMvbW9kdWxlcy9TdG9yYWdlQ29udHJvbGxlci5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvdGhpbmtQYWQvcHVibGljL2pzL21vZHVsZXMvZGF0ZS5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvdGhpbmtQYWQvcHVibGljL2pzL21vZHVsZXMveGhyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vcmVxdWlyZSgnLi4vcHVibGljL2pzL21vZHVsZXMvcGFuZWxzJyk7XG52YXIgTm90ZXNBcHAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvTm90ZXNBcHAnKTtcblxuLy8gRW5hYmxlIHRvdWNoXG5SZWFjdC5pbml0aWFsaXplVG91Y2hFdmVudHModHJ1ZSk7XG5cblJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5vdGVzQXBwLCBudWxsKSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW50ZXItcG9pbnQnKVxuKTsiLCJ2YXIgeGhyID0gcmVxdWlyZSgnLi4vLi4vcHVibGljL2pzL21vZHVsZXMveGhyJyk7XG52YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vLi4vcHVibGljL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLWV2ZW50LWVtaXR0ZXIvRXZlbnRTeXN0ZW0nKTtcblxuXG52YXIgQWRkRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBZGRGb3JtXCIsXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzU2hvdzogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGUpe1xuICAgICAgIGlmKGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc1Nob3c6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIHNob3dIYW5kbGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzU2hvdzogdHJ1ZVxuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLm5hbWUpLmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpIHx8ICfQkdC10Lcg0L3QsNC30LLQsNC90LjRjyDQvtGCICcrbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLnJlZnMubm90ZS5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpLFxuICAgICAgICAgICAgcHVibGlzaDogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfTtcblxuICAgICAgICBpZighbm90ZS5kZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC10LTQvtGB0YLQsNGC0L7Rh9C90L4g0L7Qv9C40YHQsNC90LjRjycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgRXZlbnRzLnB1Ymxpc2goJ2xvYWRlci5zaG93Jyk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc1Nob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFN0b3JhZ2Uuc2V0Tm90ZShub3RlKTtcblxuICAgICAgICB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5yZWZzLm5vdGUuZ2V0RE9NTm9kZSgpLnZhbHVlID0gJyc7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3ggPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQ7XG4gICAgICAgIHZhciBzaG93U3RhdGUgPSBjeCh7XG4gICAgICAgICAgICAnaXMtaGlkZSc6ICF0aGlzLnN0YXRlLmlzU2hvdyxcbiAgICAgICAgICAgICdwb3B1cF9fZm9ybSc6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic2VjdGlvblwiLCB7Y2xhc3NOYW1lOiBzaG93U3RhdGV9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaGVhZGVyXCIsIHtjbGFzc05hbWU6IFwicG9wdXBfX2hlYWRlciB1bnNlbGVjdGFibGVcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDNcIiwgbnVsbCwgXCLQndC+0LLQsNGPINC30LDQv9C40YHRjFwiKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiBcIiNcIiwgY2xhc3NOYW1lOiBcInBvcHVwX19jbG9zZVwiLCBvbkNsaWNrOiB0aGlzLmNsb3NlSGFuZGxlcn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IFwiZmEgZmEtdGltZXNcIn0pKVxuICAgICAgICAgICAgICAgICksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHtjbGFzc05hbWU6IFwiZm9ybVwiLCBvblN1Ym1pdDogdGhpcy5zdWJtaXRIYW5kbGVyfSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge2NsYXNzTmFtZTogXCJmb3JtX19sYWJlbFwifSwgXCLQndCw0LfQstCw0L3QuNC1INC30LDQvNC10YLQutC4OlwiKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwidGV4dFwiLCByZWY6IFwibmFtZVwiLCBjbGFzc05hbWU6IFwiZm9ybV9fbmFtZVwiLCBwbGFjZWhvbGRlcjogXCLQktCy0LXQtNC40YLQtSDQvdCw0LfQstCw0L3QuNC1XCJ9KVxuICAgICAgICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7Y2xhc3NOYW1lOiBcImZvcm1fX2xhYmVsXCJ9LCBcItCX0LDQvNC10YLQutCwOlwiKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIiwge3R5cGU6IFwidGV4dFwiLCByZWY6IFwibm90ZVwiLCBjbGFzc05hbWU6IFwiZm9ybV9fZGVzY3JpcHRpb25cIiwgcGxhY2Vob2xkZXI6IFwi0KEg0YfQtdCz0L4g0L3QsNGH0LjQvdCw0LXRgtGB0Y8g0YDQvtC00LjQvdCwP1wifSlcbiAgICAgICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZXh0LXJpZ2h0XCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge3R5cGU6IFwic3VibWl0XCIsIGNsYXNzTmFtZTogXCJmb3JtX19zdWJtaXRcIn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IFwiZmEgZmEtcGFwZXItcGxhbmUtb1wifSksIFwiINCh0L7RhdGA0LDQvdC40YLRjFwiKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgQWRkTm90ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBZGROb3RlXCIsXG4gICAgY2xpY2tIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZihlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMucmVmcy5mb3JtLnNob3dIYW5kbGVyKCk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWRkRm9ybSwge3JlZjogXCJmb3JtXCJ9KSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IFwiI1wiLCBjbGFzc05hbWU6IFwibm90ZV9fYWRkXCIsIG9uQ2xpY2s6IHRoaXMuY2xpY2tIYW5kbGVyfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS1wYXBlci1wbGFuZS1vXCJ9LCBcIiBcIikpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWRkTm90ZTsiLCJ2YXIgU2lkZWJhck5hdiA9IHJlcXVpcmUoJy4vU2lkZWJhck5hdicpO1xudmFyIFNpZGViYXJJbmZvID0gcmVxdWlyZSgnLi9TaWRlYmFySW5mbycpO1xudmFyIE1haW4gPSByZXF1aXJlKCcuL21haW4vTWFpbicpO1xudmFyIEFkZE5vdGUgPSByZXF1aXJlKCcuL0FkZE5vdGUnKTtcblxucmVxdWlyZSgnLi4vLi4vcHVibGljL2pzL21vZHVsZXMvU3RvcmFnZUNvbnRyb2xsZXInKTtcblxudmFyIE5vdGVzQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk5vdGVzQXBwXCIsXG4gICAgdG91Y2hIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgaWYodGhpcy5zdGF0ZS50b3VjaE1vdmUgLSB0aGlzLnN0YXRlLnRvdWNoU3RhcnQgPiAxMCkge1xuICAgICAgICAgICAgaWYoZC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLS1vcGVuLXJpZ2h0JykpIHtcbiAgICAgICAgICAgICAgICBkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1vcGVuLXJpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dG91Y2hFbmQ6IGZhbHNlfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUudG91Y2hFbmQpIHtcbiAgICAgICAgICAgICAgICBkLmNsYXNzTGlzdC5hZGQoJ2lzLS1vcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLnN0YXRlLnRvdWNoTW92ZSAtIHRoaXMuc3RhdGUudG91Y2hTdGFydCA8IC0xMCkge1xuICAgICAgICAgICAgaWYoZC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLS1vcGVuJykpe1xuICAgICAgICAgICAgICAgIGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtLW9wZW4nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt0b3VjaEVuZDogZmFsc2V9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS50b3VjaEVuZCkge1xuICAgICAgICAgICAgICAgIGQuY2xhc3NMaXN0LmFkZCgnaXMtLW9wZW4tcmlnaHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvdWNoU3RhcnQ6IG51bGwsXG4gICAgICAgICAgICB0b3VjaE1vdmU6IG51bGwsXG4gICAgICAgICAgICB0b3VjaEVuZDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZigoXCJvbnRvdWNoc3RhcnRcIiBpbiB3aW5kb3cpKXtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3RvdWNoU3RhcnQ6ZS50b3VjaGVzWzBdLmNsaWVudFh9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt0b3VjaEVuZDogdHJ1ZX0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dG91Y2hNb3ZlOmUudG91Y2hlc1swXS5jbGllbnRYfSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaEhhbmRsZXIoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTaWRlYmFyTmF2LCBudWxsKSwgXG4gICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpbiwgbnVsbCksIFxuICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNpZGViYXJJbmZvLCBudWxsKSwgXG4gICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWRkTm90ZSwgbnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb3Rlc0FwcDsiLCJ2YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vLi4vcHVibGljL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLWV2ZW50LWVtaXR0ZXIvRXZlbnRTeXN0ZW0nKTtcblxudmFyIEluZm9IZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSW5mb0hlYWRlclwiLFxuICAgIGNsb3NlOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZCA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtLW9wZW4tcmlnaHQnKTtcblxuICAgICAgICBpZihkLmNsYXNzTGlzdC5jb250YWlucygnaXMtLW9wZW4nKSl7XG4gICAgICAgICAgICBkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1vcGVuJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaGVhZGVyXCIsIHtjbGFzc05hbWU6IFwibm90ZV9faGVhZGVyXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcIm5vdGVfX2Nsb3NlXCIsIG9uQ2xpY2s6IHRoaXMuY2xvc2V9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLXRpbWVzXCJ9KSksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCB0aGlzLnByb3BzLmhlYWRlcilcblxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgSW5mb0Rlc2NyaXB0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkluZm9EZXNjcmlwdGlvblwiLFxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFydGljbGVcIiwge2NsYXNzTmFtZTogXCJub3RlX19kZXNjcmlwdGlvblwifSwgdGhpcy5wcm9wcy5ub3RlKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgSW5mbyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJbmZvXCIsXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub3RlOiAnJyxcbiAgICAgICAgICAgIGhlYWRlcjogJycsXG4gICAgICAgICAgICBzaG93OmZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBFdmVudHMuc3Vic2NyaWJlKCdub3RlLnNob3cnLCBmdW5jdGlvbihvYmope1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgbm90ZTogb2JqLml0ZW0uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgaGVhZGVyOiBvYmouaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgIHNob3c6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy0tb3Blbi1yaWdodCcpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXNpZGVcIiwge2NsYXNzTmFtZTogXCJzaWRlYmFyX19pbmZvXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic2VjdGlvblwiLCB7Y2xhc3NOYW1lOiBcIm5vdGVcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZm9IZWFkZXIsIHtoZWFkZXI6IHRoaXMuc3RhdGUuaGVhZGVyfSksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZm9EZXNjcmlwdGlvbiwge25vdGU6IHRoaXMuc3RhdGUubm90ZX0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZm87IiwidmFyIG1lbnUgPSB7XG4gICAgbWVudTogW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOifQndCwINGB0LXQs9C+0LTQvdGPJyxcbiAgICAgICAgICAgIHVybDogJyMnLFxuICAgICAgICAgICAgaWNvOiAnY2FsZW5kYXItbydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTon0J3QsCDQt9Cw0LLRgtGA0LAnLFxuICAgICAgICAgICAgdXJsOiAnIycsXG4gICAgICAgICAgICBpY286ICdjYWxlbmRhcidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTon0JLRgdC1INC30LDQvNC10YLQutC4JyxcbiAgICAgICAgICAgIHVybDogJyMnLFxuICAgICAgICAgICAgaWNvOiAnZGF0YWJhc2UnXG4gICAgICAgIH1cblxuICAgIF0sXG4gICAgc3lzdGVtOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6J9Cd0LDRgdGC0YDQvtC50LrQuCcsXG4gICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgIGljbzogJ3dyZW5jaCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTon0JLRi9GF0L7QtCcsXG4gICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgIGljbzogJ3NpZ24tb3V0J1xuICAgICAgICB9XG4gICAgXVxufTtcblxudmFyIE5hdkl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTmF2SXRlbVwiLFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpY29DbGFzcyA9ICdmYSBmYS0nK3RoaXMucHJvcHMuaWNvO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwibWVudV9faXRlbVwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0aXRsZTogdGhpcy5wcm9wcy50ZXh0LCBjbGFzc05hbWU6IFwibWVudV9fbGlua1wifSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IGljb0NsYXNzfSksIFwiIFwiLCB0aGlzLnByb3BzLnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBOYXZMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk5hdkxpc3RcIixcbiAgICBnZXROYXZJdGVtczogZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2SXRlbSwge3VybDogaXRlbS51cmwsIHRleHQ6IGl0ZW0ubmFtZSwgaWNvOiBpdGVtLmljbywga2V5OiBpfSlcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMucHJvcHMubWVudS5tYXAodGhpcy5nZXROYXZJdGVtcyk7XG5cbiAgICAgICAgdmFyIHVsQ2xhc3MgPSAnbWVudV9fbGlzdCc7XG4gICAgICAgIGlmKHRoaXMucHJvcHMuc2VwYXJhdGUpIHVsQ2xhc3MgKz0gJyBtZW51X19saXN0LS1zZXBhcmV0ZSc7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiB1bENsYXNzfSwgXG4gICAgICAgICAgICAgICAgaXRlbXNcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxuIHZhciBOYXYgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTmF2XCIsXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgbWVudTogbWVudS5tZW51LFxuICAgICAgICAgICBzeXN0ZW06IG1lbnUuc3lzdGVtXG4gICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhc2lkZVwiLCB7Y2xhc3NOYW1lOiBcInNpZGViYXJfX25hdlwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCB7Y2xhc3NOYW1lOiBcIm1lbnVcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkxpc3QsIHttZW51OiB0aGlzLnN0YXRlLm1lbnV9KSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2TGlzdCwge21lbnU6IHRoaXMuc3RhdGUuc3lzdGVtLCBzZXBhcmF0ZTogdHJ1ZX0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdjsiLCJ2YXIgUHJlbG9hZGVyID0gcmVxdWlyZSgnLi9QcmVsb2FkZXInKTtcbnZhciBNYWluSGVhZCA9IHJlcXVpcmUoJy4vTWFpbkhlYWQnKTtcbnZhciBUYXNrcyA9IHJlcXVpcmUoJy4vVGFza3MnKTtcblxuXG52YXIgTWFpbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNYWluXCIsXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic2VjdGlvblwiLCB7Y2xhc3NOYW1lOiBcImNhYmluZXRfX21haW5cIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJlbG9hZGVyLCBudWxsKSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWluSGVhZCwgbnVsbCksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFza3MsIG51bGwpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbjsiLCJ2YXIgTWFpbkhlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTWFpbkhlYWRcIixcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlRWwgPSB0aGlzLnJlZnMuZGF0ZS5nZXRET01Ob2RlKCksXG4gICAgICAgICAgICB0aW1lRWwgPSB0aGlzLnJlZnMudGltZS5nZXRET01Ob2RlKCksXG4gICAgICAgICAgICBub3cgPSBuZXcgRGF0ZSgpO1xuXG5cbiAgICAgICAgZGF0ZUVsLnRleHRDb250ZW50ID0gbm93LnRvRGF0ZVN0cmluZygpO1xuICAgICAgICB0aW1lRWwudGV4dENvbnRlbnQgPSAnLyAnICsgbm93LnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMF07XG5cbiAgICAgICAgdmFyIHRpbWVyID0gbm93LmdldFRpbWUoKTtcblxuICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGltZXIgKz0gMTAwMDtcbiAgICAgICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUodGltZXIpO1xuICAgICAgICAgICAgdGltZUVsLnRleHRDb250ZW50ID0gJy8gJyArIHRpbWUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgfSwxMDAwKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoZWFkZXJcIiwge2NsYXNzTmFtZTogXCJjYWJpbmV0X19oZWFkZXIgdW5zZWxlY3RhYmxlXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2NsYXNzTmFtZTogXCJjYWJpbmV0X19oIHRleHQtLXNoYWRvd1wifSwgXCJUaGluayBcIiwgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS10ZXJtaW5hbFwifSksIFwiIFBhZFwiKSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRsXCIsIHtjbGFzc05hbWU6IFwiY2FiaW5ldF9fdG9kYXlcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZHRcIiwge2NsYXNzTmFtZTogXCJpcy1zeC1oaWRkZW5cIn0sIFwi0J3QsCDQtNCy0L7RgNC1OlwiKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkZFwiLCB7cmVmOiBcImRhdGVcIiwgY2xhc3NOYW1lOiBcInRleHQtLXNoYWRvd1wifSksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGRcIiwge3JlZjogXCJ0aW1lXCIsIGNsYXNzTmFtZTogXCJpcy1zeC1oaWRkZW4gdGV4dC0tc2hhZG93XCJ9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYWluSGVhZDsiLCJ2YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vLi4vLi4vcHVibGljL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLWV2ZW50LWVtaXR0ZXIvRXZlbnRTeXN0ZW0nKTtcblxudmFyIFByZWxvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJQcmVsb2FkZXJcIixcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiAod2luZG93LmlubmVySGVpZ2h0IC0gNjApLzIsXG4gICAgICAgICAgICBpc1Nob3c6IHRydWVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaGFuZGxlUmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dG9wOiAod2luZG93LmlubmVySGVpZ2h0IC02MCkvMn0pO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG5cbiAgICAgICAgRXZlbnRzLnN1YnNjcmliZSgnbG9hZGVyLnNob3cnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNTaG93OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICBFdmVudHMuc3Vic2NyaWJlKCdsb2FkZXIuaGlkZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc1Nob3c6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjeCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldDtcbiAgICAgICAgdmFyIHNob3dTdGF0ZSA9IGN4KHtcbiAgICAgICAgICAgICdpcy1oaWRlJzogIXRoaXMuc3RhdGUuaXNTaG93LFxuICAgICAgICAgICAgJ3ByZWxvYWRfX292ZXJsYXknOiB0cnVlLFxuICAgICAgICAgICAgJ3Vuc2VsZWN0YWJsZSc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogc2hvd1N0YXRlfSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByZWxvYWRfX2xvYWRlclwiLCByZWY6IFwibG9hZGVyXCIsIHN0eWxlOiB7bWFyZ2luVG9wOiB0aGlzLnN0YXRlLnRvcCsncHgnfX0pXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZGVyOyIsInZhciB4aHIgPSByZXF1aXJlKCcuLi8uLi8uLi9wdWJsaWMvanMvbW9kdWxlcy94aHInKTtcbnZhciBFdmVudHMgPSByZXF1aXJlKCcuLi8uLi8uLi9wdWJsaWMvYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtZXZlbnQtZW1pdHRlci9FdmVudFN5c3RlbScpO1xudmFyIGdldERhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi9wdWJsaWMvanMvbW9kdWxlcy9kYXRlJyk7XG5cblxuXG5cbnZhciBUYXNrc0hlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGFza3NIZWFkXCIsXG4gICAgdG9nZ2xlSGFuZGxlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtLW9wZW4nKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0YXNrc19faGVhZGVyIHVuc2VsZWN0YWJsZVwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJ0YXNrX19hZGRcIiwgb25DbGljazogdGhpcy50b2dnbGVIYW5kbGVyfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS1iYXJzXCJ9KSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIFRhc2tUYWJsZVJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUYXNrVGFibGVSb3dcIixcbiAgICB0b2dnbGVIYW5kbGVyOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZCA9IGRvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgaWYoIWQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy0tb3Blbi1yaWdodCcpKXtcbiAgICAgICAgICAgIGQuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtLW9wZW4tcmlnaHQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy0tb3BlbicpKXtcbiAgICAgICAgICAgIGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtLW9wZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFN0b3JhZ2UuZ2V0Tm90ZSh0aGlzLnByb3BzLm5vdGUua2V5KTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlSGFuZGxlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZihlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFN0b3JhZ2UucmVtb3ZlTm90ZSh0aGlzLnByb3BzLm5vdGUua2V5KTtcbiAgICAgICAgRXZlbnRzLnB1Ymxpc2goJ2xvYWRlci5zaG93Jyk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgdmFyIHB1Ymxpc2ggPSB0aGlzLnJlZnMucHVibGlzaC5nZXRET01Ob2RlKCk7XG4gICAgICAgIHB1Ymxpc2gudGV4dENvbnRlbnQgPSBnZXREYXRlKHRoaXMucHJvcHMubm90ZS5pdGVtLnB1Ymxpc2gpO1xuXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgcHVibGlzaC50ZXh0Q29udGVudCA9IGdldERhdGUodGhpcy5wcm9wcy5ub3RlLml0ZW0ucHVibGlzaCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSw2MDAwMCk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICAoXG4gICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge2NsYXNzTmFtZTogXCJ0YXNrXCIsIGtleTogdGhpcy5wcm9wcy5rZXl9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7Y2xhc3NOYW1lOiBcInRhc2tfX2l0ZW1cIiwgXCJkYXRhLWxhYmVsXCI6IFwi0JfQsNC80LXRgtC60LA6XCIsIFwiZGF0YS1mdWxsXCI6IHRoaXMucHJvcHMubm90ZS5pdGVtLmRlc2NyaXB0aW9uLCBvbkNsaWNrOiB0aGlzLnRvZ2dsZUhhbmRsZXJ9LCB0aGlzLnByb3BzLm5vdGUuaXRlbS5uYW1lKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2NsYXNzTmFtZTogXCJ0YXNrX19kYXRlXCIsIFwiZGF0YS1sYWJlbFwiOiBcItCe0L/Rg9Cx0LvQuNC60L7QstCw0L3QvjpcIiwgcmVmOiBcInB1Ymxpc2hcIiwgb25DbGljazogdGhpcy50b2dnbGVIYW5kbGVyfSksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IFwidGFza19fYnRuc1wiLCBhbGlnbjogXCJyaWdodFwifSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLnJlbW92ZUhhbmRsZXJ9LCBcIiBcIiwgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS10cmFzaC1vIGlzLW14LWhpZGRlbiBcIn0pKSlcbiAgICAgICAgICkpO1xuICAgIH1cbn0pO1xuXG52YXIgVGFza1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRhc2tUYWJsZVwiLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm90ZXMgOiBbXSxcbiAgICAgICAgICAgIGhlYWRlcjogbnVsbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFRhYmxlUm93OiBmdW5jdGlvbihub3RlLCBpKSB7XG4gICAgICAgIHJldHVybiAgUmVhY3QuY3JlYXRlRWxlbWVudChUYXNrVGFibGVSb3csIHtub3RlOiBub3RlLCBrZXk6IGl9KVxuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgICAgICAgRXZlbnRzLnN1YnNjcmliZSgnbm90ZXMuaW5pdCcsIGZ1bmN0aW9uKG5vdGVzKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbm90ZXM6IG5vdGVzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBFdmVudHMuc3Vic2NyaWJlKCdub3RlLmFkZCcsIGZ1bmN0aW9uKG5vdGVzKXtcbiAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBub3Rlc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIEV2ZW50cy5zdWJzY3JpYmUoJ25vdGUucmVtb3ZlJywgZnVuY3Rpb24obm90ZXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IG5vdGVzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgRXZlbnRzLmNsZWFyKCk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByb3dzID0gdGhpcy5zdGF0ZS5ub3Rlcy5tYXAodGhpcy5nZXRUYWJsZVJvdyk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGFza3NfX3dcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7Y2xhc3NOYW1lOiBcInRhc2tzX19saXN0XCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7Y2xhc3NOYW1lOiBcInRhc2tfX2l0ZW0tLXRpdGxlIHRleHQtLXNoYWRvdyB1bnNlbGVjdGFibGVcIn0sIFwi0JzQvtC4INGG0LjQvdC40YfQvdGL0LUg0LfQsNC80LXRgtC60LhcIiksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7Y2xhc3NOYW1lOiBcInRhc2tfX2RhdGUtLXRpdGxlIHRleHQtLXNoYWRvdyB1bnNlbGVjdGFibGVcIn0sIFwi0KHQvtC30LTQsNC90L5cIiksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgVGFza3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGFza3NcIixcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIiwge2NsYXNzTmFtZTogXCJ0YXNrc1wifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYXNrc0hlYWQsIG51bGwpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhc2tUYWJsZSwgbnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrczsiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LkV2ZW50U3lzdGVtID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5xdWV1ZSA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHVibGlzaDogZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpb25zID0gc2VsZi5xdWV1ZVtldmVudF07XG5cbiAgICAgICAgICAgIGlmKCFhY3Rpb25zIHx8ICFhY3Rpb25zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oYWN0aW9uLCBpKXtcbiAgICAgICAgICAgICAgICBhY3Rpb24uY2FsbGJhY2soZGF0YSB8fCB7fSk7XG4gICAgICAgICAgICAgICAgaWYoYWN0aW9uLmZsYWcpIGFjdGlvbnMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBwdWJsaXNoQ2hhaW46IGZ1bmN0aW9uIChldmVudHMsIGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpb25zID0gZXZlbnRzLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihldmVudCwgaSl7XG4gICAgICAgICAgICAgICAgdGhpcy5wdWJsaXNoKGV2ZW50LGFyZ3NbaV0pXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24oZXZlbnQsIGNhbGxiYWNrLCBvbmNlKSB7XG4gICAgICAgICAgIGlmICghc2VsZi5xdWV1ZVtldmVudF0pIHNlbGYucXVldWVbZXZlbnRdID0gW107XG5cbiAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZi5xdWV1ZVtldmVudF0ucHVzaCh7XG4gICAgICAgICAgICAgICAgZmxhZzogISFvbmNlLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLnF1ZXVlW2V2ZW50XVtpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgc2VsZi5xdWV1ZSA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhzZWxmLnF1ZXVlKS5tYXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0NvdW50OnNlbGYucXVldWVbZXZlbnRdLmxlbmd0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkpO1xuIiwidmFyIHhociA9IHJlcXVpcmUoJy4veGhyJyk7XG52YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtZXZlbnQtZW1pdHRlci9FdmVudFN5c3RlbScpO1xuXG52YXIgU3RvcmFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5vdGVzID0gW107XG4gICAgdGhpcy5pbml0KCk7XG59O1xuXG5TdG9yYWdlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHhoci5nZXQoZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgdGhpcy5ub3RlcyA9IHJlc3A7XG5cbiAgICAgICAgaWYgKHRoaXMubm90ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBFdmVudHMucHVibGlzaCgnbm90ZXMuaW5pdCcsIHRoaXMubm90ZXMsIHRydWUpO1xuICAgICAgICAgICAgRXZlbnRzLnB1Ymxpc2goJ2xvYWRlci5oaWRlJyk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuU3RvcmFnZS5wcm90b3R5cGUuZ2V0Tm90ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgbm90ZSA9IHRoaXMubm90ZXMuZmlsdGVyKGZ1bmN0aW9uKG5vdGUpe1xuICAgICAgICByZXR1cm4gbm90ZS5rZXkgPT09IGtleTtcbiAgICB9KVswXTtcblxuICAgIEV2ZW50cy5wdWJsaXNoKCdub3RlLnNob3cnLCBub3RlKTtcbn07XG5cblN0b3JhZ2UucHJvdG90eXBlLnJlbW92ZU5vdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgeGhyLnBvc3QoJ3JlbW92ZScsIHtrZXk6IGtleX0sIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub3Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubm90ZXNbaV0ua2V5ID09PSBrZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIEV2ZW50cy5wdWJsaXNoKCdub3RlLnJlbW92ZScsIHRoaXMubm90ZXMpO1xuICAgICAgICBFdmVudHMucHVibGlzaCgnbG9hZGVyLmhpZGUnKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuU3RvcmFnZS5wcm90b3R5cGUuc2V0Tm90ZSA9IGZ1bmN0aW9uIChub3RlKSB7XG4gICAgeGhyLnBvc3QoJ2FkZCcsIG5vdGUsIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgIHRoaXMubm90ZXMucHVzaCh7XG4gICAgICAgICAgICBpdGVtOm5vdGUsXG4gICAgICAgICAgICBrZXk6SlNPTi5wYXJzZShyZXNwKS5rZXlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRXZlbnRzLnB1Ymxpc2goJ25vdGUuYWRkJywgdGhpcy5ub3Rlcyk7XG4gICAgICAgIEV2ZW50cy5wdWJsaXNoKCdsb2FkZXIuaGlkZScpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5TdG9yYWdlLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubm90ZXM7XG59O1xuXG53aW5kb3cuU3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKSxcbiAgICAgICAgdGltZVN0YW1wID0gbmV3IERhdGUocGFyc2VJbnQodGltZSkpLFxuICAgICAgICB0aW1lU3RyaW5nO1xuXG4gICAgdmFyIGdldFdpdGhUaW1lem9uZSA9IGZ1bmN0aW9uIChkYXRlT2JqKXtcbiAgICAgICAgdmFyIHV0YyA9IGRhdGVPYmouZ2V0VGltZSgpICsgKGRhdGVPYmouZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKTtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHV0YyArICgzNjAwMDAwKiAobmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLzYwKSotMSkpLmdldFRpbWUoKTtcbiAgICB9O1xuXG4gICAgdmFyIHRvZGF5VG1wID0gZ2V0V2l0aFRpbWV6b25lKHRvZGF5KTtcbiAgICB2YXIgdGltZVN0YW1wVG1wID0gZ2V0V2l0aFRpbWV6b25lKHRpbWVTdGFtcCk7XG5cbiAgICB2YXIgZGF5VG9kYXkgPSB0b2RheS5nZXREYXkoKSxcbiAgICAgICAgZGF5VGltZXN0YW1wID0gdGltZVN0YW1wLmdldERheSgpO1xuXG4gICAgdmFyIGRpZmZlcmVuY2UgPSB0b2RheVRtcCAtIHRpbWVTdGFtcFRtcDtcblxuICAgIHZhciBkYXlzRGlmZmVyZW5jZSA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZS8xMDAwLzYwLzYwLzI0KTtcbiAgICBkaWZmZXJlbmNlIC09IGRheXNEaWZmZXJlbmNlKjEwMDAqNjAqNjAqMjQ7XG5cbiAgICB2YXIgaG91cnNEaWZmZXJlbmNlID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlLzEwMDAvNjAvNjApO1xuICAgIGRpZmZlcmVuY2UgLT0gaG91cnNEaWZmZXJlbmNlKjEwMDAqNjAqNjA7XG5cbiAgICB2YXIgbWludXRlc0RpZmZlcmVuY2UgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2UvMTAwMC82MCk7XG4gICAgZGlmZmVyZW5jZSAtPSBtaW51dGVzRGlmZmVyZW5jZSoxMDAwKjYwO1xuXG4gICAgdmFyIHNlY29uZHNEaWZmZXJlbmNlID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlLzEwMDApO1xuXG4gICAgaWYoZGF5c0RpZmZlcmVuY2UgPT09IDAgJiYgaG91cnNEaWZmZXJlbmNlIDwgMSkge1xuICAgICAgICB0aW1lU3RyaW5nID0gbWludXRlc0RpZmZlcmVuY2UrJyDQvCAnK3NlY29uZHNEaWZmZXJlbmNlKycg0YEg0L3QsNC30LDQtCc7XG4gICAgfVxuICAgIGlmKGRheXNEaWZmZXJlbmNlID09PSAwICYmIGhvdXJzRGlmZmVyZW5jZSA+PSAxICYmIGRheVRvZGF5ID09PSBkYXlUaW1lc3RhbXApIHtcbiAgICAgICAgdGltZVN0cmluZyA9ICdj0LXQs9C+0LTQvdGPINCyICcgKyBuZXcgRGF0ZSh0aW1lU3RhbXBUbXApLnRvVGltZVN0cmluZygpLnJlcGxhY2UoLy4qKFxcZHsyfTpcXGR7Mn06XFxkezJ9KS4qLywgXCIkMVwiKTtcbiAgICB9XG5cbiAgICBpZigoZGF5c0RpZmZlcmVuY2UgPT09IDEpIHx8IChkYXlzRGlmZmVyZW5jZSA9PT0gMCAmJiBob3Vyc0RpZmZlcmVuY2UgPj0gMSAmJiBkYXlUb2RheSAhPT0gZGF5VGltZXN0YW1wKSkge1xuICAgICAgICB0aW1lU3RyaW5nID0gJ9Cy0YfQtdGA0LAg0LIgJyArIG5ldyBEYXRlKHRpbWVTdGFtcFRtcCkudG9UaW1lU3RyaW5nKCkucmVwbGFjZSgvLiooXFxkezJ9OlxcZHsyfTpcXGR7Mn0pLiovLCBcIiQxXCIpO1xuICAgIH1cblxuICAgIGlmKGRheXNEaWZmZXJlbmNlID4gMCkge1xuICAgICAgICB0aW1lU3RyaW5nID0gbmV3IERhdGUodGltZVN0YW1wVG1wKS50b0xvY2FsZVN0cmluZygpLnNwbGl0KCcgJykuc3BsaWNlKDAsMikuam9pbignICcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aW1lU3RyaW5nO1xufTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSAgKGZ1bmN0aW9uICgpe1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHVybDogJy9nZXQnLFxuICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cbiAgICB9LFxuXG4gICAgdG9QYXJhbSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgdmFyIGVuY29kZWRTdHJpbmcgPSAnJztcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZW5jb2RlZFN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuY29kZWRTdHJpbmcgKz0gJyYnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbmNvZGVkU3RyaW5nICs9IGVuY29kZVVSSShwcm9wICsgJz0nICsgb2JqZWN0W3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW5jb2RlZFN0cmluZztcbiAgICB9LFxuXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG9iajtcbiAgICAgICAgdmFyIHNvdXJjZSwgcHJvcDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yIChwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjYiwgdXJsKSB7XG4gICAgICAgICAgICBpZihjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zWydjYWxsYmFjayddID0gY2I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sg0L3QtSDQt9Cw0LTQsNC9INC40LvQuCDQuNC80LXQtdGCINC90LUg0LLQtdGA0L3Ri9C5INGC0LjQvyDQtNCw0L3QvdGL0YUnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHVybCAmJiB0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbJ3VybCddID0gdXJsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBvcHRpb25zLnVybCwgb3B0aW9ucy5hc3luYyk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCB8fCB4aHIuc3RhdHVzICE9IDIwMCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayhyZXNwLmRhdGEpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNiKXtcbiAgICAgICAgICAgIGlmKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbJ2NhbGxiYWNrJ10gPSBjYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93ICfQn9Cw0YDQsNC80LXRgtGAIENhbGxiYWNrINC90LUg0LfQsNC00LDQvSDQuNC70Lgg0LjQvNC10LXRgiDQvdC1INCy0LXRgNC90YvQuSDRgtC40L8g0LTQsNC90L3Ri9GFJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdHlwZW9mIHVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zWyd1cmwnXSA9IHVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93ICfQn9Cw0YDQsNC80LXRgtGAIHVybCDQvdC1INC30LDQtNCw0L0g0LjQu9C4INC40LzQtdC10YIg0L3QtSDQstC10YDQvdGL0Lkg0YLQuNC/INC00LDQvdC90YvRhSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zWydkYXRhJ10gPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ9Cf0LDRgNCw0LzQtdGC0YAgZGF0YSDQvdC1INC30LDQtNCw0L0g0LjQu9C4INC40LzQtdC10YIg0L3QtSDQstC10YDQvdGL0Lkg0YLQuNC/INC00LDQvdC90YvRhSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICB4aHIub3BlbignUE9TVCcsICcvJytvcHRpb25zLnVybCwgb3B0aW9ucy5hc3luYyk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuXG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0IHx8IHhoci5zdGF0dXMgIT0gMjAwKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKHRvUGFyYW0ob3B0aW9ucy5kYXRhKSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyJdfQ==
