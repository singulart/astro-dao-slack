import { IProposal } from "../entities/Proposal"

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');

export const proposalSlackPayload = (proposal: IProposal) => {
    
    const { flag } = JSON.parse(decode(proposal.dao.config.metadata));
    return {

        text: 'New proposal added',

        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:bank: New \`${proposal.kind.type}\` proposal by *${proposal.proposer}* in _${proposal.daoId}_ DAO`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:whale2: Proposal ID: *${proposal.proposalId}*\n :joystick: Status: *${proposal.status}*\n :alarm_clock: Created: *${proposal.createdAt}* \n<https://explorer.testnet.near.org/transactions/${proposal.transactionHash}|View in explorer>`
                },
                accessory: {
                    type: "image",
                    image_url: `https://sputnik-dao.s3.eu-central-1.amazonaws.com/${flag}`,
                    alt_text: `${proposal.daoId}`
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
                        value: "aye",
                        action_id: "aye"
                    },
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: ":thumbsdown:",
                            emoji: true
                        },
                        value: "nay",
                        action_id: "nay"
                    }
                ]
            }
        ]
    }
}