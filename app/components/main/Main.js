var Preloader = require('./Preloader');
var MainHead = require('./MainHead');
var Tasks = require('./Tasks');


var Main = React.createClass({
    render: function () {
        return (
            <section className="cabinet__main">
                <Preloader />
                <MainHead />
                <Tasks />
            </section>
        );
    }
});

module.exports = Main;