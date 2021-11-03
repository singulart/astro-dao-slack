export interface ISlackRequest {
    token: string;
    team_id: string;
    team_domain: number;
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    api_app_id: string;
    response_url: string;
    trigger_id: string;
}

export interface ISlackInteraction {
    response_url: string;
    actions: [ISlackInteractionAction];
}

export interface ISlackInteractionAction {
    action_id: string;
    value: string;
}
