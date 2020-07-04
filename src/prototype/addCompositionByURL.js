"use strict";

DAWCore.prototype.addCompositionByURL = function( url, opt ) {
	return fetch( url )
		.then( res => {
			if ( !res.ok ) {
				throw `The file is not accessible: ${ url }`;
			}
			return res.json();
		} )
		.then(
			cmp => this.addComposition( cmp, opt ),
			e => { throw e; }
		);
};
