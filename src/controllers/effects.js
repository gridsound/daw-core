"use strict";

DAWCore.controllers.effects = class {
	on = null;
	data = {};
	#effectsCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data,
		this.#addEffect.bind( this ),
		this.#updateEffect.bind( this ),
		this.#deleteEffect.bind( this ) );
	values = Object.seal( {
		destFilter: null,
		resetting: false,
	} );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"changeBPM",
			"addEffect",
			"removeEffect",
			"changeEffect",
			"connectEffectTo",
			"changeEffectData",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( id => this.#deleteEffect( id ) );
	}
	reset() {
		const ent = Object.entries( this.data );

		this.values.resetting = true;
		ent.forEach( kv => this.#deleteEffect( kv[ 0 ] ) );
		this.values.resetting = false;
		ent.forEach( kv => this.#addEffect( kv[ 0 ], kv[ 1 ] ) );
	}
	change( obj ) {
		if ( obj.bpm ) {
			this.on.changeBPM( obj.bpm );
		}
		if ( obj.effects ) {
			this.#effectsCrud( obj.effects );
		}
	}
	setDestFilter( dest ) {
		const old = this.values.destFilter;

		if ( dest !== old ) {
			this.values.destFilter = dest;
			Object.entries( this.data ).forEach( ( [ id, fx ] ) => {
				if ( fx.dest === old ) {
					this.#deleteEffect2( id );
				} else if ( fx.dest === dest ) {
					this.#addEffect2( id, fx );
				}
			} );
		}
	}

	// .........................................................................
	#addEffect( id, obj, diffObj ) {
		const fx = Object.seal( DAWCore.utils.jsonCopy( obj ) );

		this.data[ id ] = fx;
		if ( this.#fxDestOk( fx ) ) {
			this.#addEffect2( id, fx, diffObj );
		}
	}
	#addEffect2( id, fx, diffObj ) {
		this.on.addEffect( id, fx );
		this.on.changeEffect( id, "toggle", fx.toggle );
		this.on.changeEffect( id, "order", fx.order );
		this.on.changeEffectData( id, fx.data );
		if ( !DAWCore.utils.isNoop( this.on.connectEffectTo ) ) {
			const [ prevId, nextId ] = this.#findSiblingFxIds( id, diffObj );

			this.on.connectEffectTo( fx.dest, id, nextId );
			this.on.connectEffectTo( fx.dest, prevId, id );
		}
	}
	#deleteEffect( id, diffObj ) {
		const fx = this.data[ id ];

		if ( this.#fxDestOk( fx ) ) {
			this.#deleteEffect2( id, diffObj );
		}
		delete this.data[ id ];
	}
	#deleteEffect2( id, diffObj ) {
		if ( !this.values.resetting && !DAWCore.utils.isNoop( this.on.connectEffectTo ) ) {
			const [ prevId, nextId ] = this.#findSiblingFxIds( id, diffObj );

			this.on.connectEffectTo( this.data[ id ].dest, prevId, nextId );
		}
		this.on.removeEffect( id );
	}
	#updateEffect( id, fx, diffObj ) {
		const dataObj = this.data[ id ];
		const destOk = this.#fxDestOk( dataObj );

		if ( "toggle" in fx ) {
			dataObj.toggle = fx.toggle;
			if ( destOk ) {
				this.on.changeEffect( id, "toggle", fx.toggle );
			}
		}
		if ( "data" in fx ) {
			DAWCore.utils.diffAssign( dataObj.data, fx.data );
			if ( destOk ) {
				this.on.changeEffectData( id, fx.data );
			}
		}
		if ( "order" in fx ) {
			if ( destOk && !DAWCore.utils.isNoop( this.on.connectEffectTo ) ) {
				const [ prevId, nextId ] = this.#findSiblingFxIds( id, diffObj );

				this.on.connectEffectTo( dataObj.dest, prevId, nextId );
			}
			dataObj.order = fx.order;
			if ( destOk ) {
				this.on.changeEffect( id, "order", fx.order );
				if ( !DAWCore.utils.isNoop( this.on.connectEffectTo ) ) {
					const [ prevId, nextId ] = this.#findSiblingFxIds( id, diffObj );

					this.on.connectEffectTo( dataObj.dest, prevId, id );
					this.on.connectEffectTo( dataObj.dest, id, nextId );
				}
			}
		}
	}

	// .........................................................................
	#fxDestOk( fx ) {
		return !this.values.destFilter || fx.dest === this.values.destFilter;
	}
	#findSiblingFxIds( id, diffObj = {} ) {
		const { dest, order } = this.data[ id ];
		let prevId = null;
		let nextId = null;
		let prevOrder = -Infinity;
		let nextOrder = Infinity;

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
