import { CommandResponse } from "./CommandResponse";

export default class ErrorMessages {
    public static readonly InsufficientBotPermissions = "Unable to do this action, am I missing permissions?";
    public static readonly ChannelNotFound = "Unable to find channel";
    public static readonly RoleNotFound = "Unable to find role";

    public static readonly UserUnauthorised = "You are not authorised to use this command";
    public static readonly ServerNotSetup = "This server hasn't been setup yet, please run the setup command";
    public static readonly NotInServer = "This command requires to be ran inside of a server";
    public static readonly FeatureDisabled = "This feature is currently disabled by a server moderator";

    public static GetErrorMessage(response: CommandResponse): string {
        switch (response) {
            case CommandResponse.Unauthorised:
                return this.UserUnauthorised;
            case CommandResponse.ServerNotSetup:
                return this.ServerNotSetup;
            case CommandResponse.NotInServer:
                return this.NotInServer;
            case CommandResponse.FeatureDisabled:
                return this.FeatureDisabled;
            default:
                return "";
        }
    }
}