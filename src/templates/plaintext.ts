export const plainText = (text: string) => `
{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "${text}"
			}
		}
	]
}
`