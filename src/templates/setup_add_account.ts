export const addAccountTextField = () => `{
	"blocks": [
		{
			"dispatch_action": true,
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "action_add_account_entered"
			},
			"label": {
				"type": "plain_text",
				"text": "Enter your NEAR account",
				"emoji": true
			}
		}
	]
}`