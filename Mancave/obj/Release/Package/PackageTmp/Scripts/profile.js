$(document).ready(function () {

    $('#messageForm').on('shown.bs.modal', function () {
        $('#message-text').focus();
    });

    $('#btnAddFriend').click(function () {

        var friendId = $(this).attr('data-id');

        //Run ajax
        $.ajax({
            type: "POST",
            url: "/messages/sendfriendrequest",
            data: { FriendId: friendId }
        })
        .fail(function (response) {
            console.log('failed');
            console.log(response);
        })
        .done(function (response) {
            
            $('#btnAddFriend').html('Friend Request Sent');
            $('#btnAddFriend').attr('disabled', 'disabled');

            console.log('done');
            console.log(response);
        });
    });

    //Close button for Edit Website Colors section
    $('.closeEditWebsite').click(function () {
        $('#editwebsitePanel').collapse('hide');
    });

    //Enable sliders for Edit Website Colors section
    $('#editwebsitePanel').on('shown.bs.collapse', function () {

        //Initialize Sliders
        $('#MainPanelBackImgTransparency, #MainPanelPanelsTransparency').slider({
            formatter: function (value) {
                return 'Current value: ' + value;
            }
        });
    });

    //Update transparency for Background Image
    $('#MainPanelBackImgTransparency').on('slideStop', function () {
        var val = $(this).slider('getValue').val();
        var backImg = $('#BackgroundImage').val();
        
        $('#mainPanel').css('background', 'linear-gradient(rgba(255, 255, 255, 0.' + val + '), rgba(255, 255, 255, 0.' + val + ')), url(/backimgs/' + backImg + ')');

        saveWebsiteSettings();
    });

    //Update transparency for Main Panel panels
    $('#MainPanelPanelsTransparency').on('slideStop', function () {
        var val = $(this).slider('getValue').val();
    
        $('#mainPanel > .panel').css('background', 'linear-gradient(rgba(255, 255, 255, 0.' + val + '), rgba(255, 255, 255, 0.' + val + '))');

        saveWebsiteSettings();
    });

    //Update Header Link Color
    $('#HeaderFontColor, #LeftPanelFontColor, #RightPanelFontColor').change(function () {
        var FontColor = $(this).val();
        var eventSrc = $(this);
        var id = eventSrc.attr('id');

        if (id.indexOf('Header') > -1) {
            $('.navbar a').css('color', FontColor);
        }
        else if (id.indexOf('LeftPanel') > -1) {
            $('#leftPanel').css('color', FontColor);
        }
        else if (id.indexOf('RightPanel') > -1) {
            $('#rightPanel').css('color', FontColor);
        }
        
        saveWebsiteSettings();
    });

    //Update Back Colors
    $('#HeaderBackColor1, #LeftPanelBackColor1, #RightPanelBackColor1, #HeaderBackColor2, #LeftPanelBackColor2, #RightPanelBackColor2').change(function () {
        var id = $(this).attr('id');
        var backColor1 = id.indexOf('Color1') > -1 ? $(this).val() : $('#' + id.replace('Color2', 'Color1')).val();
        var backColor2 = id.indexOf('Color2') > -1 ? $(this).val() : $('#' + id.replace('Color1', 'Color2')).val();

        var meta = $('.navbar-fixed-top');
        if (id.indexOf('LeftPanel') > -1) {
            meta = $('#leftPanel');
        }
        else if (id.indexOf('RightPanel') > -1) {
            meta = $('#rightPanel');
        }

        //Affect website now
        meta.css("background", "-webkit-linear-gradient(left top," + backColor1 + "," + backColor2 + ")");
        meta.css("background", "o-linear-gradient(bottom right," + backColor1 + "," + backColor2 + ")");
        meta.css("background", "-moz-linear-gradient(bottom right," + backColor1 + "," + backColor2 + ")");
        meta.css("background", "linear-gradient(to bottom right," + backColor1 + "," + backColor2 + ")");

        saveWebsiteSettings();
    });
});

function saveWebsiteSettings() {
    
    /*
    console.log('$(#MainPanelBackImgTransparency)');
    console.log($('#MainPanelBackImgTransparency').slider('getValue').val());
    console.log('-----------------------------------------------------------------');
    console.log('$(#MainPanelPanelsTransparency)');
    console.log($('#MainPanelPanelsTransparency').slider('getValue').val());
    */

    //Send to server, to save in database
    $.ajax({
        url: '/account/updatewebsite',
        type: 'POST',
        data: {
            HeaderBackColor1: $('#HeaderBackColor1').val(),
            HeaderBackColor2: $('#HeaderBackColor2').val(),
            HeaderFontColor: $('#HeaderFontColor').val(),
            LeftPanelBackColor1: $('#LeftPanelBackColor1').val(),
            LeftPanelBackColor2: $('#LeftPanelBackColor2').val(),
            LeftPanelFontColor: $('#LeftPanelFontColor').val(),
            RightPanelBackColor1: $('#RightPanelBackColor1').val(),
            RightPanelBackColor2: $('#RightPanelBackColor2').val(),
            RightPanelFontColor: $('#RightPanelFontColor').val(),
            MainPanelBackImgTransparency: $('#MainPanelBackImgTransparency').slider('getValue').val(),
            MainPanelPanelsTransparency: $('#MainPanelPanelsTransparency').slider('getValue').val(),
            MainPanelFontColor: $('#MainPanelFontColor').val()
        }
    })
    .fail(function (response) {
        console.log('failed');
        console.log(response);
    })
    .done(function (response) {
        console.log('done');
        console.log(response);
    });
}