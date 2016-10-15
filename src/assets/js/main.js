
var game = {
    players: 0, //number of players
    player1: {},
    player2: {},
    boardSize: 3, // size
    board: [], // board 3x3
    /* Initialize the game */
    initializeGame: function(){
        $(".info").hide();
        $(".inner").show(); // show entry screen
        $(".col-md-4").html('');
        $(".col-md-4").css("border","solid 1px #fff");
        $(".choose-name").hide();

        // initialize board with empty values
        for (var i = 0; i < this.boardSize; i++){
            this.board[i] = [];
            for (var j = 0; j < this.boardSize; j++){
                this.board[i][j] = "";
            }
        }
        this.setScoreBoard();
        this.setNotification(this.player1["name"]); // set notification for first player
        this.renderState();
     },

    // set the initial values of scoreBoard
    setScoreBoard: function(){
        $(".score-board").show();
        $(".player1-name").text(this.player1["name"]);
        $(".player1-victories").text(this.player1["victories"]);
        $(".player2-name").text(this.player2["name"]);
        $(".player2-victories").text(this.player2["victories"]);
    },

    //setNotification for current player
    setNotification: function(name){
        var notifPanel = "";
        if (name === this.player1["name"]){
            notifPanel = ".left-notif";
            $(".right-notif").hide();
        }
        else {
            notifPanel = ".right-notif";
            $(".left-notif").hide();
        }
        $(notifPanel + " span").text(name + ", your turn!");
        $(notifPanel).fadeIn("slow");
    },

    // draw the state of the player in a cell
    renderState: function(){
        var self = this;
        $('.restart').click(function() {
            self.restartGame();
        });

        $('.col-md-4').click(function() {
            var column = $(this).index(); // column index
            var row = $(this).parent().index(); //row index
            // if cell is not empty don't do anything
            if ($(this).text() !== ""){
                return false;
            }
            // if left notif player1 goes
            if ($('.left-notif').css('display') === 'block'){
                var name = "";
                $(this).text(self.player1["state"]); // set state in clicked cell
                self.board[row][column] = $(this).text(); // set a value for current element in board array
                self.setNotification(self.player2["name"]); //set notification for second player
                name = self.checkIsWin(self.player1["name"], self.player1["state"]);
            }else {
                $(this).text(self.player2["state"]);
                self.board[row][column] = $(this).text();
                self.setNotification(self.player1["name"]);
                name = self.checkIsWin(self.player2["name"], self.player2["state"]);
            }
            if (name){
                self.increaseVictories(name);
            }
            if (self.isDraw()){
                self.showDrawScreen();
            }
        });
    },
    // check if somebody won
    checkIsWin: function(name,state){
        var diagonalSums = [], columnSums = [];
        var rowSum = 0;

        //initialize diagonal and column sums
        for (var i = 0; i < this.boardSize - 1; i++){
            diagonalSums[i] = 0;
        }
        for (var j = 0; j < this.boardSize; j++){
            columnSums[j] = 0;
        }
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === state){
                    rowSum++;
                    columnSums[j]++;
                    if (i == this.boardSize - 1){ // columns
                        if (columnSums[j] == this.boardSize) {
                            return name;
                        }
                    }
                    if (i == j){ // main diagonal
                        diagonalSums[0]++;
                        if (i == this.boardSize - 1 && diagonalSums[0] == this.boardSize){
                            return name;
                        }
                    }
                    if (i == this.boardSize - 1 - j){   // return diagonal
                        diagonalSums[1]++;
                        if (j == 0 && diagonalSums[1] == this.boardSize){
                            return name;
                        }
                    }
                }
            }
             if (rowSum == this.boardSize){  //rows
                 return name;
            }
            else {
                rowSum = 0;
            }
        }
    },
    // check if draw in the game
    isDraw: function(){
        var count = 0;
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] !== "") {
                    count++;
                }
            }
        }
        if (count === 9) {
            return true;
        }
    },
    // restart game
    restartGame: function(){
        $(".choose-name .col-xs-12 h3").text("Player1 enter your name:");
        $("#name").val('');
        $(".info").hide();
        this.getStartingScreen();
        $(".score-board").hide();
        $(".left-notif").hide();
        $(".right-notif").hide();
    },
    //update game
    updateGame: function(){
        var self = this;

        $('.btn').click(function() {
            if ($(this).attr("value") === 'Yes'){
                self.initializeGame();
            }
            if (($(this).attr("value") === 'No')){
                self.restartGame();
            }
        });
    },
    // increaseVictories for winner
    increaseVictories: function(winner_name){
        var opponent_name = winner_name === this.player1["name"] ? this.player2["name"] : this.player1["name"];
        if (opponent_name === this.player2["name"]){
            this.player1["victories"]++;
        }else {
            this.player2["victories"]++;
        }
        this.showCongratulationsScreen(winner_name,opponent_name);
    },

    //show the winner name
    showCongratulationsScreen: function(winner_name,opponent_name){
        $(".left-notif").hide();
        $(".right-notif").hide();
        $(".inner").hide();
        $(".info").show();
        $(".info").html(
            "<p class='congrat'><b>" + winner_name + "</b> have won!</p><br>" +
            "<span>" + opponent_name  +  ", do you want to take a revenge?</span>" +
            "<input class='btn btn-default' type='button' value='Yes'>" +
            "<input class='btn btn-default' type='button' value='No'>"
        );
        this.updateGame();
    },
    // show if draw
    showDrawScreen: function(){
        $(".left-notif").hide();
        $(".right-notif").hide();
        $(".inner").hide();
        $(".info").show();
        $(".info").html(
            "<p class='congrat'>Ops, it is a draw! One more game?</p><br>" +
            "<input class='btn btn-default' type='button' value='Yes'>" +
            "<input class='btn btn-default' type='button' value='No'>"
        );
        this.updateGame();
    },
    // select players
    getStartingScreen: function(){
        var self = this;
        $(".col-md-4").css("border","none");
        $(".inner").hide();
        $(".select-players").show();
        $(".select-players>input").on('click',function(){
            self.players = $(this).val() === 'One player' ? 1 : 2;
            self.getStateScreen();
        });
    },
    // set name and state for all players
    getStateScreen: function(){
        var self = this;
        $(".select-players").hide();
        $(".choose-name").show();
        $(".choose-state").show();
        $(".choose-state>input").on('click',function(){
            var state = $(this).val();
            var name = $("#name").val();
            if (name){
                var player1 = new Player(name,state,0);
                self.player1 = player1;
                if (self.players === 2){
                    $("#name").val('');
                    $(".choose-state").hide();
                    $(".choose-name .col-xs-12 h3").text("Player2 enter your name:");
                    $(document).keypress(function(e) {
                        name = $("#name").val();
                        state = player1.state === "x" ? "o" : "x";
                        if(e.which == 13) {
                            if (name){
                                var player2 = new Player(name,state,0);
                                self.player2 = player2;
                                if (self.player1["name"] === self.player2["name"]){
                                    alert("The names are identical, try another one!");
                                    return false;
                                }
                                self.initializeGame();
                            }
                        }
                    });
                }
            } else {
                alert("Please, enter your name!");
            }
        });

    }

};

// player object
function Player(name,state,victories){
    this.name = name;
    this.state = state;
    this.victories = victories;
};


$( document ).ready(function() {
    game.getStartingScreen(); // show starting screen

});