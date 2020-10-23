import { EndScreen } from "./endScreen.js";
import { Highscore_Personal } from "./highscore.js";
import { TextButton } from "./button.js";

var game;

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  preload() {
    this.load.image("avatar", "/assets/images/avatar1.png");
    this.load.image("smiley", "/assets/images/smiley1.png");
    this.load.image("card", "/assets/images/cardHeartsA.png");
  }

  selectOption(option) {
    this.optionA.setAlpha(0.5);
    this.optionB.setAlpha(0.5);
    this.optionC.setAlpha(0.5);
    option.setAlpha(1);
    switch (option) {
      case this.optionA:
        this.registry.set("cardset", "avatar");
        break;
      case this.optionB:
        this.registry.set("cardset", "smiley");
        break;
      case this.optionC:
        this.registry.set("cardset", "card");
        break;
    }
    const hs = this.highscores[this.registry.get("cardset")];
    this.textHs.setText("Highscore: " + (hs ? (hs + "s") : "-"));
  }

  create() {

    let canvas = this.sys.canvas;
    this.add.text(0.2 * canvas.width, 0.2 * canvas.height, "Choose CardSet!", { fontSize: '32px', });
    this.button_start = new TextButton(this, 0.5 * canvas.width, 0.8 * canvas.height, "PLAY", { fontSize: "72px", backgroundColor: "#6666ff", padding: 10 }, () => this.scene.start("Game"));

    this.highscores = JSON.parse(localStorage.getItem(this.game.config.gameTitle + "-highscores"));
    this.textHs = this.add.text(400, 50, "", { fontSize: '32px', });
    if (!this.highscores) {
      this.highscores = {};
      localStorage.setItem(this.game.config.gameTitle + "-highscores", JSON.stringify({}));
    }
    this.button_start.setHoverScale(1.2)
    this.button_start.setOrigin(0.5);
    this.optionA = this.add.image(0.2 * canvas.width, 0.5 * canvas.height, "avatar").setInteractive({ cursor: "pointer" });
    this.optionB = this.add.image(0.4 * canvas.width, 0.5 * canvas.height, "smiley").setInteractive({ cursor: "pointer" });
    this.optionC = this.add.image(0.6 * canvas.width, 0.5 * canvas.height, "card").setInteractive({ cursor: "pointer" });
    this.selectOption(this.optionA);

    Phaser.Actions.Call([this.optionA, this.optionB, this.optionC], (gameObject) =>
      gameObject.on("pointerdown", function () {
        this.selectOption(gameObject);
      }, this));
    this.input.keyboard.on('keydown', function () {
      this.scene.start("Game");
    }, this);
    this.add.image();
  }
}

class Card extends Phaser.GameObjects.Image {
  constructor(scene, x, y, key, key2, scale) {
    super(scene, x, y, key, key2);
    this.hidden = true;
    this.paired = false;
    this.key = key;
    this.key2 = key2;
    this.scene = scene;
    this.baseScale = scale;
  }
  init() {
    this.setScale(this.baseScale);
    this.on('pointerover', function () {
      if (!this.paired)
        this.setScale(this.baseScale * 1.15);
    });
    this.on('pointerout', function () {
      if (!this.paired)
        this.setScale(this.baseScale);
    });
  }

  isHidden() {
    return this.hidden;
  }

  getType() {

    return this.key2;
  }

  reveal() {
    this.hidden = false;
    let flip = this.scene.tweens.createTimeline();
    let _this = this;

    flip.add({
      targets: _this,
      scaleX: 0,
      ease: 'Sine.easeInOut',
      duration: 300,
      onComplete: function () { _this.setTexture(_this.key2); }
    });

    flip.add({
      targets: _this,
      scaleX: this.baseScale,
      scaleY: this.baseScale,
      ease: 'Sine.easeInOut',
      duration: 300,
    });

    flip.play();
  }

  hide() {
    this.hidden = true;

    let flip = this.scene.tweens.createTimeline();
    let _this = this;


    flip.add({
      targets: _this,
      scaleX: 0,
      ease: 'Sine.easeInOut',
      duration: 300,
      onComplete: function () { _this.setTexture(_this.key); }
    });

    flip.add({
      targets: _this,
      scaleX: this.baseScale,
      ease: 'Sine.easeInOut',
      duration: 300,
    });

    flip.play();
  }

  compareTo(card) {
    let boolean = true;

    if (this.getType() === card.getType()) {
      this.paired = true;
      card.paired = true;
      this.setTint(0xc8f76a);
      card.setTint(0xc8f76a);
    }
    else {
      boolean = false;
      card.hide();
      this.hide();
    }

    return boolean;
  }
}

class Game extends Phaser.Scene {

  constructor() {
    super({ key: "Game", active: false });
  }

  preload() {

    let cardSet = this.registry.get("cardset");
    var keys = ["1", "2", "3", "4", "5", "6", "7", "8"];

    if (cardSet === "card") {
      let array = ["Clubs2", "Clubs3", "Clubs4", "Clubs5", "Clubs6", "Clubs7", "Clubs8", "Clubs9", "Clubs10",
        "ClubsK", "ClubsQ", "ClubsJ", "ClubsA", "DiamondsK", "DiamondsQ", "DiamondsJ", "DiamondsA",
        "Diamonds2", "Diamonds3", "Diamonds4", "Diamonds5", "Diamonds6", "Diamonds7", "Diamonds8", "Diamonds9", "Diamonds10",
        "DiamondsA", "DiamondsK", "DiamondsJ", "DiamondsA", "HeartsK", "HeartsA", "HeartsJ", "HeartsQ",
        "Hearts2", "Hearts3", "Hearts4", "Hearts5", "Hearts6", "Hearts7", "Hearts8", "Hearts9", "Hearts10",
        "Spades2", "Spades3", "Spades4", "Spades5", "Spades6", "Spades7", "Spades8", "Spades9", "Spades10"];

      for (var i = 0; i < 8; i++) {
        keys[i] = Phaser.Math.RND.shuffle(array).pop();
      }
    }

    for (let i = 0; i < 8; i++) {
      this.load.image(cardSet + (i + 1).toString(), "/assets/images/" + cardSet + keys[i] + ".png");
    }
    this.load.image("back", "/assets/images/back.png");
    this.load.audio("success", "/assets/sounds/success.wav");
  }

  create() {

    let canvas = this.sys.canvas;
    this.gameTime = 0;
    this.clickEnabled = true;
    this.timeBox = this.add.text(550, 50, "Time: ", { fontSize: "22px" });
    this.button_toMenu = new TextButton(this, 550, 400, "Back to Menu", { fontSize: "22px", backgroundColor: "#000000", padding: 10 }, () => this.scene.start("Menu"));
    this.paired = 0;
    var cardSet = this.registry.get("cardset");
    this.registry.set("level", cardSet);
    this.firstCard = null;
    this.sfx = this.sound.add("success");
    this.highscores = JSON.parse(localStorage.getItem(this.game.config.gameTitle + "-highscores"));
    if (!this.highscores) {
      this.highscores = {};
      localStorage.setItem(this.game.config.gameTitle + "-highscores", JSON.stringify(this.highscores));
    }


    const keys = [cardSet + "1", cardSet + "2", cardSet + "3", cardSet + "4", cardSet + "5", cardSet + "6", cardSet + "7", cardSet + "8"];
    var group = this.add.group();
    this.cards = group;

    for (var i = 0; i < keys.length; i++) {
      for (var j = 0; j < 2; j++) {
        let card = new Card(this, 100, 100, "back", keys[i], 0.6);
        card.init();
        this.add.existing(card.setInteractive({ cursor: "pointer" }));
        group.add(card);
      }
    }

    Phaser.Math.RND.shuffle(group.getChildren());

    Phaser.Actions.GridAlign(group.getChildren(), {
      width: 4,
      height: 4,
      cellWidth: group.getChildren()[0].getBounds().width + 20,
      cellHeight: group.getChildren()[0].getBounds().height + 20,
      x: 100,
      y: 50
    });

    this.input.keyboard.on('keydown_ESC', function () {
      console.log("press");
      this.scene.start("Menu");
    }, this);

    this.input.on("pointerdown", function (pointer, gameObject) {
      if (gameObject.length > 0) {
        let card = gameObject[0];
        if (card.isHidden()) {
          card.reveal();
          if (this.firstCard) {
            this.disableInput();
            let card2 = this.firstCard;
            this.time.addEvent({ delay: 1000, callback: function () { this.compare(card, card2); this.activateInput() }, callbackScope: this });
            this.firstCard = null;
          }
          else {
            this.firstCard = card;
          }
        }
      }
    }, this);
  }

  disableInput() {
    Phaser.Actions.Call(this.cards.getChildren(), function (children) { children.disableInteractive(); });
  }

  activateInput() {
    Phaser.Actions.Call(this.cards.getChildren(), function (children) { children.setInteractive(); });
  }

  compare(card1, card2) {

    if (card1.compareTo(card2)) {
      this.paired++;
      this.sfx.play();
      if (this.paired === 8) {
        this.registry.set("score", Math.round(this.gameTime / 100) / 10);
        this.scene.start("EndScreen", { desc: false });
      }
    }
  }

  update(time, delta) {
    this.gameTime += delta;
    this.timeBox.setText("Time: " + Math.round(this.gameTime / 100) / 10);
  }

}

class Loading extends Phaser.Scene {

  constructor() {
    super({ key: "Loading", active: false });
  }

  preload() {
    this.load.spritesheet('loading_circle', '/assets/images/loadingred.png', { frameWidth: 110, frameHeight: 110 });
  }

  create() {
    this.add.text(500, 300, "Loading");

    var config = {
      key: 'loading',
      frames: this.anims.generateFrameNumbers('loading_circle'),
      frameRate: 12,
      yoyo: false,
      repeat: -1
    };

    var sprite = this.add.sprite(400, 300, 'loading_circle').setScale(0.8);

    sprite.anims.load('loading');
    sprite.anims.play('loading');

    let _this = this;
    let score = this.registry.get("score");
    $.post('/highscore.php', { highscore: score, game: game.config.gameTitle }, function (result) {
      result = JSON.parse(result);
      if (result.user_average < result.best_average) {
        _this.registry.set("highscore_user", score);
        _this.scene.start("Highscore_User");
      }
      else if (result.personal > score) {
        _this.registry.set("highscore_personal", score);
        _this.scene.start("Highscore_Personal");
      }
      else _this.scene.start("Menu");
    });
  }
}

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  title: "Memory",
  backgroundColor: '#392542',
  parent: 'phaser',
  audio: {
    disableWebAudio: true
  },
  scene: [Menu, Game, EndScreen, Highscore_Personal]
};

game = new Phaser.Game(config);
