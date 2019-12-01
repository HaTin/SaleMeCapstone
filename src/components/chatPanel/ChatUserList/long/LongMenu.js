import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = [
  'Delete'
];


class LongMenu extends Component {
  state = {
    anchorEl: undefined,
    open: false,
  };

  handleClick = event => {
    event.stopPropagation();
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = (e) => {
    e.stopPropagation();
    console.log(e.target.value)
    const option = e.target.value
    this.props.handleOption(option)
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={this.state.open ? 'long-SidenavContent.js' : null}
          aria-haspopup
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
          MenuListProps={{
            style: {
              width: 200,
            },
          }}
        >
          {options.map(option =>
            <MenuItem key={option} onClick={this.handleRequestClose}>
              {option}
            </MenuItem>,
          )}
        </Menu>
      </div>
    );
  }
}

export default LongMenu;