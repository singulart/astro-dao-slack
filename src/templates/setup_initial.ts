export const setupInitialPrompt = () => `{
	"blocks": [
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Add Account",
						"emoji": true
					},
					"value": "action_add_account_clicked",
					"action_id": "action_add_account_clicked"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Remove Account",
						"emoji": true
					},
					"value": "action_remove_account_clicked",
					"action_id": "action_remove_account_clicked"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "My Accounts",
						"emoji": true
					},
					"value": "action_view_accounts_clicked",
					"action_id": "action_view_accounts_clicked"
				}
			]
		}
	]
}`