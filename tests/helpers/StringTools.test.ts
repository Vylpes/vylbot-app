import StringTools from "../../src/helpers/StringTools";

describe('Capitalise', () => {
    test('Expect sentence to be captilised', () => {
        const inputString = 'the big brown fox jumps over the lazy dog';

        const result = StringTools.Capitalise(inputString);

        expect(result).toBe('The Big Brown Fox Jumps Over The Lazy Dog');
    });
});