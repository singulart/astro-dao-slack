export const createProposalInitialModal = (triggerId: string) => `
{
    "trigger_id": "${triggerId}",
    "view": {
        "type": "modal",
        "callback_id": "modal-identifier",
        "title": {
            "type": "plain_text",
            "text": "Create Proposal"
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit"
        },
        "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select Proposal Type",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Payout",
                                "emoji": true
                            },
                            "value": "proposal_type_payout"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Bounty",
                                "emoji": true
                            },
                            "value": "proposal_type_bounty"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Add member",
                                "emoji": true
                            },
                            "value": "proposal_add_member"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Remove member",
                                "emoji": true
                            },
                            "value": "proposal_remove_member"
                        }
                    ],
                    "action_id": "proposal_type_select_action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Proposal Type",
                    "emoji": true
                }
            }
        ]        
    }
}`