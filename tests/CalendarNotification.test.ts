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
