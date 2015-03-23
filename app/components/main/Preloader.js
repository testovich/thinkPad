var Events = require('../../../public/bower_components/simple-event-emitter/EventSystem');

var Preloader = React.createClass({
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
            <div className={showState}>
                <div className="preload__loader" ref="loader" style={{marginTop: this.state.top+'px'}}></div>
            </div>
        );
    }
});

module.exports = Preloader;