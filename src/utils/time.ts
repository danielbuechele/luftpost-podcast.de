export function timeToSeconds(time: string): number {
  return time
    .split(':')
    .reverse()
    .reduce((acc, cv, i) => acc + parseInt(cv, 10) * Math.pow(60, i), 0);
}

export function secondsToTime(seconds: number): string {
  const ss = (seconds % 60).toString().padStart(2, '0');
  seconds = Math.floor(seconds / 60);
  const mm = (seconds % 60).toString().padStart(2, '0');
  seconds = Math.floor(seconds / 60);
  if (seconds === 0) {
    return `${mm}:${ss}`;
  }
  return `${seconds}:${mm}:${ss}`;
}
