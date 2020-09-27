"use strict";

DAWCore.controllers.blocks = class {
	constructor( fns ) {
		this.data = {};
		this.on = GSUtils.mapCallbacks( [
			"addBlock",
			"removeBlock",
			"changeBlockProp",
			"updateBlockViewBox",
		], fns.dataCallbacks );
		this._blocksCrud = GSUtils.createUpdateDelete.bind( null, this.data,
			this._addBlock.bind( this ),
			this._updateBlock.bind( this ),
			this._deleteBlock.bind( this ) );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( this._deleteBlock, this );
	}
	change( obj ) {
		this._blocksCrud( obj.blocks );
	}

	// .........................................................................
	_addBlock( id, obj ) {
		const blc = { ...obj };

		this.data[ id ] = blc;
		this.on.addBlock( id, blc );
		this._updateBlock( id, blc );
	}
	_deleteBlock( id ) {
		delete this.data[ id ];
		this.on.removeBlock( id );
	}
	_updateBlock( id, obj ) {
		const dataBlc = this.data[ id ],
			cb = this.on.changeBlockProp.bind( null, id );

		this._setProp( dataBlc, cb, "when", obj.when );
		this._setProp( dataBlc, cb, "duration", obj.duration );
		this._setProp( dataBlc, cb, "offset", obj.offset );
		this._setProp( dataBlc, cb, "track", obj.track );
		this._setProp( dataBlc, cb, "selected", obj.selected );
		if ( "offset" in obj || "duration" in obj ) {
			this.on.updateBlockViewBox( id, dataBlc );
		}
	}
	_setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.blocks );
