(function ($, window, document)
{
    function AdminPanel(options)
    {
        this.options =
        {
            maxTabNums: options.maxTabNums || 20, // 最大tab页面上数目
            currentTabNums: 1, // 当前tab数目
            callback: options.callback || function ()  {}
            // 回调函数
        };
        this.resizeWindow();
        this.addListener();
    }
    AdminPanel.prototype =
    {
        constructor: AdminPanel,
        resizeWindow: function ()
        {
            if ($(window).width() >= 1024)
            {
                $('.sidebar-nav').css("height", $(window).height() - 56 - 50 - $('.user-panel').height() + "px");
                $('.left-sidebar').css("height", $(window).height() - 56 + "px");
                $('.app-widget').css("height", $(window).height() - 56 + "px");
            }
        },
        addListener: function ()
        {
            var that = this;
            $(window).resize(function ()
            { //当浏览器大小变化时
                that.resizeWindow();
            }
            );

            // // left-side 打开链接
            $(document).on('click', 'a[data-href]', function ()
            {
                var dataHref = $(this).attr('data-href');
                var dataTitle = $(this).text();
                that.activeMenu(dataHref);
                that.createTab(dataHref, dataTitle);
            }
            );

            // tab-item关闭
            $(document).on('click', 'i.tab-item-close', function ()
            {
                var href = $(this).parent().attr('data-href');
                that.closeTab(href);
            }
            );

            // tab-item-close control关闭
            $(document).on('click', 'a.tab-item-close', function ()
            {
                if ( $(this).hasClass('tab-item-current') ) {
                  that.closeCurrentTab();
                }
                if ( $(this).hasClass('tab-item-other') ) {
                  that.closeOtherTab();
                }
                if ( $(this).hasClass('tab-item-all') ) {
                  that.closeAllTab();
                }
            }
            );

            // tab-control点击
            $(document).on('click', 'div.tab-control', function ()
            {
                if ($(this).hasClass('icon-prev'))
                {
                    that.rollTab("prev");
                }
                if ($(this).hasClass('icon-next'))
                {
                    that.rollTab("next");
                }
                // if ($(this).hasClass('icon-next'))
            }
            );

            // left-side 打开
            $(document).on('click', '.sub-title', function ()
            {
                that.openMenu(this);
            }
            );

            // 选择页面事件绑定
            $(document).on('click', '.tab-list ul li.tab-item', function ()
            {
                var href = $(this).attr('data-href');
                that.switchTab(href);
                that.activeMenu(href);
            }
            );

            // 侧边栏菜单
            $(document).on('click', '.header .switch-btn',function ()
            {
                if ($('.left-sidebar').is('.close'))
                {
                    if ($(window).width() > 1024)
                    {
                        $('.right-content').removeClass('active');
                    }
                    $('.left-sidebar').removeClass('close');
                }
                else
                {
                    $('.left-sidebar').addClass('close');
                    if ($(window).width() > 1024)
                    {
                        $('.right-content').addClass('active');
                    }
                }
            }
            )
        },
        activeMenu: function (href)
        {
            $('a[data-href].active').removeClass('active');
            $('a[data-href="' + href + '"]').addClass('active');
        },
        createTab: function (dataHref, dataTitle)
        {
            var tabElem = $('.tab-list .tab-item[data-href="' + dataHref + '"]');
            var bodyElem = $('.app-widget-bodys div.body-item[data-href="' + dataHref + '"]');
            if (tabElem.length && bodyElem.length)
            {
                this.switchTab(dataHref);
                return;
            }
            (!dataTitle) && (dataTitle = "标签页");
            if (this.options.currentTabNums >= this.options.maxTabNums)
            {
                console.log("上限，创建失败");
            }
            else
            {
                var tabElem = $('.tab-list ul').append('<li class="tab-item tab-active" data-href=' + dataHref + '> <span>' + dataTitle + '</span> <i class="tab-item-close am-icon-close"></i></li>');
                var bodyElem = $('.app-widget-bodys').append('<div class="body-item body-show" data-href=' + dataHref + '> <iframe class="body-iframe" src="' + dataHref + '"></iframe> </div>');
                this.switchTab(dataHref);
                this.options.callback(tabElem, bodyElem);
            }
        },
        closeTab: function (dataHref)
        {
            var tabElem = $('.tab-list ul li[data-href="' + dataHref + '"]');
            var bodyElem = $('.app-widget-bodys div.body-item[data-href="' + dataHref + '"]');
            if (tabElem.hasClass('tab-active'))
            {
                var href = tabElem.prev().attr('data-href');
                this.switchTab(href);
            }
            tabElem.remove();
            bodyElem.remove();
            this.options.callback(tabElem, bodyElem);
        },
        closeCurrentTab: function() {
          var dataHref = $('tab-list li.tab-active').attr('data-href');
          this.closeTab(dataHref);
        },
        closeOtherTab: function() {
          var that = this;
          $('.tab-list li.tab-item').each(function(index) {
            if (!index && !$(this).hasClass('tab-active') ) {
              var dataHref = $(this).attr('data-href');
              that.closeTab(dataHref);
            }
          });
        },
        closeAllTab: function() {
          var that = this;
          $('.tab-list li.tab-item').each(function(index) {
            if (!index) {
              var dataHref = $(this).attr('data-href');
              that.closeTab(dataHref);
            }
          });
        },
        switchTab(dataHref)
        {
            var tabElem = $('.tab-list .tab-item[data-href="' + dataHref + '"]');
            var bodyElem = $('.app-widget-bodys div.body-item[data-href="' + dataHref + '"]');
            if (tabElem.length && bodyElem.length)
            {
                $('.tab-list li.tab-item').removeClass('tab-active');
                $('.tab-list li.tab-item[data-href="' + dataHref + '"]').addClass('tab-active');
                $('.app-widget-bodys div.body-item').removeClass('body-show');
                $('.app-widget-bodys div.body-item[data-href="' + dataHref + '"]').addClass('body-show');
                this.rollTab("auto");
                this.options.callback(tabElem, bodyElem);
            }
        },
        rollTab: function (direct)
        {
            var ulElem = $('.tab-list ul');
            var liElem = ulElem.children('li');
            var width = (ulElem.prop("scrollWidth"), ulElem.outerWidth());
            var toLeft = parseFloat(ulElem.css('left'));
            if (direct == "prev")
            {
                if (toLeft == 0)
                {
                    return;
                }
                var right = -toLeft - width;
                liElem.each(function ()
                {
                    var scrollWidth = $(this).position().left;
                    if (scrollWidth >= right)
                    {
                        ulElem.css('left', -scrollWidth);
                        return false;
                    }
                }
                );
            }
            if (direct == "next")
            {
                liElem.each(function ()
                {
                    var current_x = $(this).position().left;
                    if (current_x + liElem.outerWidth() >= width - toLeft)
                    {
                        ulElem.css("left", -current_x);
                        return false;
                    }
                }
                );
                return;
            }
            if (direct == "auto")
            {
                var activeElem = $('.tab-list .tab-item.tab-active');
                if (activeElem.position().left < -toLeft)
                {
                    ulElem.css('left', -activeElem.position().left);
                }
                if (activeElem.position().left + activeElem.outerWidth() >= width - toLeft)
                {
                    ulElem.each(function ()
                    {
                        var current_x = $(this).position().left;
                        if (current_x + toLeft > 0 && width - toLeft > current_x)
                        {
                            ulElem.css("left", -current_x);
                            return false;
                        }
                    }
                    );
                }
                return;
            }
        },
        openMenu: function (elem)
        {
            $(elem).siblings('.sub').slideToggle(80)
            .end()
            .find('.sub-ico').toggleClass('sub-ico-rotate');
        }
    }
    $.fn.AdminPanel = function (options)
    {
        return new AdminPanel(options);
    }
}
)(jQuery, window, document);
