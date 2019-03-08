import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTemplateObject, changeTemplateObject, setTemplatePlace,
         changeTemplatePlace } from '../../redux/actions.js';
import PropTypes from "prop-types";
import Konva from 'konva';
import { Stage, Layer, Group, Rect, Line,
  Text, Circle, Ellipse, Arrow } from 'react-konva';

const mapStateToProps = state => {
  return {
    states: state.template.current.flow.states,
    places: state.template.current.flow.places,
    connections: state.template.current.flow.connections
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setTemplateObject, setTemplatePlace, changeTemplateObject, changeTemplatePlace }, dispatch);
}

class FlowView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: 1000,
      width: 1000,
      dx: 0,
      dy: 0,
      currentAction: false,
      currentPlace: false,
      dragObject: this.dragObject.bind(this),
      dragEndObject: this.dragEndObject.bind(this),
      selectObject: this.selectObject.bind(this),
      dragPlace: this.dragObject.bind(this),
      dragEndPlace: this.dragEndObject.bind(this),
      selectPlace: this.selectObject.bind(this)
    };
  }

  selectObject(event, item) {
    // Only select actions
    if (item.hasOwnProperty('state')) {
      this.props.setTemplatePlace(false);
      this.props.setTemplateObject(item.state.id);
    } else if (item.hasOwnProperty('place')) {
      this.props.setTemplateObject(false);
      this.props.setTemplatePlace(item.place.id);
    } else {
      this.props.setTemplateObject(false);
      this.props.setTemplateObject(false);
    }
  }

  dragObject(event, object) {
    if (object.hasOwnProperty('state')) {
      this.setState({
        currentAction: object.state.id,
        currentPlace: false,
        dx: event.target.attrs.x,
        dy: event.target.attrs.y
      });
    }
    if (object.hasOwnProperty('place')) {
      this.setState({
        currentPlace: object.place.id,
        currentAction: false,
        dx: event.target.attrs.x,
        dy: event.target.attrs.y,
      });
    }
  }

  dragEndObject(event, object) {
    if (object.hasOwnProperty('state')) {
      this.props.changeTemplateObject( object.state.id, "location", { x:this.state.dx, y:this.state.dy } );
      this.setState({ currentAction: false, dx: 0, dy: 0 });
    }
    if (object.hasOwnProperty('place')) {
      this.props.changeTemplatePlace( object.place.id, "location", { x:this.state.dx, y:this.state.dy });
      this.setState({ currentPlace: false, dx: 0, dy: 0 });
    }
  }

  getPoints(conn_item) {
    let sx = 0;
    let sy = 0;
    let ex = 0;
    let ey = 0;
    if (conn_item.connection.type==='a2p') {
      this.props.states.some(function(item) {
        if (conn_item.connection.from === item.state.id) {
          if (item.state.id === this.state.currentAction) {
            sx += this.state.dx;
            sy += this.state.dy + 20;
          } else {
            sx = item.state.location.x;
            sy = item.state.location.y + 20;
          }
          return true;
        }
      },this);
      this.props.places.some(function(item){
        if (conn_item.connection.to === item.place.id) {
          if (item.place.id === this.state.currentPlace) {
            ex = this.state.dx;
            ey = this.state.dy - 20;
          } else {
            ex = item.place.location.x;
            ey = item.place.location.y - 20;
          }
          return true;
        }
      },this);
    } else if (conn_item.connection.type==='p2a') {
      this.props.states.some(function(item) {
        if (conn_item.connection.to === item.state.id) {
          if (item.state.id === this.state.currentAction) {
            ex += this.state.dx;
            ey += this.state.dy - 20;
          } else {
            ex = item.state.location.x;
            ey = item.state.location.y - 20;
          }
          return true;
        }
      },this);
      this.props.places.some(function(item){
        if (conn_item.connection.from === item.place.id) {
          if (item.place.id === this.state.currentPlace) {
            sx = this.state.dx;
            sy = this.state.dy + 20;
          } else {
            sx = item.place.location.x;
            sy = item.place.location.y + 20;
          }
          return true;
        }
      },this);
    }
    return [sx, sy, sx, sy, ex, ey];
  }

  render() {
    const s=1;
    const { states, places, connections } = this.props;
    console.log("render konva stage");

    return (
      <Stage width={this.state.width} height={this.state.height}>
        <Layer>
        {places.map((item,key) => {
          switch (item.place.type) {
            case 'start':
            case 'end':
              return (
                <Group draggable key={key}
                  onDragMove={(event)=>this.state.dragPlace(event,item)}
                  onDragEnd={(event)=>this.state.dragEndPlace(event,item)}
                  onClick={(event)=>this.state.selectPlace(event,item)}
                  x={item.place.location.x} y={item.place.location.y} >
                  <Ellipse radius={{x:40*s,y:20*s}} fill={'white'} stroke={'black'} strokeWidth={1}/>
                  <Text x={-10*s} y={-5*s} text={item.place.name} fontFamily={'Arial'} fontSize={12} />
                </Group>
              );
            case 'place':
              return (
                <Group draggable key={key}
                  onDragMove={(event)=>this.state.dragPlace(event,item)}
                  onDragEnd={(event)=>this.state.dragEndPlace(event,item)}
                  onClick={(event)=>this.state.selectPlace(event,item)}
                  x={item.place.location.x} y={item.place.location.y}>
                  <Circle radius={20*s} fill={'white'} stroke={'black'} strokeWidth={1}/>
                  <Text x={-10*s} y={-5*s} text={item.place.name} fontFamily={'Arial'} fontSize={12} />
                </Group>
              );
          }
        })}
        {states.map((item,key) => (
          <Group draggable key={key}
            onDragMove={(event)=>this.state.dragObject(event,item)}
            onDragEnd={(event)=>this.state.dragEndObject(event,item)}
            onClick={(event)=>this.state.selectObject(event,item)}
            x={item.state.location.x} y={item.state.location.y}
          >
            <Rect fill={'white'} opacity={0.8} x={-20*s} y={-20*s}
              width={40*s} height={40*s} stroke={'black'} strokeWidth={1} />
            <Text x={-15*s} y={-5*s} text={item.state.name} fontFamily={'Arial'} fontSize={12} />
            { (item.state.input==='AND') &&
              <Line points={[-20*s,-20*s,0,-10*s,20*s,-20*s,20*s,-10*s,-20*s,-10*s]} stroke={'black'} strokeWidth={1} /> }
            { (item.state.input==='OR') &&
              <Line points={[-20*s,-10*s,0,-20*s,20*s,-10*s,-20*s,-10*s]} stroke={'black'} strokeWidth={1} /> }
            { (item.state.output==='AND') &&
              <Line points={[-20*s,20*s,0,10*s,20*s,20*s,20*s,10*s,-20*s,10*s]} stroke={'black'} strokeWidth={1} /> }
            { (item.state.output==='OR') &&
              <Line points={[-20*s,10*s,0,+20*s,20*s,10*s,-20*s,10*s]} stroke={'black'} strokeWidth={1} /> }
            { (item.state.output==='XOR') &&
              <Line points={[-20*s,10*s,-5*s,+10*s,-5*s,20*s,-5*s,10*s,5*s,10*s,5*s,20*s,5*s,10*s,20*s,10*s]} stroke={'black'} strokeWidth={1} /> }
            { item.state.manual &&
              <Line points={[12*s,-s*22,4*s,-28*s,9*s,-s*28,9*s,-33*s,15*s,-s*33,15*s,-28*s,20*s,-s*28,12*s,-22*s]} stroke={'black'} strokeWidth={1} /> }
            { item.state.timed &&
              <Circle x={-s*15} y={-s*28} fill={'white'} radius={5*s} stroke={'black'} strokeWidth={1} /> }
            { item.state.timed &&
              <Line points={[-s*15,-s*32,-s*15,-s*28,-s*17, -s*26]} stroke={'black'} strokeWidth={1} /> }
          </Group>
        ))}
        {connections.map((item,key) => (
          <Arrow key={key} points={this.getPoints(item)} pointerLength={5} pointerWidth={5} stroke={'black'} strokeWidth={1} />
        ))}
        </Layer>
      </Stage>
    );
  }
}

FlowView.propTypes = {
};

export default connect(mapStateToProps,mapDispatchToProps)(FlowView);
