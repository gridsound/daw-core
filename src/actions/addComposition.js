"use strict";

DAWCore.prototype.addComposition = function( cmp, options ) {
	const opt = Object.freeze( Object.assign( {
			localSaving: true,
		}, options ) );

	this.compositions.set( cmp.id, cmp );
	this.compositionsOptions.set( cmp.id, opt );
	this._call( "compositionAdded", cmp, opt );
	return Promise.resolve( cmp );
};
