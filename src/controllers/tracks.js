"use strict";

DAWCore.controllers.tracks = class {
	constructor( fns ) {
		this.data = {};
		this.on = GSUtils.mapCallbacks( [
			"addTrack",
			"removeTrack",
			"toggleTrack",
			"renameTrack",
			"reorderTrack",
		], fns.dataCallbacks );
		this._tracksCrud = GSUtils.createUpdateDelete.bind( null, this.data,
			this._addTrack.bind( this ),
			this._changeTrack.bind( this ),
			this._deleteTrack.bind( this ) );
		Object.freeze( this );
	}
	change( obj ) {
		this._tracksCrud( obj.tracks );
	}
	clear() {
		Object.keys( this.data ).forEach( this._deleteTrack, this );
	}

	// .........................................................................
	_addTrack( id, obj ) {
		this.data[ id ] = { ...obj };
		this.on.addTrack( id );
		this._changeTrack( id, obj );
	}
	_deleteTrack( id ) {
		delete this.data[ id ];
		this.on.removeTrack( id );
	}
	_changeTrack( id, obj ) {
		this._changeTrackProp( id, "toggle", obj.toggle, this.on.toggleTrack );
		this._changeTrackProp( id, "name", obj.name, this.on.renameTrack );
		this._changeTrackProp( id, "order", obj.order, this.on.reorderTrack );
	}
	_changeTrackProp( id, prop, val, fn ) {
		if ( val !== undefined ) {
			this.data[ id ][ prop ] = val;
			fn( id, val );
		}
	}
};

Object.freeze( DAWCore.controllers.drums );
