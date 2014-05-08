var rssDataPath = "parliament.bg_activities";
var plenaryDataFile = "plenary.rss.xml";
var controllDataFile = 'controll.rss.xml';
var committeeDataFile = 'committee.xml.rss';
var newsDataFile = 'news.xml.rss';
var dataFiles = [plenaryDataFile, controllDataFile, committeeDataFile, newsDataFile];
var adapters = [];

var dataFileAgeToDownload = 86400; //one day in seconds

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if (v1 === v2) {
		return options.fn(this);
	}
	return options.inverse(this);
});

function getRssUrlByFileName(fileName) {
	var url = '';
	if (fileName == plenaryDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_plenary/";
	} else if (fileName == controllDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_control/";
	} else if (fileName == committeeDataFile) {
		url = "http://www.parliament.bg/export/bg/xml/app_comsitting/";
	} else if (fileName == newsDataFile) {
		url = "http://www.http://parliament.bg/export/bg/xml/app_news/";
	}
	return url;
}

function getAdapter(dataFileName) {
	var adapterIndex = 0;
	for (var i = 0; i < dataFiles.length; i++) {
		if (dataFiles[i] == dataFileName) {
			adapterIndex = i;
			break;
		}
	}
	return adapters[adapterIndex];
}

// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homeTpl = Handlebars.compile($("#home-tpl").html());
    var plenaryTpl = Handlebars.compile($("#plenary-tpl").html());
    var plenaryDetailTpl = Handlebars.compile($("#plenary-tpl-detail-preview").html());
    var controllTpl = Handlebars.compile($("#controll-tpl").html());
    var controllDetailTpl = Handlebars.compile($("#controll-tpl-detail-preview").html());
    var committeeTpl = Handlebars.compile($("#committee-tpl").html());
    var committeeDetailTpl = Handlebars.compile($("#committee-tpl-detail-preview").html());
    var newsTpl = Handlebars.compile($("#news-tpl").html());

    var homeUrl = "#home";
    var plenaryUrl = "#plenary";
    var plenaryDetailUrl = '#plenaryDetail';
    var controllUrl = "#controll";
    var controllDetailUrl = "#controllDetail";
    var committeeUrl = "#committee";
    var committeeDetailUrl = "#committeeDetail";
    var newsUrl = "#news";

    var slider = new PageSlider($('body'));

    for (var i = 0; i < dataFiles.length; i++) {
    	adapters[i] = new FileStorage(dataFiles[i]);
    	adapters[i].initialize();
    }
    route();
    /*adapter.initialize().done(function () {
        route();
    });*/

    /* --------------------------------- Event Registration -------------------------------- */
    $(window).on('hashchange', route);

    document.addEventListener('deviceready', function () {

        FastClick.attach(document.body);

        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
        
        //Check for downloaded RSS files and if they are missing or too old download them
        for (var i = 0; i < adapters.length; i++) {
        	adapters[i].checkDataFile();
        	//console.log(adapters[i].dataFile);
    	}
        
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */
	function route() {
		var hash = window.location.hash;
		if (!hash) {
			slider.slidePage(new HomeView(homeTpl).render().el);
			return;
		}

		var match = hash.match(plenaryUrl);
		if (match) {
			var match = hash.match(plenaryDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					var plenary = new PlenaryView(plenaryDetailTpl);
					plenary.getData(function(tplData) {
						var detailData = {};
						if (tplData.plenary.length == 0) {
							detailData = getPlenaryTestingData(id);
						} else {
							detailData = tplData.plenary[id];
						}
						slider.slidePage(plenary.render(detailData).el);
					});
					return;
				}
			}
			var plenary = new PlenaryView(plenaryTpl);
			plenary.getData(function(tplData) {
				slider.slidePage(plenary.render(tplData).el);
				plenary.assignHandlers();
			});
			return;
		}

		var match = hash.match(controllUrl);
		if (match) {
			var match = hash.match(controllDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					var controll = new ControllView(controllDetailTpl);
					controll.getData(function(tplData) {
						var detailData = {};
						if (tplData.controll.length == 0) {
							detailData = getControllTestingData(id);
						} else {
							detailData = tplData.controll[id];
						}
						slider.slidePage(controll.render(detailData).el);
					});
					return;
				}
			}
			var controll = new ControllView(controllTpl);
			controll.getData(function(tplData) {
				slider.slidePage(controll.render(tplData).el);
				controll.assignHandlers();
			});
			return;
		}

		var match = hash.match(committeeUrl);
		if (match) {
			var match = hash.match(committeeDetailUrl);
			if (match) {
				var parts = hash.split('?');
				if (parts[1]) {
					var id = parts[1].replace('id=', '');
					var committee = new CommitteeView(committeeDetailTpl);
					committee.getData(function(tplData) {
						var detailData = {};
						if (tplData.committee.length == 0) {
							detailData = getCommitteeTestingData(id);
						} else {
							detailData = tplData.committee[id];
						}
						slider.slidePage(committee.render(detailData).el);
					});
					return;
				}
			}
			var committee = new CommitteeView(committeeTpl);
			committee.getData(function(tplData) {
				slider.slidePage(committee.render(tplData).el);
				committee.assignHandlers();
			});
			return;
		}

		var match = hash.match(newsUrl);
		if (match) {
			var news = new NewsView(newsTpl);
			news.getData(function(tplData) {
				slider.slidePage(news.render(tplData).el);
				
			});
			return;
		}

	}

}());