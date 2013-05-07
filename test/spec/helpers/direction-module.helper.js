module.exports = {
  inbound: {
    proximity: {
      maximum: 5,
      minimum: 2
    },
    stops: {
      '1128': {
        redPin: '1',
        greenPin: '2'
      }, 
      '1129': {
        redPin: '3',
        greenPin: '4'
      },
      '1938': {
        redPin: '5',
        greenPin: '6'
      }
    }
  },
  outbound: {
    proximity: {
      maximum: 5,
      minimum: 2
    },
    stops: {
      '11164': {
        redPin: '7',
        greenPin: '8'
      },
      '1164': {
        redPin: '9',
        greenPin: '10'
      },
      '1162': {
        redPin: '11',
        greenPin: '12'
      }
    }
  }
};
