import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Marker extends Component {
    
    componentDidUpdate = (prevProps) => {
        if ((this.props.map !== prevProps.map) ||
        (this.props.position !== prevProps.position)) {
            // The relevant props have changed
            this.renderMarker();
      }
    }

    renderMarker = () => {
        let {
            map,
            google,
            position,
            mapCenter
        } = this.props;

        let pos = position || mapCenter;
        position = new google.maps.LatLng(pos.lat, pos.lng);

        const pref = { 
            map: map, 
            position: position
        };
        console.log(pref);
        this.marker = new google.maps.Marker(pref);

        const evtNames = ['click', 'mouseover'];

        evtNames.forEach(e => {
            this.marker.addListener(e, this.handleEvent(e));
        })
    }

    handleEvent = (evtName) => {
        const camelize = function(str) {
            return str.split(' ').map(function(word){
              return word.charAt(0).toUpperCase() + word.slice(1);
            }).join('');
        }

        let evt = evtName;

        return (e) => {
            const evtName = `on${camelize(evt)}`
            if (this.props[evtName]) {
              this.props[evtName](this.props, this.marker, e);
            }
        }
    }

    render() {
        return null;
    }
}

Marker.propTypes = {
    position: PropTypes.object,
    map: PropTypes.object
}