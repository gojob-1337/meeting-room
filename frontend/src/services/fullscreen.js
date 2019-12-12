import screenfull from "screenfull";

export const toggleFullScreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle();
  }
};
