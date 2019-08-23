import React, { useState, useEffect, useCallback } from "react";
import request from "request-promise-native";
import "./App.css";

const GIPHY_API_KEY = "DDNpg13GKnbYe1Dn1aNonhFJTq3ufxGP";

const randomInt = max => Math.floor(Math.random() * max);

const randomValue = array => array[randomInt(array.length)];

const fetchRandomGiphy = async tag => {
  const response = await request({
    url: "https://api.giphy.com/v1/gifs/random",
    qs: {
      api_key: GIPHY_API_KEY,
      tag,
      rating: "g"
    },
    json: true
  });

  return response.data.image_url;
};

const fetchRandomGiphyBySearch = async query => {
  const response = await request({
    url: "https://api.giphy.com/v1/gifs/search",
    qs: {
      api_key: GIPHY_API_KEY,
      q: query,
      limit: 5,
      rating: "g"
    },
    json: true
  });

  return randomValue(response.data).images.original.url;
};

const RandomGiphy = ({ tags, theme }) => {
  const [src, setSrc] = useState();
  const fetchNew = useCallback(() => {
    if (theme) {
      // search gives better results than random endpoint if we want to keep it to a theme
      fetchRandomGiphyBySearch([theme].concat(tags).join(" ")).then(setSrc);
    } else {
      fetchRandomGiphy(randomValue(tags)).then(setSrc);
    }
  }, [theme, tags]);

  useEffect(() => fetchNew(), [fetchNew]);

  return (
    <div className="random-giphy">
      <img src={src} alt={`${[theme].concat(tags).join(" ")}`}/>
      <div>
        <button onClick={fetchNew}>🎲</button>
      </div>
    </div>
  );
};

const fistOfFiveData = [
  [5, ["victory", "win", "ecstatic"]],
  [4, ["happy"]],
  [3, ["meh"]],
  [2, ["sad"]],
  [1, ["sad", "depressed"]]
];

function App() {
  const params = new URL(document.location).searchParams;
  const theme = params.get("theme");

  return (
    <div id="top" className="App">
      <form>
        <input
          type="text"
          name="theme"
          defaultValue={theme}
          placeholder="Theme (optional)"
        />
        <input type="submit" />
      </form>
      {fistOfFiveData.map(([level, tags]) => (
        <div id={`level-${level}`} className="fist-container">
          <h1>{level}</h1>
          <RandomGiphy theme={theme} tags={tags} />
          <div className="next-link-container">
            {level > 1 && (
              <a className="next-link" href={`#level-${level - 1}`}>
                ➤
              </a>
            )}
            {level === 1 && <a href="#top">Back to Top</a>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
