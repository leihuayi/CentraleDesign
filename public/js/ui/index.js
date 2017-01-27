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
    var data = {order_id : orderId};
    data.designer_id = parseInt($modal.find('input').val().substring(1,$modal.find('input').val().indexOf(':')));

    var designerEmail = $modal.find('input').val().substring($modal.find('input').val().indexOf(':')+2);

    var columnDesignerIndex = $('table th[data-field="designer"]').index();
    var designerOrderCell = $('table tr[data-id="'+orderId+'"]').find('td:eq('+columnDesignerIndex+')');

    api.createDesignerOrder(data)
        .then(function(designerOrder){
            var html = designerOrderCell.text() ? designerOrderCell.html() : "";
            html+= '<span data-id="'+designerOrder.id+'" class="badge-designer">'+designerEmail.substring(0,designerEmail.indexOf('@'))+'</span>';
            designerOrderCell.html(html);
            $modal.find('input').val('');
        });
}

function unassignDesigner(orderId){
    $('tr[data-id="'+orderId+'"] .badge-designer').addClass('edit');
    Materialize.toast(translation.action_unassign_designer_info, 2000);
    $('.badge-designer.edit').on('click',function(){
        var $elem = $(this);
        api.deleteDesignerOrder($elem.data('id'))
            .then(function(){
                $elem.remove();
                $('.badge-designer.edit').unbind( "click").removeClass('edit');
            });
    });
}

function updateRangeField($elem){
    var $rangeField = $elem.closest('.range-field');
    if(! $rangeField.hasClass('disabled')) {
        $rangeField.find('.range-connect').css('width',$elem.text()+'%');
    }
}

function updateProgress($input){
    var $rangeField = $input.closest('.range-field');
    if($rangeField.hasClass('disabled')){
        Materialize.toast(translation.error_not_responsible, 2000);
    }
    else {

        var orderId = $rangeField.closest('.card-content').data('id');
        var data = new FormData();
        data.append('progress',$input.val());

        api.updateOrder(orderId,data)
            .then(function(){
                console.log('updated !');
            });
    }
}

$( document ).ready(function(){
    //Enable side nav
    $(".button-collapse").sideNav();

    /** ENABLE MATERIALIZE COMPONENTS **/
    //Start material selects
    $('select').material_select();
    //Give a name attribute to material selects input
    $('input.select-dropdown').each(function (){
        $(this).attr("name",$(this).closest('.input-field').data('name'));});

    //Start datepickers
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    //Start carousels
    $('.carousel.carousel-slider').carousel({full_width: true, interval:2000});

    //Start auto completes
    initAutocompletes();

    //Start staggered lists
    Materialize.showStaggeredList('.staggered-list');

    //Start material boxes
    $('.materialboxed').materialbox();
    /** END MATERIALIZE COMPONENTS **/

    $('#form_order').submit(function (event){
        event.preventDefault();
        sendOrder($(this));
    });

    $('.range-field .value').bind("DOMSubtreeModified",function(){updateRangeField($(this))});

    $('#range_order').on("change",function(){updateProgress($(this))});

    $('*[data-href]').click(function(){
        window.location.href=$(this).data('href');
    });

});