'use strict';

var api = apiRequests();

function sendOrder($form) {
    var required = true;

    $form.find('input,textarea').each(function(){
        if($(this).prop('required') || $(this).attr('name') == 'type'){
            if(!$(this).val()) {
                required = false;
                $(this).addClass('invalid');
            }
            else{
                $(this).removeClass('invalid');
            }
        }
    });

    if(required){
        var data = new FormData($form[0]);

        //Get all image files
        var arrayFiles = [];
        $.each($($form.find("input[type='file']"))[0].files, function(i, file) {
            arrayFiles.push(file);
        });
        data.append('images',arrayFiles);

        //Get selected type
        var selected = $form.find('div[data-name="type"] .dropdown-content li.active').index();
        var type = $form.find('div[data-name="type"] select option').eq(selected).val();
        data.set("type",type);


        api
            .createOrder(data)
            .then(function(response){
                window.location.href="/";
            })
    }

    else{
        $form.find('.text-error').text(translation.error_fields_empty+" (*)");
    }

}

function openModal(modal){
    $(modal).modal();
    $('.modal.bottom-sheet').animate({'bottom':0})
}

$( document ).ready(function(){
    $(".button-collapse").sideNav();
    $('select').material_select();

    //Give a name attribute to the input
    $('input.select-dropdown').each(function (){
        $(this).attr("name",$(this).closest('.input-field').data('name'));});
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $('.carousel.carousel-slider').carousel({full_width: true, interval:2000});

    $('#form_order').submit(function (event){
        event.preventDefault();
        sendOrder($(this));
    });

    $('*[data-href]').click(function(){
        window.location.href=$(this).data('href');
    });

    Materialize.showStaggeredList('#my_orders');

    $('#modal_menu_designer').addClass('modal');
});