import React, { Component } from 'react';
import './Menu.css';
import { locations } from '../data/locations';

export default class Menu extends Component {
  state = {
    value: '',
    venues: [],
    links: [],
    activeLink: null,
  }

  onClick = (e) => {
    e.preventDefault();
    console.log(e.target.key)
    e.target.classList.add('active-link');
    this.setState({ activeLink: e.target })
  }

  handleChange = (e) => {
    const { venues } = this.state;
    const filteredLinks = venues.filter(venue => {
      return venue.name.toLowerCase().includes(e.target.value)
    })
    
    this.setState({
      value: e.target.value,
      links: filteredLinks
    })
  }

  componentDidMount = () => {
    this.setState({ venues: locations, links: locations })
  }

  componentDidUpdate = (prevProps, prevState) => {
    // removes active-link class
    if (prevState.activeLink === null) {
      // no active link
    } else if (this.state.activeLink !== prevState.activeLink) {
      prevState.activeLink.classList.remove('active-link');
    }
  }

  render() {
    const { links } = this.state;
      // console.log(locations)
      // TODO: make these links clickable, and style them
    return (
      <div className='menu-map-container'>
        <div className='side-menu'>
          <input type="text" 
          className='search-box'
          placeholder="Search.."
          onChange={this.handleChange}
          value={this.state.value}/>
              {links.map(location => {
                return (
                  <a 
                  href={'/'} 
                  key={location.venueId}
                  onClick={this.onClick}>
                  
                    {location.name}
                  </a>
                )
              })}
        </div>
        {this.props.children}
      </div>
    )
  }
}
