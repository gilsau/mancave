var spanImgLabel = '';

$(document).ready(function () {

    //Photo icon click
    bindMancaveImgBtn();

    //Photo selected
    bindMancaveImgSelected();

    //Form submitted
    bindMancaveFormSubmit();

    //Comment btn click
    bindMancaveCommentBtn();

    if ($('#mcaveComment')) {
        $('#mcaveComment').focus();
    }

});

function bindMancaveCommentBtn() {
    $('.btnPostComment').on('click', function (e) {
        
        var parentId = $(this).attr('data-parent-id');
        var comment = $('#newcomment-'+parentId).val();

        console.log(comment);

        //Set comment field in form
        $('#Comment').val(comment);
        $('#ParentAccountPostId').val(parentId);

        console.log($('#mcaveComment').val());

        $('#frmMcavePost').trigger('submit');

    });
}

function bindMancaveFormSubmit() {
    $('#frmMcavePost').on('submit', function (e) {
        var comment = $.trim($('#mcaveComment').val());

        if (comment != '') {
            $('#Comment').val(comment);
        }

        MancavePost(this);
        e.stopPropagation();
        e.preventDefault();
    });
}

function bindMancaveImgSelected() {
    $('#mcaveImg').on('change', function () {
        var filename = $.trim($(this).val());
        if (filename != '') {
            var fileparts = filename.split('\\');
            $('#'+spanImgLabel).html('<b>PHOTO: </b>' + fileparts[fileparts.length - 1]);
        }
    });
}

function bindMancaveImgBtn() {
    $('.btnMcaveImg').on('click', function () {

        //Label to show image selected from upload window
        spanImgLabel = $(this).attr('data-span-img-label');

        //Trigger click event for image selection from computer
        $('#mcaveImg').trigger('click');
    });
}

function MancavePost(form) {

    $.ajax({
        url: '/mancave/post',
        type: 'POST',
        data: new FormData(form),
        processData: false,
        contentType: false
    })
    .fail(function (response) {
        console.log('failed');
        console.log(response);
    })
    .done(function (response) {
        $('.mcaveContainer').html(response);

        bindMancaveImgBtn();
        bindMancaveImgSelected();
        bindMancaveFormSubmit();
        bindMancaveCommentBtn();

        $(window).trigger('resize');

        //console.log('done');
        //console.log(response);
    });
}