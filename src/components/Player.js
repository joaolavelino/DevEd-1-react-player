import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  songs,
  setCurrentSong,
  setSongs,
}) => {
  //useEffect
  useEffect(() => {
    const newSongs = songs.map((mapped) => {
      if (mapped.id === currentSong.id) {
        return {
          ...mapped,
          active: true,
        };
      } else {
        return {
          ...mapped,
          active: false,
        };
      }
    });
    setSongs(newSongs);
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  //eventHandlers
  const playSongHandler = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const getTime = (time) => {
    return (
      //formula pronta de formatar segundos em min:seg
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    //1o - ligo a posiçao do audio à posicao do input - aqui serve para atualizar a musica em si.
    audioRef.current.currentTime = e.target.value;
    //2o eu atualizo o statos da song info, pra atualizar os contadores
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler = (direction) => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      // setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      if (currentIndex === songs.length - 1) {
        setCurrentSong(songs[0]);
        return;
      }
      setCurrentSong(songs[currentIndex + 1]);
    } else if (direction === "skip-back") {
      if (currentIndex === 0) {
        setCurrentSong(songs[songs.length - 1]);
        return;
      }
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  //Add style
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };
  const gradient = {
    background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div className="track">
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            type="range"
            onChange={dragHandler}
            style={gradient}
          />
          <div className="animate-track" style={trackAnim}></div>
        </div>
        <p>{getTime(songInfo.duration || 0)}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
