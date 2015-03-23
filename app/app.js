//require('../public/js/modules/panels');
var NotesApp = require('./components/NotesApp');

// Enable touch
React.initializeTouchEvents(true);

React.render(
    <NotesApp />,
    document.getElementById('enter-point')
);