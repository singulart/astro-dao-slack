export const createProposalInitialModal = (
    triggerId: string, 
    viewId: string = '', 
    viewHash: string = '', 
    selectedProposalType: string = '') => `{

    ${triggerId ? `"trigger_id": "${triggerId}",` : ''}
    ${viewId ? `"view_id": "${viewId}",` : ''}
    ${viewHash ? `"hash": "${viewHash}",` : ''}
    "view": {
        "type": "modal",
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
                "type": "actions",
                "elements": [
                    {
                        "type": "static_select",
                        ${selectedProposalType === 'proposal_type_payout' ? 
                        `"initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Payout",
                                "emoji": true
                            },
                            "value": "proposal_type_payout"
                        },` : ''}
                        ${selectedProposalType === 'proposal_type_bounty' ?
                        `"initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Bounty",
                                "emoji": true
                            },
                            "value": "proposal_type_bounty"
                        },` : ''}
                        ${selectedProposalType === 'proposal_add_member' ?
                        `"initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Add member",
                                "emoji": true
                            },
                            "value": "proposal_add_member"
                        },` : ''}
                        ${selectedProposalType === 'proposal_remove_member' ?
                        `"initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Remove member",
                                "emoji": true
                            },
                            "value": "proposal_remove_member"
                        },` : ''}            
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
                                "value": "c"
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
                    }
                ]
            }
            ${selectedProposalType === 'proposal_type_payout' ? `,
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "payout_recipient",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "NEAR account name",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Send to",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "payout_amount",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "0.0",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Amount, NEAR",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "payout_details",
                    "max_length": 500
                },
                "label": {
                    "type": "plain_text",
                    "text": "Details",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "payout_link",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Add link",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "External Link",
                    "emoji": true
                }
            }` : ''}
        ]
    }
}`