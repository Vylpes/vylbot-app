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
}