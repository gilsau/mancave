var convoPanel = $('#convoPanel');
var convoMsgsSection = $('#convoMsgs');
var msgBox = $('#txtConvoMsg');

$(document).ready(function () {

    //Page Onload
    ConvoPanelResize();
    
    //Window resizes
    win.resize(function () {
        ConvoPanelResize();
    });

    //Conversation item block is clicked
    $('.convoItem').click(function () {

        //Highlight conversation selected
        $('.convoItem').removeClass('active');
        $(this).addClass('active');

        //Save conversation Id on page, for updating conversation
        var convoId = $(this).attr('data-convo-id');
        $('#convoId').val(convoId);

        //Save 'To Account' Id, for updating conversation
        var toAcctId = $(this).attr('data-to-acct-id');
        $('#toAcctId').val(toAcctId);

        //Get messages for conversation selected
        GetConvoMsgs(convoId);
    });

    //Send button click
    $('#btnSendConvoMsg').click(function () {
        var name = $(this).attr('data-user-name');
        SendConvoMsg(name);
    });

    //Message texbox ENTER KEYPRESS
    $('#txtConvoMsg').keypress(function (e) {
        var code = e.keyCode || e.which;

        if (code == 13) {
            $('#btnSendConvoMsg').trigger('click');
        }
    });

    //Add status elements to global array
    $(".status-messages-user").each(function () {
        statusElements.push({ ElemId: $(this).attr('id'), UserId: $(this).attr('data-id') });
        statusUserIds.push($(this).attr('data-id'));
    });

    //Toggle conversations list, in mobile version
    $('.conversationslist').click(function () {
        $('#convoList').slideToggle();
    });

    //Create timer for new conversation messages
    if ($('#convoId').val() != '') {
        setInterval(CheckForNewConvoMsgs, intCheckForNewConvoMsgs);
    }

    //Scroll down in Conversation Panel, And set focus to Mesage texbox
    convoPanel.scrollTop(convoPanel[0].scrollHeight);
    $('#txtConvoMsg').focus();
});

//Create timer for new conversation messages
function CheckForNewConvoMsgs()
{
    var convoId = $('#convoId').val();

    //Run ajax
    $.ajax({
        type: "POST",
        url: "/messages/get",
        data: { leftPanel: false, conversationId: convoId, msgType: 1, newMessages: true }
    })
    .fail(function(response){
        //console.log('failed');
        //console.log(response);
    })
    .done(function (response) {
        convoMsgsSection.append(response);
        convoPanel.scrollTop(convoPanel[0].scrollHeight);
        msgBox.focus();

        //console.log('done');
        //console.log(response);
    });
}

//Send message to conversation
function GetConvoMsgs(convoId) {

    //console.log('in getconvomsgs');
    //console.log(convoId);

    var newMailIcon = $('#imgNewMail-' + convoId);

    //Show loading symbol
    convoMsgsSection.hide();
    
    var loading = $('#imgConvoLoading');
    loading.css('height', convoPanel.height() / 2 + 'px');
    loading.css('width', convoPanel.width() / 2 + 'px');
    loading.css('position', 'relative');
    loading.css('top', convoPanel.height() / 4 + 'px');
    loading.css('left', convoPanel.width() / 4 + 'px');
    loading.show();

    //Show dialog for at least 2 seconds
    setTimeout(function () {

        //Run ajax
        $.ajax({
            type: "POST",
            url: "/messages/get",
            data: { leftPanel: false, conversationId: convoId, msgType: 1, newMessages: false }
        })
        .fail(function (response) {
            loading.hide();
        })
        .done(function (response) {

            loading.hide();

            //Load messages
            newMailIcon.hide();
            convoMsgsSection.show();
            convoMsgsSection.html(response);
            convoPanel.scrollTop(convoPanel[0].scrollHeight);
            msgBox.focus();

            //console.log(response);
        });

    }, 2000);
}

//Send message to conversation
function SendConvoMsg(name) {
    var datetime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    var message = msgBox.val();
    var convoId = $('#convoId').val();
    var recentMsg = $('#divMostRecentMsg-' + convoId.toString());
    var fromAcctId = $('#fromAcctId').val();
    var toAcctId = $('#toAcctId').val();
    var msgTemplate = "<div class=\"row-fluid\" style=\"padding:5px;\">"
    msgTemplate += "<div><b>{0}</b>&nbsp;<small class=\"text-info pull-right\">{1}</small></div>"
    msgTemplate += "<div class=\"messageid\" data-id=\"5\">{2}</div>"
    msgTemplate += "</div><hr style='margin:0px;padding:5px;' />";

    //console.log('*********** Sending Msg for Convo *****************');
    //console.log('toAcctId: ' + $('#toAcctId').val());

    //Append message to conversation panel, and save message in database async w/ajax call below
    convoMsgsSection.append(msgTemplate.replace("{0}", name).replace("{1}", datetime).replace("{2}", message));
    recentMsg.text(message);
    convoPanel.scrollTop(convoPanel[0].scrollHeight);
    msgBox.val('');
    msgBox.focus();

    //Run ajax
    $.ajax({
        type: "POST",
        url: "/messages/sendmessage",
        data: { FromAcctId: fromAcctId, ToAcctId: toAcctId, ConversationId: convoId, Message: message }
    })
    .done(function (response) {
        //console.log(response);
    });
}

//Resize left panel
function ConvoPanelResize() {

    $('#mainPanel').css('height', $(window).height() - $('#header').height() - 100);

    $('#btnSendConvoMsg').css('height', $('#txtConvoMsg').height());

    $('#convoList').css('height', $('#mainPanel').height() - $('#header').height() - 10);

    $('#convoPanel').css('height', $('#mainPanel').height() - $('#header').height() - $('#convoTextSection').height());

    //Disable main panel's scrollbar
    //$('#divMainPanel').css('overflow-y', 'hidden');
}