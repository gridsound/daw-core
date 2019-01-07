"use strict";

DAWCore.prototype.deleteComposition = function( id ) {
	if ( id === this.get.id() ) {
		this.closeComposition();
	}
	this._deleteComposition( id );
};

DAWCore.prototype._deleteComposition = function( id ) {
	const cmp = this.compositions.get( id );

	if ( cmp ) {
		this.compositions.delete( id );
		this.compositionsOptions.delete( id );
		DAWCore.LocalStorage.delete( id );
		this._call( "compositionDeleted", cmp );
	}
};
