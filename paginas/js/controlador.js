$(document).ready(function(){
	console.log("El DOM ha sido cargado, debe cargar todos los tweets e imprimirlos tal y como lo muestrael html estatico");
	$("#contenido").html("");
	$.ajax({
		url:"./peticion-tweets.php",
		dataType:"json",
		success:function(respuesta){
			for (var i=0;i<respuesta.length;i++){
				$("#tweets").append(
				`<div class="row component text-left">
                  <div class="col-lg-2">  
                    <img src = "${respuesta[i].usuario.urlImagen}" class="img-fluid rounded-circle img-thumbnail">
                  </div>
                  <div class="col-lg-10">
                    <b>${respuesta[i].usuario.nombre}</b>${"  "}${respuesta[i].usuario.usuario}
                    <div class="tweet-content">
						${respuesta[i].tweet}
                        <div>
                            <small class="blue-text">${respuesta[i].hashtags}</small>
                            <small class="blue-text">${respuesta[i].hashtags}</small>
                        </div>
                    </div>
                  </div>
              	</div>`
				);
			  }	
			},
			error:function(error){
				console.log(error);
			}
		});
		$.ajax({
			url:"./peticion-trends.php",
			dataType:"json",
			success:function(respuesta){
				for (var i=0;i<respuesta.length;i++){
					$("#trends").append(
						`<div><span class="blue-text">${respuesta[i].trending}</span> <small>${respuesta[i].tweets}tweets</small></div>`
					);
				  }	
				},
				error:function(error){
					console.log(error);
				}
			});
});

$("#slc-usuario").change(function(){
	//Esta funcion se ejecuta cada vez que el usuario selecciona o cambia un elemento de la lista.
	$("#contenido").html("");
	$.ajax({
		url:"./peticion.php",
		dataType:"json",
		success:function(respuesta){
			for (var i=0;i<respuesta.length;i++){
				if($("#slc-usuario").val()==respuesta[i].nombre){
					$("#contenido").append(
						`<div class="component-header">
							<img src = "${respuesta[i].urlImagen}" class="img-fluid rounded-circle img-thumbnail">
						  </div>
						  <hr>
						  <h2 class="blue-text">${respuesta[i].nombre}${" "}${respuesta[i].apellido}</h2>
						  <small>${respuesta[i].usuario}</small>
						  <hr>
						  <div class="row">
							<div class="col-lg-4">
							  Tweets<br>
							  <span class="blue-text">${respuesta[i].tweets}</span>
							</div>
							<div class="col-lg-4">
							  Following<br>
							  <span class="blue-text">${respuesta[i].following}</span>
							</div>
							<div class="col-lg-4">
							  Followers<br>
							  <span class="blue-text">${respuesta[i].followers}</span>
							</div>
						  </div>`
					);
				}
			  }	
			},
			error:function(error){
				console.log(error);
			}
		});
});

$("#btn").click(function(){
	$.ajax({
		url:"./peticion.php",
		dataType:"json",
		success:function(respuesta){
			for (var i=0;i<respuesta.length;i++){
				if($("#slc-usuario").val()==respuesta[i].nombre){
					var parametros = 
					"usuario="+respuesta[i].usuario+"&"+
					"nombre="+respuesta[i].nombre+"&"+
					"urlImagen="+respuesta[i].urlImagen+"&"+
					"tweet="+$("#txt-tweet").val()+"&"+"Hashtags="+$("#txt-Hashtags").val();
					console.log("se enviara al servidor",parametros);
					$.ajax({
						url:"./Procesar-tweets.php",
						method:"POST",
						data:parametros,
						dataType:"json",
						success:function(respuesta){
							console.log("holaaaaa");
    				        if (respuesta.codigo==1){
    				            console.log(respuesta.mensaje);
    				        }
    				    },
    				    error:function(error){
    				        console.log(error);
    				    }
					});
				}
			  }	
			},
			error:function(error){
				console.log(error);
			}
		});

		
});