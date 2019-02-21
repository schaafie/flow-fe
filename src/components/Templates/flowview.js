import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTemplateObject, changeTemplateObject,
         changeTemplateTerminator } from '../../redux/actions.js';
import PropTypes from "prop-types";
import Konva from 'konva';
import { Stage, Layer, Group, Rect, Line,
  Text, Circle, Ellipse, Arrow } from 'react-konva';

const mapStateToProps = state => {
  return {
    states: state.template.current.flow.states,
    terminators: state.template.current.flow.terminators,
    connections: state.template.current.flow.connections
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setTemplateObject, changeTemplateObject }, dispatch);
}

class FlowView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: 1000,
      width: 1000,
      dx: 0,
      dy: 0,
      current: false,
      dragObject: this.dragObject.bind(this),
      dragEndObject: this.dragEndObject.bind(this),
      selectObject: this.selectObject.bind(this)
    };
  }

  selectObject(event, item) {
    // Only select actions
    if (item.state.id>0) {
      this.props.setTemplateObject(item.state.id);
    } else {
      this.props.setTemplateObject(false);
    }
  }

  dragObject(event, object) {
    this.setState({
      current: object.state.id,
      dx: event.target.attrs.x,
      dy: event.target.attrs.y
    });
  }

  dragEndObject(event, object) {
    this.props.changeTemplateObject(
      object.state.id,
      "location",
      {
        x:object.state.location.x,
        y:object.state.location.y,
        dx:this.state.dx,
        dy:this.state.dy
      }
    );
    this.setState({
      current: false,
      dx: 0,
      dy: 0
    });
  }

  getPoints(conn_item) {
    let sx = 0;
    let sy = 0;
    let ex = 0;
    let ey = 0;
    let items = this.props.states.concat(this.props.terminators);
    items.forEach( function(item) {
      if (conn_item.connection.from === item.state.id) {
        sx = item.state.location.x;
        sy = item.state.location.y + 20;
        if (item.state.id === this.state.current) {
          sx += this.state.dx;
          sy += this.state.dy;
        } else if (item.state.location.dx) {
          sx += item.state.location.dx;
          sy += item.state.location.dy;
        }
      }
      if (conn_item.connection.to === item.state.id) {
        ex = item.state.location.x;
        ey = item.state.location.y - 20;
        if (item.state.id === this.state.current) {
          ex += this.state.dx;
          ey += this.state.dy;
        } else if (item.state.location.dx) {
          ex += item.state.location.dx;
          ey += item.state.location.dy;
        }
      }
    }, this );
    return [sx, sy, sx, sy, ex, ey];
  }

  render() {
    const s=1;
    const { states, terminators, connections } = this.props;

    return (
      <Stage width={this.state.width} height={this.state.height}>
        <Layer>
        {terminators.map((item,key) => (
          <Group draggable
              key={key}
              onDragMove={(event)=>this.dragObject(event,item)}
              onDragEnd={(event)=>this.dragEndObject(event,item)}
              onClick={(event)=>this.selectObject(event,item)}
              >
            <Ellipse  x={item.state.location.x}
                      y={item.state.location.y}
                      radius={{x:40*s,y:20*s}}
                      fill={'white'}
                      stroke={'black'}
                      strokeWidth={1}/>
            <Text x={item.state.location.x-10*s}
                  y={item.state.location.y-5*s}
                  text={item.state.name}
                  fontFamily={'Arial'}
                  fontSize={12} />
          </Group>
        ))}
        {states.map((item,key) => (
          <Group
            draggable
            key={key}
            onDragMove={(event)=>this.dragObject(event,item)}
            onDragEnd={(event)=>this.dragEndObject(event,item)}
            onClick={(event)=>this.selectObject(event,item)}
          >
            <Rect
              fill={'white'}
              opacity={0.8}
              x={item.state.location.x-20*s}
              y={item.state.location.y-20*s}
              width={40*s}
              height={40*s}
              stroke={'black'}
              strokeWidth={1}
            />
            <Text
              x={item.state.location.x-15*s}
              y={item.state.location.y-5*s}
              text={item.state.name}
              fontFamily={'Arial'}
              fontSize={12}
            />
            { (item.state.input==='AND') &&
              <Line points={[item.state.location.x-20*s,item.state.location.y-20*s,
                            item.state.location.x,item.state.location.y-10*s,
                            item.state.location.x+20*s,item.state.location.y-20*s,
                            item.state.location.x+20*s,item.state.location.y-10*s,
                            item.state.location.x-20*s,item.state.location.y-10*s]}
                stroke={'black'} strokeWidth={1} /> }
            { (item.state.input==='OR') &&
              <Line points={[item.state.location.x-20*s,item.state.location.y-10*s,
                            item.state.location.x,item.state.location.y-20*s,
                            item.state.location.x+20*s,item.state.location.y-10*s,
                            item.state.location.x-20*s,item.state.location.y-10*s]}
                stroke={'black'} strokeWidth={1} /> }
            { (item.state.output==='AND') &&
              <Line points={[item.state.location.x-20*s,item.state.location.y+20*s,
                            item.state.location.x,item.state.location.y+10*s,
                            item.state.location.x+20*s,item.state.location.y+20*s,
                            item.state.location.x+20*s,item.state.location.y+10*s,
                            item.state.location.x-20*s,item.state.location.y+10*s]}
                stroke={'black'} strokeWidth={1} /> }
            { (item.state.output==='OR') &&
              <Line points={[item.state.location.x-20*s,item.state.location.y+10*s,
                            item.state.location.x,item.state.location.y+20*s,
                            item.state.location.x+20*s,item.state.location.y+10*s,
                            item.state.location.x-20*s,item.state.location.y+10*s]}
                stroke={'black'} strokeWidth={1} /> }
            { (item.state.output==='XOR') &&
              <Line points={[item.state.location.x-20*s,item.state.location.y+10*s,
                            item.state.location.x-5*s,item.state.location.y+10*s,
                            item.state.location.x-5*s,item.state.location.y+20*s,
                            item.state.location.x-5*s,item.state.location.y+10*s,
                            item.state.location.x+5*s,item.state.location.y+10*s,
                            item.state.location.x+5*s,item.state.location.y+20*s,
                            item.state.location.x+5*s,item.state.location.y+10*s,
                            item.state.location.x+20*s,item.state.location.y+10*s]}
                             stroke={'black'} strokeWidth={1} /> }
            { item.state.manual &&
              <Line points={[item.state.location.x+12*s, item.state.location.y-s*22,
                            item.state.location.x+4*s,item.state.location.y-28*s,
                            item.state.location.x+9*s,item.state.location.y-s*28,
                            item.state.location.x+9*s,item.state.location.y-33*s,
                            item.state.location.x+15*s,item.state.location.y-s*33,
                            item.state.location.x+15*s,item.state.location.y-28*s,
                            item.state.location.x+20*s,item.state.location.y-s*28,
                            item.state.location.x+12*s,item.state.location.y-22*s]}
                             stroke={'black'} strokeWidth={1} /> }
            { item.state.timed &&
              <Circle
                x={item.state.location.x-s*15}
                y={item.state.location.y-s*28}
                fill={'white'}
                radius={5*s}
                stroke={'black'}
                strokeWidth={1} /> }
            { item.state.timed &&
              <Line points={[item.state.location.x-s*15,item.state.location.y-s*32,
                            item.state.location.x-s*15,item.state.location.y-s*28,
                            item.state.location.x-s*17, item.state.location.y-s*26]}
                stroke={'black'} strokeWidth={1} /> }

          </Group>
        ))}
        {connections.map((item,key) => (
          <Arrow
            key={key}
            points={this.getPoints(item)}
            pointerLength={5}
            pointerWidth={5}
            stroke={'black'}
            strokeWidth={1} />
        ))}
        </Layer>
      </Stage>
    );
  }
}

FlowView.propTypes = {
};

export default connect(mapStateToProps,mapDispatchToProps)(FlowView);
