import { IDao } from "../entities/Proposal";

export const createProposalInitialModal = (
    triggerId: string, 
    viewId: string = '', 
    viewHash: string = '', 
    selectedProposalType: string = '',
    daos: IDao[]
    ) => `{

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
                "block_id": "proposal_create_modal",
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
                        ${selectedProposalType === 'proposal_type_add_member' ?
                        `"initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Add member",
                                "emoji": true
                            },
                            "value": "proposal_type_add_member"
                        },` : ''}
                        ${selectedProposalType === 'proposal_type_remove_member' ?
                        `"initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Remove member",
                                "emoji": true
                            },
                            "value": "proposal_type_remove_member"
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
                                "value": "proposal_type_bounty"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Add member",
                                    "emoji": true
                                },
                                "value": "proposal_type_add_member"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Remove member",
                                    "emoji": true
                                },
                                "value": "proposal_type_remove_member"
                            }
                        ],
                        "action_id": "proposal_type_select_action"
                    },
                    {
                        "type": "static_select",
                        "action_id": "proposal_select_dao",
                        "placeholder": {
                          "type": "plain_text",
                          "text": "Choose a DAO"
                        },
                        "options": [
                            ${daos.map((d: IDao) => `
                            {
                              "text": {
                                "type": "plain_text",
                                "text": "${d.id}"
                              },
                              "value": "proposal_dao_${d.id}"
                            }`).join(',')}
                        ]                      
                    }       
                ]
            }
            ${selectedProposalType === 'proposal_type_payout' ? `,
            {
                "block_id": "payout_recipient",
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
                "block_id": "payout_amount",
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
                "block_id": "payout_details",
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
                },
                "optional": true
            },
            {
                "block_id": "payout_link",
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
                },
                "optional": true
            }` : ''}
            ${selectedProposalType === 'proposal_type_bounty' ? `,
            {
                "block_id": "bounty_amount",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "bounty_amount",
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
                "block_id": "bounty_details",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "bounty_details",
                    "max_length": 500
                },
                "label": {
                    "type": "plain_text",
                    "text": "Details",
                    "emoji": true
                },
                "optional": true
            },
            {
                "block_id": "bounty_link",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "bounty_link",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "External link",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "External Link",
                    "emoji": true
                },
                "optional": true
            },
            {
                "block_id": "bounty_num_claims",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "bounty_num_claims",
                    "initial_value": "3"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Number of bounty claims",
                    "emoji": true
                }
            },
            {
                "block_id": "bounty_complete_in_1",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "bounty_complete_in_1",
                    "initial_value": "3"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Complete in",
                    "emoji": true
                }
            },
            {
                "block_id": "bounty_complete_in_2",
                "type": "actions",
                "elements": [
                    {
                        "type": "static_select",
                        "action_id": "bounty_complete_in_2",
                        "initial_option": {
                            "text": {
                                "type": "plain_text",
                                "text": "Days",
                                "emoji": true
                            },
                            "value": "bounty_complete_in_days"
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Days",
                                    "emoji": true
                                },
                                "value": "bounty_complete_in_days"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Weeks",
                                    "emoji": true
                                },
                                "value": "bounty_complete_in_weeks"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Month",
                                    "emoji": true
                                },
                                "value": "bounty_complete_in_months"
                            }
                        ]        
                    }
                ]
            }` : ''}
            ${selectedProposalType === 'proposal_type_add_member' ? `,
            {
                "block_id": "add_member_account",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "add_member_account",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "NEAR account name",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Account to add to group",
                    "emoji": true
                }
            },
            {
                "block_id": "add_member_group",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "add_member_group",
                    "initial_value": "Everyone"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Group",
                    "emoji": true
                }
            }` : ''}
            ${selectedProposalType === 'proposal_type_remove_member' ? `,
            {
                "block_id": "remove_member_account",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "remove_member_account",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "NEAR account name",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Account to remove from group",
                    "emoji": true
                }
            },
            {
                "block_id": "remove_member_group",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "remove_member_group",
                    "initial_value": "Everyone"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Group",
                    "emoji": true
                }
            }` : ''}
        ]
    }
}`