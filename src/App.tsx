import React, { useState } from 'react';
import './App.css';

function App() {

const [genres, setGenres] = useState<string[]>([""]);
const [seenAnime, setSeenAnime] = useState<string[]>([""]);

type genre = {
  label: string
}

const genreChoices: genre[] = [
  {
    label: 'Shounen'
  },{
    label: 'Comedy'
  },{
    label: 'Romance'
  },{
    label: 'Sports'
  }
]

  return (
    <div className="App">
      <ul> 
        <li></li>
      </ul>
    </div>
  );
}

export default App;
