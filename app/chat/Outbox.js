import { View } from 'curvature/base/View';

export class Outbox extends View
{
	template = `<form class = "chat-outbox" cv-on = "submit">
		<input type = "text" cv-ref = "input" cv-bind = "input" />
		<input type = "submit">
	</form>`

	constructor(args, parent)
	{
		super(args, parent);
	}

	submit(event)
	{
		event.preventDefault();

		const input = this.args.input;

		this.dispatchEvent(new CustomEvent('send', {detail:{input,event}}));

		this.args.input = '';

		this.tags.input.focus();
	}
}