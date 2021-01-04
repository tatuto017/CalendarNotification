export default class CalendarNotification {
    public readonly line_notify_url : string = 'https://notify-api.line.me/api/notify';
    private token   : string;
    private message : string;

    constructor(token : string, message : string) {
        this.token   = token;
        this.message = message;
    }

    public createTrigger(hour : number) {
        let funcname : string;
        ScriptApp.getProjectTriggers().forEach(trigger => {
            funcname = trigger.getHandlerFunction();
            if ( ['notice', 'removeReminders'].some(name => name == funcname) ) {
                ScriptApp.deleteTrigger(trigger);
            }
        });
        
        ScriptApp.newTrigger('notice').timeBased().atHour(hour).everyDays(1).create();
        hour = hour == 0 ? 23 : hour - 1;
        ScriptApp.newTrigger('removeReminders').timeBased().atHour(hour).everyDays(1).create();
    }

    public notice() {
        const calendar = CalendarApp.getDefaultCalendar();
        const date     = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
        
        calendar.getEventsForDay(date).forEach(event => {
            this.message = this.message.replace('%title%', event.getTitle());
            this.notify(this.message);
        });
    }

    public removeReminders() {
        const calendar = CalendarApp.getDefaultCalendar();
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()　+ 1);
        calendar.getEventsForDay(date).forEach(event => {
            event.removeAllReminders();
        });
    }

    protected notify(messsage : string) {
        UrlFetchApp.fetch(this.line_notify_url, {
            "method"  : "post",
            "payload" : "message=" + messsage,
            "headers" : {"Authorization" : "Bearer " + this.token }
        });
    }
}