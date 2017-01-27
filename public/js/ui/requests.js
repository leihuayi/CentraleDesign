function apiRequests() {
    var api = '/api/';

    return {
        createOrder: createOrder,
        updateOrder: updateOrder,
        deleteOrder: deleteOrder,
        searchOrders: searchOrders,
        createDesignerOrder : createDesignerOrder,
        deleteDesignerOrder : deleteDesignerOrder,
        getDesigners : getDesigners,
        updateUser: updateUser,
        deleteUser: deleteUser,
        getLayout : getLayout
    };

    function createOrder(data) {
        return $.ajax({
            url: api + 'orders/',
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            dataType: 'json',
            statusCode: {
                400: function() {
                    alert(translation.error);
                }
            }
        })
    }

    function updateOrder(orderId, data) {
        return $.ajax({
            url: api + 'orders/' + orderId,
            type: 'PUT',
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            statusCode: {
                400: function() {
                    alert("Missing file");
                }
            }
        });
    }

    function deleteOrder(orderId) {
        return $.ajax({
            url: api + 'orders/' + orderId,
            type: 'DELETE',

            error: function (err){
                alert('Error in deleting Order '+orderId);
            }
        });
    }

    function searchOrders(query){
        return $.ajax({
            url: api + 'orders/search?query='+query+'&format=json',
            type: 'GET',

            error: function (err){
                alert(translation.error);
            }
        });
    }

    function createDesignerOrder(data) {
        return $.ajax({
            url: api + 'designer-orders/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            statusCode: {
                400: function() {
                    alert(translation.error);
                }
            }
        });
    }

    function deleteDesignerOrder(designerOrderId) {
        return $.ajax({
            url: api + 'designer-orders/' + designerOrderId,
            type: 'DELETE',

            error: function (err){
                alert('Error in deleting the assignment '+designerOrderId);
            }
        });
    }

    function getDesigners() {
        return $.ajax({
            url: api + 'users/designers',
            type: 'GET',
            error: function (err){
                alert(translation.error);
            }
        });
    }

    function updateUser(userId, data) {
        return $.ajax({
            url: api + 'users/' + userId,
            type: 'PUT',
            data: data,
            processData: false,
            contentType: false,
            dataType: 'json',
            statusCode: {
                400: function() {
                    alert("Missing file");
                }
            }
        });
    }

    function deleteUser(id) {
        return $.ajax({
            url: api + 'users/' + id,
            type: 'DELETE',

            error: function (err){
                alert(translation.error);
            }
        });
    }

    function getLayout(data){
        return $.ajax({
            url: '/render',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            statusCode: {
                400: function() {
                    alert(translation.error);
                }
            }
        })
    }
}