function useScryerStance() {
	var scry = 4;
	if (game.global.uberNature == "Wind" && getEmpowerment() != "Wind") {
		scry = 5;
	}

	var AutoStance = getPageSetting('AutoStance');
	function autostancefunction() {
		if ((getPageSetting('AutoStance') == 3) || (getPageSetting('use3daily') == true && game.global.challengeActive == "Daily")) windStance();
		else if (AutoStance == 1) autoStance();
		else if (AutoStance == 2) autoStance2();

	}

	if (!getPageSetting('UseScryerStance') || game.global.preMapsActive || game.global.gridArray.length === 0 || game.global.highestLevelCleared < 180 || game.global.world <= 60) {
		autostancefunction();
		return;
	}

	//Never
	var never_scry = (game.global.mapsActive && getPageSetting('ScryerUseinMaps2') == 0 && getCurrentMapObject().location != "Void" && getCurrentMapObject().location != "Bionic" && getCurrentMapObject().level <= game.global.world);
	never_scry = never_scry || (game.global.mapsActive && getPageSetting('ScryerUseinPMaps') == 0 && getCurrentMapObject().level > game.global.world && getCurrentMapObject().location != "Void" && getCurrentMapObject().location != "Bionic");
	never_scry = never_scry || (game.global.mapsActive && getCurrentMapObject().location == "Void" && getPageSetting('ScryerUseinVoidMaps2') == 0);
	never_scry = never_scry || (game.global.mapsActive && getCurrentMapObject().location == "Bionic" && getPageSetting('ScryerUseinBW') == 0);
	never_scry = never_scry || (!game.global.mapsActive && (isActiveSpireAT() || disActiveSpireAT()) && getPageSetting('ScryerUseinSpire2') == 0);
	never_scry = never_scry || (!game.global.mapsActive && getPageSetting('ScryerSkipBoss2') == 1 && game.global.world < getPageSetting('VoidMaps') && game.global.lastClearedCell == 98) || (getPageSetting('ScryerSkipBoss2') == 0 && game.global.lastClearedCell == 98);
	never_scry = never_scry || (!game.global.mapsActive && (getEmpowerment() == "Poison" && (getPageSetting('ScryUseinPoison') == 0 || (getPageSetting('ScryUseinPoison') > 0 && game.global.world >= getPageSetting('ScryUseinPoison')))) || (getEmpowerment() == "Wind" && (getPageSetting('ScryUseinWind') == 0 || (getPageSetting('ScryUseinWind') > 0 && game.global.world >= getPageSetting('ScryUseinWind')))) || (getEmpowerment() == "Ice" && (getPageSetting('ScryUseinIce') == 0 || (getPageSetting('ScryUseinIce') > 0 && game.global.world >= getPageSetting('ScryUseinIce')))));
	never_scry = never_scry || (!game.global.mapsActive && getPageSetting('screwessence') == true && countRemainingEssenceDrops() < 1);
	never_scry = never_scry || (getCurrentEnemy(1)
		&& (
			(getCurrentEnemy(1).mutation == "Corruption" && getPageSetting('ScryerSkipCorrupteds2') == 0)
			|| (getCurrentEnemy(1).mutation == "Healthy" && getPageSetting('ScryerSkipHealthy') == 0)
		)
	);

	//Force
	var force_scryer = force_scryer || (game.global.mapsActive && getPageSetting('ScryerUseinMaps2') == 1);
	force_scryer = force_scryer || (game.global.mapsActive && getCurrentMapObject().location == "Void" && ((getPageSetting('ScryerUseinVoidMaps2') == 1) || (getPageSetting('scryvoidmaps') == true && game.global.challengeActive != "Daily") || (getPageSetting('dscryvoidmaps') == true && game.global.challengeActive == "Daily")));
	force_scryer = force_scryer || (game.global.mapsActive && getCurrentMapObject().location == "Bionic" && getPageSetting('ScryerUseinBW') == 1);
	force_scryer = force_scryer || (game.global.mapsActive && getCurrentMapObject().level > game.global.world && getPageSetting('ScryerUseinPMaps') == 1 && getCurrentMapObject().location != "Bionic");
	force_scryer = force_scryer || (!game.global.mapsActive && (isActiveSpireAT() || disActiveSpireAT()) && getPageSetting('ScryerUseinSpire2') == 1);
	force_scryer = force_scryer || (!game.global.mapsActive && ((getEmpowerment() == "Poison" && getPageSetting('ScryUseinPoison') > 0 && game.global.world < getPageSetting('ScryUseinPoison')) || (getEmpowerment() == "Wind" && getPageSetting('ScryUseinWind') > 0 && game.global.world < getPageSetting('ScryUseinWind')) || (getEmpowerment() == "Ice" && getPageSetting('ScryUseinIce') > 0 && game.global.world < getPageSetting('ScryUseinIce'))));
	force_scryer = force_scryer || (getCurrentEnemy(1)
		&& (
			(getCurrentEnemy(1).mutation == "Corruption" && getPageSetting('ScryerSkipCorrupteds2') == 0)
			|| (getCurrentEnemy(1).mutation == "Healthy" && getPageSetting('ScryerSkipHealthy') == 0)
		)
	);

	//Calc Damage
	if (AutoStance == 1)
		calcBaseDamageinX();
	else if (AutoStance >= 2)
		calcBaseDamageinX2();

	//Suicide to Scry
	var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
	var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
	// Why init to true?
	var oktoswitch = true;
	var die = (getPageSetting('ScryerDieZ') != -1 && getPageSetting('ScryerDieZ') <= game.global.world);
	var willSuicide = getPageSetting('ScryerDieZ');
	if (die && willSuicide >= 0) {
		var [dieZ, dieC] = willSuicide.toString().split(".");
		if (dieC && dieC.length == 1) dieC = dieC + "0";
		die = game.global.world >= dieZ && (!dieC || (game.global.lastClearedCell + 1 >= dieC));
	}
	if (game.global.formation == 0 || game.global.formation == 1)
		oktoswitch = die || newSquadRdy || (missingHealth < (baseHealth / 2));

	//Overkill
	var useoverkill = getPageSetting('ScryerUseWhenOverkill');
	var overkill = false;
	if (useoverkill && game.portal.Overkill.level == 0)
		setPageSetting('ScryerUseWhenOverkill', false);
	if (useoverkill && !game.global.mapsActive && (isActiveSpireAT() || disActiveSpireAT()) && getPageSetting('ScryerUseinSpire2') == 0)
		useoverkill = false;
	if (useoverkill && game.portal.Overkill.level > 0 && getPageSetting('UseScryerStance') == true) {
		var overkillerCount = 1;
		overkillerCount += Fluffy.isRewardActive("overkiller");
		if (game.talents.overkill.purchased) overkillerCount++;
		if (getEmpowerment() == "Ice") {
			if (game.empowerments.Ice.getLevel() >= 50) overkillerCount++;
			if (game.empowerments.Ice.getLevel() >= 100) overkillerCount++;
		}
		if (getUberEmpowerment() == "Ice") overkillerCount += 2;

		var minDamage = calcOurDmg("min", false, true);
		var Sstance = 0.5;
		var ovkldmg = minDamage * Sstance * Math.pow((game.portal.Overkill.level * 0.005), overkillerCount);

		if (getCurrentEnemy(1).maxHealth < ovkldmg) {
			overkill = true;
		}
	}

	//Default
	var min_zone = getPageSetting('ScryerMinZone');
	var max_zone = getPageSetting('ScryerMaxZone');
	var valid_min = game.global.world >= min_zone && game.global.world > 60;
	var valid_max = max_zone <= 0 || game.global.world < max_zone;
	var valid_zone = false;
	if (valid_min && valid_max && !(getPageSetting('onlyminmaxworld') == true && game.global.mapsActive)) {
		valid_zone = true;
	}

	if (overkill) {
		setFormation(4);
		return;
	} else if (never_scry) {
		autostancefunction();
		return;
	} else if (force_scryer) {
		setFormation(scry);
		return;
	} else if (valid_zone) {
		setFormation(scry);
		return;
	} else {
		autostancefunction();
		return;
	}
}
