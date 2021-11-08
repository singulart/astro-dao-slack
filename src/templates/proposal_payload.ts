import { formatNearAmount } from "near-api-js/lib/utils/format";
import { IAddBountyProposal, IMemberProposal, IProposal, ITransferProposal } from "../entities/Proposal"

export const SEPARATOR = '___SEPARATOR___'

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');

export const proposalSlackPayload = (proposal: IProposal) => {
    
    const { flag } = JSON.parse(decode(proposal.dao.config.metadata));
    return `
    {

        "text": 'New proposal added',
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":bank: New \`${proposal.kind.type}\` proposal by *${proposal.proposer}* in _${proposal.daoId}_ DAO"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":whale2: Proposal ID: *${proposal.proposalId}*\n :joystick: Status: *${proposal.status}*\n :alarm_clock: Created: *${proposal.createdAt}* \n<https://explorer.testnet.near.org/transactions/${proposal.transactionHash}|View in explorer>"
                },
                "accessory": {
                    "type": "image",
                    "image_url": "https://sputnik-dao.s3.eu-central-1.amazonaws.com/${flag}",
                    "alt_text": "${proposal.daoId}"
                }
            },
            {
                "type": "divider"
            },
            ${proposal.kind.type === 'Transfer' ? 
            `{
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":bank: ${formatNearAmount((proposal.kind as ITransferProposal).amount)} NEAR  :point_right: *${(proposal.kind as ITransferProposal).receiverId}*"
                }
            },` : ''}
            ${proposal.kind.type === 'AddBounty' ? 
            `{
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":bank: *Bounty amount:* ${formatNearAmount((proposal.kind as IAddBountyProposal).bounty.amount)}  *Summary:* ${(proposal.kind as IAddBountyProposal).bounty.description}*"
                }
            },` : ''}
            ${proposal.kind.type === 'AddMemberToRole' ? 
            `{
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":bank: Add  
                                  ${(proposal.kind as IMemberProposal).member_id} :point_right: *
                                  ${(proposal.kind as IMemberProposal).role}*"
                }
            },` : ''}
            ${proposal.kind.type === 'RemoveMemberFromRole' ? 
            `{
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":bank: Remove  
                                  ${(proposal.kind as IMemberProposal).member_id} :point_right: *
                                  ${(proposal.kind as IMemberProposal).role}*"
                }
            },` : ''}
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":thumbsup:",
                            "emoji": true
                        },
                        "value": "${['VoteApprove', proposal.daoId, proposal.proposalId].join(SEPARATOR)}",
                        "action_id": "VoteApprove"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":thumbsdown:",
                            "emoji": true
                        },
                        "value": "${['VoteReject', proposal.daoId, proposal.proposalId].join(SEPARATOR)}",
                        "action_id": "VoteReject"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":wastebasket:",
                            "emoji": true
                        },
                        "value": "${['VoteRemove', proposal.daoId, proposal.proposalId].join(SEPARATOR)}",
                        "action_id": "VoteRemove"
                    }
                ]
            }
        ]
    }`
}