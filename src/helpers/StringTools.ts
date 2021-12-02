export default class StringTools {
    public static Capitalise(str: string): string {
        const words = str.split(" ");
        let result: string[] = [];

        words.forEach(word => {
            const firstLetter = word.substring(0, 1).toUpperCase();
            const rest = word.substring(1);

            result.push(firstLetter + rest);
        });

        return result.join(" ");
    }
}