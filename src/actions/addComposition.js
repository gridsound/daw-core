"use strict";

DAWCore.prototype.addComposition = function( cmp, opt = {} ) {
	const cpy = DAWCore.objectDeepCopy( cmp );

	cpy.options = Object.freeze( Object.assign( {
			saveMode: "local",
		}, opt ) );
	this.cmps[ cpy.options.saveMode ].set( cpy.id, cpy );
	this._call( "compositionAdded", cpy );
	this._call( "compositionSavedStatus", cpy, true );
	return Promise.resolve( cpy );
};
