var xhr = require('../../public/js/modules/xhr');
var Events = require('../../public/bower_components/simple-event-emitter/EventSystem');


var AddForm = React.createClass({
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
            <section className={showState}>
                <header className="popup__header unselectable">
                    <h3>Новая запись</h3>
                    <a href="#" className="popup__close" onClick={this.closeHandler}><i className="fa fa-times"></i></a>
                </header>
                <form className="form" onSubmit={this.submitHandler}>
                    <div>
                        <label className="form__label">Название заметки:</label>
                        <input type="text" ref="name" className="form__name" placeholder="Введите название" />
                    </div>
                    <div>
                        <label className="form__label">Заметка:</label>
                        <textarea type="text" ref="note" className="form__description" placeholder="С чего начинается родина?" ></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="form__submit"><i className="fa fa-paper-plane-o"></i> Сохранить</button>
                    </div>
                </form>
            </section>
        );
    }
});

var AddNote = React.createClass({
    clickHandler: function (e) {
        if(e) e.preventDefault();
        this.refs.form.showHandler();
    },

    render: function() {
        return (
            <div>
                <AddForm ref="form" />
                <a href="#" className="note__add" onClick={this.clickHandler}><i className="fa fa-paper-plane-o"> </i></a>
            </div>
        );
    }
});

module.exports = AddNote;