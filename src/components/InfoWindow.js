import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';

export default class InfoWindow extends Component {
    state = {
        infowindow: {},
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.map !== prevProps.map) {
          this.renderInfoWindow();
        }

        if ((this.props.children !== prevProps.children) && 
            this.infowindow) {

            this.updateContent();
        }

        if ((this.props.visible !== prevProps.visible) ||
            (this.props.marker !== prevProps.marker)) {
            this.props.visible ?
                this.openWindow() :
                this.closeWindow();
        }
    }

    renderInfoWindow() {
        let { map, google, mapCenter } = this.props;
    
        const iw = this.infowindow = new google.maps.InfoWindow({
          content: ''
        });
    }

    renderChildren() {
        const { children } = this.props;
        return ReactDOMServer.renderToString(children);
    }

    updateContent = () => {
        const content = this.renderChildren();
        this.infowindow.setContent(content);
    }

    openWindow() {
        this.infowindow
          .open(this.props.map, this.props.marker);
    }

    closeWindow() {
        this.infowindow.close();
    }
    
    render() {
        return null;
    }
}
