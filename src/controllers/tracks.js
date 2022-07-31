"use strict";

DAWCoreControllers.tracks = class {
	on = null;
	data = {};
	#tracksCrud = DAWCoreUtils.$createUpdateDelete.bind( null, this.data,
		this.#addTrack.bind( this ),
		this.#changeTrack.bind( this ),
		this.#deleteTrack.bind( this ) );

	constructor( fns ) {
		this.on = DAWCoreUtils.$mapCallbacks( [
			"addTrack",
			"removeTrack",
			"toggleTrack",
			"renameTrack",
			"reorderTrack",
		], fns.dataCallbacks );
		Object.freeze( this );
	}
	change( obj ) {
		this.#tracksCrud( obj.tracks );
	}
	clear() {
		Object.keys( this.data ).forEach( this.#deleteTrack, this );
	}

	// .........................................................................
	#addTrack( id, obj ) {
		this.data[ id ] = { ...obj };
		this.on.addTrack( id );
		this.#changeTrack( id, obj );
	}
	#deleteTrack( id ) {
		delete this.data[ id ];
		this.on.removeTrack( id );
	}
	#changeTrack( id, obj ) {
		this.#changeTrackProp( id, "toggle", obj.toggle, this.on.toggleTrack );
		this.#changeTrackProp( id, "name", obj.name, this.on.renameTrack );
		this.#changeTrackProp( id, "order", obj.order, this.on.reorderTrack );
	}
	#changeTrackProp( id, prop, val, fn ) {
		if ( val !== undefined ) {
			this.data[ id ][ prop ] = val;
			fn( id, val );
		}
	}
};

Object.freeze( DAWCoreControllers.drums );
