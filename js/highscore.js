
export class Highscore_Personal extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'Highscore', active: false });
    }

    init(data) {
        this.text = data.text;
    }
    preload() {
        this.load.image("whitelight", "assets/images/whitelight.png" );
        this.load.image("orange", "assets/images/orangelight.png" );
        this.load.image("blue", "assets/images/bluelight.png" );
        this.load.image("black", "assets/images/blacklight.png" );
        this.load.image("red", "assets/images/redlight.png" );
    }
create ()   {

    /*  var config = {
        key: 'loading',
        frames: this.anims.generateFrameNumbers('loading_circle'),
        frameRate: 12,
        yoyo: false,
        repeat: -1
    };*/

    //var anim = this.anims.create(config);
    //var sprite = this.add.sprite(400, 300, 'loading_circle').setScale(0.8);

    //sprite.anims.load('loading');
    //sprite.anims.play('loading');
    var style = {
    
        
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom:10
        },
            backgroundColor: '#000',
          
            };
    var text = this.add.text(400,400,this.text, style).setFontSize('16px');

    text.setOrigin(0.5);

    var wordNew = new Phaser.Curves.Path(150, 150);

    wordNew.lineTo(150, 0);
    wordNew.lineTo(250, 150);
    wordNew.lineTo(250, 0);

    
    wordNew.moveTo(400, 150);
    wordNew.lineTo(300, 150);
    wordNew.lineTo(300, 0);
    wordNew.lineTo(400, 0);
    wordNew.moveTo(300, 75);
    wordNew.lineTo(400, 75);

    wordNew.moveTo(450, 0);
    wordNew.lineTo(500, 150);
    wordNew.lineTo(550, 0);
    wordNew.lineTo(600, 150);
    wordNew.lineTo(650, 0);

    var particles = this.add.particles('blue');
    var particles2 = this.add.particles('orange');

    var emitter2 = particles.createEmitter({
        speed: 0,
        lifespan: 1000,
        frequency: 1300,
        quantity: 150,
        scale: { start: 0.05, end: 0.01 },
        emitZone: {   source: wordNew, quantity: 0 , stepRate: 5},
        blendMode: 'ADD',
    });

    var candle = particles2.createEmitter({
        x: 700,
        y: 550,
        quantity: 2,
        angle: { min: 260, max: 280 },
        speed: { min: 200, max: 500 },
        gravityY: 200,
        lifespan: { min: 1000, max: 2000 },
        scale: { start: 0.05, end: 0.003 },
        collideTop: true,
        bounce: 0.8,
        blendMode: 'ADD'
    });

     var candle2 = particles2.createEmitter({
        x: 100,
        y: 550,
        quantity: 2,
        angle: { min: 260, max: 280 },
        speed: { min: 200, max: 500 },
        gravityY: 200,
        lifespan: { min: 1000, max: 2000 },
        scale: { start: 0.05, end: 0.003 },
        blendMode: 'ADD'
    });

       var well = particles2.createGravityWell({
        x: 400,
        y: 300,
        power: 3,
        epsilon: 100,
        gravity: 100
    });

}
}

class Highscore_User extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'Highscore_User', active: false });
    }

    preload() {
        this.load.image("whitelight", "assets/images/whitelight.png" );
        this.load.image("orange", "assets/images/orangelight.png" );
        this.load.image("blue", "assets/images/bluelight.png" );
        this.load.image("black", "assets/images/blacklight.png" );
        this.load.image("red", "assets/images/redlight.png" );
    }
create ()   {

   //this.registry.set("hi", 1000);
    var personal_record = [  this.game.config.gameTitle, 
                            "You are now Leader of the Scoreboard with:"];   
    

    var style = {
    
        
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom:10
        },
            backgroundColor: '#000',
          
            };

    var score_text = this.add.text(400,400,this.registry.get("highscore_user"), style).setOrigin(0.5);
    var text = this.add.text(400,300,personal_record, style).setFontSize('16px');

    text.setOrigin(0.5);
   


    var particles = this.add.particles('orange');
    var particles2 = this.add.particles('red');


    var rect = new Phaser.Geom.Rectangle(250, 200, 300, 300);
    var rect2 = new Phaser.Geom.Rectangle(0, 0, 800, 600);
    var points = Phaser.Geom.Rectangle.GetPoints(rect2, 64);
    console.log(points);

    for(var i= 0; i < points.length-1; i++){
             var angle = 180;
        if (points[i].x == points[i+1].x && points[i].x < 350) 
            angle = 0;
        else if (points[i].y == points[i+1].y && points[i].y > 150) 
            angle = 270;
        else if (points[i].y == points[i+1].y && points[i].y < 150) 
            angle = 90;

        if(i % 2 == 0){
       
          particles.createEmitter({
            x: points[i].x,
            y:  points[i].y,
            angle: { min: angle-30, max: angle + 30},
            speed: { min: -100, max: 300 },
            gravityY: 200,
            scale: { start: 0.05, end: 0.01 },
            lifespan: 1000,
            blendMode: 'ADD',
            quantitiy: 1,
            deathZone: { type: 'onEnter', source: rect }
        });
      }
      else {
            particles2.createEmitter({
            x: points[i].x,
            y:  points[i].y,
            angle: { min: angle-30, max: angle + 30},
            speed: { min: -100, max: 300 },
            gravityY: 200,
            scale: { start: 0.05, end: 0.01 },
            lifespan: 1000,
            blendMode: 'ADD',
            //deathZone: { type: 'onEnter', source: rect }
        });
        }
    }

    }
}

