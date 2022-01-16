function prestigeChanging2() {
	var prestSelected = document.getElementById('Prestige').selectedIndex;

	if (!(prestSelected <= 2)) {
		var prestAvail = autoTrimpSettings.Prestige.list - (game.global.slowDone ? 1 : 3);
		var tarWorld = getPageSetting('DynamicPrestige2');
		var worldsLeft = game.global.world - tarWorld;

		// Simple linear
		var dagadderIdx = 2;
		var worldsPerStep = tarWorld / ((prestSelected - dagadderIdx) / 2);
		var calcWorld = Math.min(tarWorld, game.global.world);
		autoTrimpSettings.Prestige.selected = autoTrimpSettings.Prestige.list[dagadderIdx + Math.round(calcWorld / worldsPerStep) * 2];
	}
}

		//var numPrestiges = 0;
		//for (ii = 1; ii <= prestSelected; ii++) {
		//	var lastPrestige = game.mapUnlocks[autoTrimpSettings.Prestige.list[ii]].last;
		//	// Upgrade available?
		//	if (lastPrestige + 5 <= tarWorld) {
		//		numPrestiges += Math.floor((tarWorld - lastPrestige) / 5);
		//	}
		//}

		//if (numPrestiges == 0) {
		//	autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value;
		//	return;
		//}

		//if ('Lead' == game.global.challengeActive)
		//	numPrestiges *= 2;
		//if (game.global.sLevel >= 4)
		//	numPrestiges /= 2;

		//var averageMissing = Math.ceil(missingPrest / prestSelected);
		//if (game.global.world > tarWorld - averageMissing) {
		//	if (game.global.mapBonus < prestSelected) {
		//		if (game.global.slowDone)
		//			autoTrimpSettings.Prestige.selected = 'GambesOP';
		//		else
		//			autoTrimpSettings.Prestige.selected = 'Bestplate';
		//	}
		//} else {
		//	autoTrimpSettings.Prestige.selected = 'Dagadder';
		//}
//	}
//}

function RprestigeChanging2() {
	var maxPrestigeIndex = document.getElementById('RPrestige').selectedIndex;
	if (maxPrestigeIndex <= 2)
		return;
	var lastzone = getPageSetting("RDynamicPrestige2");
	var extra = maxPrestigeIndex > 10 ? maxPrestigeIndex - 10 : 0;
	var neededPrestige = 0;
	for (ii = 1; ii <= maxPrestigeIndex; ii++) {
		var lastp = game.mapUnlocks[autoTrimpSettings.RPrestige.list[ii]].last;
		if (lastp <= lastzone - 5) {
			var rem = lastzone - lastp;
			var addto = Math.floor(rem / 5);
			if (game.global.sLevel >= 4)
				addto = Math.ceil(addto / 2);
			neededPrestige += addto;
		}
	}
	var zonesToFarm = 0;
	if (neededPrestige == 0) {
		autoTrimpSettings.RPrestige.selected = document.getElementById('RPrestige').value;
		return;
	}
	zonesToFarm = Math.ceil(neededPrestige / maxPrestigeIndex);
	if (game.global.world > (lastzone - zonesToFarm)) {
		if (game.global.mapBonus < maxPrestigeIndex) {
			if (game.global.slowDone == true)
				autoTrimpSettings.RPrestige.selected = "GambesOP";
			else
				autoTrimpSettings.RPrestige.selected = "Bestplate";
		}
		else if (game.global.mapBonus > maxPrestigeIndex)
			autoTrimpSettings.RPrestige.selected = "Dagadder";
	}
	if (game.global.world <= lastzone - zonesToFarm || game.global.mapBonus == 10)
		autoTrimpSettings.RPrestige.selected = "Dagadder";
}
