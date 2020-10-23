export class Loading_line extends Phaser.GameObjects.Rectangle {

	constructor(scene, x, y, duration,width, height, callback, config) {

		super(scene, x, y, width, height, 0xff0000);

		this.duration = duration * 1000;
		this.timeLeft = duration*1000;
		this.started = false;
		this.autoReset = true;
		this.callback = callback;
		this.setOrigin(0);
		this.decreasing = false;

	}

	setAutoReset(boolean) {
		this.autoReset = boolean;
	}

	start() {
		this.started = true;
		
	}
	reset() {

		this.timeLeft = this.duration*1000;
		this.started = false;
	}

	preUpdate(time, delta) {
		
		if ( this.started && this.timeLeft > 0){
			this.timeLeft -=delta;

			let prog = 1 - this.timeLeft/this.duration;
			if(this.decreasing) prog = 1- prog;

			let color = 0x45f442;
			if (prog < 0.1)  color = 0xff0000;
			else if(prog < 0.3) color = 0xff5400;
			else if(prog < 0.5)color = 0xffd800;
			this.setFillStyle(color);
			this.setDisplaySize(prog * this.width, this.height);
		}
		else {

			if(this.callback) this.callback();
			if(this.autoReset) this.reset();
		}
	}
}