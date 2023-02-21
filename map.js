/** @param {NS} ns */
/*

	TheAncientOne
	https://steamcommunity.com/id/theancient1/

	Usage: > run map.js
	
		> run map.js ?
			[or]
		> run map.js help

	To write results to a text file named: map-results.txt
		> run map.js txt

*/
export async function main(ns) {
	let _ver = 1.0;
	if (ns.args[0] == "help" || ns.args[0] == "?") {
		ns.tprintf("\n	Usage:\n" +
		"		> run map.js\n\n" +
		"	To write results to a text file named: map-results.txt\n" +
		"		> run map.js txt\n\n" +
		"	Create an alias like the below example for ease of use.\n" +
		"		> alias map=\"run map.js\"" +
		"	Then run using:\n" +
		"		> map");
		return;
	}
	let _infoline = "\n\n﴾ Info ﴿\n﴾ Organization Name ﴿─﴾ IP Address ﴿\n﴾ Hostname ﴿─﴾ H = Required Hacking Level | P = Required Open Ports ﴿\n﴾ SL = Current security level | BD = Y or N if backdoor is installed ﴿\n﴾ [***] indicates Faction server requiring a backdoor installed ﴿\n﴾ R = Ram | Max = Max money server can Have | Avail = Available money on server ﴿\n\n";
	let _mapinfo = _infoline;
	let _idx = 0;
	let _scanned = [];
	let _ps = ns.getPurchasedServers();
	let _exestotal = 0;
	let _curHost = "home";
	let _ppipe;
	let _spipe;
	const _exes = [
		{"prog": "BruteSSH.exe", "enabled": false},
		{"prog": "FTPCrack.exe", "enabled": false},
		{"prog": "relaySMTP.exe", "enabled": false},
		{"prog": "HTTPWorm.exe", "enabled": false},
		{"prog": "SQLInject.exe", "enabled": false}
	];

	for (let i = 0; i < _exes.length; i++) {
		if (ns.fileExists(_exes[i]["prog"], "home")) {
			_exes[i]["enabled"] = true;
			_exestotal++;
		}
	}

	function _facts(_host) {
		let _exists = false;
		let _factfiles = ["democracy-is-dead.lit"];
		for (let i = 0; i < _factfiles.length; i++) {
			if (ns.fileExists(_factfiles[i], _host) || _host == "run4theh111z" || _host == "fulcrumassets") {
				_exists = true;
			}
		}
		return _exists;
	}

	function _map(_curHost, _pipes, indent) {
		if (_scanned.includes(_curHost)) return;
		_scanned.push(_curHost);
		let _hosts = ns.scan(_curHost);
		_hosts = _hosts.filter(function (item) { return _scanned.indexOf(item) === -1; });
		_hosts = _hosts.sort(function(a, b) { ns.getServer(a).requiredHackingSkill - ns.getServer(b).requiredHackingSkill;});
		let _hostdata;
		//_hosts = _hosts.sort(function(a, b) { return a < b ? 1 : -1;});
		for (let i = 0; i < _hosts.length; i++) {
			let _nextHost = _hosts[i];
			if (_scanned.includes(_nextHost) || _ps.includes(_nextHost)) continue;
			_hostdata = ns.getServer(_nextHost);
			_spipe = "║   ";
			if (_idx == 0) {
				_ppipe = "╔";
			} else if (i != _hosts.length - 1) {
				_ppipe = "╠";
			} else {
				_ppipe = "╠";
				_spipe = "    ";
			}
			let _backdoor = _hostdata.backdoorInstalled ? " BD: Y" : " BD: N";
			let _faction = _facts(_nextHost) ? " [***]" : "";
			let _hackable = "";
			if (ns.getHackingLevel() >= _hostdata.requiredHackingSkill && !_hostdata.hasAdminRights && _exestotal >= _hostdata.numOpenPortsRequired) {
				_hackable = "──﴾ Hackable ﴿ ";
			}
			let _r00ted = "H: " + _hostdata.requiredHackingSkill + " P: " + _hostdata.numOpenPortsRequired + " SL: " + _hostdata.hackDifficulty.toFixed(2);
			if (_hostdata.hasAdminRights) {
				_r00ted = "Rooted" + " SL: " + _hostdata.hackDifficulty.toFixed(2) + _backdoor;
			}
			if (_idx == 0) {
				_idx++;
				_mapinfo = _mapinfo + _pipes + "  [ " + _hostdata.organizationName + " ] " + _hostdata.ip + " " + _faction + "\n";
			} else {
				_mapinfo = _mapinfo + _pipes + "║\n";
				_mapinfo = _mapinfo + _pipes + "║ [ " + _hostdata.organizationName + " ] " + _hostdata.ip + _faction + "\n";
			}
			_mapinfo = _mapinfo + _pipes + _ppipe + "﴾ " + _nextHost + " ﴿─﴾ " + _r00ted + " ﴿ " + _hackable + "\n";
			_mapinfo = _mapinfo + _pipes + "╚═══﴾ R: " + _hostdata.maxRam + " Money: Max: " + new Intl.NumberFormat().format(_hostdata.moneyMax) + " Avail: " + new Intl.NumberFormat().format(Math.round(_hostdata.moneyAvailable)) + " ﴿\n";
			_map(_nextHost, _pipes + _spipe, indent + 1);
		}
	}

	function _butter(_opt) {
		let _my = [
			"map-results.txt created...",
			"map-results.txt updated...",
			"Map data generated..."
		]
		ns.toast(_my[_opt], "success", 3000);
		return;
	}

	_map(_curHost, "", 0);
	
	if (ns.args[0] == "txt") {
		let _opt = 0;
		if (ns.fileExists("map-results.txt", ns.getHostname())) {
			_opt = 1;
			ns.rm("map-results.txt", ns.getHostname());
		}
		ns.write("map-results.txt", _mapinfo.replace(_infoline, ""), "w");
		_butter(_opt);
	} else {
		ns.tprintf(_mapinfo);
		_butter(2);
	}
}