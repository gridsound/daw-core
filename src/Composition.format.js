"use strict";

DAWCore.Composition.format = function( cmp ) {
	const blcsValues = Object.values( cmp.blocks );
	let orderDefault = 0;

	// loopA/B
	// ..........................................
	if ( Number.isFinite( cmp.loopA ) && Number.isFinite( cmp.loopB ) ) {
		cmp.loopA = Math.max( 0, cmp.loopA );
		cmp.loopB = Math.max( 0, cmp.loopB );
		if ( cmp.loopA === cmp.loopB ) {
			cmp.loopA =
			cmp.loopB = null;
		}
	} else {
		cmp.loopA =
		cmp.loopB = null;
	}

	// ***Opened
	// ..........................................
	cmp.synthOpened = cmp.synthOpened ? `${ cmp.synthOpened }` : null;
	cmp.patternKeysOpened = cmp.patternKeysOpened ? `${ cmp.patternKeysOpened }` : null;
	cmp.patternBufferOpened = cmp.patternBufferOpened ? `${ cmp.patternBufferOpened }` : null;
	delete cmp.patternOpened;

	// buffers
	// ..........................................
	cmp.buffers = cmp.buffers || {};

	// channels
	// ..........................................
	if ( !cmp.channels ) {
		cmp.channels = DAWCore.json.channels();
		Object.values( cmp.synths ).forEach( syn => syn.dest = "main" );
	}
	delete cmp.channels.main.order;

	// effects
	// ..........................................
	cmp.effects = cmp.effects || {};

	// patterns
	// ..........................................
	Object.values( cmp.patterns ).forEach( pat => {
		if ( !( "order" in pat ) ) {
			pat.order = orderDefault;
		}
		orderDefault = Math.max( pat.order, orderDefault ) + 1;
		if ( pat.type === "keys" ) {
			pat.synth = pat.synth || "0";
		}
	} );

	// synths
	// ..........................................
	if ( !cmp.synths ) {
		cmp.synths = { 0: DAWCore.json.synth( "synth" ) };
	}
	Object.values( cmp.synths ).forEach( syn => {
		delete syn.envelopes;
		syn.lfo = syn.lfo || DAWCore.json.lfo();
	} );

	// ..........................................
	Object.values( cmp.tracks ).reduce( ( order, tr ) => {
		tr.name = typeof tr.name === "string" ? tr.name : "";
		tr.order = typeof tr.order === "number" ? tr.order : order;
		tr.toggle = typeof tr.toggle === "boolean" ? tr.toggle : true;
		return tr.order + 1;
	}, 0 );
	blcsValues.sort( ( a, b ) => a.when - b.when );
	cmp.blocks = blcsValues.reduce( ( obj, blc, i ) => {
		blc.offset = blc.offset || 0;
		blc.selected = !!blc.selected;
		blc.durationEdited = !!blc.durationEdited;
		obj[ i ] = blc;
		return obj;
	}, {} );
	Object.values( cmp.keys ).forEach( keys => {
		Object.values( keys ).forEach( k => {
			k.pan = DAWCore.castToNumber( k.pan, 0, -1, 1, 2 );
			k.gain = DAWCore.castToNumber( k.gain, .8, 0, 1, 2 );
			k.attack = DAWCore.castToNumber( k.attack, 0, 0, Infinity, 3 );
			k.release = DAWCore.castToNumber( k.release, 0, 0, Infinity, 3 );
			k.lowpass = DAWCore.castToNumber( k.lowpass, 1, 0, 1, 2 );
			k.highpass = DAWCore.castToNumber( k.highpass, 1, 0, 1, 2 );
			k.selected = !!k.selected;
			if ( typeof k.prev === "number" ) { k.prev += ""; }
			if ( typeof k.next === "number" ) { k.next += ""; }
			k.prev = k.prev || null;
			k.next = k.next || null;
			delete k.durationEdited;
			if ( typeof k.key === "string" ) {
				if ( window.gsuiKeys ) {
					k.key = window.gsuiKeys.keyStrToMidi( k.key );
				} else {
					console.warn( "DAWCore.Composition.format: gsuiKeys is needed to convert an old midi notation" );
					return false;
				}
			}
		} );
	} );
	return true;
};
