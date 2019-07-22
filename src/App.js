import React, { useState } from 'react';
import './style.css';

import _map from 'lodash/map'
import _forEach from 'lodash/forEach'


const people = [
  {
    name: 'Erik',
    image: 'erik.jpg'
  },
  {
    name: 'Matteo',
    image: 'matteo.jpg'
  },
  {
    name: 'Agata',
    image: 'agata.jpg'
  },
  {
    name: 'Ida',
    image: 'ida.jpg'
  },
  {
    name: 'Linn',
    image: 'linn.jpg'
  },
  {
    name: 'Ross',
    image: 'ross.jpg'
  },
  {
    name: 'Sara',
    image: 'sara.jpg'
  },
  {
    name: 'Patricia',
    image: 'patricia.jpg'
  },
]

const Portrait = ({person}) => {

  var style = {
    borderRadius: '50%',
    width: 150,
    height: 150,
    position: 'absolute',
    top: person.y - 75,
    left: person.x - 75,
  }

  if (person.collisionTick > 0) {
    style.border = person.collisionTick + 'px solid white'
  }

  return (
    <img style={style} src={`/img/${person.image}`} alt='bild'/>
  )
}

class Portraits extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      people: _map(props.people, function(person) {
        return {
          name: person.name,
          image: person.image,
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          vx: Math.random() * 10 - 5,
          vy: Math.random() * 10 - 5,
          collisionTick: 0
        }
      })
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updatePortraits(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePortraits() {
    var { people } = this.state
    for (var i = 0; i < people.length; i++) {
      var pa = people[i]
      for (var j = i+1; j < people.length; j++) {
        var pb = people[j]
        var delta = {x: pb.x - pa.x, y: pb.y - pa.y}
        var dist = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))
        if (dist < 150) {
          pa.vx += -10 * delta.x / dist
          pa.vy += -10 * delta.y / dist
          pb.vx += 10 * delta.x / dist
          pb.vy += 10 * delta.y / dist

          pa.collisionTick = 10
          pb.collisionTick = 10
        }
      }

      if (pa.x < 0 || pa.x > 1000 || pa.y < 0 || pa.y > 1000) {
        pa.vx *= -1
        pa.vy *= -1
      }

      if(this.props.isOn) {
        pa.vx += Math.random() * 6 - 3
        pa.vy += Math.random() * 6 - 3
      }

      var friction = 0.99
      if (!this.props.isOn) friction = 0.75
      pa.vx *= friction
      pa.vy *= friction
      pb.vx *= friction
      pb.vy *= friction

      pa.x += pa.vx
      pa.y += pa.vy
      pa.collisionTick--
      pb.collisionTick--
    }
    this.setState({people: people})
  }

  render () {
    return _map(this.state.people, person => <Portrait key={person.name} person={person} />)
  }
}


function App() {
  const [isOn, setIsOn] = useState(true)
  return (
    <div>
      <Portraits people={people} isOn={isOn} />
      <button style={{
        position: 'absolute',
        bottom: 8,
        width: '100%',
        padding: '1rem',
        fontSize: 24,
        color: 'white',
        border: 'none',
        margin: '16 0',
        backgroundColor: 'hotpink'
      }} onClick={() => setIsOn(!isOn)}>{isOn ? 'STOP!' : 'START!'}</button>
    </div>
  );
}

export default App;
