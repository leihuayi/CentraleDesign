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

        //Get selected type
        var selected = $form.find('div[data-name="type"] .dropdown-content li.active').index();
        var type = $form.find('div[data-name="type"] select option').eq(selected).val();
        data.set("type",type);


        api
            .createOrder(data)
            .then(function(response){
                window.location.href="/";
            });
    }

    else{
        $form.find('.text-error').text(translation.error_fields_empty+" (*)");
    }

}

function openModal(modal,id){
    $(modal).modal();
    if(id){
        $(modal).data('id',id);
    }
    $('.modal.bottom-sheet').animate({'bottom':0})
}

function initAutocompletes(){
    //Set designer autocomplete
    api.getDesigners()
        .then(function(designers){
            var data={};
            $.each(designers,function(index, designer){
                data['#'+designer.id+' : '+designer.email] = null;

                if(index == designers.length-1) {
                    $('#autocomplete_designer').autocomplete({
                        data: data
                    });
                }
            });
        })
}

function assignDesigner(){
    var $modal = $('#modal_set_designer');
    var orderId = $modal.data('id');
    var data = new FormData();
    data.append("order_id",orderId);
    data.append("designer_id",$modal.find('input').val().substring(1,$modal.find('input').val().indexOf(':')));

    var columnDesignerIndex = $('table th[data-field="designer"]').index();
    var designerOrderCell = $('table tr[data-id="'+orderId+'"]').find('td:eq('+columnDesignerIndex+')');

    if(designerOrderCell.data('id')){
        api.updateDesignerOrder(designerOrderCell.data('id'), data)
            .then(function(designerOrder){
                updateDesignerAssigned(designerOrder);
            })
    }
    else{
        api.createDesignerOrder(data)
            .then(function(designerOrder){
                updateDesignerAssigned(designerOrder);
            })
    }

    function updateDesignerAssigned(designerOrder){
        designerOrderCell.data('id', designerOrder.id);
        designerOrderCell.text(designerOrder.designer_id);
        //$modal.modal('close');
    }
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

    initAutocompletes();

});