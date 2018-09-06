var ls;
(function (ls) {
	ls.newScene = function() {
		return {
			"yes": function() { return yes },
			"bounceInOut": function() { return bounceInOut },
			"%22FirstScene%22": function() { return "FirstScene" },
			"childTime": function() { return childTime }
		}
	};
	ls.ThirdScene = function() {
		return {
			"%22create%22": function() { return "create" },
			"setBg": function() { return setBg },
			"%22equalTo%22": function() { return "equalTo" },
			"0%2BMath.random()*1": function() { return 0+Math.random()*1 },
			"%22greaterOrEqual%22": function() { return "greaterOrEqual" },
			"%22TextScene%22": function() { return "TextScene" },
			"%22greaterThan%22": function() { return "greaterThan" },
			"60%2BMath.random()*630": function() { return 60+Math.random()*630 },
			"System.create": function() { return System.create },
			"120%2BMath.random()*560": function() { return 120+Math.random()*560 },
			"%22ThirdScene%22": function() { return "ThirdScene" },
			"%22SecondScene%22": function() { return "SecondScene" },
			"setTimh": function() { return setTimh },
			"60%2BMath.random()*450": function() { return 60+Math.random()*450 },
			"thiBtn": function() { return thiBtn },
			"120%2BMath.random()*360": function() { return 120+Math.random()*360 },
			"%22newScene%22": function() { return "newScene" },
			"%22n%22": function() { return "n" }
		}
	};
	ls.TextScene = function() {
		return {
			"%22FirstScene%22": function() { return "FirstScene" }
		}
	};
	ls.FirstScene = function() {
		return {
			"%22create%22": function() { return "create" },
			"setDisa": function() { return setDisa },
			"%22equalTo%22": function() { return "equalTo" },
			"%22greaterOrEqual%22": function() { return "greaterOrEqual" },
			"setDisab": function() { return setDisab },
			"System.create": function() { return System.create },
			"setdis": function() { return setdis },
			"120%2BMath.random()*560": function() { return 120+Math.random()*560 },
			"setDis": function() { return setDis },
			"setDisabl": function() { return setDisabl },
			"%22SecondScene%22": function() { return "SecondScene" },
			"%22j%22": function() { return "j" },
			"%22TextScene%22": function() { return "TextScene" },
			"120%2BMath.random()*360": function() { return 120+Math.random()*360 },
			"%22n%22": function() { return "n" },
			"setTime": function() { return setTime }
		}
	};
	ls.SecondScene = function() {
		return {
			"%22create%22": function() { return "create" },
			"%22FirstScene%22": function() { return "FirstScene" },
			"%22equalTo%22": function() { return "equalTo" },
			"%22greaterOrEqual%22": function() { return "greaterOrEqual" },
			"%22TextScene%22": function() { return "TextScene" },
			"setDisas": function() { return setDisas },
			"disableS": function() { return disableS },
			"120%2BMath.random()*460": function() { return 120+Math.random()*460 },
			"60%2BMath.random()*630": function() { return 60+Math.random()*630 },
			"setDisabls": function() { return setDisabls },
			"120%2BMath.random()*560": function() { return 120+Math.random()*560 },
			"setDisass": function() { return setDisass },
			"setTimes": function() { return setTimes },
			"System.create": function() { return System.create },
			"setdi": function() { return setdi },
			"%22ThirdScene%22": function() { return "ThirdScene" },
			"60%2BMath.random()*450": function() { return 60+Math.random()*450 },
			"setDisabs": function() { return setDisabs },
			"120%2BMath.random()*360": function() { return 120+Math.random()*360 },
			"%22newScene%22": function() { return "newScene" }
		}
	};
	ls.one = function() {
		return {
			"%22n%22": function() { return "n" },
			"%22equalTo%22": function() { return "equalTo" },
			"%22FirstScene%22": function() { return "FirstScene" }
		}
	};
})(ls || (ls = {}));