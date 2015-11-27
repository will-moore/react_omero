
var ProjectListItem = React.createClass({
    render: function() {
        var name = this.props.project.name;
        return (
            <li>
              {name}
            </li>
        );
    }
});

var ProjectList = React.createClass({

    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            jsonp: "callback",
            dataType: 'jsonp',
            cache: false,
            success: function(data) {
                this.setState({data: data.projects});
            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: []};
    },

    render: function() {
        var rows = [];
        var lastCategory = null;
        this.state.data.forEach(function(project) {
            rows.push(<ProjectListItem project={project} key={project.id} />);
        });
        return (
            <ul>{rows}</ul>
        );
    }
});

 
ReactDOM.render(
    <ProjectList url="http://localhost:4080/webgateway/api/containers/" />,
    document.getElementById('container')
);