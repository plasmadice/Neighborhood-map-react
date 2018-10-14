import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class Map extends Component {
    state = {
        currentLocation: {},
        map: {}
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
    }

    componentDidMount = () => {
        this.loadMap();

        const { lat, lng } = this.props.initialCenter;
        const currentLocation = { lat, lng }

        this.setState({
            currentLocation : currentLocation
        })
    }

    loadMap = () => {
        if (this.props && this.props.google) {
            // google is available
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            let { zoom } = this.props;
            const { lat, lng } = this.state.currentLocation;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
              center: center,
              zoom: zoom
            })
            this.map = new maps.Map(node, mapConfig);
            this.setState({ map: this.map })
        }
    }

    renderChildren = ()  => {
        const { children } = this.props;
    
        if (!children) return;
    
        return React.Children.map(children, c => {
          return React.cloneElement(c, {
            map: this.map,
            google: this.props.google,
            mapCenter: this.state.currentLocation
          });
        })
    }

    render() {
        const style = {
            width: '100%',
            height: '100%'
        }

        return (
            <div ref='map' style={style}>
                Loading map...
                {this.renderChildren()}
            </div>
        )
    }
}

Map.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    initialCenter: PropTypes.object
}
Map.defaultProps = {
    zoom: 13,
    // Miami area
    initialCenter: {
      lat: 25.7852234,
      lng: -80.2480662
    }
}