import { Cube } from './Cube';
import { Coin } from './Coin';

export class Other extends Cube
{
	coinCooldown = 0;

	constructor(args, parent)
	{
		super(args, parent);

		this.args.css = this.args.css || 'sean main';

		this.args.quips = [];

		this.target = {};

		this.target.x = 0;
		this.target.y = 0;
		this.target.z = 0;
	}

	update(frame)
	{
		if(this.args.x - this.target.x)
		{
			this.xSpeed = -Math.sign(this.args.x - this.target.x) * 0.3;
		}

		if(this.args.z - this.target.z)
		{
			this.zSpeed = -Math.sign(this.args.z - this.target.z) * 0.3;
		}
		
		if(Math.abs(this.args.x - this.target.x) < 0.3)
		{
			this.args.x = this.target.x;
			this.xSpeed = 0;
		}

		if(Math.abs(this.args.z - this.target.z) < 0.3)
		{
			this.args.z = this.target.z;
			this.zSpeed = 0;
		}

		super.update(frame);

		if(this.xSpeed || this.zSpeed)
		{
			this.args.walking = true;
		}
		else
		{
			this.args.walking = false;
		}
	}

	showQuip(quip)
	{
		const quips = this.args.quips;
		
		quips.push(quip);

		while(quips.length > 3)
		{
			quips.shift();
		}

		this.onTimeout(3750, () => quips.shift());
	}

	setFace(yCamTilt3d)
	{
		if(this.moving)
		{
			this.args.rot = Math.atan2(this.zSpeed, this.xSpeed) / Math.PI;
		}

		super.setFace(yCamTilt3d + -(this.args.rot * 100 + -50));
	}
}
