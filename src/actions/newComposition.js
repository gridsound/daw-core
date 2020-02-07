"use strict";

DAWCore.prototype.newComposition = function( opt ) {
	const cmp = DAWCore.json.composition( this.env, DAWCore.utils.uuid() );

	return this.addComposition( cmp, opt )
		.then( cmp => this.composition.load( cmp ) )
		.then( cmp => this._compositionOpened( cmp ) );
};
