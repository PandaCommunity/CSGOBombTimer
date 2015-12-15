# Node.js BombTimer

With the recent release of Counter-Strike: Global Offensive's Game State "library" release, we've decided to release a Node.js script that counts down the bomb timer automatically, along with some cool stats if you decide to share it with friends.

### Installation
To install BombTimer, you must install Node.js (duh), along with the following libraries:

```sh
$ npm install http
```
```sh
$ npm install fs
```
```sh
$ npm install socket.io
```
Then, move gamestate_integration_bombtimer.cfg to your CS:GO cfg folder.

Once that's done, run the script via
```sh
$ node timer.js
```
And just open index.html locally.