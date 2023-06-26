import { useState, useRef, useMemo, createRef } from "react";
import ReactPlayer from "react-player";
import Music from "./music1";

import "./reset.scss";
import "./defaults.scss";
import "./range.scss";
import "./styles.scss";

const App = () => {
  const [url, setUrl] = useState("/music/music1.mp3");
  const [lyrics, setLyrics] = useState(Music.music);
  const [pip, setPip] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [controls, setControls] = useState(true);
  const [light, setLight] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlayBackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);

  const [playingSeconds, setPlayingSeconds] = useState();

  const playerRef = useRef(null);

  const refsByWords = useMemo(() => {
    const refs = {};
    lyrics.forEach((item, index) => {
      const index1 = index;
      item.entry.forEach((item, index) => {
        const refID = `${index1}, ${index}`;
        refs[refID] = createRef(null);
      });
    });
    return refs;
  }, [lyrics]);

  const load = (url) => {
    setUrl(url);
    setPlaying(0);
    setLoaded(0);
    setPip(false);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    console.log("onPause");
    setPlaying(false);
  };

  const handleEnablePIP = () => {
    console.log("onEnablePIP");
    setPip(true);
  };

  const handleDisablePIP = () => {
    console.log("onDisablePIP");
    setPip(false);
  };

  const handleOnPlaybackRateChange = (speed) => {
    setPlayBackRate(parseFloat(speed));
  };

  const handleEnded = () => {
    console.log("onEnded");
    setPlaying(loop);
  };

  const handleDuration = (duration) => {
    console.log("onDuration", duration);
    setDuration(duration);
  };

  const handleProgress = (state) => {
    // console.log("onProgress", state);

    setPlayingSeconds(state.playedSeconds.toFixed(3));
    setPlayed(state.played);
    setLoaded(state.loaded);
    // We only want to update time slider if we are not currently seeking
    // if (!this.state.seeking) {
    //   this.setState(state)
    // }
  };

  const renderLoadButton = (url, label) => {
    return <button onClick={() => load(url)}>{label}</button>;
  };

  const toSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <div className="app">
      <section className="section">
        <h1>ReactPlayer Demo</h1>
        <div className="player-wrapper">
          <ReactPlayer
            ref={playerRef}
            className="react-player"
            width="100%"
            height="100%"
            url={url}
            pip={pip}
            playing={playing}
            controls={controls}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onReady={() => console.log("onReady")}
            onStart={() => console.log("onStart")}
            onPlay={handlePlay}
            onEnablePIP={handleEnablePIP}
            onDisablePIP={handleDisablePIP}
            onPause={handlePause}
            onBuffer={() => console.log("onBuffer")}
            onPlaybackRateChange={handleOnPlaybackRateChange}
            onSeek={(e) => console.log("onSeek", e)}
            onEnded={handleEnded}
            onError={(e) => console.log("onError", e)}
            onProgress={handleProgress}
            onDuration={handleDuration}
          />
        </div>

        <table>
          <tbody></tbody>
        </table>
      </section>
      <section className="section">
        <table>
          <tbody>
            <tr>
              <th>Duu: </th>
              <td>
                Gantsaar duulaach
                {/* {renderLoadButton("/music/music1.mp3", "Gantsaar duulaach")} */}
              </td>
              {/* <td>{renderLoadButton("/music/music2.mp3", "Tumen eh")}</td> */}
            </tr>
          </tbody>
        </table>

        <h2> Karoake </h2>

        <table>
          <tbody>
            {lyrics.map((item, index) => {
              const index1 = index;
              const startTime =
                parseFloat(toSeconds(item._startTime)).toFixed(3) - 0.75;
              const endTime = parseFloat(toSeconds(item._endTime)).toFixed(3);
              let render = false;

              let className = "lyrics";
              if (playingSeconds >= startTime && playingSeconds <= endTime) {
                render = true;
              }

              let wordRenderDelay = 0;

              return (
                <tr key={index}>
                  <td>
                    {item.entry.map((item, index) => {
                      const refID = `${index1}, ${index}`;
                      const a = refsByWords[refID];

                      if (render && a) {
                        const word = a.current;
                        const duration = item._duration + "ms";

                        word.style.display = "block";
                        word.style.animationDuration = duration;
                        word.style.animationDelay = `${wordRenderDelay}ms`;

                        wordRenderDelay += parseFloat(item._duration);
                      }
                      return (
                        <td key={index}>
                          <span
                            key={index}
                            className={className}
                            data-text={item.__text}
                          >
                            {item.__text}
                            <span
                              key={index}
                              className="selected"
                              ref={refsByWords[refID]}
                            >
                              {item.__text}
                            </span>
                          </span>
                        </td>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default App;
