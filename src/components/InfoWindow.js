/* eslint-disable-next-line */
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import './InfoWindow.css';

export default class InfoWindow extends Component {

    componentDidUpdate(prevProps, prevState) {
        // TODO: Figure out if this is 
        // how the infowindow spawns
        // link click not working
        if (this.props.map !== prevProps.map) {
            this.renderInfoWindow();
        }
        
        if ((this.props.children !== prevProps.children) && 
        this.infowindow) {
            
            this.updateContent();
        }
        
        if ((this.props.visible !== prevProps.visible) ||
        (this.props.marker !== prevProps.marker)) {
            console.log('update')
            this.props.visible ?
            this.openWindow() :
            this.closeWindow();
        }
    }

    renderInfoWindow = () => {
        /* eslint-disable-next-line */
        let {map, google, mapCenter} = this.props;
    
        const iw = this.infowindow = new google.maps.InfoWindow({
          content: ''
        });
    
        google.maps.event
          .addListener(iw, 'closeclick', this.onClose.bind(this))
        google.maps.event
          .addListener(iw, 'domready', this.onOpen.bind(this));
    }
    
    onOpen = () => {
        if (this.props.onOpen) this.props.onOpen();
    }
    
    onClose = () => {
        if (this.props.onClose) this.props.onClose();
    }

    renderChildren = () => {
        const { children } = this.props;
        return ReactDOMServer.renderToString(children);
    }

    updateContent = () => {
        const content = this.renderChildren();
        this.infowindow.setContent(content);
    }

    openWindow = () => {
        this.infowindow
          .open(this.props.map, this.props.marker);
    }

    closeWindow = () => {
        this.infowindow.close();
    }
    
    render() {
        return null;
    }
}
