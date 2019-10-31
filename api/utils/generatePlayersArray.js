function generatePlayersArray(size, startAt = 1) {
  const players = [...Array(size).keys()].map(i => i + startAt)
  const playersArray = [];
  players.unshift(players.pop())
  players.forEach(() => {
     players.push(players.shift())
     playersArray.push(players.concat());
     //THIS IS WHERE WE WILL ADD PLAYERS ARRAY INTO JSON
  });
  return playersArray;
}

module.exports = generatePlayersArray;