function apiRequests() {
    var api = '/api/';

    return {
        createOrder: createOrder,
        updateOrder: updateOrder,
        deleteOrder: deleteOrder,
        searchorders: searchorders,
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
                404: function() {
                    alert(translation.error_no_Order);
                },
                400: function() {
                    alert(translation.error_scene_create_missing);
                }
            }
        })
    }

    function updateOrder(OrderId, data) {
        return $.ajax({
            url: api + 'orders/' + OrderId,
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

    function deleteOrder(OrderId) {
        return $.ajax({
            url: api + 'orders/' + OrderId,
            type: 'DELETE',

            error: function (err){
                alert('Error in deleting Order '+OrderId);
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