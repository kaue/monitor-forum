function notifyMe(texto, url) {
    if (!("Notification" in window)) {
        alert("Esse navegador não suporte notificações!");
    }
    else if (Notification.permission === "granted") {
        console.log("Enviando notification: " + texto);
        var notification = new Notification("Novo Tópico", {
            dir: "auto",
            icon: "/images/icone.png",
            lang: "",
            body: texto,
            tag: "tag",
        });
        notification.onclick = function () {
            var win = window.open(url, '_blank');
            win.focus();
        }
        notification.onshow = function () {
            //alert("enviado");
        }
        return true;
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if(!('permission' in Notification)) {
                Notification.permission = permission;
            }
            if (permission === "granted") {
                console.log("Enviando notification: " + texto);
                var notification = new Notification("Novo Tópico", {
                    dir: "auto",
                    icon: "/images/icone.png",
                    lang: "",
                    body: texto,
                    tag: "tag",
                });
                notification.onclick = function () {
                    var win = window.open(url, '_blank');
                    win.focus();
                }
                notification.onshow = function () {
                    //alert("enviado");
                }
                return true;
            }
        });
    }
    return false;
}
$(document).ready(function() {
    if ($.cookie('posts') == null){
        $.cookie('posts', JSON.stringify(new Array()));
    }
    listaPosts = new Array();
    
    listaPosts = JSON.parse($.cookie('posts'));
    $(".post").find("a").each(function () {
        var link = $(this).attr('href');
        var titulo = $(this).text();
        if(listaPosts.indexOf(link) == -1){
            if(notifyMe(titulo, link)) {
                listaPosts.push(link);
            }
            return false;
        }
    }); 
    $.cookie('posts', JSON.stringify(listaPosts));
});

