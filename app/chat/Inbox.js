import { View } from 'curvature/base/View';

export class Inbox extends View
{
	template = `<div class = "chat-inbox" cv-each = "messages:message">
		<p><b>[[message.user]]:</b> [[message.text]]</p>
	</div>`

	constructor(args, parent)
	{
		super(args, parent);

		this.args.messages = [];
	}
}