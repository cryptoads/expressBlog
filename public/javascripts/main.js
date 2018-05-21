$(document).ready(function() {

      
    $('.post').on('click', function(){
        var id = $(this).data('id');
        $.get('/'+id).done(function(data){
            $('.modal-title').html(`<a href="/blog/${data.id}">${data.title}</a>`)
            $('.js-author').html(`${data.first_name} ${data.last_name}`)
            $('.js-date').html(data.date)
            $('.js-content').html(data.content)
            $('.modal').modal();
        })
    })

})
