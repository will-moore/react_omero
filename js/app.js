

var BootstrapDropdownListItem = React.createClass({

    handleClick: function(event) {
        console.log("li click", this.props.id);
        event.preventDefault();
        event.stopPropagation();
        this.props.handleSelection({'id': this.props.id, 'name': this.props.name});
        return false;
    },

    render: function() {
        return (
            <li>
                <a onClick={this.handleClick} href="#">{this.props.children}</a>
            </li>
        );
    } 
})

var BootstrapDropdown = React.createClass({

    render: function() {
        var self = this;
        var items = [];
        this.props.options.forEach(function(option) {
            items.push(<BootstrapDropdownListItem
                                key={option.id}
                                handleSelection={self.props.onChoose}
                                name={option.name}
                                id={option.id}>
                            {option.name}
                        </BootstrapDropdownListItem>);
        });
        return (
          <li className="dropdown open">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              {this.props.children}
              <span className="caret" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              {items}
            </ul>
          </li>
        );
    }
});


var ProjectList = React.createClass({

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
        return (
            <BootstrapDropdown options={this.state.data} onChoose={this.props.handleProjectClick}>
                Projects:
            </BootstrapDropdown>
        );
    }
});


var DatasetList = React.createClass({

    render: function() {
        if (this.props.datasets.length === 0) {
            return (<span></span>);
        }
        return (
            <BootstrapDropdown options={this.props.datasets} onChoose={this.props.handleProjectClick}>
                Datasets:
            </BootstrapDropdown>
        );
    }
});


var PDIContainer = React.createClass({

    handleProjectClick: function(project) {
        console.log("PDIContainer", project);
        var data = {'id': project.id};
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
            <ul className="nav navbar-nav">
                <ProjectList handleProjectClick={this.handleProjectClick} />
                <DatasetList datasets={this.state.datasets} />
            </ul>
        );
    }
});


 
ReactDOM.render(
    <PDIContainer />,
    document.getElementById('container')
);