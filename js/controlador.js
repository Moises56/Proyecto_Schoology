function seleccionarUsuario(codigoUsuario, nombreUsuario){
	//alert("Codigo: " + codigoUsuario + ", Nombre: " + nombreUsuario);
	$("#txt-id-usuario").val(codigoUsuario);
	$("#txt-nombre").val(nombreUsuario);
	$("#titulo-publicaciones").html("Publicaciones de "+nombreUsuario);
	$("#espacio-publicar").css("display","block");
	cargarPublicaciones(codigoUsuario);
}
function agregarAmigo(codigoNuevoAmigo){
	alert("Codigo nuevo amigo: " + codigoNuevoAmigo);
}
$(document).ready(function(){
	cargarUsuarios();
	$("#btn-tengo-hambre").click(function(e){
		e.preventDefault();
		alert("Puede tomar 5 minutos e ir donde don Tito a comprar algo, me trae.");
	});	
	$("#btn-ir-banio").click(function(e){
		e.preventDefault();
		alert("Vaya, solamente deje su telefono en el escritorio.");
	});	
	$("#btn-publicar").click(function(e){
		e.preventDefault();
		parametros = "txt-titulo-publicacion="+$("#txt-titulo-publicacion").val()+"&"+
						"txt-publicacion="+$("#txt-publicacion").val()+"&"+
						"txt-id-usuario="+$("#txt-id-usuario").val();
		codigoUsuario = $("#txt-id-usuario").val();
		//alert(codigoUsuario);
		$.ajax({
			url:"ajax/acciones.php?accion=2",
			data:parametros,
			method:"POST",
			dataType:"json",
			success:function(respuesta){
				$("#respuestaPublicacion").html(respuesta.mensaje);
				if(respuesta.codigo==0){
					$("#respuestaPublicacion").removeClass("alert-success");
					$("#respuestaPublicacion").addClass("alert-danger");
				}else if(respuesta.codigo==1){
					$("#respuestaPublicacion").removeClass("alert-danger");
					$("#respuestaPublicacion").addClass("alert-success");

				}
				cargarPublicaciones(codigoUsuario);				
			}
		});
	});	
	$("#btn-iniciar-sesion").click(function(e){
		e.preventDefault();
		parametros = "txt-correo-inicio="+$("#txt-correo-inicio").val()+"&"+
						"txt-contrasena-inicio="+$("#txt-contrasena-inicio").val();
		$.ajax({
			url:"ajax/acciones.php?accion=3",
			data:parametros,
			method:"POST",
			dataType:"json",
			success:function(respuesta){
				//$("#respuesta").html(respuesta);
				//alert(respuesta);
				$("#respuestaInicioSesion").html(respuesta.mensaje);
				if(respuesta.codigo==0 || respuesta.codigo==1){
					$("#respuestaInicioSesion").removeClass("alert-success");
					$("#respuestaInicioSesion").addClass("alert-danger");
				}else if(respuesta.codigo==2){
					$("#respuestaInicioSesion").removeClass("alert-danger");
					$("#respuestaInicioSesion").addClass("alert-success");
				}
			}
		});
	});

	$("#btn-guardar").click(function(e){
		
		$("#formulario").find('input, select').attr("disabled",true);
		parametros =    "txt-usuario="+$("#txt-usuario").val()+"&"+
						"txt-correo="+$("#txt-correo").val()+"&"+
						"txt-contrasena="+$("#txt-contrasena").val()+"&"+
						"slc-url-imagen="+$("#slc-url-imagen").val();
		$.ajax({
			url:"ajax/acciones.php?accion=4",
			data:parametros,
			method:"POST",
			dataType:"json",
			success:function(respuesta){				
				//$("#respuestaRegistro").html(respuesta);
				$("#formulario").find('input, select').attr("disabled",false);
				$("#respuestaRegistro").html(respuesta.mensaje);
				if(respuesta.codigo==0){
					$("#respuestaInicioSesion").removeClass("alert-success");
					$("#respuestaRegistro").addClass("alert-danger");
				}else if(respuesta.codigo==1){
					$("#respuestaInicioSesion").removeClass("alert-danger");
					$("#respuestaRegistro").addClass("alert-success");
				}
				cargarUsuarios();
			}
		});
	});	
	
});

function cargarPublicaciones(codigoUsuario){
	$("#div-publicaciones").html("<img src='img/loading.gif'>");
	parametro = "codigoUsuario="+codigoUsuario;
	$.ajax({
		url:"ajax/acciones.php?accion=1",
		data:parametro,
		method:"POST",
		success:function(respuesta){
			$("#div-publicaciones").html(respuesta);
		},
		error:function(){
			alert("Oh no, algo ha sucedido!!!");
		}
	});
}
function cargarUsuarios(){
	$("#div-uasuarios").html("<img src='img/loading.gif'>");
	parametro = "",
	$.ajax({
		url:"ajax/acciones.php?accion=5",
		data:parametro,
		method:"POST",
		success:function(respuesta){
			$("#div-uasuarios").html(respuesta);
		}
	});
}

