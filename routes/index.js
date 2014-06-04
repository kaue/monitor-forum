var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var router = express.Router();
router.get('/', function(req, res) {
    var listaPost = new Array();
    var listaLinks = new Array();
    var bandeiras = ["extra.com.br", "pontofrio.com.br", "casasbahia.com.br"];
    request('http://www.hardmob.com.br/promocoes/',  {timeout: 20000, encoding: null}, function (error, response, html) {
        try{
            var htmlUtf8 = iconv.decode(new Buffer(html), "ISO-8859-1");
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(htmlUtf8);
            console.log("Pesquisando");
            $('h3.threadtitle a').each(function(i, element){
                var post = new Object();
                post.url =  $(this).attr('href');
                post.titulo = $(this).text();
                post.visitas = parseInt($(this).parents(".threadinfo").siblings(".threadstats").find("li").eq(1).text().split("Visto:")[1].replace(" ","").replace(".", ""));
                if(post.visitas < 100)
                    post.cor = "green";
                else if(post.visitas < 1000)
                    post.cor = "yellow";
                else
                    post.cor = "red";
                if(listaLinks.indexOf(post.url) == -1){
                    listaLinks.push(post.url);
                    listaPost.push(post);
                }
            });
            var n = 0;
            var listaPostFinal = new Array();
            listaPost.forEach(function(post) {
                request(post.url, function (error, response, html) {
                    try{
                       htmlUtf8 = iconv.decode(new Buffer(html), "ISO-8859-1");
                    n += 1;
                    var $ = cheerio.load(htmlUtf8);
                    post.data = $("span.date").eq(0).text();
                    //Verificar todos os links <a>
                    $('.postcontent').eq(0).find('a').each(function(i, element){
                        var link = $(this).attr("href");
                        //Verificar se pertence as bandeiras (pontofrio,extra,casas bahia)
                        bandeiras.forEach(function(bandeira) {                            
                            if(link.indexOf(bandeira) != -1){
                                post.listaLinks = new Array();  
                                post.listaLinks.push(link);
                                post.bandeira = bandeira;
                            }
                        });
                    });
                    //Adicionar item a lista
                    if(post.listaLinks != null){
                        listaPostFinal.push(post);
                    }   
                    if(n == listaPost.length)
                        res.render('index', { posts: listaPostFinal}); 
                    }catch(e){}   
                });
            });
        }
        }catch(e){}
        
    });  
});

module.exports = router;




