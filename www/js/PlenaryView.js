var PlenaryView = function(template) {

    this.initialize = function() {
        this.el = $('<div/>');
        //this.el.on('click', '.add-location-btn', this.addLocation);
    };

    this.render = function(tplData) {
        this.el.html(template(tplData));
        return this;
    };

	this.getData = function(callback) {
		$.ajax({
			type: 'GET',
			url: "http://www.parliament.bg/rss.php?feed=plenary&lng=bg",
			dataType: 'xml',
			success: function(data, testStatus, jqXHR) {
				//data is a XML DOM object
				var plenariesList = data.getElementsByTagName('item');
				
				var plenary = [];
				for (var pi = 0; pi < plenariesList.length; pi++) {
					var dscrNode = plenariesList[pi].getElementsByTagName('description')[0];
					var dscr = [];
					for (var i = 0; i < dscrNode.childNodes.length; i++) {
						dscr[i] = dscrNode.childNodes[i].textContent.replace("<br />", "");
					}
					
					plenary[pi] = {
						title: plenariesList[pi].getElementsByTagName('title')[0].textContent,
						dscr: dscr,
						pubDate: plenariesList[pi].getElementsByTagName('pubDate')[0].textContent,
						link: plenariesList[pi].getElementsByTagName('link')[0].textContent
					};
				}
				
				tplData = {
					plenary: plenary
				};
				
				if (callback) {
					callback(tplData);
				}
			},
			error: function() {
			}
		});
	};

    this.initialize();

};