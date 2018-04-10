var Player = {
  setNumber: function(number) {
    this.number = number;
  },
  addPoints: function(points) {
    this.score += points;
  },
  score: 0
};

var Turn = {
  points: 0,
  setPlayer: function(player) {
    this.player = player;
  },
  roll: function() {
    var die = Object.create(Die);
    var roll = die.roll();
    if (roll === 1) {
      this.over = true;
      this.points = 0;
    } else {
      this.points += roll;
    }
    return roll;
  },
  hold: function() {
    this.player.addPoints(this.points);
    this.over = true;
  }
};

var Die = {
  roll: function() {
    return Math.floor(Math.random() * 5 + 1);
  }
};

var Game = {
  createPlayers: function(numberOfPlayers) {
    this.players = [];
    for (var i = numberOfPlayers; i > 0; i--) {
      var player = Object.create(Player);
      player.setNumber(i);
      this.players.push(player);
      this.nextPlayer();
    }
  },
  nextPlayer: function() {
    this.currentPlayer = this.players.pop();
    this.players.unshift(this.currentPlayer);
    return this.currentPlayer;
  },
  over: function() {
    return this.players.some(function(player) {
      return player.score >= 100;
    });
  },
  winner: function() {
    return this.players.reduce(function(highestScorerYet, currentPlayer) {
      if (highestScorerYet.score > currentPlayer.score) {
        return highestScorerYet;
      } else {
        return currentPlayer;
      }
    });
  }
};

$(function() {
  function endTurn() {
    $("#player" + currentPlayer.number + "-score").empty().append(currentPlayer.score);
    currentPlayer = game.nextPlayer();
  }

  function newTurn() {
    $("#turn").hide();
    $("#current-player").empty().append(currentPlayer.number);
    var currentTurn = Object.create(Turn);
    currentTurn.setPlayer(currentPlayer);
    return currentTurn;
  }

  var game = Object.create(Game);
  game.createPlayers(2);
  var currentPlayer = game.currentPlayer;
  var currentTurn = newTurn();

  $("button#roll").click(function() {
    var currentRoll = currentTurn.roll();
    $("#current-roll").empty().append(currentRoll);
    $("#current-turn-score").empty().append(currentTurn.points);
    $("#turn").show();
    if (currentTurn.over) {
      alert("You rolled a 1. Your turn is over!")
      endTurn();
      currentTurn = newTurn();
    }
  });

  $("button#hold").click(function() {
    currentTurn.hold();
    endTurn();
    alert("You scored " + currentTurn.points + " points this turn.");
    if (game.over()) {
      alert("Player " + game.winner().number + " wins!")
    } else {
      currentTurn = newTurn();
    }
  });
});