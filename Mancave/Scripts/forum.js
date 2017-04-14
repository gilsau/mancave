$(document).ready(function () {

    //Set focus to new topic textbox
    $('#addForumMsgForm').on('shown.bs.modal', function () {
        $('#newforummsg-name').focus();
    });

    //Allow enter-key for new forum textbox
    /*$('#newforummsg-name').on('keypress', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            $('#btnCreateForumMsg').trigger('click');
        }
    });*/

    //Set focus to new topic textbox
    $('#addTopicForm').on('shown.bs.modal', function () {
        $('#newtopic-name').focus();
    });

    //Allow enter-key for new forum textbox
    /*$('#newtopic-name').on('keypress', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            $('#btnCreateTopic').trigger('click');
        }
    });*/

    //Set focus to new forum textbox
    $('#addForumForm').on('shown.bs.modal', function () {
        $('#newforum-name').focus();
    });

    //Allow enter-key for new forum textbox
    $('#newforum-name').on('keypress', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            $('#btnCreateForum').trigger('click');
        }
    });

});