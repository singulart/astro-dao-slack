export const removeAccountTextField = () => `{
	"blocks": [
		{
			"dispatch_action": true,
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "action_remove_account_entered"
			},
			"label": {
				"type": "plain_text",
				"text": "Enter the NEAR account you wish to remove from Slack",
				"emoji": true
			}
		}
	]
}`