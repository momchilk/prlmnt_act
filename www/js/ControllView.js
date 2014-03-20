var ControllView = function(template) {

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
			url: "http://www.parliament.bg/rss.php?feed=plcontrol&lng=bg",
			dataType: 'xml',
			success: function(data, testStatus, jqXHR) {
				//data is a XML DOM object
				var controllsList = data.getElementsByTagName('item');
				
				var controll = [];
				for (var pi = 0; pi < controllsList.length; pi++) {
					controll[pi] = {
						title: controllsList[pi].getElementsByTagName('title')[0].textContent,
						dscr: controllsList[pi].getElementsByTagName('description')[0].textContent.replace("<i>", "").replace("</i>", ""),
						pubDate: controllsList[pi].getElementsByTagName('pubDate')[0].textContent,
						link: controllsList[pi].getElementsByTagName('link')[0].textContent
					};
				}
				
				tplData = {
					controll: controll
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