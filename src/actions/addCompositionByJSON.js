"use strict";

DAWCore.prototype.addCompositionByJSON = function( json, opt ) {
	return new Promise( ( res, rej ) => {
		try {
			const cmp = JSON.parse( json );

			this.addComposition( cmp, opt ).then( res, rej );
		} catch ( e ) {
			rej( e );
		}
	} );
};
