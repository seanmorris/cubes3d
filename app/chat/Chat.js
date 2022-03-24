import { View } from 'curvature/base/View';

import { Inbox }  from './Inbox';
import { Outbox } from './Outbox';

export class Chat extends View
{
	template = `<div class = "chat-box">
		<div class = "chat-wrapper">[[inbox]]</div>
		[[outbox]]
	</div>`

	constructor(args, parent)
	{
		super(args, parent);

		const outbox = new Outbox({}, this);
		const inbox  = new Inbox({}, this);

		outbox.addEventListener('send', event => this.handleSend(event));

		this.args.outbox = outbox;
		this.args.inbox  = inbox;
	}

	handleSend(event)
	{
		const detail = event.detail;

		this.args.inbox.args.messages.push({
			user:this.args.myId, text:detail.input
		});

		this.dispatchEvent(new CustomEvent('send', {detail}));
	}

	handleMessage(event)
	{
		const detail = event.detail;

		this.args.inbox.args.messages.push({
			user:detail.user_id, text:detail.content.body
		});
	}
}