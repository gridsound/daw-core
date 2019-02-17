"use strict";

DAWCore.json.mixer = () => {
	const mixer = {
		"main": DAWCore.json.channel( "main" ),
		"1": DAWCore.json.channel( "chan#1" ),
		"2": DAWCore.json.channel( "chan#2" ),
		"3": DAWCore.json.channel( "chan#3" ),
		"4": DAWCore.json.channel( "chan#4" ),
	};

	delete mixer.main.dest;
	return mixer;
};
