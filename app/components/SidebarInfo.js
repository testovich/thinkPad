var Events = require('../../public/bower_components/simple-event-emitter/EventSystem');

var InfoHeader = React.createClass({
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
            <header className="note__header">
                <a className="note__close" onClick={this.close}><i className="fa fa-times"></i></a>
                <h3>{this.props.header}</h3>

            </header>
        );
    }
});

var InfoDescription = React.createClass({
    render: function () {
        return (
            <article className="note__description">{this.props.note}</article>
        );
    }
});

var Info = React.createClass({
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
            <aside className="sidebar__info">
                <section className="note">
                    <InfoHeader header={this.state.header} />
                    <InfoDescription note={this.state.note} />
                </section>
            </aside>
        );
    }
});

module.exports = Info;