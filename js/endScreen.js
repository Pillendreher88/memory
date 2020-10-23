import {TextButton} from "./button.js";

export class EndScreen extends Phaser.Scene {

    constructor ()
   {
       super({ key: 'EndScreen', active: false });
   }

   init(data) {
   this.desc = data.desc;
   }

   startMenu() {
    this.scene.stop("Highscore"); 
    this.scene.start("Menu"); 
   }
   restartGame() {
    this.scene.stop("Highscore"); 
    this.scene.start("Game");
   }

   create() {
       
       this.checkHighscore();
       this.cameras.main.backgroundColor.setTo(0,0,0); 
       this.button_exit = new TextButton(this, 150,500, "Back to menu", {fontSize: "32px", backgroundColor: "#000000"},()=>this.startMenu());
       this.button_retry = new TextButton(this, 400,500, "Play again", {fontSize: "32px", backgroundColor: "#000000"},()=>this.restartGame());
       this.button_retry.setActive(true);
       this.active_button = 1;

       this.input.keyboard.on('keydown_LEFT', function () {
           this.button_retry.setActive(false);
           this.button_exit.setActive(true);
           this.active_button = 2;
       }, this);
       this.input.keyboard.on('keydown_RIGHT', function () {
           this.button_retry.setActive(true);
           this.button_exit.setActive(false);
           this.active_button = 1;

       }, this);
       this.input.keyboard.on('keydown_ENTER', function () {
           if (this.active_button === 1) {
            this.restartGame();    
           }
           else {
            this.startMenu();
           }
       }, this);
   }

   checkHighscore() {

       const score = this.registry.get("score");
       const level = this.registry.get("level");
       const storageKey = this.game.config.gameTitle +"-highscores";
       var highscores = JSON.parse(localStorage.getItem(storageKey));
       var hs = highscores[level];
    
        if(hs === undefined || (hs < score && this.desc) || (hs > score && !this.desc)){
               highscores[level] =  score;
               highscores= JSON.stringify(highscores);
               localStorage.setItem(storageKey, highscores);
               const oldHsText = hs ? "You have improved your old Highscore of "+ hs : "Congratulations!";
               const text = [oldHsText,"New HighScore:" + score];
               this.scene.launch("Highscore",  { text: text});
        }
        else {
            this.add.text(100, 200, "Your Highscore:  "+ hs, {fontSize: "32px", backgroundColor: "0x000"});
            this.add.text(100, 100, "Your Score:  "+ this.registry.get("score"), {fontSize: "32px", backgroundColor: "#000"});    
        }
   }
}