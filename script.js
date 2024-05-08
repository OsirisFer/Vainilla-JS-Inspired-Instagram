/* eslint-disable no-unused-vars */
////////////////////////////////////////////////////////////////

var __post_list    = [];
var __current_user = "";

////////////////////////////////////////////////////////////////

Storage.prototype.setObject = function ( key, value )
{
	this.setItem( key, JSON.stringify( value ) );
};

////////////////////////////////////////////////////////////////

Storage.prototype.getObject = function ( key )
{
	const value = this.getItem( key );
	return value && JSON.parse( value );
};

////////////////////////////////////////////////////////////////

function Cargar_Usuarios ()
{
	fetch( "https://jsonplaceholder.typicode.com/users" )
		.then( response => response.json() )
		.then(
			data =>
			{
				let lista_usuario = document.getElementById( "lista_usuario" );

				const current_user = data[ 0 ].name;
				Cambiar_Usuario( current_user );

				for( let usuario of data )
				{
					const img_usuario         = document.createElement( "img" );
					const label_usuario_user  = document.createElement( "label" );
					const label_usuario_email = document.createElement( "label" );

					img_usuario         .src       = "./img/perfil.png";
					img_usuario         .className = "imagen";
					label_usuario_user  .className = "nombre";
					label_usuario_email .className = "email";

					label_usuario_user.innerText  = usuario.name;
					label_usuario_email.innerText = usuario.email;

					const div = document.createElement( "div" );
					div.className = "usuario";
					div.appendChild( img_usuario );

					const div_nombre_email = document.createElement( "div" );
					div_nombre_email.className = "nombre_email";
					div_nombre_email.appendChild( label_usuario_user );
					div_nombre_email.appendChild( label_usuario_email );

					div.appendChild( div_nombre_email );
					div.addEventListener( "click", () => Cambiar_Usuario( usuario.name ) );
					lista_usuario.appendChild( div );
				}

			}
		);
}

////////////////////////////////////////////////////////////////

function Cambiar_Usuario ( username )
{
	__current_user = username;
	localStorage.setItem( "current_user", username );

	const elem_current_user = document.getElementById( "current_user" );

	elem_current_user.innerHTML = username;
}

////////////////////////////////////////////////////////////////

function Cargar_Imagen ()
{
	const input  = document.getElementById( "input_imagen" );
	const file   = input.files[ 0 ];
	const reader = new FileReader();

	reader.onloadend = () =>
	{
		const image_base64 = reader.result.replace( "data:", "" ).replace( /^.+,/, "" );

		localStorage.setItem( "new_post_image", image_base64 );

		const img = document.getElementById( "new_post_image" );
		img.src = `data:image/png;base64,${image_base64}`;

	};

	reader.readAsDataURL( file );
}

////////////////////////////////////////////////////////////////

function Vaciar_Post ()
{
	const form = document.getElementById( "form" );
	form.reset();

	const img = document.getElementById( "new_post_image" );
	img.src = "./img/placeholder.jpg";
}

////////////////////////////////////////////////////////////////

function Crear_Post ()
{
	const descripcion  = document.getElementById( "input_descripcion" ).value;
	const image_base64 = localStorage.getItem( "new_post_image" ?? "./img/placeholder.jpg" );
	const usuario      = localStorage.getItem( "current_user" ?? "" );

	const post =
	{
		"usuario"     : usuario,
		"descripcion" : descripcion,
		"imagen"      : image_base64,
		"likes"       : [],
		"comentarios" : []
	};

	// localStorage.setObject( "post", JSON.stringify( post ) );

	// const elem_descripcion = document.getElementById( "post_0_descripcion" );
	// const elem_usuario     = document.getElementById( "post_0_usuario" );
	// const elem_imagen      = document.getElementById( "post_0_imagen" );
	// const elem_likes       = document.getElementById( "post_0_likes" );

	// elem_descripcion.innerHTML = descripcion;
	// elem_usuario.innerHTML     = usuario;
	// elem_imagen.src            = `data:image/png;base64,${image_base64}`;
	// elem_likes.innerHTML       = 0;

	Vaciar_Post();

	const n = __post_list.length;
	__post_list.push( post );
	localStorage.setObject( "post_list", __post_list );
	Agregar_Post( post, n );
}

////////////////////////////////////////////////////////////////

function Mostrar_Likes ( n )
{
	const post    = __post_list[ n ];
	const post_id = "post_" + n;
	const counter = document.getElementById( post_id + "_likes" );
	const list    = document.getElementById( post_id + "_list"  );
	counter .innerText = post.likes.length;
	list    .innerText = Array.from( post.likes ).join( ", " );
}

////////////////////////////////////////////////////////////////

function On_Like ( usuario, n )
{
	const post = __post_list[ n ];

	if( usuario != post.usuario )
	{
		const i = post.likes.indexOf( usuario );

		if( i !== -1 )
			post.likes = post.likes.filter( x => x != usuario );
		else
			post.likes.push( usuario );
	}

	localStorage.setObject( "post_list", __post_list );

	Mostrar_Likes( n );
}

////////////////////////////////////////////////////////////////

function Mostrar_Comentarios ( n )
{
	const post = __post_list[ n ];

	for( const comentario of post.comentarios )
		Agregar_Comentario( comentario, n );
}

////////////////////////////////////////////////////////////////

function On_Comment ( usuario, n, mensaje )
{
	const post       = __post_list[ n ];
	const comentario = { usuario, mensaje  };

	post.comentarios.push( comentario  );

	localStorage.setObject( "post_list", __post_list );

	Agregar_Comentario( comentario, n );
}

////////////////////////////////////////////////////////////////

function Agregar_Comentario ( comentario, n )
{
	const usuario = document.createElement( "p" );
	usuario.className = "usuario";
	usuario.innerText = comentario.usuario;

	const mensaje = document.createElement( "p" );
	mensaje.className = "mensaje";
	mensaje.innerText = comentario.mensaje;

	const div_comentario     = document.createElement( "div" );
	div_comentario.className = "comentario";
	div_comentario.appendChild( usuario );
	div_comentario.appendChild( mensaje );

	const post_id    = "post_" + n;
	const contenedor = document.getElementById( post_id + "_contenedor" );
	contenedor.appendChild( div_comentario );
}

////////////////////////////////////////////////////////////////

function Agregar_Post ( post, n )
{
	const post_id = "post_" + n;

	const div_post     = document.createElement( "div" );
	div_post.className = "post";
	div_post.id        = post_id;

	const div_user     = document.createElement( "div" );
	div_user.className = "user";

	const user_img     = document.createElement( "img" );
	user_img.id        = post_id + "_avatar";
	user_img.className = "avatar";
	user_img.src       = "./img/perfil.png";
	// user_img.alt       = "Imagen";

	const user_name     = document.createElement( "p" );
	user_name.id        = post_id + "_usuario";
	user_name.className = "username";
	user_name.innerText = post.usuario;

	const post_img     = document.createElement( "img" );
	post_img.id        = post_id + "_imagen";
	post_img.className = "imagen";
	post_img.src       = `data:image/png;base64,${post.imagen}`;
	post_img.alt       = "Imagen";


	div_user.appendChild( user_img );
	div_user.appendChild( user_name );

	const likes_corazon     = document.createElement( "img" );
	likes_corazon.src       = "./img/corazon.png";
	likes_corazon.className = "corazon";
	likes_corazon.addEventListener( "click", () => On_Like( __current_user, n ) );

	const likes_count     = document.createElement( "p" );
	likes_count.id        = post_id + "_likes";
	likes_count.className = "count";
	likes_count.innerText = "0";

	const likes     = document.createElement( "div" );
	likes.className = "likes";
	likes.appendChild( likes_corazon );
	likes.appendChild( likes_count );

	const likes_list     = document.createElement( "p" );
	likes_list.id        = post_id + "_list";
	likes_list.className = "list";

	const descripcion     = document.createElement( "p" );
	descripcion.id        = post_id + "_descripcion";
	descripcion.className = "descripcion";
	descripcion.innerText = post.descripcion;

	const contenido     = document.createElement( "div" );
	contenido.className = "contenido";
	contenido.appendChild( likes );
	contenido.appendChild( likes_list );
	contenido.appendChild( descripcion );


	// 	<div class="comentarios_contenedor">
	// 		<form class="formulario2" action="index.html" target="_self" method="GET" autocomplete="" novalidate="">
	// 			<input class="comentariosintro" type="text" name="" placeholder="Add a comment">
	// 			<input class="enviarcomment" type="submit" name="">
	// 		</form>
	// 	</div>
	// </div>


	// const input     = document.createElement( "input" );
	const input     = document.createElement( "textarea" );
	input.className = "input";
	input.id        = post_id + "_input";
	// input.setAttribute( "type", "text" );
	input.setAttribute( "rows", "3" );

	const submit     = document.createElement( "input" );
	submit.value     = "Comentar";
	submit.className = "submit";
	submit.setAttribute( "type", "button" );
	submit.addEventListener(
		"click",
		() =>
		{
			const mensaje = document.getElementById( post_id + "_input" ).value;
			On_Comment( __current_user, n, mensaje );
		}
	);

	const comentar = document.createElement( "div" );
	comentar.className = "comentar";
	comentar.appendChild( input );
	comentar.appendChild( submit );


	const contenedor = document.createElement( "div" );
	contenedor.className = "contenedor";
	contenedor.id        = post_id + "_contenedor";

	div_post.appendChild( div_user );
	div_post.appendChild( post_img );
	div_post.appendChild( contenido );
	div_post.appendChild( comentar );
	div_post.appendChild( contenedor );

	const post_list = document.getElementById( "post_list" );
	post_list.appendChild( div_post );

	Mostrar_Likes( n );
	Mostrar_Comentarios( n );
}

////////////////////////////////////////////////////////////////

function Cargar_Posts ()
{
	__post_list = localStorage.getObject( "post_list" ) ?? [];

	// const elem_post_list = document.getElementById( "post_list" );

	for( let n = 0; n < __post_list.length; n += 1 )
		Agregar_Post( __post_list[ n ], n );
}

////////////////////////////////////////////////////////////////

// let file = document.querySelector('input[type=file]')['files'][0];
// let reader = new FileReader();
// reader.onload = function () {
// base64String = reader.result.replace("data:", "")
// .replace(/^.+,/, "");
// reader.readAsDataURL(file);

// function submitearForm(){
// bannerImg = document.getElementById('bannerImg');
// imgData = getBase64Image(bannerImg);
// localStorage.setItem("imgData", imgData);

// }

// function cagarPost(){
// 	let postearcosas = document.getElementById('post_list');
// 	let imgagenusu = document.createElement('img');
// 	imgagenusu.id('profilepic');
// 	imgagenusu.src="logo.png";
// 	postearcosas.appendChild(imgagenusu);

// }

////////////////////////////////////////////////////////////////

// const parrafo = document.querySelector("#checkeado");
// 	parrafo.addEventListener('click', function (evt) {

// 		document.querySelector("#usu").innerHTML = user.name;
// 	} )

// $(document).ready(function() {
//        $('.usuariossugeridos').click(function() {
//            document.querySelector("#usu").innerHTML = ${user.name};
//        });
//    });

////////////////////////////////////////////////////////////////