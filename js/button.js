 export class TextButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style, callback) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState() )
      .on('pointerout', () => this.enterButtonRestState() )
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        this.enterButtonHoverState();
        if (callback) callback();
      });
    scene.add.existing(this);
    this.buttonGroup;
    this.toggleable = false;
    this.active = false;
    this.hoverScaleFactor = 1;
    scene.add.rectangle(this.getBounds(),0x9966ff);
  }

  enterButtonHoverState() {
    this.setScale(this.hoverScaleFactor);
    
  }

  enterButtonRestState() {
    this.setScale(1);  
  }

  enterButtonActiveState() {
  	
  	if(this.buttonGroup){
    	Phaser.Actions.Call(this.buttonGroup.getChildren(), function(button){
    	button.setActive(false);
    	});
    	}

    if (this.toggleable) this.setActive(!this.active);
  }

  setButtonGroup(group) {
  	this.buttonGroup = group;

  }

  setHoverScale(factor){
  	this.hoverScaleFactor = factor;
  }

  setActive(boolean) {
  	this.active = boolean;
  	if(this.active){
    	this.setStyle({ backgroundColor: '#6666ff' });
    }
    else this.setStyle({ backgroundColor: '#000000' });
  }

  setToggleable(boolean) {
  	this.toggleable = boolean;
  }

}

export class OptionGroup extends Phaser.GameObjects.Group {
  constructor(scene ) {
    super(scene);
    this.scene.add.existing(this);
    this.active = 0; 
  }

  addOptions(children) {
    //const children = options.map((option) => option.gameObject);
    this.addMultiple(children);
    Phaser.Actions.Call(children, (child) => 
                        child.input.on("pointerdown",  function(pointer, gameObject){
                        this.setActive(gameObject);     
    }),this);
  }

  setActive(activeChild) {
    this.active = this.getChildren().indexOf(activeChild);
    Phaser.Actions.Call(this.getChildren(), (child) => {
                        if(activeChild === child) {
                          child.setStyle(this.activeStyle);
                        }
                        else {
                          child.setStyle(this.passiveStyle);
                        }});
  }
}