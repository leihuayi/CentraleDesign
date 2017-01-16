var translation = {};

function fetchTranslation() {
    //If the variable already exists
    if (localStorage && localStorage.getItem('translation')) {

        //If we can parse the variable
        if(JSON.parse(localStorage.getItem('translation'))) {
            translation = JSON.parse(localStorage.getItem('translation'));
        }
        //Else there's an error, we delete it
        else {
            deleteTranslation();
            getTranslation();
        }

    } else {
        getTranslation();
    }

}

function getTranslation() {
    $.ajax(
        {
            url: "/translation",
            method: "GET",
            dataType: "json"
        }).done(function(json) {
            translation = json;
            if (localStorage) {
                localStorage.setItem('translation', JSON.stringify(json));
            }
        });
}

function deleteTranslation() {
    Object.keys(localStorage)
        .forEach(function(key){
            if (/^(translation)/.test(key)) {
                localStorage.removeItem(key);
            }
        });
}

function changeLang(lang) {
    deleteTranslation();
    window.location.href = "/"+lang;
}

$(document).ready(function(){
    //If forced in url change lang
    //Get translations for JQuery use
    if(window.location.href.indexOf('?lang=') !== -1) {
        var index = window.location.href.indexOf('?lang=');
        var lang = window.location.href.substring(index+6,index+8);

        //Delete request from url
        window.history.pushState("object or string", "Title", window.location.href.substring(0,index)+window.location.href.substring(index+8));
        if(lang !== 'en'){
            lang = 'fr';
        }
        changeLang(lang);
    }

    //Get translations for JQuery use
    if(window.location.pathname.indexOf('login') !== -1) {
        deleteTranslation();
    }

    fetchTranslation();
});