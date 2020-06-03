"use strict";

DAWCore.controllers.mixer = class {
	constructor( fns ) {
		this.data = Object.freeze( { channels: {} } );
		this.on = GSUtils.mapCallbacks( [
			"addChannel",
			"removeChannel",
			"toggleChannel",
			"renameChannel",
			"reorderChannel",
			"redirectChannel",
			"changePanChannel",
			"changeGainChannel",
		], fns.dataCallbacks );
		this._chansCrud = GSUtils.createUpdateDelete.bind( null, this.data.channels,
			this._addChannel.bind( this ),
			this._updateChannel.bind( this ),
			this._deleteChannel.bind( this ) );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data.channels ).forEach( id => {
			if ( id !== "main" ) {
				this._deleteChannel( id );
			}
		} );
	}
	recall() {
		const ent = Object.entries( this.data.channels );

		ent.forEach( kv => this._deleteChannel( kv[ 0 ] ) );
		ent.forEach( kv => this._addChannel( kv[ 0 ], kv[ 1 ] ) );
	}
	change( { channels } ) {
		this._chansCrud( channels );
	}

	// .........................................................................
	_addChannel( id, obj ) {
		this.data.channels[ id ] = {};
		this.on.addChannel( id, obj );
		this._updateChannel( id, obj );
	}
	_deleteChannel( id ) {
		delete this.data.channels[ id ];
		this.on.removeChannel( id );
	}
	_updateChannel( id, obj ) {
		Object.assign( this.data.channels[ id ], obj );
		this.__updateChannel( id, obj.name, this.on.renameChannel );
		this.__updateChannel( id, obj.order, this.on.reorderChannel );
		this.__updateChannel( id, obj.toggle, this.on.toggleChannel );
		this.__updateChannel( id, obj.dest, this.on.redirectChannel );
		this.__updateChannel( id, obj.pan, this.on.changePanChannel );
		this.__updateChannel( id, obj.gain, this.on.changeGainChannel );
	}
	__updateChannel( id, val, fn ) {
		if ( val !== undefined ) {
			fn( id, val );
		}
	}
};

Object.freeze( DAWCore.controllers.mixer );
