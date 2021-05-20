export function getHashString(game?: string, playerIndex?: number) {
  if (!game) return "#";
  let hash = `#${game}`;
  if (playerIndex !== undefined) hash += `/${playerIndex}`;
  return hash;
}

export function setHash(game?: string, playerIndex?: number) {
  window.location.hash = getHashString(game, playerIndex);
}

export function replaceHash(game?: string, playerIndex?: number) {
  window.history.replaceState(null, "", getHashString(game, playerIndex));
}

type HashStatus = {
  game?: string;
  playerIndex?: number;
};

function getHash(): HashStatus {
  let hash = window.location.hash;
  hash = hash.substr(1, hash.length);
  if (hash.length === 0) return {};
  let [game, potentialIndex] = hash.split("/");
  let maybeIndex = parseInt(potentialIndex, 10);
  let playerIndex = isNaN(maybeIndex) ? undefined : maybeIndex;
  return { game, playerIndex };
}

export function createHashEmitter(emit: (hashStatus: HashStatus) => void) {
  emit(getHash());
  window.onhashchange = () => emit(getHash());
  return () => (window.onhashchange = () => undefined);
}
