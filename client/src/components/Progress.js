import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({ percentage }) => {
  return (
    <div>
      <div className="progress">
      <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: `${percentage}%` }}
      aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">{percentage}%</div>
      </div>
    </div>
  );
}

Progress.propTypes = {
  percentage: PropTypes.number.isRequired
}

export default Progress;
