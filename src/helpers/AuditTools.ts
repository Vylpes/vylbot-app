import { AuditType } from "../constants/AuditType";

export default class AuditTools {
    public static TypeToFriendlyText(auditType: AuditType): string {
        switch (auditType) {
            case AuditType.General:
                return "General";
            case AuditType.Warn:
                return "Warn";
            case AuditType.Mute:
                return "Mute";
            case AuditType.Kick:
                return "Kick";
            case AuditType.Ban:
                return "Ban";
            default:
                return "Other";
        }
    }

    public static StringToType(str: string): AuditType {
        switch (str.toLowerCase()) {
            case "general":
                return AuditType.General;
            case "warn":
                return AuditType.Warn;
            case "mute":
                return AuditType.Mute;
            case "kick":
                return AuditType.Kick;
            case "ban":
                return AuditType.Ban;
            default:
                return AuditType.General;
        }
    }
}