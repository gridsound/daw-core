"use strict";

class DAWCoreAddComposition {
	static LS( daw ) {
		return Promise.all( DAWCoreLocalStorage.getAll().map( cmp => DAWCoreAddComposition.JSObject( daw, cmp ) ) );
	}
	static URL( daw, url, opt ) {
		return fetch( url )
			.then( res => {
				if ( !res.ok ) {
					throw `The file is not accessible: ${ url }`;
				}
				return res.json();
			} )
			.then(
				cmp => DAWCoreAddComposition.JSObject( daw, cmp, opt ),
				e => { throw e; }
			);
	}
	static blob( daw, blob, opt ) {
		return new Promise( ( res, rej ) => {
			const rd = new FileReader();

			rd.onload = () => {
				DAWCoreAddComposition.#JSON( daw, rd.result, opt ).then( res, rej );
			};
			rd.readAsText( blob );
		} );
	}
	static JSObject( daw, cmp, opt ) {
		const cpy = DAWCore.utils.jsonCopy( cmp );

		cpy.options = Object.freeze( {
			saveMode: "local",
			...opt,
		} );
		daw.cmps[ cpy.options.saveMode ].set( cpy.id, cpy );
		daw.callCallback( "compositionAdded", cpy );
		daw.callCallback( "compositionSavedStatus", cpy, true );
		return Promise.resolve( cpy );
	}
	static new( daw, opt ) {
		const cmp = DAWCore.json.composition( daw.env, DAWCore.utils.uuid() );

		return DAWCoreAddComposition.JSObject( daw, cmp, opt );
	}

	// .........................................................................
	static #JSON( daw, json, opt ) {
		return new Promise( ( res, rej ) => {
			try {
				const cmp = JSON.parse( json );

				DAWCoreAddComposition.JSObject( cmp, opt ).then( res, rej );
			} catch ( e ) {
				rej( e );
			}
		} );
	}
}
