import * as actions from "./SyncedVideo.actions";
import { ActionType } from "typesafe-actions";

interface SyncedVideoState {
  holdingReasons: string[];
  seekTo: number | undefined;
  shouldForceSeek: boolean;
  seeking: boolean;
}

export const initialState: SyncedVideoState = {
  holdingReasons: [],
  seekTo: undefined,
  shouldForceSeek: false,
  seeking: false
};

type RootAction = ActionType<typeof actions>;

export const reducer = (
  state: SyncedVideoState,
  action: RootAction
): SyncedVideoState => {
  switch (action.type) {
    case "HOLD":
      return {
        ...state,
        holdingReasons: [...state.holdingReasons.filter(r => r !== action.payload), action.payload]
      };
    case "RELEASE":
      return {
        ...state,
        holdingReasons: state.holdingReasons.filter(r => r !== action.payload)
      };
    case "SEEK_TO":
      return {
        ...state,
        seekTo: action.payload.time,
        shouldForceSeek: action.payload.force
      };
    case "SEEK_TO_START":
      return { ...state, shouldForceSeek: false, seeking: true };
    case "SEEK_TO_COMPLETE":
      return { ...state, seeking: false };
    default:
      return state;
  }
};
