
//Window vars
var win = $(window);
var mainPanel = $('#mainPanel');
var leftPanel = $('#leftPanel');
var rightPanel = $('#rightPanel');

//Message/Notification vars
var msgsDropdown = $('#ulMsgs');
var notesDropdown = $('#ulNotes');

//Status vars
var statusElements = [];
var statusUserIds = [];

//Timers, 1000 = 1 sec
var intCheckForNewNotesForLeftPanel = 30000;    //New Notifications
var intCheckForNewMsgsForLeftPanel = 30000;     //New Messages
var intUpdateStatuses = 60000;                  //Users' Status
var intCheckForNewConvoMsgs = 5000;             //New Messages in Conversation, on Messages Page

$(document).ready(function () {
    ResizeMainPanel();

    $(window).resize(function () {
        ResizeMainPanel();
    });

    //Update statuses all over the current page
    //console.log('mainpanel: ' + statusElements);
    //setInterval(UpdateStatuses, intUpdateStatuses);

    //Create timer for new conversation messages
    CheckForNewMsgsForLeftPanel();
    setInterval(CheckForNewMsgsForLeftPanel, intCheckForNewMsgsForLeftPanel);

    //Create timer for new notifications
    CheckForNewNotesForLeftPanel();
    setInterval(CheckForNewNotesForLeftPanel, intCheckForNewNotesForLeftPanel);

    //Add status elements
    statusElements.push({ ElemId: $('#status-current-user').attr('id'), UserId: $('#status-current-user').attr('data-id') });
    statusUserIds.push($('#status-current-user').attr('data-id'));

    //Message button
    $("a[href='#messageForm']").click(function () {
        $('#message-name').text($(this).attr('data-name'));
        $('#message-contactid').val($(this).attr('data-id'));
    });

    //Send Message button
    $('.sendmessagebtn').click(function () {
        SendMessage();
    });

    //Set focus
    if ($('#EmailLogin')) {
        $('#EmailLogin').focus();
    }

});

//Pop-overs
$('[data-toggle="popover"]').popover({ trigger: 'hover', 'placement': 'left' });


//Create timer for new messages
function CheckForNewMsgsForLeftPanel() {
    var msgsList = $('#ulMsgs');
    var msgCount = $('#msgCount');
    var msgCounter = 0;

    if (!msgsList.is(':visible')) {

        //Run ajax
        $.ajax({
            type: "POST",
            url: "/messages/get",
            data: { leftPanel: true, conversationId: 0, msgType: 1, newMessages: true }
        })
        .fail(function (response) {

            //console.log('FAIL');
            //console.log(response.responseText);

        })
        .done(function (response) {
            msgsList.empty();
            msgsList.html(response);
            msgCount.show();

            //Subtract dividers in html
            msgCounter = ($('li', '<div>' + response + '</div>').length - 1) / 2;
            msgCounter = msgCounter > 1 ? msgCounter - 1 : msgCounter;
            msgCount.text(msgCounter);

            //console.log('DONE');
            //console.log(response);
        });
    }
}

//Create timer for new notifications
function CheckForNewNotesForLeftPanel() {
    var notesList = $('#ulNotes');
    var noteCount = $('#noteCount');
    var noteCounter = 0;

    if (!notesList.is(':visible')) {

        //Run ajax
        $.ajax({
            type: "POST",
            url: "/messages/get",
            data: { leftPanel: true, conversationId: 0, msgType: 2, newMessages: true }
        })
        .fail(function (response) {

            //console.log('FAIL');
            //console.log(response.responseText);

        })
        .done(function (response) {
            notesList.empty();
            notesList.html(response);
            noteCount.show();

            //Subtract dividers in html
            noteCounter = ($('li', '<div>' + response + '</div>').length - 1) / 2;
            noteCounter = noteCounter > 1 ? noteCounter - 1 : noteCounter;
            noteCount.text(noteCounter);

            //console.log('DONE');
            //console.log(response);
        });
    }
}

//Update Status for all friends of this user
function UpdateStatuses() {
    //console.log('*****************************************************');
    //console.log(statusUserIds);

    //Run ajax
    $.ajax({
        type: "POST",
        url: "/account/getstatus",
        data: { users: statusUserIds.toString() }
    })
    .fail(function (response) {
        //console.log(response.responseText);
    })
    .done(function (response) {

        //console.log('********* SUCCESS, RESPONSE *************');
        //console.log(response);

        var accountStatuses = response;
        var intCounter = 0;
        //Loop thru elements and update their status
        for (var se in statusElements) {
            intCounter++;

            var elem = $('#' + statusElements[se].ElemId);
            var userId = statusElements[se].UserId;

            //Look for current user's status
            var statusColor = 'gray';
            var statusText = 'Offline';
            for (var as in accountStatuses) {
                if (accountStatuses[as].AccountId == userId) {
                    statusColor = accountStatuses[as].StatusColor;
                    statusText = accountStatuses[as].StatusText;
                    break;
                }
            }

            //Redirect to login page, if user is timedout
            if (intCounter == 1 && statusText == 'Offline') {
                window.location = '../account/login';
            }

            //console.log('********** Element being updated *************');
            //console.log(elem);

            elem.css('color', statusColor);
            elem.text(statusText);
        }

        //console.log('******************** Success!\r\n');
        //console.log(response);
    });
}

//Send Message
function SendMessage() {
    var message = $('#message-text').val();
    var toAcctId = $('#message-contactid').val();

    //Show Dialog Box
    $('#messageForm').modal('hide');
    $('#procMsg').text('Sending message...');
    $('#modalProcessing').modal('show');

    //Show dialog for at least 3 seconds
    setTimeout(function () {

        //Run ajax
        $.ajax({
            type: "POST",
            url: "/messages/sendmessage/",
            data: { FromAcctId: 0, ToAcctId: toAcctId, ConversationId: '', Message: message }
        })
        .fail(function (response) {
            $('#modalProcessing').modal('hide');
            $('#okMsg').text('There was a problem sending the message.');
            $('#modalOk').modal('show');

            console.log('fail');
            console.log('response.statusText: ' + response.statusText);
            console.log("response.responseText: " + response.responseText);
        })
        .done(function (response) {

            if (response.Success) {
                //Hide Dialog Box
                $('#modalProcessing').modal('hide');
                $('#okMsg').text('Message was sent successfully!');
                $('#modalOk').modal('show');
            }
            else {
                $('#modalProcessing').modal('hide');
                $('#okMsg').text('There was a problem sending the message.');
                $('#modalOk').modal('show');
            }

            console.log('done');
            console.log(response);
        });

    }, 3000);
}

//Resize Main Panel
function ResizeMainPanel() {
    var winHt = $(window).height();
    var docHt = $(document).height();
    var mainHt = $('#mainPanel').height();
    var leftHt = $('#leftPanel').height();
    var rightHt = $('#rightPanel').height();
    var selectedHt = Math.max(winHt, docHt, mainHt, leftHt, rightHt);
    var bodyMargin = Math.abs($('body').css('margin-top').replace('px', ''));
    var footerHt = $('#footer').height();
    var headerHt = $('#header').height();

    /*
    console.log('mainHt = ' + mainHt);
    console.log('leftHt = ' + leftHt);
    console.log('rightHt = ' + rightHt);
    console.log('selectedHt =' + selectedHt);
    console.log('bodyMargin =' + bodyMargin);
    console.log('footerHt =' + footerHt);
    console.log('headerHt =' + headerHt);
    */

    mainPanel.css('height', selectedHt);
    leftPanel.css('height', selectedHt);
    rightPanel.css('height', selectedHt);
}