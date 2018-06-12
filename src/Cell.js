import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './App.css';
import constants from './constants.js';

const Cell = props => (
  <div>
    {props.youLost
      ? _renderLost(props)
      : props.youWon
        ? _renderWon(props)
        : _renderPlaying(props)}
  </div>
);

const _renderLost = props => {
  if (props.status === constants.MARKED_MINE_CHAR) {
    return constants.MARKED_MINE_CHAR;
  } else if (props.value === constants.MINE_CHAR) {
    return <GrowingCell>{constants.MINE_CHAR}</GrowingCell>;
  } else if (props.status) {
    return props.value;
  } else {
    return <UnopenedCell {...props} />;
  }
};

const _renderWon = props => {
  if (props.value === constants.MINE_CHAR) {
    return <GrowingCell>{constants.WON_MINE_CHAR}</GrowingCell>;
  } else {
    return props.value;
  }
};

const _renderPlaying = props => {
  if (props.status === constants.MARKED_MINE_CHAR) {
    return constants.MARKED_MINE_CHAR;
  } else if (props.status) {
    return props.value;
  } else {
    return <UnopenedCell {...props} />;
  }
};

const UnopenedCell = props => (
  <div className={props.youWon || props.youLost ? '' : 'active-cell'}>
    {constants.UNOPENED_SQUARE_CHAR}
  </div>
);

const GrowingCell = props => (
  <ReactCSSTransitionGroup
    transitionName="growing-cell"
    transitionAppear={true}
  >
    <div>{props.children}</div>
  </ReactCSSTransitionGroup>
);

export default Cell;
