var NewsView = function(template) {

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
			url: "http://www.parliament.bg/rss.php?feed=news&lng=bg",
			dataType: 'xml',
			success: function(data, testStatus, jqXHR) {
				//data is a XML DOM object
				var newsList = data.getElementsByTagName('item');
				
				var news = [];
				for (var pi = 0; pi < newsList.length; pi++) {
					news[pi] = {
						title: newsList[pi].getElementsByTagName('title')[0].textContent,
						dscr: newsList[pi].getElementsByTagName('description')[0].textContent,
						pubDate: newsList[pi].getElementsByTagName('pubDate')[0].textContent,
						link: newsList[pi].getElementsByTagName('link')[0].textContent
					};
				}
				
				tplData = {
					news: news
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