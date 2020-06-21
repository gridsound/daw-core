"use strict";

DAWCore.controllers.drums = class {
	constructor( fns ) {
		this.data = {};
		this.on = GSUtils.mapCallbacks( [
			"addDrum",
			"removeDrum",
			"updateDrum",
			"addDrumcut",
			"removeDrumcut",
		], fns.dataCallbacks );
		this._drumsCrud = GSUtils.createUpdateDelete.bind( null, this.data,
			this._addDrum.bind( this ),
			this._updateDrum.bind( this ),
			this._deleteDrum.bind( this ) );
		Object.freeze( this );
	}
	change( obj ) {
		this._drumsCrud( obj );
	}
	clear() {
		Object.keys( this.data ).forEach( this._deleteDrum, this );
	}

	// .........................................................................
	_addDrum( id, obj ) {
		const drum = { ...obj },
			fn = "gain" in drum
				? this.on.addDrum
				: this.on.addDrumcut;

		this.data[ id ] = drum;
		fn( id, drum );
	}
	_updateDrum( id, obj ) {
		Object.assign( this.data[ id ], obj );
		this.on.updateDrum( id, obj );
	}
	_deleteDrum( id ) {
		const fn = "gain" in this.data[ id ]
				? this.on.removeDrum
				: this.on.removeDrumcut;

		delete this.data[ id ];
		fn( id );
	}
};

Object.freeze( DAWCore.controllers.drums );
