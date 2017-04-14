$(document).ready(function () {

    $('#btnJoinSingle').click(function (e) {
        var singleEmail = $('#SingleEmail');
        
        $('#HerEmail').val('');
        $('#Email').val(singleEmail.val());
        
        $('#frmSignup').trigger('submit');
    });

    $('#btnJoinMarried').click(function (e) {
        var marriedHerEmail = $('#MarriedHerEmail');
        var marriedEmail = $('#MarriedEmail');
        
        $('#HerEmail').val(marriedHerEmail.val());
        $('#Email').val(marriedEmail.val());
        
        $('#frmSignup').trigger('submit');
    });
});