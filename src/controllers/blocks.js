"use strict";

DAWCore.controllers.blocks = class {
	on = null;
	data = {};
	#blocksCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data,
		this.#addBlock.bind( this ),
		this.#updateBlock.bind( this ),
		this.#deleteBlock.bind( this ) );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"addBlock",
			"removeBlock",
			"changeBlockProp",
			"updateBlockViewBox",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( this.#deleteBlock, this );
	}
	change( obj ) {
		this.#blocksCrud( obj.blocks );
	}

	// .........................................................................
	#addBlock( id, obj ) {
		const blc = { ...obj };

		this.data[ id ] = blc;
		this.on.addBlock( id, blc );
		this.#updateBlock( id, blc );
	}
	#deleteBlock( id ) {
		delete this.data[ id ];
		this.on.removeBlock( id );
	}
	#updateBlock( id, obj ) {
		const dataBlc = this.data[ id ];
		const cb = this.on.changeBlockProp.bind( null, id );

		this.#setProp( dataBlc, cb, "when", obj.when );
		this.#setProp( dataBlc, cb, "duration", obj.duration );
		this.#setProp( dataBlc, cb, "offset", obj.offset );
		this.#setProp( dataBlc, cb, "track", obj.track );
		this.#setProp( dataBlc, cb, "selected", obj.selected );
		if ( "offset" in obj || "duration" in obj ) {
			this.on.updateBlockViewBox( id, dataBlc );
		}
	}
	#setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.blocks );
