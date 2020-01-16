import React, { useRef, useEffect, useReducer, useMemo, useCallback } from "react";
import { reducer, initialState } from "./SyncedVideo.reducer";
import * as actions from "./SyncedVideo.actions";
import { mergeRefs } from "../util";

interface SyncedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  time?: number;
  playing?: boolean;
  onOutOfSync?: () => void;
  onSync?: () => void;
  onCancelSync?: () => void;
  maxDrift?: number;
};

type Seek = {
  promise: Promise<void>;
  cancel: (reason: string) => void;
}

/**
 * Sets the currentTime of the given video to the specified time.
 * 
 * @param time Time to seek to
 * @param video The HTMLVideoElement on which to perform the seek on.
 */
const seek = (time: number, video: HTMLVideoElement): Seek => {
  let cancel: (reason: string) => void = () => undefined;
  const promise = new Promise<void>((resolve, reject) => {
    cancel = (reason) => {
      reject(reason);
      video.removeEventListener("seeked", onSeeked);
    }

    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };

    video.addEventListener("seeked", onSeeked);

    video.currentTime = time / 1000;
    return undefined;
  })

  return {
    promise,
    cancel,
  };
};

const checkSync = (maxDiff: number) => (syncTime: number, video: HTMLVideoElement) => {
  return Math.abs(syncTime - video.currentTime * 1000) > maxDiff;
}

export const SyncedVideo = React.forwardRef<HTMLVideoElement, SyncedVideoProps>((props, ref) => {
  const { time, playing = false, onOutOfSync, onSync, onCancelSync, maxDrift = 500, ...rest } = props; 

  const [state, dispatch] = useReducer(reducer, initialState);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSeek = useRef<Seek>();

  const isSynced = useMemo(() => checkSync(maxDrift), [maxDrift]);

  useEffect(() => {
    if(videoRef.current) {
      if(playing) {
        videoRef.current.paused && videoRef.current.play();
      } else if(!videoRef.current.paused && !playing) {
        videoRef.current.pause();
        time && dispatch(actions.seekTo(time, true)); //When pausing we force the video to seek to the latest time.
      }
    } 
  }, [playing, time]);

  useEffect(() => {
    if (videoRef.current && time) {
      if(isSynced(time, videoRef.current)) {
        onOutOfSync && onOutOfSync();
        dispatch(actions.seekTo(time));
      }
    }
  }, [time, onOutOfSync]);

  useEffect(() => {
    if(videoRef.current && state.seekTo) {
      if(currentSeek.current) currentSeek.current.cancel("Cancelled");
      dispatch(actions.seekToStart());
      currentSeek.current = seek(state.seekTo, videoRef.current);
      currentSeek.current.promise
        .catch(() => {
          onCancelSync && onCancelSync();
        })
        .then(() => {
          dispatch(actions.seekToComplete());
          onSync && onSync();
        })
    }
  }, [state.seekTo, onSync, onCancelSync]);

  const usedRef = useMemo(() => ref !== null ? mergeRefs(ref, videoRef) : videoRef, [ref]);

  return (
    <video {...rest} ref={usedRef} />
  );
});