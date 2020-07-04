"use strict";

DAWCore.controllers.effects = class {
	constructor( fns ) {
		this.data = {};
		this.on = GSUtils.mapCallbacks( [
			"changeBPM",
			"addEffect",
			"removeEffect",
			"changeEffect",
			"connectEffectTo",
			"changeEffectData",
		], fns.dataCallbacks );
		this.values = Object.seal( {
			destFilter: null,
			resetting: false,
		} );
		this._effectsCrud = GSUtils.createUpdateDelete.bind( null, this.data,
			this._addEffect.bind( this ),
			this._updateEffect.bind( this ),
			this._deleteEffect.bind( this ) );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( id => this._deleteEffect( id ) );
	}
	reset() {
		const ent = Object.entries( this.data );

		this.values.resetting = true;
		ent.forEach( kv => this._deleteEffect( kv[ 0 ] ) );
		this.values.resetting = false;
		ent.forEach( kv => this._addEffect( kv[ 0 ], kv[ 1 ] ) );
	}
	change( obj ) {
		if ( obj.bpm ) {
			this.on.changeBPM( obj.bpm );
		}
		if ( obj.effects ) {
			this._effectsCrud( obj.effects );
		}
	}
	setDestFilter( dest ) {
		const old = this.values.destFilter;

		if ( dest !== old ) {
			this.values.destFilter = dest;
			Object.entries( this.data ).forEach( ( [ id, fx ] ) => {
				if ( fx.dest === old ) {
					this.__deleteEffect( id );
				} else if ( fx.dest === dest ) {
					this.__effectAdd( id, fx );
				}
			} );
		}
	}

	// .........................................................................
	_addEffect( id, obj, diffObj ) {
		const fx = Object.seal( GSUtils.jsonCopy( obj ) );

		this.data[ id ] = fx;
		if ( this._fxDestOk( fx ) ) {
			this.__effectAdd( id, fx, diffObj );
		}
	}
	__effectAdd( id, fx, diffObj ) {
		this.on.addEffect( id, fx );
		this.on.changeEffect( id, "toggle", fx.toggle );
		this.on.changeEffect( id, "order", fx.order );
		this.on.changeEffectData( id, fx.data );
		if ( !GSUtils.isNoop( this.on.connectEffectTo ) ) {
			const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

			this.on.connectEffectTo( fx.dest, id, nextId );
			this.on.connectEffectTo( fx.dest, prevId, id );
		}
	}
	_deleteEffect( id, diffObj ) {
		const fx = this.data[ id ];

		if ( this._fxDestOk( fx ) ) {
			this.__deleteEffect( id, diffObj );
		}
		delete this.data[ id ];
	}
	__deleteEffect( id, diffObj ) {
		if ( !this.values.resetting && !GSUtils.isNoop( this.on.connectEffectTo ) ) {
			const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

			this.on.connectEffectTo( this.data[ id ].dest, prevId, nextId );
		}
		this.on.removeEffect( id );
	}
	_updateEffect( id, fx, diffObj ) {
		const dataObj = this.data[ id ],
			destOk = this._fxDestOk( dataObj );

		if ( "toggle" in fx ) {
			dataObj.toggle = fx.toggle;
			if ( destOk ) {
				this.on.changeEffect( id, "toggle", fx.toggle );
			}
		}
		if ( "data" in fx ) {
			GSUtils.diffAssign( dataObj.data, fx.data );
			if ( destOk ) {
				this.on.changeEffectData( id, fx.data );
			}
		}
		if ( "order" in fx ) {
			if ( destOk && !GSUtils.isNoop( this.on.connectEffectTo ) ) {
				const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

				this.on.connectEffectTo( dataObj.dest, prevId, nextId );
			}
			dataObj.order = fx.order;
			if ( destOk ) {
				this.on.changeEffect( id, "order", fx.order );
				if ( !GSUtils.isNoop( this.on.connectEffectTo ) ) {
					const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

					this.on.connectEffectTo( dataObj.dest, prevId, id );
					this.on.connectEffectTo( dataObj.dest, id, nextId );
				}
			}
		}
	}

	// .........................................................................
	_fxDestOk( fx ) {
		return !this.values.destFilter || fx.dest === this.values.destFilter;
	}
	_findSiblingFxIds( id, diffObj = {} ) {
		const { dest, order } = this.data[ id ];
		let prevId = null,
			nextId = null,
			prevOrder = -Infinity,
			nextOrder = Infinity;

		Object.entries( this.data ).forEach( ( [ fxId, fx ] ) => {
			if ( fxId !== id && fx.dest === dest ) {
				const fxOrder = ( diffObj[ fxId ] || fx ).order;

				if ( prevOrder < fxOrder && fxOrder < order ) {
					prevId = fxId;
					prevOrder = fxOrder;
				}
				if ( order < fxOrder && fxOrder < nextOrder ) {
					nextId = fxId;
					nextOrder = fxOrder;
				}
			}
		} );
		return [ prevId, nextId ];
	}
};

Object.freeze( DAWCore.controllers.effects );
