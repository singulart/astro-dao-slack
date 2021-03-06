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
    type: string;
    trigger_id: string;
    response_url: string;
    user: ISlackUser;
    actions: ISlackInteractionAction[];
    view: any;
}

export interface ISlackInteractionAction {
    type: string;
    action_id: string;
    value: string;
    selected_option: ISelectedOption;
    block_id: string;
}

export interface ISlackUser {
    id: string;
    username: string;
}

export interface ISelectedOption {
    value: string;
}
