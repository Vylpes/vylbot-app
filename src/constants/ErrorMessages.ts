import { CommandResponse } from "./CommandResponse";

export default class ErrorMessages {
    public static readonly InsufficientBotPermissions = "Unable to do this action, am I missing permissions?";
    public static readonly ChannelNotFound = "Unable to find channel";
    public static readonly RoleNotFound = "Unable to find role";

    public static readonly UserUnauthorised = "You are not authorised to use this command";
    public static readonly ServerNotSetup = "This server hasn't been setup yet, please run the setup command";

    public static GetErrorMessage(response: CommandResponse): string {
        switch (response) {
            case CommandResponse.Unauthorised:
                return this.UserUnauthorised;
            case CommandResponse.ServerNotSetup:
                return this.ServerNotSetup;
            default:
                return "";
        }
    }
}