

var BootstrapDropdown = React.createClass({

        render: function() {
            return (
              <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  Dropdown
                  <span className="caret" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                  <li role="separator" className="divider" />
                  <li><a href="#">Separated link</a></li>
                </ul>
              </div>
            );
        }
});



var ProjectListItem = React.createClass({
    handleClick: function() {
        console.log("click project", this.props.project.id);
        this.props.onClick(this.props.project.id);
    },

    render: function() {
        var name = this.props.project.name,
            childCount = this.props.project.childCount,
            id = this.props.project.id;
        return (
            <li>
              <button onClick={this.handleClick} value="{id}">
                {name} [{childCount}]
              </button>
            </li>
        );
    }
});

var ProjectList = React.createClass({

    // handleProjectClick: function(projectId) {
    //     console.log("handleProjectClick", projectId);
    //     this.props.handleProjectClick(projectId);
    // },

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
                        onClick={self.props.handleProjectClick}
                        project={project}
                        key={project.id} />);
        });
        return (
            <div>
            <BootstrapDropdown />
            <ul style={{float:'left'}}>{rows}</ul>
            </div>
        );
    }
});


var DatasetList = React.createClass({

    // handleProjectClick: function(projectId) {
    //     console.log("handleProjectClick", projectId);
    //     this.props.handleProjectClick(projectId);
    // },

    // componentDidMount: function() {
    //     $.ajax({
    //         url: "http://localhost:4080/webgateway/api/containers/",
    //         jsonp: "callback",
    //         dataType: 'jsonp',
    //         cache: false,
    //         success: function(data) {
    //             this.setState({data: data.projects});
    //         }.bind(this),
    //         error: function(xhr, status, err) {
    //             // console.error(this.props.url, status, err.toString());
    //         }.bind(this)
    //     });
    // },

    // getInitialState: function() {
    //     return {datasets: []};
    // },

    render: function() {
        console.log("DatasetList render()", this.props.datasets.length);
        var rows = [];
        var self = this;
        this.props.datasets.forEach(function(dataset) {
            rows.push(<DatasetListItem
                        onClick={self.props.handleProjectClick}
                        dataset={dataset}
                        key={dataset.id} />);
        });
        return (
            <ul style={{float:'left'}} >{rows}</ul>
        );
    }
});

var DatasetListItem = React.createClass({
    handleClick: function() {
        console.log("click dataset", this.props.dataset.id);
        this.props.onClick(this.props.dataset.id);
    },

    render: function() {
        var name = this.props.dataset.name,
            childCount = this.props.dataset.childCount,
            id = this.props.dataset.id;
        return (
            <li>
                <button onClick={this.handleClick} value="{id}">
                    {name} [{childCount}]
                </button>
            </li>
        );
    }
});



var PDIContainer = React.createClass({

    handleProjectClick: function(projectId) {
        console.log("PDIContainer", projectId);
        var data = {'id': projectId};
        $.ajax({
            url: "http://localhost:4080/webgateway/api/datasets/",
            jsonp: "callback",
            data: data,
            dataType: 'jsonp',
            cache: false,
            success: function(data) {
                console.log(data);
                this.setState({datasets: data.datasets});
            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {datasets: []};
    },

    render: function() {
        return (
            <div>
            <ProjectList 
                handleProjectClick={this.handleProjectClick} />
            <DatasetList datasets={this.state.datasets} />
            </div>
        );
    }
});


 
ReactDOM.render(
    <PDIContainer />,
    document.getElementById('container')
);