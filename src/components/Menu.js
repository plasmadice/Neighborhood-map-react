import React, { Component } from 'react';
import './Menu.css';
import { locations } from '../data/locations';

export default class Menu extends Component {
  render() {
      // console.log(locations)
      // TODO: make these links clickable, and style them
    return (
      <div className='side-menu'>
        <ul className='location-list'>
          {locations.map(location => {
            return (
              <li 
                key={location.venueId}
                
                >
                
                {location.name}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
