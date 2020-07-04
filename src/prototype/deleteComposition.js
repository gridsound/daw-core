"use strict";

DAWCore.prototype.deleteComposition = function( saveMode, id ) {
	if ( this.composition.cmp && id === this.get.id() ) {
		this.closeComposition();
	}
	this._deleteComposition( this.cmps[ saveMode ].get( id ) );
};

DAWCore.prototype._deleteComposition = function( cmp ) {
	if ( cmp ) {
		const saveMode = cmp.options.saveMode;

		this.cmps[ saveMode ].delete( cmp.id );
		if ( saveMode === "local" ) {
			DAWCore.LocalStorage.delete( cmp.id );
		}
		this._call( "compositionDeleted", cmp );
	}
};
