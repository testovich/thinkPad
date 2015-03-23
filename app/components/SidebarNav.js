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

var NavItem = React.createClass({
    render: function() {
        var icoClass = 'fa fa-'+this.props.ico;
        return (
            <li className="menu__item">
                <a href={this.props.url} title={this.props.text} className="menu__link">
                    <i className={icoClass}></i> {this.props.text}
                </a>
            </li>
        );
    }
});

var NavList = React.createClass({
    getNavItems: function (item, i) {
        return <NavItem url={item.url} text={item.name} ico={item.ico} key={i}/>
    },

    render: function () {
        var items = this.props.menu.map(this.getNavItems);

        var ulClass = 'menu__list';
        if(this.props.separate) ulClass += ' menu__list--separete';

        return (
            <ul className={ulClass}>
                {items}
            </ul>
        );
    }
});

 var Nav = React.createClass({
    getInitialState: function () {
       return {
           menu: menu.menu,
           system: menu.system
       }
    },

    render: function () {
        return (
            <aside className="sidebar__nav">
                <nav className="menu">
                    <NavList menu={this.state.menu} />
                    <NavList menu={this.state.system} separate={true} />
                </nav>
            </aside>
        );
    }
});

module.exports = Nav;