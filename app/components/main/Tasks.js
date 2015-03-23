var xhr = require('../../../public/js/modules/xhr');
var Events = require('../../../public/bower_components/simple-event-emitter/EventSystem');
var getDate = require('../../../public/js/modules/date');




var TasksHead = React.createClass({
    toggleHandler: function(e) {
        e.preventDefault();
        document.body.classList.toggle('is--open');
    },

    render: function() {
        return (
            <div className="tasks__header unselectable">
                <a className="task__add" onClick={this.toggleHandler} ><i className="fa fa-bars"></i></a>
            </div>
        );
    }
});

var TaskTableRow = React.createClass({
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
         <tr className="task" key={this.props.key}>
            <td className="task__item" data-label="Заметка:" data-full={this.props.note.item.description} onClick={this.toggleHandler}>{this.props.note.item.name}</td>
            <td className="task__date" data-label="Опубликовано:" ref="publish" onClick={this.toggleHandler}></td>
            <td className="task__btns" align="right"><a href="#" onClick={this.removeHandler}> <i className="fa fa-trash-o is-mx-hidden "></i></a></td>
         </tr>);
    }
});

var TaskTable = React.createClass({
    getInitialState: function () {
        return {
            notes : [],
            header: null
        }
    },

    getTableRow: function(note, i) {
        return  <TaskTableRow note={note} key={i} />
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
            <div className="tasks__w">
                <table className="tasks__list">
                    <thead>
                        <tr>
                            <th className="task__item--title text--shadow unselectable">Мои циничные заметки</th>
                            <th className="task__date--title text--shadow unselectable">Создано</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var Tasks = React.createClass({
    render: function() {
        return (
            <section className="tasks">
                <TasksHead />
                <TaskTable />
            </section>
        );
    }
});

module.exports = Tasks;