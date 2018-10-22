import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Menu.css';
import { stack as BurgerMenu } from 'react-burger-menu';
import { bmStyles } from '../data/styles.js';

class Menu extends Component {

  // required use of constructor due to updateWidth changing 
  constructor(props) {
    super(props)
    this.updateWidth = this.updateWidth.bind(this);
    this.state = {
      isOpen: true,
      query: '',
    }
  }



  updateQuery = (event) => {
    this.setState({ query: event.target.value })
  }

  // reset all markers in the map to default icons.
  resetMarkerIcons = (mapMarkers, defaultIcon) => {
    mapMarkers.forEach(mapMarker => {
      mapMarker.setIcon(defaultIcon)
    })
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  }

  updateWidth() {
    if (window.innerWidth > 479) {
      this.setState({ isOpen: true })
    } else if (window.innerWidth < 479) {
      this.setState({ isOpen: false })
    }
  }

  render() {
    const { map, markers, mapMarkers, infowindow, defaultIcon, highlightedIcon, addMarkers, hideMarkers, populateInfoWindow } = this.props
    const { query } = this.state
    const filteredMapMarkers = mapMarkers.filter(mapMarker => mapMarker.name.toUpperCase().includes(query.toUpperCase()))
    const filteredMarkers = markers.filter(marker => marker.name.toUpperCase().includes(query.toUpperCase()))

    return (
      <BurgerMenu
        width={(window.innerWidth > 767) ? 280 : 260}
        styles={bmStyles}
        isOpen={this.state.isOpen}>
        <form className='bm-form' onSubmit={(e) => { hideMarkers(mapMarkers); addMarkers(map, filteredMarkers, infowindow); e.preventDefault() }} >
          <h1 className='bm-title'
            style={window.innerWidth > 767 ?
              { fontSize: '1.1em' } : { fontSize: '1em' }}
            aria-labelledby='title-description'
            tabIndex='0' >
            Neighborhood Map - React
              </h1>
          <label id='title-description' className='aria-labels'>
            Neighborhood Map Side Menu
              </label>
          <input
            className='search-box'
            aria-label='search'
            type='text'
            value={query}
            placeholder='Restaurant location'
            onChange={this.updateQuery}
            aria-labelledby='search-box' />
          <label id='search-box' className='aria-labels'>
            Search and Filter from hardcoded list
                  </label>
          <input className='search-filter'
            type='submit'
            value='Filter' />
        </form>
        <ul
          className='bm-list'>
          {filteredMapMarkers.map(mapMarker => (
            // aria-labelledby
            // and labels
            <li
              className='menu-item'
              key={mapMarker.name}
              tabIndex='0'
              onClick={() => {
                this.setState({ isOpen: false })
                populateInfoWindow(mapMarker, infowindow, map)
              }}
              onMouseOver={() => mapMarker.setIcon(highlightedIcon)} onMouseOut={() => { mapMarker.setIcon(defaultIcon) }}
              onFocus={() => { this.resetMarkerIcons(mapMarkers, defaultIcon); mapMarker.setIcon(highlightedIcon) }}
              onKeyPress={(event) => { if (event.key === 'Enter') populateInfoWindow(mapMarker, infowindow, map) }} >
              {mapMarker.name}
            </li>
          ))}
        </ul>
      </BurgerMenu>
    )
  }
}

Menu.propTypes = {
  map: PropTypes.object.isRequired,
  defaultIcon: PropTypes.object.isRequired,
  highlightedIcon: PropTypes.object.isRequired,
  infowindow: PropTypes.object.isRequired,
  markers: PropTypes.array.isRequired,
  mapMarkers: PropTypes.array.isRequired,
  addMarkers: PropTypes.func.isRequired,
  hideMarkers: PropTypes.func.isRequired,
  populateInfoWindow: PropTypes.func.isRequired
}

export default Menu;