
var ProjectListItem = React.createClass({
    handleClick: function() {
        console.log("click project", this.props.project.id);
        this.props.onClick(this.props.project.id);
    },

    render: function() {
        var name = this.props.project.name,
            id = this.props.project.id;
        return (
            <li>
              <button onClick={this.handleClick} value="{id}">{name}</button>
            </li>
        );
    }
});

var ProjectList = React.createClass({

    handleProjectClick: function(projectId) {
        console.log("handleProjectClick", projectId);
        this.props.handleProjectClick(projectId);
    },

    componentDidMount: function() {
        $.ajax({
            url: "http://localhost:4080/webgateway/api/containers/",
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
        var self = this;
        var lastCategory = null;
        this.state.data.forEach(function(project) {
            rows.push(<ProjectListItem
                        onClick={self.handleProjectClick}
                        project={project}
                        key={project.id} />);
        });
        return (
            <ul>{rows}</ul>
        );
    }
});

var PDIContainer = React.createClass({

    handleProjectClick: function(projectId) {
        console.log("PDIContainer", projectId);
    },

    render: function() {
        return (
            <div><h1>PDI</h1>
            <ProjectList 
                handleProjectClick={this.handleProjectClick} />
            </div>
        );
    }
});


 
ReactDOM.render(
    <PDIContainer />,
    document.getElementById('container')
);