
angular.module('ngFlashCards', [])

  .controller('cardCtrl', function($scope, $timeout) { 
    var selectedCard = null, MAX_SCORE, WAIT = false;
    $scope.score = 0;

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

      while (cards.length > 0) {
        var index = Math.floor(Math.random() * cards.length);
        var card = cards.splice(index,1)[0];
        $scope.cards.push(card);
      }
    }

    function incorrect(card) {
      WAIT = true;
      $timeout(function() {
        card.isFlipped = false;
        selectedCard.isFlipped = false;
        selectedCard = null;
        WAIT = false;
      }, 500);
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