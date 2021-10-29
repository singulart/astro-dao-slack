export const proposalSlackPayload = () => {
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":bank: New `AddMemberToRole` proposal by *isonar.testnet* in _china_ DAO"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":whale2: Proposal ID: *4*\n :joystick: Status: *In Progress*\n :alarm_clock: Created: *2021-10-29T06:51:02.042Z* \n<https://explorer.testnet.near.org/transactions/DoadWbWR9vi8ehCYXskDrNHKddRfBNw54NP3XzZSZ4mo|View in explorer>"
                },
                accessory: {
                    type: "image",
                    image_url: "https://sputnik-dao.s3.eu-central-1.amazonaws.com/_dpZv2MCj2HVbeHhFzWs7",
                    alt_text: "china"
                }
            },
            {
                type: "divider"
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":bank: Add member *mao.testnet* to *Council*."
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: ":thumbsup:",
                            "emoji": true
                        },
                        value: "click_me_123",
                        action_id: "actionId-0"
                    },
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: ":thumbsdown:",
                            emoji: true
                        },
                        value: "click_me_456",
                        action_id: "actionId-1"
                    }
                ]
            }
        ]
    }
}