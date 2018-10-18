import React, { Component } from 'react';
import './Menu.css';

export default class Menu extends Component {
  state = {
    value: '',
    venues: [],
    links: [],
    activeLink: null,
  }

  onClick = (e, location, marker) => {
    e.preventDefault();
    e.target.classList.add('active-link');
    this.setState({ activeLink: e.target })

    // activate onMarkerClick in <MapContainer />
    this.props.onVenueClick(location, marker)
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
    const { locations } = this.props;
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
                  onClick={(e) => this.onClick(e, location.marker, location.marker)}>
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
