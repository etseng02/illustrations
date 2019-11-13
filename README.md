## Description
Skedoodle is a multiplayer party game modelled after telestrations designed to be played on mobile devices. Players will be able to connect from their mobile browser into a lobby displayed on a monitor or TV. Once the game starts, each player is given a word and asked to draw that word. Drawings will be converted into a blob (Binary Large OBject) and processed by the database. Each drawing is passed to another different player. The server sends a blob and the app converts the blob back into an image. The following player has to guess what they think the image is. The guess is passed and the next player has to draw that word. This continues until all the rounds are complete. Players will be able to visually see on the host machine (typically displayed on a big monitor) how their word and drawings have mutated over each player’s iteration.

## Requirements
* A computer or laptop is required to host the server. This device needs to be connected to the internet.
* 3 players minumum for best experience. 
* Each player needs a mobile device connected to the same network as the host machine.

## Final Product
!["Lobby View"](https://github.com/etseng02/illustrations/docs/skedoodle1)

!["Mobile Client View"](https://github.com/etseng02/illustrations/docs/skedoodle2)

## Getting Started
In order to run this app, you will need to run both the API server and the React client.

1. Open the illustrations/api folder in terminal.
2. Run npm install to install dependencies.
3. Npm start to start the api server.
4. Open the main illustrations folder.
5. npm install to install dependencies.
6. Npm start to run client.