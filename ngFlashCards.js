
angular.module('ngFlashCards', [])

  .controller('cardCtrl', function($scope, $timeout) { 
    var selectedCard = null, MAX_SCORE, WAIT = false;

    // Populate Random Card Sequence
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");  
    request.open("GET", "ngFlashCards.json", true);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var cards = JSON.parse(request.responseText);
                $scope.newGame(cards);
                $scope.$apply();
            }
        }
    };
    request.send(null);

    $scope.select = function(card) {
      if (card === selectedCard || card.isFound || WAIT) 
        return;

      card.isFlipped = true;
      if (selectedCard) {
        if (selectedCard.answer === card.answer) {
          correct(card);
        } else {
          incorrect(card);
        }
      } else {
        selectedCard = card;
      }
    }

    $scope.newGame = function(cards) {
      cards = cards || $scope.cards;
      MAX_SCORE = cards.length / 2;
      $scope.cards = [];
      $scope.score = 0;

      while (cards.length > 0) {
        var index = Math.floor(Math.random() * cards.length);
        var card = cards.splice(index,1)[0];
        flip(card, cards.length + 1);
        card.isFound = false;
        $scope.cards.push(card);
      }
    }

    function flip(card, i, callback) {
      $timeout(function() {
        card.isFlipped = false;
        WAIT = false;
        if (callback) callback();
      }, 10 * (i || 30) );
    }

    function incorrect(card) {
      WAIT = true;
      flip(card);
      flip(selectedCard, 30, function() {
        selectedCard = null;
      });
    }

    function correct(card) {
      card.isFlipped = true;
      card.isFound = true;
      selectedCard.isFound = true;
      selectedCard = null;
      $scope.score++;

      if ($scope.score === MAX_SCORE) {
        $timeout(gameOver, 300);
      }
    }

    function gameOver() {
      alert("You win");
    }

  });