// jquery.jsonp 2.1.2 (c)2010 Julian Aubourg | MIT License
// http://code.google.com/p/jquery-jsonp/
(function(e,b){function d(){}function t(C){c=[C]}function m(C){f.insertBefore(C,f.firstChild)}function l(E,C,D){return E&&E.apply(C.context||C,D)}function k(C){return/\?/.test(C)?"&":"?"}var n="async",s="charset",q="",A="error",r="_jqjsp",w="on",o=w+"click",p=w+A,a=w+"load",i=w+"readystatechange",z="removeChild",g="<script/>",v="success",y="timeout",x=e.browser,f=e("head")[0]||document.documentElement,u={},j=0,c,h={callback:r,url:location.href};function B(C){C=e.extend({},h,C);var Q=C.complete,E=C.dataFilter,M=C.callbackParameter,R=C.callback,G=C.cache,J=C.pageCache,I=C.charset,D=C.url,L=C.data,P=C.timeout,O,K=0,H=d;C.abort=function(){!K++&&H()};if(l(C.beforeSend,C,[C])===false||K){return C}D=D||q;L=L?((typeof L)=="string"?L:e.param(L,C.traditional)):q;D+=L?(k(D)+L):q;M&&(D+=k(D)+escape(M)+"=?");!G&&!J&&(D+=k(D)+"_"+(new Date()).getTime()+"=");D=D.replace(/=\?(&|$)/,"="+R+"$1");function N(S){!K++&&b(function(){H();J&&(u[D]={s:[S]});E&&(S=E.apply(C,[S]));l(C.success,C,[S,v]);l(Q,C,[C,v])},0)}function F(S){!K++&&b(function(){H();J&&S!=y&&(u[D]=S);l(C.error,C,[C,S]);l(Q,C,[C,S])},0)}J&&(O=u[D])?(O.s?N(O.s[0]):F(O)):b(function(T,S,U){if(!K){U=P>0&&b(function(){F(y)},P);H=function(){U&&clearTimeout(U);T[i]=T[o]=T[a]=T[p]=null;f[z](T);S&&f[z](S)};window[R]=t;T=e(g)[0];T.id=r+j++;if(I){T[s]=I}function V(W){(T[o]||d)();W=c;c=undefined;W?N(W[0]):F(A)}if(x.msie){T.event=o;T.htmlFor=T.id;T[i]=function(){T.readyState=="loaded"&&V()}}else{T[p]=T[a]=V;x.opera?((S=e(g)[0]).text="jQuery('#"+T.id+"')[0]."+p+"()"):T[n]=n}T.src=D;m(T);S&&m(S)}},0);return C}B.setup=function(C){e.extend(h,C)};e.jsonp=B})(jQuery,setTimeout);


// START OF news.js
/**
 * news fetching object
 * @param {Object} options the news fetcher parameters:
 * viewer - the relevant viewer object instance for the news
 * title - widget title
 * caption - widget caption
 * width - the desired widget width
 * height - the desired widget height
 * theme - the widget jquery ui theme
 * apiUrl - the base URL for the API, e.g. "http://api.feedzilla.rnd/v1/"
 * titleOnly - optional - true iff only the title should be retrieved without the summary
 * mockup - optional - true iff static mockup data should be used
 * debug - optional - true iff debug messages should be printed to the console
 */
function NewsController(options){

    this.options = options;
    this.didFetchNews = false;
    this.viewer = this.options["viewer"];
    
    // take care of default values
    this.options["mockup"] = this.options["mockup"] || false;
    this.options["titleOnly"] = this.options["titleOnly"] || false;
    this.options["debug"] = this.options["debug"] || false;
    this.options["imageWidth"] = this.options["imageWidth"] || 48;
    this.options["imageHeight"] = this.options["imageHeight"] || 48;
    this.options["rssLinks"] = {};
    
    
    /**
     * causes the controller to start running
     */
    this.run = function(){
        // setup the viewer
        var options = this.options;
        var viewer = this.viewer;
		var _this = this;
        
        viewer.setCustomStyle(options);
        viewer.setVisible();
		
        // custom image width + height set, create dynamic css
        if (options["imageWidth"]) {
            var css = ".news-item-left {width: " + (parseInt(options["imageWidth"]) + 5) + "px !important;} " +
            ".news-item-image { width: " +
            options["imageWidth"] +
            "px; height: " +
            options["imageHeight"] +
            "px;}";
            viewer.loadDynamicCss(css);
        }
        		
		// need to wait for the size before continuing
		viewer.waitForHeaderHeight(headerHeightCallback, 100, 100000);
		
		function headerHeightCallback() {
	        viewer.showFeedzillaLogo();
        
	        viewer.setTitleAndCaption(options["title"], options["caption"]);
	        // there are several sub categories - use tabs
	        if (_this.hasTabs()) {
	            viewer.setTabsNavigation(options);
	            _this.setTabsNewsFetch();
	        }

		    viewer.setSize(options["width"], options["height"], _this.hasTabs());
		    viewer.setScrollbar(options["scrollbar"]);
		    viewer.setTimestamp(options["timestamp"]);
		    viewer.disableTextSelect();
		    viewer.showFooter();
			
		    // fetch news
		    if (!options["mockup"]) {
		        // fetch data before initializing addthis for better performance
				_this.fetch();
				// addthis.init();  // commented out due to ticket #1109
				// viewer.setFooterSharing();  // commented out due to ticket #1109
		    }

		    // mockup - simulate news fetch delay, up to 4 seconds
		    else {
		        var delay = Math.floor(Math.random() * 4000);
		        setTimeout(function(){
		            _this.fetch();
		        }, delay);
		    }			
		} // end of headerHeightCallback
		
    }
    
    
    /**
     * makes a jsonp ajax call to fetch recent news from the url
     * @param {string} tabId optional - the tab id for which to fetch news, "1" is default
     */
    this.fetch = function(tabId){
        var _this = this;
        tabId = tabId || "1";
        
        this.viewer.hideError(tabId);
        this.viewer.hideGlobalLoading();
        this.viewer.showLoading(tabId);
        
        // get the news and display them         
        if (!this.options["mockup"]) {
			var apiStartDate = new Date();	
			
            $.jsonp({
                url: _this.getNewsUrl(tabId),
                dataType: "jsonp",
                cache: false,
                timeout: 15000,
                success: function(data){
                    // log api response time
					var apiLoadTime = new Date() - apiStartDate;
					_gaq.push(['_trackEvent', 'News Widget', 'API Load Time', FEEDZILLA.options["className"], apiLoadTime]);
					
					// add the news to the widget
					_this.addNews(data, tabId, _this);

					// log complete load time - only for the first tab!
					if (tabId == 1) {
						var loadTime = new Date() - new Date(FEEDZILLA.startDate);
						_gaq.push(['_trackEvent', 'News Widget', 'Complete Load Time', FEEDZILLA.options["className"], loadTime]);
					}

                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    _this.errorHandler(XMLHttpRequest, textStatus, errorThrown, tabId, _this);
					
					// log error
					_gaq.push(['_trackEvent', 'News Widget', 'API Error/Timeout', textStatus]);
                }
            });
        }
        
        // display mockup news
        else {
            var handler = function(){
                _this.addNews(_this.getMoreMockData(), 2);
                _this.viewer.unbindTab("click", 2, handler);
            }
            
            this.addNews(this.getMockData(), 1);
            this.viewer.bindTab("click", 2, handler);
            
        }
    }
    
    
    /**
     * helper function to add news after they have been fetched and start displaying them
     */
    this.addNews = function(data, tabId, _this){
		_this = _this || this;
		
		if (_this.options["debug"]) 
			console.dir(data);
		
		// no news received - something went wrong
		if ((typeof data == 'undefined') || (typeof data["articles"] == 'undefined')) {
			_this.errorHandler();
			return;
		}
		
		// update the rss link in the options
		_this.options["rssLinks"][tabId] = data["syndication_url"].replace("client_source=feedzilla_widget", "client_source=feedzilla_widget_feed");
		
		// if there are tabs, use the right active tab id, otherwise 1
		var $activeTab = $("#tabs-nav .active a");
		var activeTabId = $activeTab.length ? _this.viewer.getActiveTabSelector().replace("#", "") : "1";
		
		// update the rss link only if the relevant tab is still active
		if (tabId == activeTabId) 
			_this.viewer.setRssLink(_this.options["rssLinks"][tabId]);
		
		_this.viewer.hideLoading(tabId);
		
		// no news - show an error message
		if (data["articles"].length == 0) {
			this.viewer.showError(tabId, "No news has been found.", function() {
				_this.fetch(tabId)
			});
		}
		
		else {

            for (var i = 0, limit = data["articles"].length; i < limit; i++) {
                jQuery('<h1>').text(data["articles"][i].title).appendTo('#content-placeholder');
            }

			// start displaying news with the viewer        
			var options = {
				news: data["articles"],
				tabId: tabId,
				imageWidth: _this.options["imageWidth"],
				imageHeight: _this.options["imageHeight"]
			};
			
			_this.viewer.showNews(options); // this calls showNews in the subclass!
			if (_this.options["shareHover"] != "false") {
				_this.viewer.setShareHover();
			}
			
			if (_this.options["rotate"] != "false") {
				_this.viewer.setRotation();
			}
		}
		
    }
    
    
    /**
     * helper function to prepare the full news api url
     */
    this.getNewsUrl = function(tabId){
        var options = this.options;
        
        // use the right id for the categories/subcategories, if relevant
        id = this.hasTabs() ? tabId : "";
        
        var newsUrl = options["apiUrl"];
        
        var c = options["c" + id];
        var sc = options["sc" + id];
        var q = options["q"];
        var titleOnly = options["titleOnly"] ? 1 : 0;
        
        var newsUrlParams = "?count=" + this.encode(options["count"]) +
        "&culture_code=" +
        this.encode(options["culture_code"]) +
        "&order=" +
        this.encode(options["order"]) +
        "&title_only=" +
        titleOnly +
        "&client_source=FEEDZILLA_WIDGET" +
        "&embed_source_in_title=0" +
        "&callback=?";
        
        // setup api url - the options are - query, category, category + subcategory, category + subcategory + query
        if (typeof c != "undefined" && c != FEEDZILLA.noSelection) 
            newsUrl = newsUrl + "categories/" + c + "/";
        
        if (typeof sc != "undefined" && sc != FEEDZILLA.noSelection) 
            newsUrl = newsUrl + "subcategories/" + sc + "/";
        
        if (typeof q != "undefined" && q != "") 
            newsUrl = newsUrl + "articles/search.json" + newsUrlParams + "&q=" + this.encode(q);
        else 
            newsUrl = newsUrl + "articles.json" + newsUrlParams;
        
        if (options["debug"]) 
            console.log(newsUrl);
        
        return newsUrl;
    }
    
    
    /**
     * handles errors
     * @param {Object} _this current context
     */
    this.errorHandler = function(XMLHttpRequest, textStatus, errorThrown, tabId, _this){
        _this = _this || this;
        
        if (typeof console != "undefined" && typeof console.log != "undefined" && typeof errorThrown != "undefined") 
            console.log(errorThrown);
        
        _this.viewer.showError(tabId, "The information is currently unavailable.", function(){
			_this.fetch(tabId);
		});
    }
    
    
    /**
     * helper function that url encodes a string with the best function available
     * @param {Object} str
     */
    this.encode = function(str){
        var encode = typeof encodeURIComponent != 'undefined' ? encodeURIComponent : escape;
        
        return encode(str);
    }
    
    
    /**
     * returns true iff there are tabs/multiple categories
     */
    this.hasTabs = function(){
        return typeof this.options["tabs"] != "undefined";
    }
    
    
    /**
     * sets tabs to fetch news upon click, only for the first time
     */
    this.setTabsNewsFetch = function(){
        var _this = this;
        
        // iterate over all categories/subcategories beyond the first, if there are any
        for (var i = 2; this.options["sc" + i]; i++) {
            helper(i);
        }
        
        // set the rss handler for the first tab as well
        _this.viewer.bindTab("click", 1, function(){
            rssHandler(1);
        });
        
        /*
         * helper function to handle rss changes
         */
        function rssHandler(tabId){
            // set the right rss link in the viewer, if it's ready
            var rssLink = _this.options["rssLinks"][tabId];
            if (rssLink) 
                _this.viewer.setRssLink(rssLink);
            else 
                _this.viewer.setRssLink("http://www.feedzilla.com");
        }
        
        /*
         * helper function to circumvent enclosure issues
         */
        function helper(tabId){
        
            _this.viewer.bindTab("click", tabId, function(){
                // fetch news upon tab click if the tab ain't loading and there aren't any news
                if (!(_this.viewer.isLoading(tabId) || _this.viewer.hasNews(tabId))) {
                    _this.fetch(tabId);
                }
                
                // show the next news if there aren't any news in display & it ain't loading
                else if (!_this.viewer.hasNewsDisplayed(tabId) && !_this.viewer.isLoading(tabId)) {
                    _this.viewer.createPaging();
                    _this.viewer.showNext();
                    
                    if (_this.viewer.options["rotate"] != "false") 
                        _this.viewer.startRotation();
                }
                
                // change the rss link upon tab click
                rssHandler(tabId);
            });
        } // end of helper
    }
    
    
    /**
     * returns mock data for the news displayer
     */
    this.getMockData = function(){
        // jerusalem post mock data
        var news = {
            "articles": [{
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=140631"
                }],
                "publish_date": "Mon, 30 Aug 2010 17:21:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Starting policemen to receive NIS 10,000 (JPOST)",
                "url": "http:\/\/www.jpost.com\/Israel\/Article.aspx?ID=186472"
            }, {
                "publish_date": "Mon, 30 Aug 2010 17:20:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "'Iran will hit Dimona if attacked' (JPOST)",
                "url": "http:\/\/www.jpost.com\/IranianThreat\/News\/Article.aspx?ID=186480"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=13701555555asfasfcxv0"
                }],
                "publish_date": "Mon, 30 Aug 2010 17:20:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "'PA expects prerequisites for statehood within year' (JPOST)",
                "url": "http:\/\/www.jpost.com\/MiddleEast\/Article.aspx?ID=186474"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=145138"
                }],
                "publish_date": "Mon, 30 Aug 2010 16:58:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "J'lem man indicted for aiding Hamas (JPOST)",
                "url": "http:\/\/www.jpost.com\/Israel\/Article.aspx?ID=186469"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=148573"
                }],
                "publish_date": "Mon, 30 Aug 2010 15:10:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "From dawn till dusk (JPOST)",
                "url": "http:\/\/www.jpost.com\/MiddleEast\/Article.aspx?ID=186459"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=148560"
                }],
                "publish_date": "Mon, 30 Aug 2010 14:36:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Assad asks Lebanon to support Hizbullah (JPOST)",
                "url": "http:\/\/www.jpost.com\/MiddleEast\/Article.aspx?ID=186456"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=148562"
                }],
                "publish_date": "Mon, 30 Aug 2010 13:50:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Exclusive video: Mr Jewlicious (JPOST)",
                "url": "http:\/\/www.jpost.com\/JewishWorld\/JewishFeatures\/Article.aspx?ID=186449"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=145899"
                }],
                "publish_date": "Mon, 30 Aug 2010 13:11:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "'Building set to start in settlements' (JPOST)",
                "url": "http:\/\/www.jpost.com\/Israel\/Article.aspx?ID=186446"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=145446"
                }],
                "publish_date": "Mon, 30 Aug 2010 00:21:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Abbas wants talks according to Quartet (JPOST)",
                "url": "http:\/\/www.jpost.com\/MiddleEast\/Article.aspx?ID=186394"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=0'\/%3E%3Cbr\/%3EManipulating%20gov"
                }],
                "publish_date": "Sun, 29 Aug 2010 22:14:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Boycotts and legitimacy (JPOST)",
                "url": "http:\/\/www.jpost.com\/Opinion\/Editorials\/Article.aspx?ID=186378"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=30690"
                }],
                "publish_date": "Sun, 29 Aug 2010 18:35:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Iran to replace Google with ‘Oh Lord’ (JPOST)",
                "url": "http:\/\/www.jpost.com\/MiddleEast\/Article.aspx?ID=186363"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=1187"
                }],
                "publish_date": "Tue, 29 Jun 2010 01:59:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "In praise of negative income tax (JPOST)",
                "url": "http:\/\/www.jpost.com\/Opinion\/Editorials\/Article.aspx?ID=179826"
            }, {
                "enclosures": [{
                    "media_type": "image\/jpg",
                    "uri": "http:\/\/www.jpost.com\/HttpHandlers\/ShowImage.ashx?id=141214"
                }],
                "publish_date": "Tue, 29 Jun 2010 01:38:00 +0100",
                "source": "JPOST",
                "source_url": "http:\/\/pipes.yahoo.com\/pipes\/pipe.run?_id=b8ea83466fa569f574a1ad51923c87c5&_render=rss&feedurl=http:\/\/www.jpost.com\/Rss\/RssFeedsFrontPage.aspx",
                "title": "Silwan – ‘It’s the economy, stupid’ (JPOST)",
                "url": "http:\/\/www.jpost.com\/Opinion\/Op-EdContributors\/Article.aspx?ID=179823"
            }],
            "description": "Latest Top Stories",
            "syndication_url": "http:\/\/api.feedzilla.rnd\/en_us\/news.rss?client_source=api",
            "title": "Feedzilla"
        };
        
        return news;
    }
    
    
    return true;
}


/**
 * takes care of displaying the news using the relevant effect
 * decided to make the viewer "smart" and aware of the stack so that it will handle
 * its own news changes rather than putting all that logic in the controller
 * @param {Object} options viewer options:
 * interval - how often to switch news, in milliseconds
 */
function NewsViewer(options){
    this.options = options || {};
    this.intervalId = -1;
    this.paging = {};
    
    /**
     * displays news according to the given news stack
     * @param {Object} options the following options are available:
     * news - an array containing the news articles to display
     * order (optional) - "normal" to display in the same order as the array, "reverse" for reverse order
     * hidden (optional) - true iff the news should be hidden at first
     * sourceSeparator (optional) - a textual seperator to add right after the news source
     */
    this.showNews = function(options){
        var news = options["news"];
        options["order"] = options["order"] || "normal";
        options["hidden"] = options["hidden"] || true;
        options["sourceSeparator"] = options["sourceSeparator"] || "";
        
        var position = options["order"] == "reverse" ? "top" : "bottom";
        var hidden = options["hidden"];
        var sourceSeparator = options["sourceSeparator"] || "";
                
        // insert each piece of news 
        for (var i in news) {
            var item = news[i];
            
            // don't display the news piece if it doesn't have a title or url
            if (this.isEmpty(item["title"]) || this.isEmpty(item["url"])) {
                continue;
            }
            
            // set the title + link, source, author, summary, and date
            // trick to convert the title to html tags
            var title = $("<div />").html(item["title"]).text();
            //var title = $("<div />").html(item["title"])
            // set source and author if they are available
            var caption = this.getCaption(item);
            
            var link, summary, date;
            
            link = item["url"];
            
            if (this.options["showSummary"] && !this.isEmpty(item["summary"])) 
                summary = item["summary"];
            else 
                summary = "";
            
            // handle image enclosures
            var image = "";
            
            if (this.isImageEnclosure(item["enclosures"])) {
                image = item["enclosures"][0]["uri"];
            }

            if ( (i % 4 === 0 && i < 11)) {
                    
                    // add the news item
                    this.addItem({
                        title: jQuery("#ads").html(),
                        link: '',
                        caption: '',
                        summary: '',
                        position: '',
                        hidden: hidden,
                        image: '',
                        source: '',
                        imageWidth: options["imageWidth"],
                        imageHeight: options["imageHeight"],
                        tabId: options["tabId"]
                    });
                    
                
                    
            }
            
            // add the news item
            this.addItem({
                title: title,
                link: link,
                caption: caption,
                summary: summary,
                position: position,
                hidden: hidden,
                image: image,
                source: item["source"],
                imageWidth: options["imageWidth"],
                imageHeight: options["imageHeight"],
                tabId: options["tabId"]
            });
            
        } // end of news insertion loop
    }
    
    
    /**
     * adds a single news item to the news list
     * @param {Object} options an object containing the following options:
     * title
     * link
     * tabId
     * source (optional)
     * caption (optional)
     * image (optional)
     * summary (optional)
     * position (optional) - "top" (default) to add at it at the top of the news list, "bottom" to add it to the bottom
     * hidden (optional) - true iff the item should be hidden
     */
    this.addItem = function(options){
        // handle optional options and defaults
        options["hidden"] = options["hidden"] || false;
        options["position"] = options["position"] || "top";
        options["caption"] = options["caption"] || "";
        options["summary"] = options["summary"] || "";
        options["image"] = options["image"] || "";
        
        var hasImage = options["image"] != "";
        
        // save context
        var _this = this;
        
        // create a new news item
        var $itemDiv = _this.createItem();
        
        // set the enclosure image if relevant
        $itemDiv.find(".news-item-image .news-item-link").html("");
        
        if (hasImage) {
            // create the image
            var $img = $("<img />");
            
            // resize and show it only after it has been loaded
            $img.load(function(){
                _this.resizeItemImage(this, options["imageWidth"], options["imageHeight"]);
                $itemDiv.find(".news-item-image").show();
                $(this).css("display", "inline");
            }).error(function(){
                // the image didn't load properly - hide it and show a replacement image
                $(this).unbind("load").hide();
                $itemDiv.find(".news-item-image").addClass("no-image");
            });
            $img.attr("src", options["image"]);
            $itemDiv.find(".news-item-image .news-item-link").width(parseInt(options["imageWidth"])).height(parseInt(options["imageHeight"])).append($img);
            
        }
        
        // no image, just hide the image div
        else {
            $itemDiv.find(".news-item-image").addClass("no-image").hide();
        }
        
        if (!_this.isTicker()) {
            // set right side width - otherwise there are display bugs in some browsers
            var rightWidth = _this.getItemRightWidth(hasImage);
            $itemDiv.find(".news-item-right").width(rightWidth);
        }
        
        // set the relevant text
        $itemDiv.find(".news-item-link").attr("href", options["link"]).attr("target", "_blank");
        $itemDiv.find(".news-item-title .news-item-link").html(options["title"]);
        $itemDiv.find(".news-item-caption").html(options["caption"]);
        $itemDiv.find(".news-item-desc").html(options["summary"]);
        
        // set addthis sharing
        $shareDiv = $itemDiv.find(".news-item-share");
        //_this.setItemSharing($shareDiv, options["title"], options["source"], options["link"]); // commented out due to ticket 1109
		
        // hide or show the news item
        if (options["hidden"]) 
            $itemDiv.hide();
        else 
            $itemDiv.show();
        
        // finally, add the new item to the relevant news list
        var target = ".news-item-wrapper";
        
        // the target is inside some tab
        if (options["tabId"]) 
            target = "#" + options["tabId"] + " " + target;
        
        var $newsDiv = $(target);
        
        if (options["position"] == "bottom") 
            $newsDiv.append($itemDiv);
        else 
            $newsDiv.prepend($itemDiv);
        
    }
    
	
	/**
	 * sets sharing for a certain item
	 * @param {Object} $shareDiv
	 * @param {Object} title
	 * @param {Object} source
	 * @param {Object} url
	 */
	this.setItemSharing = function($shareDiv, title, source, url){
        var shareTitle = source ? source + " : " + title : title;
        // need to encode the url because it ends up in another url, addthis doesn't take care of it
        var shareUrl = this.encode(url);
        
        // only use addthis if the object is indeed available + the share div isn't visible yet
        if ( typeof addthis != "undefined" && typeof addthis.toolbox != "undefined" && $shareDiv.is(":hidden") ) {
            addthis.toolbox($shareDiv[0], {}, {
                url: shareUrl,
                title: shareTitle,
                description: "",
                templates: {
                    twitter: '{{title}} {{url}}'
                }
            });
            // set opacity here, otherwise IE ignores it
            $shareDiv.css({
				opacity: "0.5", 
				display: "block"
			});
        }
        // no addthis, hide the shareDiv
        else {
            $shareDiv.hide();
        }
		
	}
    
	
    /**
     * helper function to determine the right side width for items, where the title, caption, and date are
     * @param {boolean} hasImage true iff the relevant item has an image to it
     */
    this.getItemRightWidth = function(hasImage){
        var wrapperWidth = parseInt($("#wrapper").width());
        var leftPadding = this.cssToInt($(".empty-news-item").css("padding-left"));
        var rightPadding = this.cssToInt($(".empty-news-item").css("padding-right"));
        
        // basic calculation
        var rightWidth = wrapperWidth - leftPadding - rightPadding - 2;
        
        // additional width fixes for non-ticker styles
        if (!this.isTicker()) {
            // remove the left side from the right width since there is an image there
            if (hasImage) {
				rightWidth = rightWidth - this.cssToInt($(".news-item-left").css("width"));
			}
            
            // when there is a scrollbar the width needs to be even smaller
            if (this.hasScrollbar()) {
				rightWidth = rightWidth - this.cssToInt($(".scrollbar .empty-news-item").css("padding-right"));
				
				// bugfix - image and scrollbar needs even less space
				if (hasImage) {
					rightWidth = rightWidth - 4;
				}
			}
        }
        
        return rightWidth;
    }
    
    
    /**
     * helper function that converts a css attribute to integer
     * @param {string} cssString the relevant css string
     */
    this.cssToInt = function(cssString){
        try {
            return parseInt(cssString.replace("px", ""));
        } 
        catch (error) {
            return 0;
        }
    }
    
    
    /**
     * creates a new news item li
     */
    this.createItem = function(){
        return $(".empty-news-item").clone().removeClass("empty-news-item").addClass("news-item");
    }
    
    
    /**
     * creates paging - can only be done for the active tab, otherwise the items have no height
     */
    this.createPaging = function(){
        var _this = this;
        var tabId = _this.getActiveTabSelector().replace("#", "");
        
        // create a new object for the tab id
        this.paging[tabId] = {
            index: -1,
            items: []
        };
        
        // call the right paging type
        switch (_this.options["pagingType"]) {
            case "dynamic":
                createDynamicPaging();
                break;
            default:
                createConstantPaging();
        }
        
        markOddEvenRows();
        
        
        /*
         * helper function which creates paging according to how many items fit within each page
         */
        function createDynamicPaging(){
            var $tab = $("#" + tabId);
            
            // measure sizes and positions, use active wrapper for height, otherwise it gets buggy when switching tabs rapidly
            $itemWrapper = $tab.find(".news-item-wrapper");
            var wrapperHeight = $itemWrapper.height();
            
            // get all the possible next items
            var $items = $tab.find(".news-item");
            
            var pageItemsHeight = 0, $pageItems = $();
            
            // iterate over the available items
            for (var i = 0; i < $items.length; i++) {
                // get the current item height
                var $currItem = $($items[i]);
                var height = $currItem.outerHeight();
                
                // calculate the total items height
                pageItemsHeight = pageItemsHeight + height;
                
                // item height is not within range
                if (pageItemsHeight > wrapperHeight) {
                    // add current page items as a new page
                    _this.addPage(tabId, $pageItems);
                    // start a new page
                    $pageItems = $();
                    pageItemsHeight = height;
                }
                
                $pageItems = $pageItems.add($currItem);
                
            }
            
            // last item added, add the "more items" link if there is enough space
            var hasEnoughSpace = (wrapperHeight - pageItemsHeight) >= 30;
            
            if (hasEnoughSpace) {
                var $moreItems = $("<li>To get more news <a href=''>click here <span class='raquo'>&raquo;</span></a></li>").addClass("news-item more-items");
                $moreItems.hide().find("a").attr("href", $("#footer .rss a").attr("href"));
                $itemWrapper.append($moreItems);
                $pageItems = $pageItems.add($moreItems);
            }
            
            // if there are any items left, add them as the last page
            if ($pageItems.length > 0) 
                _this.addPage(tabId, $pageItems);
            
        } // end of createDynamicPaging
        /*
         * helper function which creates paging with a constant number of items
         */
        function createConstantPaging(){
            var $newsItems = $(".news-item");
            var numOfItems = parseInt(_this.options["numOfItems"]);
            
            // iterate over the news items with increments according to the number of items
            for (var i = 0; i < $newsItems.length; i = i + numOfItems) {
                var $pageItems = $newsItems.slice(i, i + numOfItems);
                _this.addPage(tabId, $pageItems)
            }
        } // end of createConstantPaging
        
		
		function markOddEvenRows(){
            var paging = _this.paging[tabId];
            
            for (var i = 0; i < paging.items.length; i++) {
                for (var j = 0; j < paging.items[i].length; j++) {
                    var className = j % 2 == 0 ? "odd" : "even";
                    var $item = $(paging.items[i][j]);
                    if (!$item.hasClass("more-items")) 
                        $item.addClass(className);
                    
                }
            }
        } // end of markOddEvenRows
    }
    // end of createPaging function
    
    
    /**
     * adds a page of items for the sake of paging
     * @param {Object} tabId the tab id for these items
     * @param {Object} items jquery object with the relevant items
     */
    this.addPage = function(tabId, items){
        this.paging[tabId].items.push(items);
        this.paging[tabId].index = this.paging[tabId].index + 1;
    }
    
    
    /**
     * returns the next items
     */
    this.getNextItems = function(){
        return this.getNextPrevItems("next");
    }
    
    
    /**
     * returns the previous page with its items
     */
    this.getPrevItems = function(){
        return this.getNextPrevItems("prev");
    }
    
    
    /**
     * helper function to get the next/prev page items
     * @param {Object} nextOrPrev
     */
    this.getNextPrevItems = function(nextOrPrev){
        var activeTabId = this.getActiveTabSelector().replace("#", "");
        var isNext = nextOrPrev == "next";
        var interval = isNext ? 1 : -1;
        var currPaging = this.paging[activeTabId];
        
        // calculate & save the new paging cyclical index. need to add the length to the index to handle negative numbers
        var newIndex = (currPaging.index + interval + currPaging.items.length) % currPaging.items.length;
        this.paging[activeTabId].index = newIndex;
        
        // return the right items
        return currPaging.items[newIndex];
    }
    
	
	/**
	 * waits until the widget header and footer have sizes and then performs a callback
	 * @param {function} callback the callback to perform with 
	 * @param {number} interval the interval in miliseconds
	 * @param {number} limit maximum time to run, after that the callback is called
	 */
	this.waitForHeaderHeight = function(callback, interval, limit) {
		var timePassed = 0;
		
		// start checking for a header height
		checkHeaderHeight();
		
		function checkHeaderHeight(){
			var headerHeight = $("#header").outerHeight();
			
			// bugfix - no heights yet, run the function later (happens upon shift + refresh in firefox)
			if (headerHeight == 0 && timePassed < limit) {
				timePassed = timePassed + interval;
				
				setTimeout(checkHeaderHeight, interval);
				
				return;
			}
			// sizes are available or the limit has been reached, do the callback
			else {
				callback();
			}
		} // end of checkSize function
		
	}
	
	
    /**
     * adds tabs according to the relevant subcategories
     * @param {Object} options
     */
    this.setTabsNavigation = function(options){
        var _this = this;
        
        // show tabs navigation bar
        $("#tabs-nav-wrapper").show();
        
        // iterate over the subcategories and create tabs for them
        for (var i = 1; options["sc" + i]; i++) {
            var tabName = options["tabName" + i];
            
            $("#tabs-nav ul").append('<li><a href="#' + i + '">' + tabName + '</a></li>');
            
            // clone news box and set ids for all tabs except for the first, it's already set
            if (i > 1) 
                $(".news:first").clone().attr("id", i).appendTo("#tabs");
        }
        
        // enable tab navigation
        $('#tabs .tab').hide();
        $('#tabs .tab:first').show();
        $('#tabs-nav li:first').addClass('active').addClass('left-most');
        
        // tab navigation click
        $('#tabs-nav li a').click(tabNavigationClick);
        
        // handle rotation upon tab click
        if (options["rotate"] != "false") {
            $('#tabs-nav li a').click(function(){
                _this.stopRotation();
                // only start the rotation if there is news in display
                if (_this.hasNewsDisplayed(_this.getActiveTabSelector().replace("#", ""))) 
                    _this.startRotation();
            });
        }
        
        // add tab left/right buttons if the tabs navigation overflows the widget space
        tabNavigationOverflow();
        
        
        /*
         * adds tab navigation left/right buttons if necessary
         */
        function tabNavigationOverflow(){
            var lastTabRightPos = $("#tabs-nav li:last").width() + $("#tabs-nav li:last").offset()["left"];
            
            if (lastTabRightPos > $("#wrapper").width()) {
                // style and width stuff
                $tabsNavWrap = $("#tabs-nav-wrapper");
                $tabsNavWrap.find(".ui-icon").show();
                var newWidth = $tabsNavWrap.width() - 34;
                $("#tabs-nav").css("overflow", "hidden").width(newWidth);
                
                // prepare for next/prev tab button clicks
                $tabsNavUl = $("#tabs-nav ul");
                var mouseDown = false;
                
                // right arrow tab navigation click
                $tabsNavWrap.find(".prev-tab-btn").mousedown(function(){
                    mouseDown = true;
                    var callback = function(){
                        // the animation is done - display the next tab if the mouse is still down
                        if (mouseDown) {
                            $tabsNavUl.queue(function(){
                                _this.scrollTabsLeft(callback);
                            });
                            $tabsNavUl.dequeue();
                        }
                    };
                    
                    _this.scrollTabsLeft(callback);
                }).mouseup(function(){
                    mouseDown = false;
                    $tabsNavUl.clearQueue();
                });
                
                // left arrow tab navigation click
                $tabsNavWrap.find(".next-tab-btn").mousedown(function(){
                    mouseDown = true;
                    var callback = function(){
                        // the animation is done - display the next tab if the mouse is still down
                        if (mouseDown) {
                            $tabsNavUl.queue(function(){
                                _this.scrollTabsRight(callback);
                            });
                            $tabsNavUl.dequeue();
                        }
                    };
                    
                    _this.scrollTabsRight(callback);
                }).mouseup(function(){
                    mouseDown = false;
                    $tabsNavUl.clearQueue();
                });
                
            }
            
            
        }
        /* end of tabNavigationOverflow function */
        
        
        /*
         * helper function - tab navigation click handler
         */
        function tabNavigationClick(){
            // show/hide relevant tab content
            var $tab = $(this).parent();
            $('#tabs-nav li').removeClass('active');
            $tab.addClass('active');
            var currentTab = _this.getTabIdFromHref($(this).attr('href'));
            $('#tabs .tab').hide();
            $('#' + currentTab).show();
            
            var tabNavRight = $("#tabs-nav").width() + $("#tabs-nav").offset()["left"];
            
            // scroll tab into view when it ain't fully visible	
            var scrollToView = function(){
                var tabLeft = $tab.offset()["left"];
                var tabRight = tabLeft + $tab.width();
                
                if ((tabRight > tabNavRight) && (tabLeft >= 0)) {
                    _this.scrollTabsRight(scrollToView);
                }
                
            };
            
            scrollToView();
            
            return false;
        }
    }
    
    
    /**
     * show the previous tab by scrolling to the tabs to the left
     * @param {Object} callback called after scrolling the tabs
     */
    this.scrollTabsLeft = function(callback){
        // get the previous tab and its left position
        var $tabsNavUl = $("#tabs-nav ul");
        var $leftMostTab = $tabsNavUl.find('.left-most');
        var $prevTab = $leftMostTab.prev();
        
        // only go on if there is a next tab
        if ($prevTab.length > 0) {
            $leftMostTab.removeClass("left-most");
            $prevTab.addClass("left-most");
            var newLeft = "-" + $prevTab.position()["left"] + "px";
            
            // animate
            $tabsNavUl.animate({
                left: newLeft
            }, callback);
        }
    }
    
    
    /**
     * show the previous tab by scrolling to the tabs to the right
     * @param {Object} callback called after scrolling the tabs
     */
    this.scrollTabsRight = function(callback){
        // get the next tab and its left position
        var $tabsNavUl = $("#tabs-nav ul");
        var $leftMostTab = $tabsNavUl.find('.left-most');
        var $nextTab = $leftMostTab.next();
        var $lastTab = $tabsNavUl.find("li:last");
        var lastTabRightOffset = $lastTab.offset()["left"] + $lastTab.width();
        var isLastTabVisible = lastTabRightOffset <= $("#tabs-nav").width();
        
        // only go on if there is a next tab and the last tab isn't visible yet
        if ($nextTab.length > 0 && !isLastTabVisible) {
            $leftMostTab.removeClass("left-most");
            $nextTab.addClass("left-most");
            var newLeft = "-" + $nextTab.position()["left"] + "px";
            
            // animate
            $tabsNavUl.animate({
                left: newLeft
            }, callback);
        }
    }
    
    
    
    
    /**
     * helper function that returns a tab id given a tab navigation href property
     * @param {Object} href
     */
    this.getTabIdFromHref = function(href){
        // IE fix - get the href only starting from the last #
        return href.slice(href.lastIndexOf("#") + 1);
    }
    
    /**
     * binds events to tab navigaton
     * @param {Object} tabId
     * @param {Object} event
     * @param {Object} eventHandler
     */
    this.bindTab = function(eventType, tabId, handler){
        $("#tabs-nav a[href$=#" + tabId + "]").bind(eventType, handler);
    }
    
    
    /**
     * unbinds a tab navigation event
     * @param {Object} tabId
     * @param {Object} eventType
     * @param {Object} handler
     */
    this.unbindTab = function(eventType, tabId, handler){
        $("#tabs-nav a[href$=#" + tabId + "]").unbind(eventType, handler);
    }
    
    /**
     * returns the active tab selector, "#1" if tabs aren't being used
     */
    this.getActiveTabSelector = function(){
        var id = $("#tabs-nav-wrapper").is(":visible") ? $("#tabs-nav .active a").attr("href") : "1";
        id = this.getTabIdFromHref(id);
        
        return "#" + id;
    }
    
    
    /**
     * helper function that returns the caption according to the given date, source, or author
     * they are all optional, so it could be either "date", "source", "author", "date - source", "source - author", etc.
     * @param {Object} item the current news item
     * @param {Object} options the options
     */
    this.getCaption = function(item){
        var caption = "";
        var showDate = this.options["timestamp"] == "true" && !this.isEmpty(item["publish_date"]);
        var showSource = !this.isEmpty(item["source"]);
        var showAuthor = !this.isEmpty(item["author"]);
        var separator = " - ";
        
        if (showDate) {
            caption = caption + "<span class='date'>" + this.timeAgo(item["publish_date"]);
            
            if (showSource || showAuthor) 
                caption = caption + "<span class='separator'>" + separator + "</span>";
            
            caption = caption + "</span>"
        }
        
        if (showSource) {
            caption = caption + "<span class='source'>" + item["source"];
            
            if (showAuthor) 
                caption = caption + "<span class='separator'>" + separator + "</span>";
            
            caption = caption + "</span>"
        }
        
        if (showAuthor) {
            caption = caption + "<span class='source'>" + item["author"] + "</span>";
        }
        
        return caption;
    }
    
    
    /**
     * helper function to resize enclosure images using css
     * @param {Object} imgNode the image dom node
     * @param {newSize} the new size that should be
     */
    this.resizeItemImage = function(imgNode, newWidth, newHeight){
        var newWidth = parseInt(newWidth) || 48;
        var newHeight = parseInt(newHeight) || 48;
        
        // resize the image
        $(imgNode).width(newWidth).height(newHeight);
        
    }
    
    
    
    /**
     * helper function - relative time calculator
     * @param {string} twitter date string returned from Twitter API
     * @return {string} relative time like "2 minutes ago"
     */
    this.timeAgo = function(dateString){
        var rightNow = new Date();
        var then = new Date(dateString);
        var diff = rightNow - then;
        var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
        
        if (isNaN(diff)) {
            return ""; // return blank string if unknown
        }
        
        if (diff < 0) {
            return "future time";
        }
        
        if (diff < second * 7) {
            // within 7 seconds
            return "right now";
        }
        
        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }
        
        if (diff < minute * 2) {
            return "about 1 minute ago";
        }
        
        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }
        
        if (diff < hour * 2) {
            return "about 1 hour ago";
        }
        
        
        if (diff < day) {
            return Math.floor(diff / hour) + " hours ago";
        }
        
        if (diff > day && diff < day * 2) {
            return "yesterday";
        }
        
        if (diff < day * 7) {
            return Math.floor(diff / day) + " days ago";
        }
        
        else {
            return "over a week ago";
        }
        
    }
    
    
    /**
     * sets the viewer for rotation
     */
    this.setRotation = function(){
        var _this = this;
        
        // mouseenter/leave over links and share buttons
        var selector = ".news-item-link, .news-item-share";
        
        this.mouseenter(selector, function(){
            if (_this.isRotating()) {
                _this.stopRotation();
            }
        });
        
        // mouse leaves - continue rotating news
        this.mouseleave(selector, function(){
            if (!_this.isRotating()) {
                _this.startRotation();
            }
        });
        
        // start rotating the news
        if (!this.isRotating()) 
            this.startRotation();
        
        
    }
    
    
    /**
     * rotates the news automatically according to the given interval
     */
    this.startRotation = function(){
        var _this = this;
        
        this.intervalId = setInterval(function(){
            _this.showNext(false);
        }, this.options["interval"]);
        
    };
    
    
    /**
     * stops rotating the news
     */
    this.stopRotation = function(){
        clearInterval(this.intervalId);
        this.intervalId = -1;
    }
    
    
    /**
     * returns true iff the news is rotating at the moment
     */
    this.isRotating = function(){
        return this.intervalId != -1;
    }
    
    
    /**
     * rotates the news display to the next piece/s of news - to be overriden by the subclasses
     */
    this.showNext = function(){
    }
    
    
    /**
     * shows the loading icon
     */
    this.showLoading = function(tabId){
        $('#' + tabId + " .loading").show();
    }
    
    
    /**
     * removes the loading icon
     */
    this.hideLoading = function(tabId){
        $('#' + tabId + " .loading").hide();
    }
    
    
    /**
     *
     */
    this.hideGlobalLoading = function(){
        $(".global.loading").hide();
    }
    
    /**
     * does what it says it does - sets the widget title and the caption
     * @param {string} title
     * @param {string} caption
     */
    this.setTitleAndCaption = function(title, caption){
        $("#title").text(title);
        $("#caption").text(caption);
    }
    
    
    /**
     * sets the rss link at the bottom of the widget
     * @param {Object} url
     */
    this.setRssLink = function(url){
        var $rssLink = $("#footer .rss a");
        $rssLink.attr("href", url);
        $rssLink.attr("target", "_blank");
    }
    
    
    /**
     * displays errors
     * @param message {String} the error message to display, default available
     */
    this.showError = function(tabId, message, reloadHandler){
        message = message || "The information is currently unavailable.";
        
        this.hideLoading(tabId);
        
        var $error = $('#' + tabId + ' .error');
        $error.html(message + " <span class='reload'>Try Again</span>");
		
		// try again link action
		$error.find(".reload").click(reloadHandler);
        
        if (this.isTicker()) 
            $error.css({
                position: "absolute",
                top: "7px",
                left: ($("#header").outerWidth() + 10) + "px"
            });
        else 
            $error.center();
        
        // hide the news, otherwise the more news link gets displayed
        $('#' + tabId + ' .news-item-wrapper').css('visibility', 'hidden');
        
        $error.fadeIn();
    }
    
    
    this.hideError = function(tabId){
        $('#' + tabId + ' .error').hide();
		
		$('#' + tabId + ' .news-item-wrapper').css('visibility', 'visible');
    }
    
    
    /**
     * loads dynamic CSS rules by appending them to the HEAD tag in a STYLE tag
     * @param {Object} css the relevant css rules as a plain string
     * @param {Object} title optional - add a title attribute to the style tag
     */
    this.loadDynamicCss = function(css, title){
        title = title || "";
        $("<style type='text/css'>" + css + "</style>").attr("title", title).appendTo("head");
    }
    
    
    /**
     * sets the widget size
     * @param {Object} width
     * @param {Object} height
     */
    this.setSize = function(width, height, hasTabs){
		// main body height is the total height minus various parts and a tiny correction
		var headerHeight = $("#header").outerHeight();
		var footerHeight = $("#footer").outerHeight();
		
	    var newsHeight = parseFloat(height) - headerHeight -
	    footerHeight -
	    2;
		
		// non ie browsers - need to decrease the news height a little more
		if (typeof $.browser.msie == "undefined") {
			var correction = hasTabs ? 6 : 4;
			newsHeight = newsHeight - correction;
		}
	
	    // only subtract the tabs height if the tabs are visible, otherwise stupid IE gets confused
	    if ($("#tabs-nav-wrapper").is(":visible")) 
	        newsHeight = newsHeight - $("#tabs-nav-wrapper").outerHeight();
	    		
	    $(".news").height(newsHeight);			
    }
    
    
    /**
     *
     * @param {Object} scroll true iff there should be a scrollbar for the news
     */
    this.setScrollbar = function(scroll){
        if (scroll == "true") {
            $(".news").addClass("scrollbar");
            $(".secret").addClass("scrollbar");
        }
    }
    
    
    /**
     * returns true iff the scrollbar option is set upon the widget
     */
    this.hasScrollbar = function(){
        return $(".news").hasClass("scrollbar");
    }
    
    
    /**
     * returns true iff the current style is ticker
     */
    this.isTicker = function(){
        return $("#wrapper").hasClass("ticker");
    }
    
    /**
     *
     * @param {Object} timestamp true iff the timestamp should appear
     */
    this.setTimestamp = function(timestamp){
        this.options["timestamp"] = timestamp;
    }
    
    
    /**
     * animate opacity for share buttons when the mouse is over a news item
     */
    this.setShareHover = function(){
        var selector = ".news-item";
        
        this.mouseenter(selector, function(){
            // this context is the item itself
            $(this).find(".news-item-share").stop().animate({
                opacity: 1
            });
            
        });
        
        this.mouseleave(selector, function(){
            // this context is the item itself
            $(this).find(".news-item-share").stop().animate({
                opacity: 0.5
            });
        });
        
    }
    
    
    /**
     * sets custom colors and backgrounds for the widget
     * @param {Object} options options:
     * headerLogoUrl
     * headerLogoLinkUrl
     * headerBackgroundUrl
     * headerTextColor
     * contentBackgroundUrl
     * contentTextColor
     * contentLinkColor
     * footerBackgroundUrl
     * footerTextColor
     */
    this.setCustomStyle = function(options){
        sanitizeOptions();
        
        $("#header").css(getCssObj(options["headerTextColor"], options["headerBackgroundColor"], options["headerBackgroundUrl"]));
        $(".ui-widget-content").css(getCssObj(options["contentTextColor"], options["contentBackgroundColor"], options["contentBackgroundUrl"]));
        $("#footer").css(getCssObj(options["footerTextColor"], options["footerBackgroundColor"], options["footerBackgroundUrl"]));
        
        // remove previous link color style, if available
        $("style[title=contentLinkColor]").remove();
        
        // need to add links as style because they are dynamic
        if (options["contentLinkColor"]) {
            var css = ".news a { color: " + options["contentLinkColor"] + ";}"
            this.loadDynamicCss(css, "contentLinkColor")
        }
        
        // set the header logo image and link
        var $logo = $(".logo");
        
        if (options["headerLogoImageUrl"]) {
            $img = $logo.find("img").attr("src", options["headerLogoImageUrl"]);
            
            if (options["headerLogoLinkUrl"]) {
                $("<a />").attr("href", options["headerLogoLinkUrl"]).append($img).appendTo($logo);
            }
            else {
                $img.appendTo($logo);
                $logo.find("a").remove();
            }
            
            $logo.show();
        }
        
        else {
            $logo.hide();
        }
        
        /*
         * helper function to sanitize custom style options now that they are loaded dynamically
         */
        function sanitizeOptions(){
            var colorRegExp = /color/i;
            var hexRegExp = /#[0-9a-fA-F]/i;
            var bgUrlRegExp = /(Background|Image|Link)Url/i;
            var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            
            // go over all options
            for (var key in options) {
                var value = options[key];
                
                // color parameters should be 6 chars in hex format
                if (colorRegExp.test(key)) {
                    value = value.substr(0, 7);
                    value = hexRegExp.test(value) ? value : "";
                }
                // background urls should have limited length and be legal
                else if (bgUrlRegExp.test(key)) {
                    value = value.substr(0, 250);
                    value = urlRegExp.test(value) ? value : "";
                }
                
                options[key] = value;
            }
        }
        
        /*
         * helper function that returns a css object for use with jQuery
         */
        function getCssObj(color, bgColor, bgUrl){
            var css = {};
            
            // text color
            if (typeof color != "undefined") 
                css["color"] = color;
            
            // there is a background url
            if (bgUrl && bgUrl != "") {
                css["background-image"] = "url(" + bgUrl + ")";
                css["background-repeat"] = "repeat";
            }
            else {
                if (bgColor) {
                    css["background-image"] = "none";
                }
                else {
                    css["background-image"] = "";
                }
            }
            
            // no url, but some color
            if (typeof bgColor != "undefined") {
                css["background-color"] = bgColor;
                css["border-color"] = bgColor;
            }
            
            return css;
        }
        
    }
    
	
	this.setVisible = function() {
		$("#wrapper").css("visibility", "visible");
	}
    
	
    /**
     * makes the footer visible again, it is hidden at first so that it wouldn't be jumpy when the widget loads
     */
    this.showFooter = function(){
        $("#footer").css("visibility", "visible");
    }
    
    
    /**
     * sets the viewer mouse enter event handler
     * @param {Object} handler
     */
    this.mouseenter = function(selector, handler){
        $(selector).mouseenter(handler);
    }
    
    
    /**
     * sets the viewer mouse leave event handler
     * @param {Object} handler
     */
    this.mouseleave = function(selector, handler){
        $(selector).mouseleave(handler);
    }
    
    
    /**
     * just shows the buttons, they are hidden by default
     * options:
     * nextClass - the CSS class name to set for the next button
     * prevClass - the CSS class name to set for the prev button
     *
     * if no options are given, then the defaults are for left and right icons
     */
    this.showButtons = function(options){
        var defaults = {
            nextClass: "ui-icon-circle-triangle-e",
            prevClass: "ui-icon-circle-triangle-w"
        };
        
        options = options || defaults;
        
        $(".buttons .next-item").addClass(options["nextClass"]);
        $(".buttons .prev-item").addClass(options["prevClass"]);
        
        //set buttons left position for non ticker styles
        if (!this.isTicker()) {
            var left = (parseInt($("#header").width()) - 46) + "px";
            $(".buttons").css("left", left)
        }
        
        $(".buttons").fadeIn("normal", function(){
            // enforce showing the buttons, may help IE7 issues
            $(this).show();
        });
    }
    
    
    /**
     * sets event handlers for the previous/next buttons
     */
    this.enableButtons = function(){
        var _this = this;
        var $prevButton = $(".buttons .prev-item");
        var $nextButton = $(".buttons .next-item");
        
        // only set new click event handlers if the buttons have been disabled
        if ($prevButton.hasClass("disabled")) {
            $prevButton.removeClass("disabled").click(function(){
                if (_this.isRotating()) {
                    _this.stopRotation();
                    _this.showPrev(true);
                    _this.startRotation();
                }
                else {
                    _this.showPrev(true);
                }
            });
        }
        
        if ($nextButton.hasClass("disabled")) {
            $nextButton.removeClass("disabled").click(function(){
                if (_this.isRotating()) {
                    _this.stopRotation();
                    _this.showNext(true);
                    _this.startRotation();
                }
                else {
                    _this.showNext(true);
                }
            });
        }
        
    }
    
    
    /**
     * disables event handling for widget buttons
     */
    this.disableButtons = function(){
        $(".buttons .prev-item").addClass("disabled").unbind("click");
        $(".buttons .next-item").addClass("disabled").unbind("click");
    }
    
    
    /**
     * options setter, needed mainly for subclasses
     * @param {Object} options
     */
    this.setOptions = function(options){
        if (options) {
            this.options = options;
            this.options["showSummary"] = this.options["showSummary"] || false;
        }
    }
    
    
    /**
     * sets the css class for the widget. useful for style switches
     * @param {Object} className the name of the class to set
     */
    this.setWidgetClass = function(className){
        $("#wrapper").addClass(className);
    }
    
    
    /**
     * returns true iff the enclosure should be shown
     * @param {Object} enclosures the enclosures array
     */
    this.isImageEnclosure = function(enclosures){
        var regExp = new RegExp("^image");
        return !this.isEmpty(enclosures) && regExp.test(enclosures[0]["media_type"]);
    }
    
    
    /**
     * returns true iff the tab is currently loading
     * @param {Object} tabId
     */
    this.isLoading = function(tabId){
        return $("#" + tabId + " .loading").is(":visible");
    }
    
    
    /**
     * returns true iff the given tab has news (even if hidden)
     * @param {Object} tabId
     */
    this.hasNews = function(tabId){
        return $("#" + tabId + " .news-item").length > 0;
    }
    
    
    /**
     * returns true iff the given tab has visible news in display
     * @param {Object} tabId
     */
    this.hasNewsDisplayed = function(tabId){
        return $("#" + tabId + " .news-item:visible").length > 0;
    }
    
    
    /**
     * returns true iff the object is undefined or contains nothing
     * @param {Object} obj
     */
    this.isEmpty = function(obj){
        return typeof obj == "undefined" || obj == "";
    }
    
    
    /**
     * helper function that url encodes a string with the best function available
     * @param {Object} str
     */
    this.encode = function(str){
        var encode = typeof encodeURIComponent != 'undefined' ? encodeURIComponent : escape;
        
        return encode(str);
    }
    
    /**
     * returns the prev/next animation delay, slow for natural, twice as fast for click
     * @param {Object} didClick true iff the user clicked prev/next
     */
    this.getAnimationDelay = function(didClick){
        return didClick == true ? this.options["animationDelay"] / 2 : this.options["animationDelay"];
    }
    
    
    /**
     * sets various parts of the widget as unselectable, otherwise things get selected automatically
     */
    this.disableTextSelect = function(){
        $('.noselect').each(function(){
            if ($.browser.mozilla) {//Firefox
                $(this).css('MozUserSelect', 'none');
            }
            else if ($.browser.msie) {//IE
                $(this).bind('selectstart', function(){
                    return false;
                });
            }
            else {//Opera, etc.
                $(this).mousedown(function(){
                    return false;
                });
            }
        });
    }
    
	
	/**
	 * sets sharing in the footer
	 * @param {Object} options widget options as passed from the controller
	 */
	this.setFooterSharing = function(options) {
		// only use addthis if the object is indeed available
        if (typeof addthis != "undefined" && typeof addthis.toolbox != "undefined") {
			
			// build sharing querystring
			var params = {};
			var regexp = /^(style|culture_code|c\d?|sc\d?|theme|q)$/;
			
			// only include parameters that are supported
			for (var key in options) {
				if (regexp.test(key)) {
					params[key] = options[key];
				} 
			}
			
            addthis.toolbox($("#footer .addthis").get(0), {}, {
				url: "http://widgets.feedzilla.com/news/builder/index.html",
				url_transforms: {
					add: params,
        			shorten: {      
            			twitter: 'bitly'
        			}
				},
				templates: {
                    twitter: 'Feedzilla - Get Your Widget Code {{url}} via @Feedzilla'
                }
            });
        }
		
	}
	
    
    /**
     * simply displays the feedzilla logo, useful in case a custom stylesheet is used to change it
     */
    this.showFeedzillaLogo = function(){
        $(".feedzilla-logo").show();
    }
    
    
    return true;
}

// instantiate the newsviewer - for use with the subclasses
var newsViewerPrototype = new NewsViewer();


/**
 * news style that slides each piece of news from top to bottom with fadein/out (spy effect)
 * @param {Object} options
 */
function SpyNewsViewer(options){
    // set options 
    SpyNewsViewer.prototype.setOptions(options);
    this.options["interval"] = this.options["interval"] || 4000;
    this.options["animationDelay"] = this.options["animationDelay"] || 800;
    
    var _this = this;
    
    this.showNews = function(options){
        // call the super class method
        options.order = "reverse";
        SpyNewsViewer.prototype.showNews(options);
        
        this.showButtons({
            nextClass: "ui-icon-circle-triangle-s",
            prevClass: "ui-icon-circle-triangle-n"
        });
        
        // only act if the relevant tab is currently active
        var isTabActive = _this.getActiveTabSelector() == "#" + options["tabId"];
        
        if (isTabActive) {
            // note - the spy effect doesn't use the paging system since it has much simpler demands than other styles
            // show the next piece of news immediately, because they are all hidden
            this.showNext();
        }
        
    }
    
    
    this.showNext = function(didClick){
        var $activeTab = $(_this.getActiveTabSelector());
        // fade the last item out
        var $newItem = $activeTab.find(".news-item:last");
        var height = $newItem.height();
        var animationDelay = _this.getAnimationDelay(didClick);
        var fadeOutDelay = _this.areAllItemsDisplayed() && _this.isLastItemOnScreen() ? animationDelay : 0;
        
        _this.disableButtons();
        
        $newItem.animate({
            opacity: 0
        }, fadeOutDelay, function(){
        
            // reinsert the last item as the first item with 0 opacity and height
            $newItem.css({
                height: 0,
				opacity: 0,
				"padding-top": 0,
                "padding-bottom": 0
            }).show().prependTo($activeTab.find(".news-item-wrapper"));
            
            // increase the items height and get back opacity
            $newItem.animate({
                height: height,
                "padding-top": 5,
                "padding-bottom": 5
            }, animationDelay, "swing", function() {
				$(this).animate({
                	opacity: 1
            	}, animationDelay, "swing", function(){
                	_this.enableButtons();
                	// ie7 fix for ugly fonts - remove filter
                	if (jQuery.browser.msie) 
                    	$newItem.get(0).style.removeAttribute('filter'); 
            	});
			});
            
        });
    }
    
    
    this.showPrev = function(didClick){
        var $activeTab = $(_this.getActiveTabSelector());
        
        var $newItem = $activeTab.find(".news-item:first");
        var height = $newItem.height();
        var animationDelay = _this.getAnimationDelay(didClick);
        
        // return and do nothing if the first item ain't visible
        if (!$newItem.is(":visible")) 
            return;
        
        _this.disableButtons();
        
        // fade the first item out
        $newItem.animate({
            opacity: 0,
            height: 0,
            "padding-top": 0,
            "padding-bottom": 0
        }, animationDelay, function(){
            // reinsert the first item as the last
            var shouldFadeIn = _this.areAllItemsDisplayed();
            
            $newItem.appendTo($activeTab.find(".news-item-wrapper")).css({
                height: height,
                opacity: 0,
                "padding-top": 5,
                "padding-bottom": 5
            });
            
            // fade in at the bottom only if all items have been displayed
            if (shouldFadeIn) {
                var fadeInDelay = _this.isLastItemOnScreen() ? animationDelay : 0;
                
                $newItem.animate({
                    opacity: 1
                }, fadeInDelay, "swing", function(){
                    _this.enableButtons();
                    // ie7 fix for ugly fonts - remove filter
                    if (jQuery.browser.msie) 
                        $newItem.get(0).style.removeAttribute('filter');
                });
                
            }
            else {
                $newItem.hide();
                _this.enableButtons();
            }
            
        });
    }
    
    
    /**
     * returns true iff all the items have been displayed
     */
    this.areAllItemsDisplayed = function(){
        return $(_this.getActiveTabSelector()).find(".news-item:last").is(':visible');
    }
    
    
    /**
     * returns true iff the last item is visible and on screen
     */
    this.isLastItemOnScreen = function(){
        return $(_this.getActiveTabSelector()).find(".news-item:last").position()["top"] <= $("#footer").position()["top"];
    }
    
    
    return true;
}

// inherit from superclass
SpyNewsViewer.prototype = newsViewerPrototype;


/**
 * news style that slides from left to right
 * @param {Object} options
 */
function SideSliderNewsViewer(options){
    // set options - note that the interval is calculated automatically
    SideSliderNewsViewer.prototype.setOptions(options);
    this.options["animationDelay"] = this.options["animationDelay"] || 800;
    this.options["interval"] = 4000;
    this.options["intervalPerItem"] = this.options["intervalPerItem"] || 3200;
    this.options["pagingType"] = "dynamic";
    
    // save the context
    var _this = this;
    
    this.showNews = function(options){
        // call the super class method
        SideSliderNewsViewer.prototype.showNews(options);
        
		this.showButtons();
		
        // only act if the relevant tab is currently active
        var isTabActive = _this.getActiveTabSelector() == "#" + options["tabId"];
        
        if (isTabActive) {
            _this.createPaging();
            
            // show the next piece of news immediately, because they are all hidden
            var numOfItems = _this.showNext();
            
            // set the rotation interval according to the number of items
            _this.setInterval(numOfItems);
        }
        
    }
    
    
    this.showNext = function(didClick){
        return _this.showNextPrev("next", didClick);
    }
    
    
    this.showPrev = function(didClick){
        _this.showNextPrev("prev", didClick);
    }
    
    
    /**
     * helper function that can display the next or previous items
     * @param nextOrPrev {string} either "next" or "prev"
     * @param didClick {boolean} true iff the user didClick prev/next
     */
    this.showNextPrev = function(nextOrPrev, didClick){
        var $activeTab = $(_this.getActiveTabSelector());
        var isNext = nextOrPrev == "next";
        var animationDelay = _this.getAnimationDelay(didClick);
        
        // disable buttons until further notice
        _this.disableButtons();
        
        // measure sizes and positions
        var $itemWrapper = $activeTab.find(".news-item-wrapper");
        var wrapperTop = $itemWrapper.position()["top"];
        var wrapperWidth = parseInt($itemWrapper.width());
        
        // get current items in display
        var currentItems = $activeTab.find(".news-item.current");
        
        // get the next/previous items according to the available height
        var nextItems = isNext ? _this.getNextItems() : _this.getPrevItems();
        var $nextItem = $(nextItems[0]);
        var itemWidth = wrapperWidth - parseInt($nextItem.css("padding-left")) - parseInt($nextItem.css("padding-right"));
        
        var allItems = $activeTab.find(".news-item");
        
        // all items are in display in one go - end it here, or it gets messy
        if ((nextItems.length == allItems.length) && (currentItems.length == nextItems.length)) 
            return;
        
        // remove 'current' class from the current items before animating them
        $(currentItems).each(function(){
            $(this).removeClass("current")
        });
        
        // set style for the new items and display them
        var top = wrapperTop;
        var left = isNext ? (-wrapperWidth) + "px" : (wrapperWidth + 10) + "px";
        
        $(nextItems).each(function(){
            // special handling for the more items link
            if ($(this).hasClass("more-items")) {
                top = (wrapperTop + $itemWrapper.height()) / 2 + top / 2 - $(this).height();
            }
            
            $(this).css({
                position: "absolute",
                top: top + "px",
                left: left,
                width: itemWidth
            }).show();
            
            // set the new top
            top = top + parseInt($(this).outerHeight());
        });
        
        // slide the current items way out of view
        left = isNext ? wrapperWidth + 10 : (-wrapperWidth);
        
        $(currentItems).each(function(){
            $(this).animate({
                left: left
            }, animationDelay, "swing", function(){
                $(this).hide();
            });
        });
        
        // slide the new items into view
        var areButtonsEnabled = false;
        
        $(nextItems).each(function(){
            $(this).animate({
                left: 0
            }, animationDelay, "swing", function(){
                // apply the 'current' class label to them after the animation is complete
                $(this).addClass("current");
                
                // enable the buttons again
                if (!areButtonsEnabled) {
                    areButtonsEnabled = true;
                    _this.enableButtons();
                }
                
            });
        });
        
        // return how many items fit it - useful for interval calculations
        return nextItems.length;
    }
    
    
    /**
     * sets the rotation interval depending on the number of items in display
     * @param {Object} numOfItems
     */
    this.setInterval = function(numOfItems){
        if (numOfItems > 0) {
            var logOfItems = Math.log(numOfItems + 1) / Math.log(2);
            var interval = Math.floor(logOfItems * this.options["intervalPerItem"]);
            this.options["interval"] = interval;
        }
        
        // new interval was just set - restart the rotation if the widget is indeed a-rotating
        if (this.isRotating()) {
            this.stopRotation();
            this.startRotation();
        }
    }
    
    
    return true;
}

// inherit from superclass
SideSliderNewsViewer.prototype = newsViewerPrototype;


/**
 * ticker style news style
 * @param {Object} options
 */
function TickerNewsViewer(options){
    // set options 
    TickerNewsViewer.prototype.setOptions(options);
    this.options["interval"] = this.options["interval"] || 4000;
    this.options["animationDelay"] = this.options["animationDelay"] || 400;
    this.options["numOfItems"] = parseInt(this.options["numOfItems"]) || 1;
    this.options["pagingType"] = "constant";
    
    var _this = this;
    
    this.showNews = function(options){
        // call the super class method
        TickerNewsViewer.prototype.showNews(options);
        this.createPaging();
        
		this.showButtons();
		
        // show the next piece of news immediately, because they are all hidden
        this.showNext();
        
    }
    
    
    this.showNext = function(didClick){
        _this.showNextPrev("next", didClick);
        
    }
    
    
    /**
     * shows the previous news item
     */
    this.showPrev = function(didClick){
        _this.showNextPrev("prev", didClick);
    }
    
    
    /**
     * helper function for showing next/previous items
     * @param nextOrPrev {string} either "next" or "prev" for the relevant item
     * @param didClick {boolean} true iff the user didClick prev/next
     * @param numOfItems {integer} the number of items to display in each showing, 1 by default
     */
    this.showNextPrev = function(nextOrPrev, didClick){
    
        var showNext = nextOrPrev == "next";
        var animationDelay = _this.getAnimationDelay(didClick);
        
        _this.disableButtons();
        
        // grab the current news items in display
        var $currItems = $(".news-item:visible");
        
        // no current item - it's the very start of the viewer, pretend as though the last item is current
        if ($currItems.length == 0) {
            $currItems = $(".news-item:last");
        }
        
        // grab the next/prev news items
        var $nextPrevItems = showNext ? _this.getNextItems() : _this.getPrevItems();
        
        // fade out the current piece of news
        $currItems.fadeOut(animationDelay, function(){
            // now fade in the next piece of news
            $nextPrevItems.fadeIn(animationDelay, function(){
                _this.enableButtons();
            });
        });
    }
    
    
    
    /**
     * override the superclass set size method
     * @param {Object} width
     * @param {Object} height
     */
    this.setSize = function(width, height){
        // set heights - parsing to int seems to save some bugs
        var heightInt = parseInt(height);
        $("#wrapper").height(heightInt);
        
        // don't count border pixels
        heightInt = heightInt - 2;
        $("#header").height(heightInt);
        $(".news").height(heightInt);
        $("#footer").height(heightInt);
        
        // header width
        var headerWidth = parseInt($("#title").outerWidth()) + parseInt($("#header .feedzilla-logo").outerWidth()) +
        this.cssToInt($(".ticker #header #title").css("padding-left"));
        $("#header").width(headerWidth);
        
        // main body width is the total width minus the header and a tiny correction
        var newsWidth = parseInt(width) - parseInt($("#header").outerWidth()) - 2;
        
		// non ie browsers - need to decrease the news height a little more
		if (typeof $.browser.msie == "undefined") {
			newsWidth = newsWidth - 2;
		}

		$(".news").width(newsWidth);
        
        var buttonsWidth = parseInt($(".news .buttons").width());
        var wrapperWidth = newsWidth - buttonsWidth
        $(".news-item-wrapper").width(wrapperWidth);
        
        // set the news text width - otherwise the share buttons are not shown
        var shareWidth = this.cssToInt($(".secret .news-item-share").css("width"));
        var textWidth = wrapperWidth - shareWidth - this.cssToInt($(".empty-news-item").css("padding-left")) - 10;
        var css = ".ticker .news-item-text, .ticker .news-item-title, .ticker .news-item-caption { width: " + textWidth + "px}";
        this.loadDynamicCss(css);
        
    }
    
    
}

// inherit from superclass
TickerNewsViewer.prototype = newsViewerPrototype;

// END OF news.js


// START OF iframe.js

// this section is outside document.ready only to load a custom stylesheet before the rest of the code runs
// otherwise the widget appears jumpy (defect #487)
try {

    function init(){
        initGlobals();
        getOptions();
        loadStyleSheets();
    }
    
    /**
     * adds global variables and jquery functions
     */
    function initGlobals(){
		if (typeof window.FEEDZILLA == "undefined") 
			window.FEEDZILLA = new Object();

        FEEDZILLA.noSelection = "-";
        
        // add center screen jquery function
        jQuery.fn.center = function(){
            this.css("position", "absolute");
            this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
            this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
            return this;
        }
    }
    
    
    /**
     * gets the options from the querystring, removes suspicious characters
     * and sets them globally in the feedzilla namespace
     */
    function getOptions(){
        // get the query string
        var options = {};
        
        // get query string and split according to ampersands
        var querystring = location.search.substring(1);
        var sections = querystring.split('&');
        
        // iterate over sections
        for (var i in sections) {
            // split section to param and value
            var section = sections[i].split('=');
            options[section[0]] = decode(section[1]);
        }
        
        // set the options globally
        FEEDZILLA.options = options;
        
    }
    
    
    /**
     * loads stylesheets before $(document).ready
     */
    function loadStyleSheets(){
		
        // load jQuery UI stylesheet
        if (FEEDZILLA.options["theme"]) {
            var styleSheetUrl = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/themes/" +
            FEEDZILLA.options["theme"] +
            "/jquery-ui.css";
            loadStyleSheet(styleSheetUrl);
        }
        
        // load a custom stylesheet, if available. need to do it here before the $(document).ready
        if (FEEDZILLA.options["customStyleSheet"]) {
            loadStyleSheet(FEEDZILLA.options["customStyleSheet"]);
        }
        
    }
    
    
    /**
     * loads a single stylesheet dynamically
     * @param {Object} url
     */
    function loadStyleSheet(href){
        $("<link rel='stylesheet' type='text/css' href='" + href + "' />").appendTo("head");
    }
    
    
    /**
     * helper function that url decodes a string with the best function available
     * @param {Object} str
     */
    function decode(str){
        var decode = typeof decodeURIComponent != 'undefined' ? decodeURIComponent : unescape;
        
        return decode(str);
    }
    
    
    // run the bastard
    init();
    
    
} 
catch (error) {
    if (typeof console != "undefined" && typeof console.log != "undefined" && typeof error != "undefined") 
        console.log(error);
}



$(document).ready(function(){

    // start it up!
    try {
        loadNewsViewer();
    } 
    catch (error) {
        if (typeof console != "undefined" && typeof console.log != "undefined" && typeof error != "undefined") 
            console.log(error);
    }
    
    
    /** 
     * loads the relevant news viewer
     */
    function loadNewsViewer(){
        var newsViewer;
        
        switch (FEEDZILLA.options["style"]) {
            case "slide-left-to-right":
                newsViewer = new SideSliderNewsViewer();
                break;
            case "ticker":
                // pass a custom number of items parameter, useful for tvsquad
                var numOfItems = FEEDZILLA.options["numOfItems"] || '1';
                newsViewer = new TickerNewsViewer({
                    numOfItems: numOfItems
                });
                break;
            default:
                newsViewer = new SpyNewsViewer();
        }
        
        // add some more options to pass to the controller
        FEEDZILLA.options["titleOnly"] = true;
        FEEDZILLA.options["viewer"] = newsViewer;
        FEEDZILLA.options["apiUrl"] = "http://api.feedzilla.com/v1/";
        FEEDZILLA.options["width"] = FEEDZILLA.options["w"];
        FEEDZILLA.options["height"] = FEEDZILLA.options["h"];
        
        // prepare the controller
        var newsController = new NewsController(FEEDZILLA.options);
        
        // get the controller running
        newsController.run();
        
    }
    
});
