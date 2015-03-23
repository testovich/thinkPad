var MainHead = React.createClass({
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
            <header className="cabinet__header unselectable">
                <h1 className="cabinet__h text--shadow">Think <i className="fa fa-terminal"></i> Pad</h1>
                <dl className="cabinet__today">
                    <dt className="is-sx-hidden">На дворе:</dt>
                    <dd ref="date" className="text--shadow"></dd>
                    <dd ref="time" className="is-sx-hidden text--shadow"></dd>
                </dl>
            </header>
        );
    }
});

module.exports = MainHead;