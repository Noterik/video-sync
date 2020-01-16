import { createAction } from "typesafe-actions";

export const hold = createAction("HOLD", (reason: string) => reason)();
export const release = createAction("RELEASE", (reason: string) => reason)();
export const seekTo = createAction("SEEK_TO", (time: number, force: boolean = false) => ({ time, force }))();
export const seekToStart = createAction("SEEK_TO_START")();
export const seekToComplete = createAction("SEEK_TO_COMPLETE")();