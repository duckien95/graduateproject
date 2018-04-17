var React = require('react')

var Food = React.createClass({
  render: function() {
    return (
        <div>Hello </div>
    );
  }
});

ReactDOM.render(<Food />,  document.getElementById('food'))