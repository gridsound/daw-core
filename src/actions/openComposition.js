"use strict";

DAWCore.prototype.openComposition = function( saveMode, id ) {
	const cmp = this.get.composition( saveMode, id );

	if ( cmp ) {
		if ( this.composition.loaded ) {
			this.closeComposition();
		}
		return ( this.get.composition( saveMode, id )
		? Promise.resolve( cmp )
		: this.addNewComposition( { saveMode } ) )
			.then( cmp => this.composition.load( cmp ) )
			.then( cmp => this._compositionOpened( cmp ) );
	}
};

DAWCore.prototype._compositionOpened = function( cmp ) {
	this._call( "focusOn", "composition", true );
	this._call( "compositionOpened", cmp );
	this._startLoop();
	return cmp;
};
