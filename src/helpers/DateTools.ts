export default class DateTools {
    public static FormatDateWithAge(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        let ageText: string;
        
        if (diffDays === 0) {
            ageText = "Today";
        } else if (diffDays === 1) {
            ageText = "1 day ago";
        } else if (diffDays < 7) {
            ageText = `${diffDays} days ago`;
        } else if (diffDays < 28) {
            const weeks = Math.round(diffDays / 7);
            ageText = weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        } else if (diffDays < 365) {
            const months = Math.round(diffDays / 28);
            ageText = months === 1 ? "1 month ago" : `${months} months ago`;
        } else {
            const years = Math.round(diffDays / 365);
            ageText = years === 1 ? "1 year ago" : `${years} years ago`;
        }
        
        return `${date.toISOString()} \`${ageText}\``;
    }
}
