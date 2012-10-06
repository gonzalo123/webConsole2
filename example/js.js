var socket = io.connect('http://localhost:8000');
var RELAX_TIME = 5000;

socket.on('log', function (data) {
    console.log(data);
});

util = {
    urlRE:/https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,

    //  html sanitizer
    toStaticHTML:function (inputHtml) {
        inputHtml = inputHtml.toString();
        return inputHtml.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace("/n", "<br/>")
                .replace(/>/g, "&gt;");
    },

    //pads n with zeros on the left,
    //digits is minimum length of output
    //zeroPad(3, 5); returns "005"
    //zeroPad(2, 500); returns "500"
    zeroPad:function (digits, n) {
        n = n.toString();
        while (n.length < digits)
            n = '0' + n;
        return n;
    },

    //it is almost 8 o'clock PM here
    //timeString(new Date); returns "19:49"
    timeString:function (date) {
        var minutes = date.getMinutes().toString();
        var hours = date.getHours().toString();
        return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
    },

    //does the argument only contain whitespace?
    isBlank:function (text) {
        var blank = /^\s*$/;
        return (text.match(blank) !== null);
    }
};

function send(msg) {
    if (msg == 'clear') {
        $('#log').html('');
        return;
    }
    $('#log').append("<div class='cmd'>" + msg + "</div>");
    $.getJSON('process.php', {command: msg}, function(data) {

    });
}

socket.on('log', function (data) {
        console.log(data);
        $('#log').append(util.toStaticHTML(data));
        window.scrollBy(0, 10000000);
    });

$(document).ready(function () {
    //submit new messages when the user hits enter if the message isnt blank
    $("#entry").keypress(function (e) {
        if (e.keyCode != 13 /* Return */) return;
        var msg = $("#entry").attr("value").replace("\n", "");
        if (!util.isBlank(msg)) {
            send(msg);
        }
        $("#entry").attr("value", ""); // clear the entry field.
    });
});