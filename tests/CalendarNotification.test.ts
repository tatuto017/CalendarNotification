import CalendarNotification from '@src/CalendarNotification';

// protedtedのテストの為、継承してpublicに変える
class SubTestClass extends CalendarNotification {
    public notify(messsage : string) {
        super.notify(messsage);
    }
}

describe('CalendarNotification.ts test', () => {
    const mockevt = {
        removeAllReminders : jest.fn(),
        getTitle           : jest.fn().mockReturnValue('eventTitle')
    };
    CalendarApp.getDefaultCalendar = jest.fn().mockImplementation(() => {
        return {
            getEventsForDay: jest.fn().mockReturnValue([mockevt])
        } 
    });

    describe('createTrigger test', () => {

        const mockend  = { create    : jest.fn() };
        const mockdays = { everyDays : jest.fn().mockImplementation((day : Number) => { return mockend; }) }; 
        const mockhour = { atHour    : jest.fn().mockImplementation((hour : number) => { return mockdays; }) };
        const mockbase = { timeBased : jest.fn().mockReturnValue(mockhour) };

        ScriptApp.newTrigger    = jest.fn().mockImplementation((name : string) => { return mockbase; });
        ScriptApp.deleteTrigger = jest.fn().mockImplementation((name : string) => {});
        const mocktrig1 = { getHandlerFunction: jest.fn().mockImplementation(() => { return 'notice'; }) };
        const mocktrig2 = { getHandlerFunction: jest.fn().mockImplementation(() => { return 'removeReminders'; }) };
        const mocktrig3 = { getHandlerFunction: jest.fn().mockImplementation(() => { return 'dummy'; }) };
        ScriptApp.getProjectTriggers = jest.fn().mockReturnValue([mocktrig1, mocktrig2, mocktrig3]);

        afterEach(() => {
            mockend.create.mockClear();
            mockdays.everyDays.mockClear();
            mockhour.atHour.mockClear();
            mockbase.timeBased.mockClear();
            (ScriptApp.newTrigger as jest.Mock).mockClear();
            (ScriptApp.deleteTrigger as jest.Mock).mockClear();
            mocktrig1.getHandlerFunction.mockClear();
            mocktrig2.getHandlerFunction.mockClear();
            mocktrig3.getHandlerFunction.mockClear();
            (ScriptApp.getProjectTriggers as jest.Mock).mockClear();
        });
        test('hour 1', () => {
            const app = new CalendarNotification('linetoken', '%title%');
            app.createTrigger(1);
    
            expect(mocktrig1.getHandlerFunction.mock.calls.length).toBe(1);
            expect(mocktrig2.getHandlerFunction.mock.calls.length).toBe(1);
            expect(mocktrig3.getHandlerFunction.mock.calls.length).toBe(1);
            expect((ScriptApp.deleteTrigger as jest.Mock).mock.calls.length).toBe(2);
            expect((ScriptApp.deleteTrigger as jest.Mock).mock.calls[0][0]).toEqual(mocktrig1);
            expect((ScriptApp.deleteTrigger as jest.Mock).mock.calls[1][0]).toEqual(mocktrig2);
            expect((ScriptApp.newTrigger as jest.Mock).mock.calls[0][0]).toBe('notice');
            expect((ScriptApp.newTrigger as jest.Mock).mock.calls[1][0]).toBe('removeReminders');
            expect(mockhour.atHour.mock.calls[0][0]).toBe(1);
            expect(mockhour.atHour.mock.calls[1][0]).toBe(0);
            expect(mockdays.everyDays.mock.calls[0][0]).toBe(1);
            expect(mockdays.everyDays.mock.calls[1][0]).toBe(1);
            expect(mockend.create.mock.calls.length).toBe(2);
        });

        test('hour 0', () => {
            const app = new CalendarNotification('linetoken', '%title%');
            app.createTrigger(0);
    
            expect(mocktrig1.getHandlerFunction.mock.calls.length).toBe(1);
            expect(mocktrig2.getHandlerFunction.mock.calls.length).toBe(1);
            expect(mocktrig3.getHandlerFunction.mock.calls.length).toBe(1);
            expect((ScriptApp.deleteTrigger as jest.Mock).mock.calls.length).toBe(2);
            expect((ScriptApp.deleteTrigger as jest.Mock).mock.calls[0][0]).toEqual(mocktrig1);
            expect((ScriptApp.deleteTrigger as jest.Mock).mock.calls[1][0]).toEqual(mocktrig2);
            expect((ScriptApp.newTrigger as jest.Mock).mock.calls[0][0]).toBe('notice');
            expect((ScriptApp.newTrigger as jest.Mock).mock.calls[1][0]).toBe('removeReminders');
            expect(mockhour.atHour.mock.calls[0][0]).toBe(0);
            expect(mockhour.atHour.mock.calls[1][0]).toBe(23);
            expect(mockdays.everyDays.mock.calls[0][0]).toBe(1);
            expect(mockdays.everyDays.mock.calls[1][0]).toBe(1);
            expect(mockend.create.mock.calls.length).toBe(2);
        });
    
    });

    test('notice test', () => {
        const spy = jest.spyOn(SubTestClass.prototype, 'notify').mockImplementation((message:String) => {});
        const app = new SubTestClass('linetoken', '%title%');

        app.notice();
        expect(mockevt.getTitle).toBeCalled()
        expect(spy).toBeCalled();
        expect(spy.mock.calls[0][0]).toBe('eventTitle');
    });

    test('removeReminders', () => {
        const app = new CalendarNotification('linetoken', '%title%');
        app.removeReminders();
        expect(mockevt.removeAllReminders).toBeCalled();
    });

    test('notify test', () => {
        UrlFetchApp.fetch = jest.fn().mockImplementation((url:String, params:any) => {});
        const app = new CalendarNotification('linetoken', '%title%');
        (app as any).notify('message');
        expect(UrlFetchApp.fetch).toBeCalled();
        expect((UrlFetchApp.fetch as jest.Mock).mock.calls[0][0]).toBe(app.line_notify_url);
        expect((UrlFetchApp.fetch as jest.Mock).mock.calls[0][1]).toEqual({
            "method"  : "post",
            "payload" : "message=message",
            "headers" : {"Authorization" : "Bearer linetoken"}
        });
    });
});
