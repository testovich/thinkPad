(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/app.js":[function(require,module,exports){
//require('../public/js/modules/panels');
var NotesApp = require('./components/NotesApp');

// Enable touch
React.initializeTouchEvents(true);

React.render(
    React.createElement(NotesApp, null),
    document.getElementById('enter-point')
);
},{"./components/NotesApp":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/NotesApp.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/AddNote.js":[function(require,module,exports){
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
},{"../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/bower_components/simple-event-emitter/EventSystem.js","../../public/js/modules/xhr":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/xhr.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/NotesApp.js":[function(require,module,exports){
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
},{"../../public/js/modules/StorageController":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/StorageController.js","./AddNote":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/AddNote.js","./SidebarInfo":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/SidebarInfo.js","./SidebarNav":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/SidebarNav.js","./main/Main":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/Main.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/SidebarInfo.js":[function(require,module,exports){
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
},{"../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/bower_components/simple-event-emitter/EventSystem.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/SidebarNav.js":[function(require,module,exports){
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
},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/Main.js":[function(require,module,exports){
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
},{"./MainHead":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/MainHead.js","./Preloader":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/Preloader.js","./Tasks":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/Tasks.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/MainHead.js":[function(require,module,exports){
var MainHead = React.createClass({displayName: "MainHead",
    componentDidMount: function() {
        var dateEl = this.refs.date.getDOMNode(),
            timeEl = this.refs.time.getDOMNode(),
            now = new Date();

        dateEl.innerText = now.toDateString();
        timeEl.innerText = '/ ' + now.toTimeString().split(' ')[0];

        var timer = now.getTime();

        this.timer = setInterval(function () {
            timer += 1000;
            var time = new Date(timer);
            timeEl.innerText = '/ ' + time.toTimeString().split(' ')[0];
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
},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/Preloader.js":[function(require,module,exports){
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
},{"../../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/bower_components/simple-event-emitter/EventSystem.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/components/main/Tasks.js":[function(require,module,exports){
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
        publish.innerText = getDate(this.props.note.item.publish);

        this.timer = setInterval(function(){
            publish.innerText = getDate(this.props.note.item.publish);
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
},{"../../../public/bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/bower_components/simple-event-emitter/EventSystem.js","../../../public/js/modules/date":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/date.js","../../../public/js/modules/xhr":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/xhr.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/bower_components/simple-event-emitter/EventSystem.js":[function(require,module,exports){
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

},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/StorageController.js":[function(require,module,exports){
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
},{"../../bower_components/simple-event-emitter/EventSystem":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/bower_components/simple-event-emitter/EventSystem.js","./xhr":"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/xhr.js"}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/date.js":[function(require,module,exports){
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


},{}],"/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/public/js/modules/xhr.js":[function(require,module,exports){
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
},{}]},{},["/media/5b8c33bd-b0bc-468a-b4a8-bde993bcb4bf/projects/todo.loc/todo.loc/app/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy9hcHAvYXBwLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy9hcHAvY29tcG9uZW50cy9BZGROb3RlLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy9hcHAvY29tcG9uZW50cy9Ob3Rlc0FwcC5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvYXBwL2NvbXBvbmVudHMvU2lkZWJhckluZm8uanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL2FwcC9jb21wb25lbnRzL1NpZGViYXJOYXYuanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL2FwcC9jb21wb25lbnRzL21haW4vTWFpbi5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvYXBwL2NvbXBvbmVudHMvbWFpbi9NYWluSGVhZC5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvYXBwL2NvbXBvbmVudHMvbWFpbi9QcmVsb2FkZXIuanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL2FwcC9jb21wb25lbnRzL21haW4vVGFza3MuanMiLCIvbWVkaWEvNWI4YzMzYmQtYjBiYy00NjhhLWI0YTgtYmRlOTkzYmNiNGJmL3Byb2plY3RzL3RvZG8ubG9jL3RvZG8ubG9jL3B1YmxpYy9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1ldmVudC1lbWl0dGVyL0V2ZW50U3lzdGVtLmpzIiwiL21lZGlhLzViOGMzM2JkLWIwYmMtNDY4YS1iNGE4LWJkZTk5M2JjYjRiZi9wcm9qZWN0cy90b2RvLmxvYy90b2RvLmxvYy9wdWJsaWMvanMvbW9kdWxlcy9TdG9yYWdlQ29udHJvbGxlci5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvcHVibGljL2pzL21vZHVsZXMvZGF0ZS5qcyIsIi9tZWRpYS81YjhjMzNiZC1iMGJjLTQ2OGEtYjRhOC1iZGU5OTNiY2I0YmYvcHJvamVjdHMvdG9kby5sb2MvdG9kby5sb2MvcHVibGljL2pzL21vZHVsZXMveGhyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL3JlcXVpcmUoJy4uL3B1YmxpYy9qcy9tb2R1bGVzL3BhbmVscycpO1xudmFyIE5vdGVzQXBwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL05vdGVzQXBwJyk7XG5cbi8vIEVuYWJsZSB0b3VjaFxuUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpO1xuXG5SZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChOb3Rlc0FwcCwgbnVsbCksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VudGVyLXBvaW50Jylcbik7IiwidmFyIHhociA9IHJlcXVpcmUoJy4uLy4uL3B1YmxpYy9qcy9tb2R1bGVzL3hocicpO1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uLy4uL3B1YmxpYy9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1ldmVudC1lbWl0dGVyL0V2ZW50U3lzdGVtJyk7XG5cblxudmFyIEFkZEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQWRkRm9ybVwiLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc1Nob3c6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvc2VIYW5kbGVyOiBmdW5jdGlvbihlKXtcbiAgICAgICBpZihlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNTaG93OiBmYWxzZVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBzaG93SGFuZGxlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc1Nob3c6IHRydWVcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5uYW1lKS5mb2N1cygpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciBub3RlID0ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKSB8fCAn0JHQtdC3INC90LDQt9Cy0LDQvdC40Y8g0L7RgiAnK25ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5yZWZzLm5vdGUuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKSxcbiAgICAgICAgICAgIHB1Ymxpc2g6IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIW5vdGUuZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdC00L7RgdGC0LDRgtC+0YfQvdC+INC+0L/QuNGB0LDQvdC40Y8nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIEV2ZW50cy5wdWJsaXNoKCdsb2FkZXIuc2hvdycpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNTaG93OiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBTdG9yYWdlLnNldE5vdGUobm90ZSk7XG5cbiAgICAgICAgdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlID0gJyc7XG4gICAgICAgIHRoaXMucmVmcy5ub3RlLmdldERPTU5vZGUoKS52YWx1ZSA9ICcnO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuICAgICAgICB2YXIgc2hvd1N0YXRlID0gY3goe1xuICAgICAgICAgICAgJ2lzLWhpZGUnOiAhdGhpcy5zdGF0ZS5pc1Nob3csXG4gICAgICAgICAgICAncG9wdXBfX2Zvcm0nOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIiwge2NsYXNzTmFtZTogc2hvd1N0YXRlfSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCB7Y2xhc3NOYW1lOiBcInBvcHVwX19oZWFkZXIgdW5zZWxlY3RhYmxlXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwi0J3QvtCy0LDRjyDQt9Cw0L/QuNGB0YxcIiksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogXCIjXCIsIGNsYXNzTmFtZTogXCJwb3B1cF9fY2xvc2VcIiwgb25DbGljazogdGhpcy5jbG9zZUhhbmRsZXJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLXRpbWVzXCJ9KSlcbiAgICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCB7Y2xhc3NOYW1lOiBcImZvcm1cIiwgb25TdWJtaXQ6IHRoaXMuc3VibWl0SGFuZGxlcn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHtjbGFzc05hbWU6IFwiZm9ybV9fbGFiZWxcIn0sIFwi0J3QsNC30LLQsNC90LjQtSDQt9Cw0LzQtdGC0LrQuDpcIiksIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInRleHRcIiwgcmVmOiBcIm5hbWVcIiwgY2xhc3NOYW1lOiBcImZvcm1fX25hbWVcIiwgcGxhY2Vob2xkZXI6IFwi0JLQstC10LTQuNGC0LUg0L3QsNC30LLQsNC90LjQtVwifSlcbiAgICAgICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge2NsYXNzTmFtZTogXCJmb3JtX19sYWJlbFwifSwgXCLQl9Cw0LzQtdGC0LrQsDpcIiksIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHt0eXBlOiBcInRleHRcIiwgcmVmOiBcIm5vdGVcIiwgY2xhc3NOYW1lOiBcImZvcm1fX2Rlc2NyaXB0aW9uXCIsIHBsYWNlaG9sZGVyOiBcItChINGH0LXQs9C+INC90LDRh9C40L3QsNC10YLRgdGPINGA0L7QtNC40L3QsD9cIn0pXG4gICAgICAgICAgICAgICAgICAgICksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGV4dC1yaWdodFwifSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHt0eXBlOiBcInN1Ym1pdFwiLCBjbGFzc05hbWU6IFwiZm9ybV9fc3VibWl0XCJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLXBhcGVyLXBsYW5lLW9cIn0pLCBcIiDQodC+0YXRgNCw0L3QuNGC0YxcIilcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIEFkZE5vdGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQWRkTm90ZVwiLFxuICAgIGNsaWNrSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnJlZnMuZm9ybS5zaG93SGFuZGxlcigpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFkZEZvcm0sIHtyZWY6IFwiZm9ybVwifSksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiBcIiNcIiwgY2xhc3NOYW1lOiBcIm5vdGVfX2FkZFwiLCBvbkNsaWNrOiB0aGlzLmNsaWNrSGFuZGxlcn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IFwiZmEgZmEtcGFwZXItcGxhbmUtb1wifSwgXCIgXCIpKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkZE5vdGU7IiwidmFyIFNpZGViYXJOYXYgPSByZXF1aXJlKCcuL1NpZGViYXJOYXYnKTtcbnZhciBTaWRlYmFySW5mbyA9IHJlcXVpcmUoJy4vU2lkZWJhckluZm8nKTtcbnZhciBNYWluID0gcmVxdWlyZSgnLi9tYWluL01haW4nKTtcbnZhciBBZGROb3RlID0gcmVxdWlyZSgnLi9BZGROb3RlJyk7XG5cbnJlcXVpcmUoJy4uLy4uL3B1YmxpYy9qcy9tb2R1bGVzL1N0b3JhZ2VDb250cm9sbGVyJyk7XG5cbnZhciBOb3Rlc0FwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJOb3Rlc0FwcFwiLFxuICAgIHRvdWNoSGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZCA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIGlmKHRoaXMuc3RhdGUudG91Y2hNb3ZlIC0gdGhpcy5zdGF0ZS50b3VjaFN0YXJ0ID4gMTApIHtcbiAgICAgICAgICAgIGlmKGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy0tb3Blbi1yaWdodCcpKSB7XG4gICAgICAgICAgICAgICAgZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy0tb3Blbi1yaWdodCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3RvdWNoRW5kOiBmYWxzZX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLnN0YXRlLnRvdWNoRW5kKSB7XG4gICAgICAgICAgICAgICAgZC5jbGFzc0xpc3QuYWRkKCdpcy0tb3BlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5zdGF0ZS50b3VjaE1vdmUgLSB0aGlzLnN0YXRlLnRvdWNoU3RhcnQgPCAtMTApIHtcbiAgICAgICAgICAgIGlmKGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy0tb3BlbicpKXtcbiAgICAgICAgICAgICAgICBkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1vcGVuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dG91Y2hFbmQ6IGZhbHNlfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUudG91Y2hFbmQpIHtcbiAgICAgICAgICAgICAgICBkLmNsYXNzTGlzdC5hZGQoJ2lzLS1vcGVuLXJpZ2h0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3VjaFN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgdG91Y2hNb3ZlOiBudWxsLFxuICAgICAgICAgICAgdG91Y2hFbmQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoKFwib250b3VjaHN0YXJ0XCIgaW4gd2luZG93KSl7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt0b3VjaFN0YXJ0OmUudG91Y2hlc1swXS5jbGllbnRYfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dG91Y2hFbmQ6IHRydWV9KTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3RvdWNoTW92ZTplLnRvdWNoZXNbMF0uY2xpZW50WH0pO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hIYW5kbGVyKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2lkZWJhck5hdiwgbnVsbCksIFxuICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1haW4sIG51bGwpLCBcbiAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTaWRlYmFySW5mbywgbnVsbCksIFxuICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFkZE5vdGUsIG51bGwpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTm90ZXNBcHA7IiwidmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uLy4uL3B1YmxpYy9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1ldmVudC1lbWl0dGVyL0V2ZW50U3lzdGVtJyk7XG5cbnZhciBJbmZvSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkluZm9IZWFkZXJcIixcbiAgICBjbG9zZTogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGQgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICBkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1vcGVuLXJpZ2h0Jyk7XG5cbiAgICAgICAgaWYoZC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLS1vcGVuJykpe1xuICAgICAgICAgICAgZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy0tb3BlbicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCB7Y2xhc3NOYW1lOiBcIm5vdGVfX2hlYWRlclwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJub3RlX19jbG9zZVwiLCBvbkNsaWNrOiB0aGlzLmNsb3NlfSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS10aW1lc1wifSkpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDNcIiwgbnVsbCwgdGhpcy5wcm9wcy5oZWFkZXIpXG5cbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIEluZm9EZXNjcmlwdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJbmZvRGVzY3JpcHRpb25cIixcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhcnRpY2xlXCIsIHtjbGFzc05hbWU6IFwibm90ZV9fZGVzY3JpcHRpb25cIn0sIHRoaXMucHJvcHMubm90ZSlcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIEluZm8gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSW5mb1wiLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm90ZTogJycsXG4gICAgICAgICAgICBoZWFkZXI6ICcnLFxuICAgICAgICAgICAgc2hvdzpmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgRXZlbnRzLnN1YnNjcmliZSgnbm90ZS5zaG93JywgZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG5vdGU6IG9iai5pdGVtLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIGhlYWRlcjogb2JqLml0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICBzaG93OiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnaXMtLW9wZW4tcmlnaHQnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFzaWRlXCIsIHtjbGFzc05hbWU6IFwic2lkZWJhcl9faW5mb1wifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIiwge2NsYXNzTmFtZTogXCJub3RlXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmZvSGVhZGVyLCB7aGVhZGVyOiB0aGlzLnN0YXRlLmhlYWRlcn0pLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmZvRGVzY3JpcHRpb24sIHtub3RlOiB0aGlzLnN0YXRlLm5vdGV9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbmZvOyIsInZhciBtZW51ID0ge1xuICAgIG1lbnU6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTon0J3QsCDRgdC10LPQvtC00L3RjycsXG4gICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgIGljbzogJ2NhbGVuZGFyLW8nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6J9Cd0LAg0LfQsNCy0YLRgNCwJyxcbiAgICAgICAgICAgIHVybDogJyMnLFxuICAgICAgICAgICAgaWNvOiAnY2FsZW5kYXInXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6J9CS0YHQtSDQt9Cw0LzQtdGC0LrQuCcsXG4gICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgIGljbzogJ2RhdGFiYXNlJ1xuICAgICAgICB9XG5cbiAgICBdLFxuICAgIHN5c3RlbTogW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOifQndCw0YHRgtGA0L7QudC60LgnLFxuICAgICAgICAgICAgdXJsOiAnIycsXG4gICAgICAgICAgICBpY286ICd3cmVuY2gnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6J9CS0YvRhdC+0LQnLFxuICAgICAgICAgICAgdXJsOiAnIycsXG4gICAgICAgICAgICBpY286ICdzaWduLW91dCdcbiAgICAgICAgfVxuICAgIF1cbn07XG5cbnZhciBOYXZJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk5hdkl0ZW1cIixcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWNvQ2xhc3MgPSAnZmEgZmEtJyt0aGlzLnByb3BzLmljbztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcIm1lbnVfX2l0ZW1cIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiB0aGlzLnByb3BzLnVybCwgdGl0bGU6IHRoaXMucHJvcHMudGV4dCwgY2xhc3NOYW1lOiBcIm1lbnVfX2xpbmtcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBpY29DbGFzc30pLCBcIiBcIiwgdGhpcy5wcm9wcy50ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgTmF2TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJOYXZMaXN0XCIsXG4gICAgZ2V0TmF2SXRlbXM6IGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkl0ZW0sIHt1cmw6IGl0ZW0udXJsLCB0ZXh0OiBpdGVtLm5hbWUsIGljbzogaXRlbS5pY28sIGtleTogaX0pXG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLnByb3BzLm1lbnUubWFwKHRoaXMuZ2V0TmF2SXRlbXMpO1xuXG4gICAgICAgIHZhciB1bENsYXNzID0gJ21lbnVfX2xpc3QnO1xuICAgICAgICBpZih0aGlzLnByb3BzLnNlcGFyYXRlKSB1bENsYXNzICs9ICcgbWVudV9fbGlzdC0tc2VwYXJldGUnO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogdWxDbGFzc30sIFxuICAgICAgICAgICAgICAgIGl0ZW1zXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbiB2YXIgTmF2ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk5hdlwiLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgIHJldHVybiB7XG4gICAgICAgICAgIG1lbnU6IG1lbnUubWVudSxcbiAgICAgICAgICAgc3lzdGVtOiBtZW51LnN5c3RlbVxuICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXNpZGVcIiwge2NsYXNzTmFtZTogXCJzaWRlYmFyX19uYXZcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwge2NsYXNzTmFtZTogXCJtZW51XCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZMaXN0LCB7bWVudTogdGhpcy5zdGF0ZS5tZW51fSksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkxpc3QsIHttZW51OiB0aGlzLnN0YXRlLnN5c3RlbSwgc2VwYXJhdGU6IHRydWV9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBOYXY7IiwidmFyIFByZWxvYWRlciA9IHJlcXVpcmUoJy4vUHJlbG9hZGVyJyk7XG52YXIgTWFpbkhlYWQgPSByZXF1aXJlKCcuL01haW5IZWFkJyk7XG52YXIgVGFza3MgPSByZXF1aXJlKCcuL1Rhc2tzJyk7XG5cblxudmFyIE1haW4gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTWFpblwiLFxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIiwge2NsYXNzTmFtZTogXCJjYWJpbmV0X19tYWluXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByZWxvYWRlciwgbnVsbCksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpbkhlYWQsIG51bGwpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhc2tzLCBudWxsKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW47IiwidmFyIE1haW5IZWFkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk1haW5IZWFkXCIsXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0ZUVsID0gdGhpcy5yZWZzLmRhdGUuZ2V0RE9NTm9kZSgpLFxuICAgICAgICAgICAgdGltZUVsID0gdGhpcy5yZWZzLnRpbWUuZ2V0RE9NTm9kZSgpLFxuICAgICAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcblxuICAgICAgICBkYXRlRWwuaW5uZXJUZXh0ID0gbm93LnRvRGF0ZVN0cmluZygpO1xuICAgICAgICB0aW1lRWwuaW5uZXJUZXh0ID0gJy8gJyArIG5vdy50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzBdO1xuXG4gICAgICAgIHZhciB0aW1lciA9IG5vdy5nZXRUaW1lKCk7XG5cbiAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRpbWVyICs9IDEwMDA7XG4gICAgICAgICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKHRpbWVyKTtcbiAgICAgICAgICAgIHRpbWVFbC5pbm5lclRleHQgPSAnLyAnICsgdGltZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzBdO1xuICAgICAgICB9LDEwMDApO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCB7Y2xhc3NOYW1lOiBcImNhYmluZXRfX2hlYWRlciB1bnNlbGVjdGFibGVcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCB7Y2xhc3NOYW1lOiBcImNhYmluZXRfX2ggdGV4dC0tc2hhZG93XCJ9LCBcIlRoaW5rIFwiLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLXRlcm1pbmFsXCJ9KSwgXCIgUGFkXCIpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGxcIiwge2NsYXNzTmFtZTogXCJjYWJpbmV0X190b2RheVwifSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkdFwiLCB7Y2xhc3NOYW1lOiBcImlzLXN4LWhpZGRlblwifSwgXCLQndCwINC00LLQvtGA0LU6XCIpLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRkXCIsIHtyZWY6IFwiZGF0ZVwiLCBjbGFzc05hbWU6IFwidGV4dC0tc2hhZG93XCJ9KSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkZFwiLCB7cmVmOiBcInRpbWVcIiwgY2xhc3NOYW1lOiBcImlzLXN4LWhpZGRlbiB0ZXh0LS1zaGFkb3dcIn0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5IZWFkOyIsInZhciBFdmVudHMgPSByZXF1aXJlKCcuLi8uLi8uLi9wdWJsaWMvYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtZXZlbnQtZW1pdHRlci9FdmVudFN5c3RlbScpO1xuXG52YXIgUHJlbG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlByZWxvYWRlclwiLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLSA2MCkvMixcbiAgICAgICAgICAgIGlzU2hvdzogdHJ1ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBoYW5kbGVSZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt0b3A6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLTYwKS8yfSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcblxuICAgICAgICBFdmVudHMuc3Vic2NyaWJlKCdsb2FkZXIuc2hvdycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc1Nob3c6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIEV2ZW50cy5zdWJzY3JpYmUoJ2xvYWRlci5oaWRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlzU2hvdzogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuICAgICAgICB2YXIgc2hvd1N0YXRlID0gY3goe1xuICAgICAgICAgICAgJ2lzLWhpZGUnOiAhdGhpcy5zdGF0ZS5pc1Nob3csXG4gICAgICAgICAgICAncHJlbG9hZF9fb3ZlcmxheSc6IHRydWUsXG4gICAgICAgICAgICAndW5zZWxlY3RhYmxlJzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBzaG93U3RhdGV9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJlbG9hZF9fbG9hZGVyXCIsIHJlZjogXCJsb2FkZXJcIiwgc3R5bGU6IHttYXJnaW5Ub3A6IHRoaXMuc3RhdGUudG9wKydweCd9fSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkZXI7IiwidmFyIHhociA9IHJlcXVpcmUoJy4uLy4uLy4uL3B1YmxpYy9qcy9tb2R1bGVzL3hocicpO1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uLy4uLy4uL3B1YmxpYy9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1ldmVudC1lbWl0dGVyL0V2ZW50U3lzdGVtJyk7XG52YXIgZ2V0RGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3B1YmxpYy9qcy9tb2R1bGVzL2RhdGUnKTtcblxuXG5cblxudmFyIFRhc2tzSGVhZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUYXNrc0hlYWRcIixcbiAgICB0b2dnbGVIYW5kbGVyOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdpcy0tb3BlbicpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRhc2tzX19oZWFkZXIgdW5zZWxlY3RhYmxlXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcInRhc2tfX2FkZFwiLCBvbkNsaWNrOiB0aGlzLnRvZ2dsZUhhbmRsZXJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLWJhcnNcIn0pKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgVGFza1RhYmxlUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRhc2tUYWJsZVJvd1wiLFxuICAgIHRvZ2dsZUhhbmRsZXI6IGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkID0gZG9jdW1lbnQuYm9keTtcblxuICAgICAgICBpZighZC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLS1vcGVuLXJpZ2h0Jykpe1xuICAgICAgICAgICAgZC5jbGFzc0xpc3QudG9nZ2xlKCdpcy0tb3Blbi1yaWdodCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoZC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLS1vcGVuJykpe1xuICAgICAgICAgICAgZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy0tb3BlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgU3RvcmFnZS5nZXROb3RlKHRoaXMucHJvcHMubm90ZS5rZXkpO1xuICAgIH0sXG5cbiAgICByZW1vdmVIYW5kbGVyOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgU3RvcmFnZS5yZW1vdmVOb3RlKHRoaXMucHJvcHMubm90ZS5rZXkpO1xuICAgICAgICBFdmVudHMucHVibGlzaCgnbG9hZGVyLnNob3cnKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICB2YXIgcHVibGlzaCA9IHRoaXMucmVmcy5wdWJsaXNoLmdldERPTU5vZGUoKTtcbiAgICAgICAgcHVibGlzaC5pbm5lclRleHQgPSBnZXREYXRlKHRoaXMucHJvcHMubm90ZS5pdGVtLnB1Ymxpc2gpO1xuXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgcHVibGlzaC5pbm5lclRleHQgPSBnZXREYXRlKHRoaXMucHJvcHMubm90ZS5pdGVtLnB1Ymxpc2gpO1xuICAgICAgICB9LmJpbmQodGhpcyksNjAwMDApO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAgKFxuICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIHtjbGFzc05hbWU6IFwidGFza1wiLCBrZXk6IHRoaXMucHJvcHMua2V5fSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2NsYXNzTmFtZTogXCJ0YXNrX19pdGVtXCIsIFwiZGF0YS1sYWJlbFwiOiBcItCX0LDQvNC10YLQutCwOlwiLCBcImRhdGEtZnVsbFwiOiB0aGlzLnByb3BzLm5vdGUuaXRlbS5kZXNjcmlwdGlvbiwgb25DbGljazogdGhpcy50b2dnbGVIYW5kbGVyfSwgdGhpcy5wcm9wcy5ub3RlLml0ZW0ubmFtZSksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IFwidGFza19fZGF0ZVwiLCBcImRhdGEtbGFiZWxcIjogXCLQntC/0YPQsdC70LjQutC+0LLQsNC90L46XCIsIHJlZjogXCJwdWJsaXNoXCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlSGFuZGxlcn0pLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7Y2xhc3NOYW1lOiBcInRhc2tfX2J0bnNcIiwgYWxpZ246IFwicmlnaHRcIn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiBcIiNcIiwgb25DbGljazogdGhpcy5yZW1vdmVIYW5kbGVyfSwgXCIgXCIsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IFwiZmEgZmEtdHJhc2gtbyBpcy1teC1oaWRkZW4gXCJ9KSkpXG4gICAgICAgICApKTtcbiAgICB9XG59KTtcblxudmFyIFRhc2tUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUYXNrVGFibGVcIixcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vdGVzIDogW10sXG4gICAgICAgICAgICBoZWFkZXI6IG51bGxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRUYWJsZVJvdzogZnVuY3Rpb24obm90ZSwgaSkge1xuICAgICAgICByZXR1cm4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFza1RhYmxlUm93LCB7bm90ZTogbm90ZSwga2V5OiBpfSlcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgICAgICAgIEV2ZW50cy5zdWJzY3JpYmUoJ25vdGVzLmluaXQnLCBmdW5jdGlvbihub3Rlcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG5vdGVzOiBub3Rlc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgRXZlbnRzLnN1YnNjcmliZSgnbm90ZS5hZGQnLCBmdW5jdGlvbihub3Rlcyl7XG4gICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3Rlczogbm90ZXNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBFdmVudHMuc3Vic2NyaWJlKCdub3RlLnJlbW92ZScsIGZ1bmN0aW9uKG5vdGVzKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBub3Rlc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIEV2ZW50cy5jbGVhcigpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcm93cyA9IHRoaXMuc3RhdGUubm90ZXMubWFwKHRoaXMuZ2V0VGFibGVSb3cpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRhc2tzX193XCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJ0YXNrc19fbGlzdFwifSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge2NsYXNzTmFtZTogXCJ0YXNrX19pdGVtLS10aXRsZSB0ZXh0LS1zaGFkb3cgdW5zZWxlY3RhYmxlXCJ9LCBcItCc0L7QuCDRhtC40L3QuNGH0L3Ri9C1INC30LDQvNC10YLQutC4XCIpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwge2NsYXNzTmFtZTogXCJ0YXNrX19kYXRlLS10aXRsZSB0ZXh0LS1zaGFkb3cgdW5zZWxlY3RhYmxlXCJ9LCBcItCh0L7Qt9C00LDQvdC+XCIpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIFRhc2tzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRhc2tzXCIsXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzZWN0aW9uXCIsIHtjbGFzc05hbWU6IFwidGFza3NcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFza3NIZWFkLCBudWxsKSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYXNrVGFibGUsIG51bGwpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFza3M7IiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5FdmVudFN5c3RlbSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucXVldWUgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHB1Ymxpc2g6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9ucyA9IHNlbGYucXVldWVbZXZlbnRdO1xuXG4gICAgICAgICAgICBpZighYWN0aW9ucyB8fCAhYWN0aW9ucy5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbiwgaSl7XG4gICAgICAgICAgICAgICAgYWN0aW9uLmNhbGxiYWNrKGRhdGEgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmKGFjdGlvbi5mbGFnKSBhY3Rpb25zLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHVibGlzaENoYWluOiBmdW5jdGlvbiAoZXZlbnRzLCBhcmdzKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9ucyA9IGV2ZW50cy5zcGxpdCgnICcpO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oZXZlbnQsIGkpe1xuICAgICAgICAgICAgICAgIHRoaXMucHVibGlzaChldmVudCxhcmdzW2ldKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjaywgb25jZSkge1xuICAgICAgICAgICBpZiAoIXNlbGYucXVldWVbZXZlbnRdKSBzZWxmLnF1ZXVlW2V2ZW50XSA9IFtdO1xuXG4gICAgICAgICAgIHZhciBpbmRleCA9IHNlbGYucXVldWVbZXZlbnRdLnB1c2goe1xuICAgICAgICAgICAgICAgIGZsYWc6ICEhb25jZSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5xdWV1ZVtldmVudF1baW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgIHNlbGYucXVldWUgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICBsaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoc2VsZi5xdWV1ZSkubWFwKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tDb3VudDpzZWxmLnF1ZXVlW2V2ZW50XS5sZW5ndGhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKTtcbiIsInZhciB4aHIgPSByZXF1aXJlKCcuL3hocicpO1xudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLWV2ZW50LWVtaXR0ZXIvRXZlbnRTeXN0ZW0nKTtcblxudmFyIFN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5ub3RlcyA9IFtdO1xuICAgIHRoaXMuaW5pdCgpO1xufTtcblxuU3RvcmFnZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB4aHIuZ2V0KGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgIHRoaXMubm90ZXMgPSByZXNwO1xuXG4gICAgICAgIGlmICh0aGlzLm5vdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgRXZlbnRzLnB1Ymxpc2goJ25vdGVzLmluaXQnLCB0aGlzLm5vdGVzLCB0cnVlKTtcbiAgICAgICAgICAgIEV2ZW50cy5wdWJsaXNoKCdsb2FkZXIuaGlkZScpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblN0b3JhZ2UucHJvdG90eXBlLmdldE5vdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIG5vdGUgPSB0aGlzLm5vdGVzLmZpbHRlcihmdW5jdGlvbihub3RlKXtcbiAgICAgICAgcmV0dXJuIG5vdGUua2V5ID09PSBrZXk7XG4gICAgfSlbMF07XG5cbiAgICBFdmVudHMucHVibGlzaCgnbm90ZS5zaG93Jywgbm90ZSk7XG59O1xuXG5TdG9yYWdlLnByb3RvdHlwZS5yZW1vdmVOb3RlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHhoci5wb3N0KCdyZW1vdmUnLCB7a2V5OiBrZXl9LCBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm90ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vdGVzW2ldLmtleSA9PT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBFdmVudHMucHVibGlzaCgnbm90ZS5yZW1vdmUnLCB0aGlzLm5vdGVzKTtcbiAgICAgICAgRXZlbnRzLnB1Ymxpc2goJ2xvYWRlci5oaWRlJyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblN0b3JhZ2UucHJvdG90eXBlLnNldE5vdGUgPSBmdW5jdGlvbiAobm90ZSkge1xuICAgIHhoci5wb3N0KCdhZGQnLCBub3RlLCBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICB0aGlzLm5vdGVzLnB1c2goe1xuICAgICAgICAgICAgaXRlbTpub3RlLFxuICAgICAgICAgICAga2V5OkpTT04ucGFyc2UocmVzcCkua2V5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEV2ZW50cy5wdWJsaXNoKCdub3RlLmFkZCcsIHRoaXMubm90ZXMpO1xuICAgICAgICBFdmVudHMucHVibGlzaCgnbG9hZGVyLmhpZGUnKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuU3RvcmFnZS5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm5vdGVzO1xufTtcblxud2luZG93LlN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCksXG4gICAgICAgIHRpbWVTdGFtcCA9IG5ldyBEYXRlKHBhcnNlSW50KHRpbWUpKSxcbiAgICAgICAgdGltZVN0cmluZztcblxuICAgIHZhciBnZXRXaXRoVGltZXpvbmUgPSBmdW5jdGlvbiAoZGF0ZU9iail7XG4gICAgICAgIHZhciB1dGMgPSBkYXRlT2JqLmdldFRpbWUoKSArIChkYXRlT2JqLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMCk7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh1dGMgKyAoMzYwMDAwMCogKG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKS82MCkqLTEpKS5nZXRUaW1lKCk7XG4gICAgfTtcblxuICAgIHZhciB0b2RheVRtcCA9IGdldFdpdGhUaW1lem9uZSh0b2RheSk7XG4gICAgdmFyIHRpbWVTdGFtcFRtcCA9IGdldFdpdGhUaW1lem9uZSh0aW1lU3RhbXApO1xuXG4gICAgdmFyIGRheVRvZGF5ID0gdG9kYXkuZ2V0RGF5KCksXG4gICAgICAgIGRheVRpbWVzdGFtcCA9IHRpbWVTdGFtcC5nZXREYXkoKTtcblxuICAgIHZhciBkaWZmZXJlbmNlID0gdG9kYXlUbXAgLSB0aW1lU3RhbXBUbXA7XG5cbiAgICB2YXIgZGF5c0RpZmZlcmVuY2UgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2UvMTAwMC82MC82MC8yNCk7XG4gICAgZGlmZmVyZW5jZSAtPSBkYXlzRGlmZmVyZW5jZSoxMDAwKjYwKjYwKjI0O1xuXG4gICAgdmFyIGhvdXJzRGlmZmVyZW5jZSA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZS8xMDAwLzYwLzYwKTtcbiAgICBkaWZmZXJlbmNlIC09IGhvdXJzRGlmZmVyZW5jZSoxMDAwKjYwKjYwO1xuXG4gICAgdmFyIG1pbnV0ZXNEaWZmZXJlbmNlID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlLzEwMDAvNjApO1xuICAgIGRpZmZlcmVuY2UgLT0gbWludXRlc0RpZmZlcmVuY2UqMTAwMCo2MDtcblxuICAgIHZhciBzZWNvbmRzRGlmZmVyZW5jZSA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZS8xMDAwKTtcblxuICAgIGlmKGRheXNEaWZmZXJlbmNlID09PSAwICYmIGhvdXJzRGlmZmVyZW5jZSA8IDEpIHtcbiAgICAgICAgdGltZVN0cmluZyA9IG1pbnV0ZXNEaWZmZXJlbmNlKycg0LwgJytzZWNvbmRzRGlmZmVyZW5jZSsnINGBINC90LDQt9Cw0LQnO1xuICAgIH1cbiAgICBpZihkYXlzRGlmZmVyZW5jZSA9PT0gMCAmJiBob3Vyc0RpZmZlcmVuY2UgPj0gMSAmJiBkYXlUb2RheSA9PT0gZGF5VGltZXN0YW1wKSB7XG4gICAgICAgIHRpbWVTdHJpbmcgPSAnY9C10LPQvtC00L3RjyDQsiAnICsgbmV3IERhdGUodGltZVN0YW1wVG1wKS50b1RpbWVTdHJpbmcoKS5yZXBsYWNlKC8uKihcXGR7Mn06XFxkezJ9OlxcZHsyfSkuKi8sIFwiJDFcIik7XG4gICAgfVxuXG4gICAgaWYoKGRheXNEaWZmZXJlbmNlID09PSAxKSB8fCAoZGF5c0RpZmZlcmVuY2UgPT09IDAgJiYgaG91cnNEaWZmZXJlbmNlID49IDEgJiYgZGF5VG9kYXkgIT09IGRheVRpbWVzdGFtcCkpIHtcbiAgICAgICAgdGltZVN0cmluZyA9ICfQstGH0LXRgNCwINCyICcgKyBuZXcgRGF0ZSh0aW1lU3RhbXBUbXApLnRvVGltZVN0cmluZygpLnJlcGxhY2UoLy4qKFxcZHsyfTpcXGR7Mn06XFxkezJ9KS4qLywgXCIkMVwiKTtcbiAgICB9XG5cbiAgICBpZihkYXlzRGlmZmVyZW5jZSA+IDApIHtcbiAgICAgICAgdGltZVN0cmluZyA9IG5ldyBEYXRlKHRpbWVTdGFtcFRtcCkudG9Mb2NhbGVTdHJpbmcoKS5zcGxpdCgnICcpLnNwbGljZSgwLDIpLmpvaW4oJyAnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGltZVN0cmluZztcbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gIChmdW5jdGlvbiAoKXtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB1cmw6ICcvZ2V0JyxcbiAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHt9XG4gICAgfSxcblxuICAgIHRvUGFyYW0gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgIHZhciBlbmNvZGVkU3RyaW5nID0gJyc7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVuY29kZWRTdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBlbmNvZGVkU3RyaW5nICs9ICcmJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW5jb2RlZFN0cmluZyArPSBlbmNvZGVVUkkocHJvcCArICc9JyArIG9iamVjdFtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVuY29kZWRTdHJpbmc7XG4gICAgfSxcblxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IFwib2JqZWN0XCIpIHJldHVybiBvYmo7XG4gICAgICAgIHZhciBzb3VyY2UsIHByb3A7XG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoY2IsIHVybCkge1xuICAgICAgICAgICAgaWYoY2IgJiYgdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1snY2FsbGJhY2snXSA9IGNiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrINC90LUg0LfQsNC00LDQvSDQuNC70Lgg0LjQvNC10LXRgiDQvdC1INCy0LXRgNC90YvQuSDRgtC40L8g0LTQsNC90L3Ri9GFJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdHlwZW9mIHVybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zWyd1cmwnXSA9IHVybDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgb3B0aW9ucy51cmwsIG9wdGlvbnMuYXN5bmMpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9IDQgfHwgeGhyLnN0YXR1cyAhPSAyMDApIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY2FsbGJhY2socmVzcC5kYXRhKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICB9LFxuICAgICAgICBwb3N0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYil7XG4gICAgICAgICAgICBpZihjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zWydjYWxsYmFjayddID0gY2I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn0J/QsNGA0LDQvNC10YLRgCBDYWxsYmFjayDQvdC1INC30LDQtNCw0L0g0LjQu9C4INC40LzQtdC10YIg0L3QtSDQstC10YDQvdGL0Lkg0YLQuNC/INC00LDQvdC90YvRhSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodXJsICYmIHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1sndXJsJ10gPSB1cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn0J/QsNGA0LDQvNC10YLRgCB1cmwg0L3QtSDQt9Cw0LTQsNC9INC40LvQuCDQuNC80LXQtdGCINC90LUg0LLQtdGA0L3Ri9C5INGC0LjQvyDQtNCw0L3QvdGL0YUnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1snZGF0YSddID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93ICfQn9Cw0YDQsNC80LXRgtGAIGRhdGEg0L3QtSDQt9Cw0LTQsNC9INC40LvQuCDQuNC80LXQtdGCINC90LUg0LLQtdGA0L3Ri9C5INGC0LjQvyDQtNCw0L3QvdGL0YUnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnLycrb3B0aW9ucy51cmwsIG9wdGlvbnMuYXN5bmMpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcblxuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCB8fCB4aHIuc3RhdHVzICE9IDIwMCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIuc2VuZCh0b1BhcmFtKG9wdGlvbnMuZGF0YSkpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiXX0=
