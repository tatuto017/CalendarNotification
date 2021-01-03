import { getProp, setProp } from '@src/functions';

describe('functions.ts test', () => {
    const mockget = jest.fn().mockImplementation((key:string) => {});
    const mockset = jest.fn().mockImplementation((key:string, value:string) => {});
    PropertiesService.getScriptProperties = jest.fn().mockImplementation(() => {
        return {
            getProperty: mockget,
            setProperty: mockset
        }
    });
    const key   : string = 'LineToken';
    const value : string = 'sdjghghdhghfg';

    test('getProp test', () => {
        getProp(key);
        expect(mockget.mock.calls.length).toBe(1);
        expect(mockget.mock.calls[0][0]).toBe(key);
    });

    test('setProp test', () => {
        setProp(key, value);
        expect(mockset.mock.calls.length).toBe(1);
        expect(mockset.mock.calls[0][0]).toBe(key);
        expect(mockset.mock.calls[0][1]).toBe(value);
    });
});
