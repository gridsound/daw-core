"use strict";

DAWCore.prototype.openComposition = function( saveMode, id ) {
	const cmp = this.get.composition( saveMode, id );

	if ( cmp ) {
		if ( this.composition.loaded ) {
			this.closeComposition();
		}
		return ( this.get.composition( saveMode, id ) // 1.
			? Promise.resolve( cmp )
			: this.addNewComposition( { saveMode } ) )
				.then( cmp => this.composition.load( cmp ) )
				.then( cmp => this._compositionOpened( cmp ) );
	}
};

DAWCore.prototype._compositionOpened = function( cmp ) {
	this.compositionFocus();
	this._call( "compositionOpened", cmp );
	this._startLoop();
	return cmp;
};

/*
1. Why don't we use `cmp` instead of recalling .get.composition() ?
   Because the `cmp` could have been delete in .closeComposition()
   if the composition was a new untitled composition.
*/
