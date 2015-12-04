

var BootstrapDropdownListItem = React.createClass({

    handleClick: function(event) {
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
        var items = this.props.options.map(function(option) {
            return (
                <BootstrapDropdownListItem
                        key={option.id}
                        handleSelection={self.props.onChoose}
                        name={option.name}
                        id={option.id}>
                    {option.name} [{option.childCount}]
                </BootstrapDropdownListItem>
            );
        });
        var open = "open";
        return (
          <li className={"dropdown " + open}>
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
                if (this.isMounted()) {
                    this.setState({data: data.projects});
                }
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: []};
    },

    render: function() {
        var txt = "Project";
        if (this.props.project) {
            txt += ": " + this.props.project.name;
        } else {
            txt += "s:";
        }
        return (
            <BootstrapDropdown options={this.state.data} onChoose={this.props.handleProjectClick}>
                {txt}
            </BootstrapDropdown>
        );
    }
});


var DatasetList = React.createClass({

    render: function() {
        if (this.props.datasets.length === 0) {
            return (<span></span>);
        }
        var txt = "Dataset";
        if (this.props.dataset) {
            txt += ": " + this.props.dataset.name;
        } else {
            txt += "s:";
        }
        return (
            <BootstrapDropdown options={this.props.datasets} onChoose={this.props.handleDatasetClick}>
                {txt}
            </BootstrapDropdown>
        );
    }
});


var PDSelector = React.createClass({

    handleProjectClick: function(project) {
        this.setState({
            project: {id: project.id, name: project.name},
            datasets: [],
            dataset: undefined
        });

        var data = {'id': project.id};
        $.ajax({
            url: "http://localhost:4080/webgateway/api/datasets/",
            jsonp: "callback",
            data: data,
            dataType: 'jsonp',
            cache: false,
            success: function(data) {
                if (this.isMounted()) {
                    this.setState({datasets: data.datasets});
                }
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },

    handleDatasetClick: function(dataset) {
        this.props.addDataset({id: dataset.id, name: dataset.name});
    },

    getInitialState: function() {
        return {
                project: undefined,
                datasets: [],
            };
    },

    render: function() {
        return (
            <div className="container-fluid">
                <ul className="nav navbar-nav">
                    <ProjectList handleProjectClick={this.handleProjectClick} project={this.state.project} />
                    <DatasetList handleDatasetClick={this.handleDatasetClick}
                                 datasets={this.state.datasets}
                                 dataset={this.state.dataset} />
                </ul>
            </div>
        );
    }
});


var DatasetThumbnails = React.createClass({

    componentDidMount: function() {
        var data = {'id': this.props.dataset.id};
        $.ajax({
            url: "http://localhost:4080/webgateway/api/images/",
            jsonp: "callback",
            data: data,
            dataType: 'jsonp',
            cache: false,
            success: function(data) {
                if (this.isMounted()) {
                    this.setState({images: data.images});
                }
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {
            images: [],
        };
    },

    render: function() {

        var thumbs = this.state.images.map(function(img){
            return (
                <img src={"http://localhost:4080/webgateway/render_thumbnail/" + img.id} />
            )
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{this.props.dataset.name}</h3>
                </div>
                <div className="panel-body">
                    {thumbs}
                </div>
            </div>
        )
    }
});


var SelectedDatasets = React.createClass({

    render: function() {

        var colWidth = Math.max(12 / this.props.datasets.length, 3);
        var datasets = this.props.datasets.map(function(dataset) {
            return (
                <div className={"col-xs-" + colWidth} key={dataset.id}>
                    <DatasetThumbnails dataset={dataset} />
                </div>
            );
        });
        return (
            <div className="container-fluid">
                <div className="row">
                    {datasets}
                </div>
            </div>
        )
    }
});


var PDSelectionManager = React.createClass({

    getInitialState: function() {
        return {
            datasets: [],
        };
    },

    addDataset: function(dataset) {
        // Only add dataset if we don't have it already selected
        var datasets = this.state.datasets;
        var selIds = datasets.map(function(d){
            return d.id;
        });
        if (selIds.indexOf(dataset.id) === -1) {
            datasets.push(dataset);
            this.setState(datasets);
        }
    },

    render: function() {
        return (
            <div>
                <PDSelector addDataset={this.addDataset} />
                <SelectedDatasets datasets={this.state.datasets} />
            </div>
        )
    }
});

 
ReactDOM.render(
    <PDSelectionManager />, document.getElementById('react')
);