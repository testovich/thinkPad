module.exports = function(time) {
    var today = new Date(),
        timeStamp = new Date(parseInt(time)),
        timeString;

    var getWithTimezone = function (dateObj){
        var utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000* (new Date().getTimezoneOffset()/60)*-1)).getTime();
    };

    var todayTmp = getWithTimezone(today);
    var timeStampTmp = getWithTimezone(timeStamp);

    var dayToday = today.getDay(),
        dayTimestamp = timeStamp.getDay();

    var difference = todayTmp - timeStampTmp;

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24;

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60;

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60;

    var secondsDifference = Math.floor(difference/1000);

    if(daysDifference === 0 && hoursDifference < 1) {
        timeString = minutesDifference+' м '+secondsDifference+' с назад';
    }
    if(daysDifference === 0 && hoursDifference >= 1 && dayToday === dayTimestamp) {
        timeString = 'cегодня в ' + new Date(timeStampTmp).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    if((daysDifference === 1) || (daysDifference === 0 && hoursDifference >= 1 && dayToday !== dayTimestamp)) {
        timeString = 'вчера в ' + new Date(timeStampTmp).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    if(daysDifference > 0) {
        timeString = new Date(timeStampTmp).toLocaleString().split(' ').splice(0,2).join(' ');
    }

    return timeString;
};

