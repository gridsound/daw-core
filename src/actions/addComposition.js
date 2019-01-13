"use strict";

DAWCore.prototype.addComposition = function( cmp, opt = {} ) {
	cmp.options = Object.freeze( Object.assign( {
			saveMode: "local",
		}, opt ) );
	this.cmps[ cmp.options.saveMode ].set( cmp.id, cmp );
	this._call( "compositionAdded", cmp );
	return Promise.resolve( cmp );
};
