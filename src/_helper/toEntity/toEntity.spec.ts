import { toEntity } from "./toEntity";

describe('toEntity', () => {
    const converter = new toEntity();

    it('should convert all keys to start with an uppercase letter', () => {
        const input = {
            age: 20,
            name: 'elton'
        };
        const expectedOutput = {
            Age: 20,
            Name: 'elton'
        };
        const output = converter.create(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should return an empty object for an empty input object', () => {
        const input = {};
        const expectedOutput = {};
        const output = converter.create(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should not modify an object whose keys are already in uppercase', () => {
        const input = {
            Age: 20,
            Name: 'elton'
        };
        const expectedOutput = {
            Age: 20,
            Name: 'elton'
        };
        const output = converter.create(input);
        expect(output).toEqual(expectedOutput);
    });
});
