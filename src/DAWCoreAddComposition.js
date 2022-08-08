"use strict";

class DAWCoreAddComposition {
	static $LS( daw ) {
		return Promise.all( DAWCoreLocalStorage.$getAll().map( cmp => DAWCoreAddComposition.$JSObject( daw, cmp ) ) );
	}
	static $URL( daw, url, opt ) {
		return fetch( url )
			.then( res => {
				if ( !res.ok ) {
					throw `The file is not accessible: ${ url }`;
				}
				return res.json();
			} )
			.then(
				cmp => DAWCoreAddComposition.$JSObject( daw, cmp, opt ),
				e => { throw e; }
			);
	}
	static $blob( daw, blob, opt ) {
		return DAWCoreUtils.$getFileContent( blob, "text" )
			.then( txt => DAWCoreAddComposition.#JSON( daw, txt, opt ) );
	}
	static $JSObject( daw, cmp, opt ) {
		const cpy = DAWCoreUtils.$jsonCopy( cmp );

		cpy.options = Object.freeze( {
			saveMode: "local",
			...opt,
		} );
		daw.$getCmps( cpy.options.saveMode ).set( cpy.id, cpy );
		daw.$callCallback( "compositionAdded", cpy );
		daw.$callCallback( "compositionSavedStatus", cpy, true );
		return Promise.resolve( cpy );
	}
	static $new( daw, opt ) {
		const cmp = DAWCoreJSON.composition( daw.$env, DAWCoreUtils.$uuid() );

		return DAWCoreAddComposition.$JSObject( daw, cmp, opt );
	}

	// .........................................................................
	static #JSON( daw, json, opt ) {
		return new Promise( ( res, rej ) => {
			try {
				const cmp = JSON.parse( json );

				DAWCoreAddComposition.$JSObject( daw, cmp, opt ).then( res, rej );
			} catch ( e ) {
				rej( e );
			}
		} );
	}
}
