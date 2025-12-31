import DateTools from "../../src/helpers/DateTools";

describe('DateTools', () => {
    describe('FormatDateWithAge', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2025-12-31T14:23:19.982Z'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should format today correctly', () => {
            const date = new Date('2025-12-31T10:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-31T10:00:00.000Z `Today`');
        });

        it('should format 1 day ago correctly', () => {
            const date = new Date('2025-12-30T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-30T14:00:00.000Z `1 Day ago`');
        });

        it('should format multiple days ago correctly', () => {
            const date = new Date('2025-12-26T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-26T14:00:00.000Z `5 Days ago`');
        });

        it('should format 1 week ago correctly (7 days)', () => {
            const date = new Date('2025-12-24T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-24T14:00:00.000Z `1 Week ago`');
        });

        it('should round 12 days to 2 weeks', () => {
            const date = new Date('2025-12-19T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-19T14:00:00.000Z `2 Weeks ago`');
        });

        it('should format 3 weeks ago correctly', () => {
            const date = new Date('2025-12-10T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-10T14:00:00.000Z `3 Weeks ago`');
        });

        it('should format 1 month ago correctly (28 days)', () => {
            const date = new Date('2025-12-03T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-12-03T14:00:00.000Z `1 Month ago`');
        });

        it('should format multiple months ago correctly', () => {
            const date = new Date('2025-10-03T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2025-10-03T14:00:00.000Z `3 Months ago`');
        });

        it('should format 1 year ago correctly (365 days)', () => {
            const date = new Date('2024-12-31T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2024-12-31T14:00:00.000Z `1 Year ago`');
        });

        it('should format multiple years ago correctly', () => {
            const date = new Date('2022-12-31T14:00:00.000Z');
            const result = DateTools.FormatDateWithAge(date);
            
            expect(result).toBe('2022-12-31T14:00:00.000Z `3 Years ago`');
        });
    });
});
