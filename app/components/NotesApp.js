var SidebarNav = require('./SidebarNav');
var SidebarInfo = require('./SidebarInfo');
var Main = require('./main/Main');
var AddNote = require('./AddNote');

require('../../public/js/modules/StorageController');

var NotesApp = React.createClass({
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
            <div>
                 <SidebarNav />
                 <Main />
                 <SidebarInfo />
                 <AddNote />
            </div>
        );
    }
});

module.exports = NotesApp;