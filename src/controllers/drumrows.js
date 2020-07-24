"use strict";

DAWCore.controllers.drumrows = class {
	constructor( fns ) {
		this.data = Object.freeze( {
			patterns: {},
			drumrows: {},
		} );
		this.on = GSUtils.mapCallbacks( [
			"addDrumrow",
			"removeDrumrow",
			"changeDrumrow",
		], fns.dataCallbacks );
		this._drumrowsCrud = GSUtils.createUpdateDelete.bind( null, this.data.drumrows,
			this._addDrumrow.bind( this ),
			this._updateDrumrow.bind( this ),
			this._deleteDrumrow.bind( this ) );
		this._patternsCrud = GSUtils.createUpdateDelete.bind( null, this.data.patterns,
			this._addPattern.bind( this ),
			this._updatePattern.bind( this ),
			this._deletePattern.bind( this ) );
		Object.freeze( this );
	}
	change( { patterns, drumrows } ) {
		if ( patterns ) { this._patternsCrud( patterns ); }
		if ( drumrows ) { this._drumrowsCrud( drumrows ); }
	}
	clear() {
		Object.keys( this.data.patterns ).forEach( id => delete this.data.patterns[ id ] );
		Object.keys( this.data.drumrows ).forEach( this._deleteDrumrow, this );
	}

	// .........................................................................
	_addPattern( id, { type, name, dest, buffer, duration } ) {
		if ( type === "buffer" ) {
			const pat = Object.seal( { name, dest, buffer, duration } );

			this.data.patterns[ id ] = pat;
			this._updatePattern( id, pat );
		}
	}
	_updatePattern( id, { name, duration, dest } ) {
		if ( name !== undefined || duration !== undefined || dest !== undefined ) {
			const pat = this.data.patterns[ id ],
				rowsEnt = Object.entries( this.data.drumrows )
					.filter( kv => kv[ 1 ].pattern === id );

			this.__updatePattern( pat, rowsEnt, "name", name );
			this.__updatePattern( pat, rowsEnt, "dest", dest );
			this.__updatePattern( pat, rowsEnt, "duration", duration );
		}
	}
	__updatePattern( pat, rowsEnt, prop, val ) {
		if ( val !== undefined ) {
			pat[ prop ] = val;
			rowsEnt.forEach( kv => this.on.changeDrumrow( kv[ 0 ], prop, val ) );
		}
	}
	_deletePattern( id ) {
		delete this.data.patterns[ id ];
	}

	// .........................................................................
	_addDrumrow( id, obj ) {
		const row = Object.seal( { ...obj } );

		this.data.drumrows[ id ] = row;
		this.on.addDrumrow( id, row );
		this.__updateDrumrow( id, row );
	}
	_deleteDrumrow( id ) {
		delete this.data.drumrows[ id ];
		this.on.removeDrumrow( id );
	}
	_updateDrumrow( id, obj ) {
		const row = this.data.drumrows[ id ];

		Object.assign( row, obj );
		this.__updateDrumrow( id, obj );
	}
	__updateDrumrow( id, obj ) {
		const pat = this.data.patterns[ obj.pattern ];

		this.___updateDrumrow( id, "order", obj.order );
		this.___updateDrumrow( id, "toggle", obj.toggle );
		this.___updateDrumrow( id, "detune", obj.detune );
		this.___updateDrumrow( id, "pan", obj.pan );
		this.___updateDrumrow( id, "gain", obj.gain );
		this.___updateDrumrow( id, "pattern", obj.pattern );
		this.___updateDrumrow( id, "name", obj.pattern && pat.name );
		this.___updateDrumrow( id, "duration", obj.pattern && pat.duration );
	}
	___updateDrumrow( id, prop, val ) {
		if ( val !== undefined ) {
			this.on.changeDrumrow( id, prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.drumrows );
