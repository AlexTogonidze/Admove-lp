(function ($, window, document, undefined) {

    /* ================================
    ===  VARIABLES                 ====
    =================================== */
    var $win = $(window);
    var $doc = $(document);
    var winW, winH, winTop, scrollSpy;
    var $html, $fhElements, $hhElements, $fsContainers,
        $gallery, $sliders, $testimonials, $carousels,
        $videoLinks, $photoLinks, $animatables, $counters,
        $logo;


    /* ================================
    ===  PRE LOADING EFFECT  	   ====
    =================================== */
    $win.load(function () {

        $(".preloader-text").addClass('pre-animate');

        // will first fade out the loading animation
        $(".status").delay(2000).fadeOut();

        // will fade out the whole DIV that covers the website.
        $(".preloader").delay(2500).fadeOut("fast");
    });



    /* ================================
    ===  DOC READY and CORE JS     ====
    =================================== */
    $doc.ready(function () {

        winW = $win.width();
        winH = $win.height();
        winTop = $win.scrollTop() + winH;

        scrollSpy = new ScrollSpy({
            linksContainerSelector: '#scroll-spy',
            sectionSelector: '.section:not(.section-intro):not(.section-download-alt):not(.section-gallery)'
        });

        scrollSpy.init();

        $html = $('html');
        $fhElements = $('.section, .section-body, .slider-intro .slide');
        $hhElements = $('.half-height');
        $fsContainers = $('[data-fs-container]');
        $sliders = $('.slider-intro ul, .slider-about ul');
        $gallery = $('.gallery ul');
        $carousels = $('.carousel');
        $videoLinks = $('.link-video');
        $photoLinks = $('.link-photo');
        $animatables = $('.slide-from-bottom, .slide-from-right, .slide-from-left, .slide-from-top, .fade-in');
        $counters = $('.counter span[data-number]');
        $logo = $('.logo');

        $html.toggleClass('mobile-device', $.browser.mobile);

        $logo.on('click', function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });



        $win.on('load resize', function (event) {
            winW = $win.width();
            winH = $win.height();

            fullHeightSections($fhElements);
            halfHeightSections($hhElements);

            if (event.type === 'load') {
                $gallery.isotope({
                    itemSelector: '.gallery-item',
                    layoutMode: 'packery'
                }).addClass('gallery-loaded');
            } else {
                setTimeout(function () {
                    $gallery.isotope('layout');
                }, 700);
            }

            scrollSpy.refreshPositions();
        });



        $gallery.on('arrangeComplete', function () {
            scrollSpy.refreshPositions();
        });



        $win.on('load resize scroll', function () {
            winTop = $win.scrollTop() + winH;

            if (winW >= 768) {
                $animatables.each(function () {
                    var $animatable = $(this);

                    if (!$animatable.hasClass('in-viewport') && inViewport($animatable)) {
                        $animatable.addClass('in-viewport');
                    }
                });
            }

            $counters.each(function () {
                var $counter = $(this);

                if (!$counter.hasClass('in-viewport') && inViewport($counter)) {
                    $counter.addClass('in-viewport');

                    var countUp = new CountUp($counter);
                    countUp.init();
                }
            });

            $carousels.each(function () {
                var $carousel = $(this);

                if (!$carousel.hasClass('in-viewport') && inViewport($carousel)) {
                    $carousel.addClass('in-viewport');
                }
            });
        });

        fullHeightSections($fhElements);
        halfHeightSections($hhElements);
        fullscreenBackgrounds($fsContainers);

        $sliders.owlCarousel({
            singleItem: true,
            slideSpeed: 600,
            paginationSpeed: 600,
            rewindSpeed: 1000,
            autoPlay: true,
        });

        $('.slider-intro ul').data('owlCarousel').play();

        $testimonials = $('.slider-testimonials ul').owlCarousel({
            itemsMobile: [479, 1],
            itemsTablet: false,
            itemsDesktopSmall: [992, 2],
            itemsDesktop: false,
            items: 2,
            slideSpeed: 600,
            rewindSpeed: 1000,
            autoPlay: false,
            pagination: false
        }).data('owlCarousel');

        var $testimonialsPrev = $('.link-prev');
        var $testimonialsNext = $('.link-next');

        $testimonialsPrev
            .on('click', function (event) {
                event.preventDefault();

                $testimonials.prev();
            });

        $testimonialsNext
            .on('click', function (event) {
                event.preventDefault();

                $testimonials.next();
            });

        if ($carousels.length) {
            $carousels.each(function () {
                var $carousel = $(this).find('ul');
                var $items = $carousel.find('li');

                var carousel = new Carousel({
                    $container: $carousel,
                    $items: $items
                });
            });
        }

        $videoLinks
            .magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 300,
                callbacks: {
                    open: function () {
                        $('.slider-intro ul').data('owlCarousel').stop();
                    }
                }
            });

        $photoLinks
            .magnificPopup({
                type: 'image',
                mainClass: 'mfp-with-zoom',
                removalDelay: 300,
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: 'ease-in-out',
                    opener: function (openerElement) {
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                    }
                },
                gallery: {
                    enabled: true
                }
            });


        var mainHeader = $('.header'),
            headerHeight = mainHeader.height();

        //set scrolling variables
        var scrolling = false,
            previousTop = 0,
            currentTop = 0,
            scrollDelta = 0,
            scrollOffset = 150;

        $(window).on('scroll', function () {
            if (!scrolling) {
                scrolling = true;
                (!window.requestAnimationFrame) ? setTimeout(autoHideHeader, 250): requestAnimationFrame(autoHideHeader);
            }
        });

        $(window).on('resize', function () {
            headerHeight = mainHeader.height();
        });

        function autoHideHeader() {
            var currentTop = $(window).scrollTop();

            checkDirection(currentTop);

            previousTop = currentTop;
            scrolling = false;
        }

        function checkDirection(currentTop) {

            if (previousTop - currentTop > scrollDelta) {
                //if scrolling up...
                mainHeader.removeClass('is-hidden');
            } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
                //if scrolling down...
                mainHeader.addClass('is-hidden');
            }
        }

    });





    /* ================================
    ===  HELPER FUNCTIONS          ====
    =================================== */

    function tvla() {
        $('.mtvleli').each(function () {
            var $this = $(this),
                countTo = $this.attr('data-count');

            $({
                countNum: $this.text()
            }).animate({
                    countNum: countTo
                },

                {

                    duration: 20000,
                    easing: 'linear',
                    step: function () {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $this.text(this.countNum);
                        //alert('finished');
                    }

                });



        });
    }

    $(window).on('scroll', function () {
        var y_scroll_pos = window.pageYOffset;
        var scroll_pos_test = 4200; // set to whatever you want it to be
       
        
        if (y_scroll_pos > scroll_pos_test) {
            tvla();
        }
    });






    function fullHeightSections($sections) {
        $sections.each(function () {
            var $section = $(this);

            $section.css({
                height: 'auto',
                minHeight: 0
            });

            if ($section.hasClass('section') && $section.find('.gallery').length === 0 && !$section.hasClass('section-download')) {
                $section.css({
                    minHeight: winH
                });
            } else if ($section.find('.gallery').length === 0) {
                if (winH <= 568 && $section.outerHeight() <= winH && !$section.hasClass('slide')) {
                    $section.css({
                        height: $section.outerHeight()
                    });
                } else if (winH <= 568 && $section.find('.container:eq(0)').outerHeight() >= winH && !$section.hasClass('slide')) {
                    $section.css({
                        height: $section.find('.container:eq(0)').outerHeight() + 40
                    });
                } else if (winW >= 600 && !$section.hasClass('section-download') && !$section.parents('.section-download').length || winW <= 568 && $section.hasClass('slide') || winW >= 600 && $section.hasClass('section-download-alt') || winW >= 600 && $section.parents('.section-download-alt').length || winW >= 992 && $section.hasClass('section-download') || winW >= 992 && $section.parents('.section-download').length) {
                    $section.css({
                        height: winH
                    });
                }
            }
        });
    }



    function halfHeightSections($sections) {
        $sections.each(function () {
            var $section = $(this);

            if (winW >= 768) {
                $section.css({
                    height: winH / 2
                });
            } else {
                $section.removeAttr('style');
            }
        });
    }



    function fullscreenBackgrounds($containers) {
        $containers.each(function () {
            var $container = $(this);
            var $image = $container.find('[data-fs-image]');

            $container.addClass('fs-background').css({
                backgroundImage: 'url(' + $image.attr('src') + ')'
            });

            $image.remove();
        });
    }






    /* ================================
    ===  GOOGLE MAP AND STYLE      ====
    =================================== */

    var mapStyle = [
        {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#6b6b6b'
				}
			]
		},
        {
            featureType: 'all',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#525252'
				}
			]
		},
        {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#848484'
				}
			]
		},
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#848484'
				}
			]
		},
        {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#333333'
				}
			]
		},
        {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    visibility: 'off'
				}
			]
		},
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off'
				}
			]
		},
        {
            featureType: 'transit',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off'
				}
			]
		}
	];


    function initMaps() {
        var geocoder = new google.maps.Geocoder();

        var $maps = $('.map');

        if ($maps.length) {
            $maps.each(function () {
                var map = this;
                var $map = $(this);
                var address = $map.data('address');
                var latLng, gMap, pin;

                geocoder.geocode({
                    'address': address
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                    } else {
                        console.log("Geocoding unsuccessful. Reason: " + status);

                        latLng = new google.maps.LatLng(48.104786, 16.049149);
                    }

                    var styledMap = new google.maps.StyledMapType(mapStyle, {
                        name: 'Styled Map'
                    });

                    gMap = new google.maps.Map(map, {
                        center: latLng,
                        zoom: 17,
                        disableDefaultUI: true
                    });

                    gMap.mapTypes.set('map_style', styledMap);
                    gMap.setMapTypeId('map_style');

                    pin = new google.maps.Marker({
                        position: latLng,
                        map: gMap,
                        icon: 'images/google-map/map-pin.png'
                    });
                });
            });
        }
    }

    window.initMaps = initMaps;





    /* ================================
    ===  Carousel                  ====
    =================================== */
    // Dependencies: jQuery, owl.carousel

    function Carousel(options) {
        this.$container = options.$container;
        this.$items = options.$items;

        this.$win = $(window);

        this.currentItem = 0;
        this.mode = 'mobile';

        this.mobileInit = false;
        this.desktopInit = false;

        this.animating = false;

        this.firstInit = true;

        this.bind();

        this.determineMode();

        this.init();
    }

    Carousel.prototype.determineMode = function () {
        var _this = this;

        if (_this.$win.width() > 767) {
            _this.mode = 'desktop';
        } else {
            _this.mode = 'mobile';
        }
    }

    Carousel.prototype.init = function () {
        var _this = this;

        if (_this.mode === 'mobile') {
            if (_this.desktopInit) {
                _this.cleanupDesktop();
            }

            _this.rearrange();

            _this.currentItem -= 2;

            if (_this.currentItem < 0) {
                _this.currentItem = 0;
            }

            _this.$container.owlCarousel({
                singleItem: true,
                slideSpeed: 600,
                rewindSpeed: 1000,
                autoPlay: false,
                pagination: false,
                mouseDrag: true,
                afterMove: function (event, data) {
                    _this.currentItem = _this.$container.data('owlCarousel').currentItem;
                }
            });

            _this.$container.data('owlCarousel').goTo(_this.currentItem);

            _this.bindMobile();
        }

        if (_this.mode === 'desktop') {
            if (_this.mobileInit) {
                _this.cleanupMobile();
            }

            _this.rearrange();

            _this.currentItem += 2;

            if (_this.currentItem > _this.$items.length - 1) {
                _this.currentItem = _this.$items.length - 1;
            }

            _this.goToSlide(_this.currentItem);

            _this.bindDesktop();
        }

        _this.firstInit = false;
    }

    Carousel.prototype.bind = function () {
        var _this = this;

        _this.$win.resize(function () {
            _this.determineMode();

            if (_this.mobileInit && _this.mode === 'desktop' || _this.desktopInit && _this.mode === 'mobile') {
                _this.init();
            }
        });
    }

    Carousel.prototype.bindMobile = function () {
        var _this = this;

        _this.mobileInit = true;
    }

    Carousel.prototype.bindDesktop = function () {
        var _this = this;

        _this.$items.on('click.carousel', function (event) {
            event.preventDefault();

            var idx = $(this).index();

            _this.currentItem = idx;

            _this.goToSlide(idx);
        });

        _this.desktopInit = true;
    }

    Carousel.prototype.cleanupMobile = function () {
        var _this = this;

        _this.$container.data('owlCarousel').destroy();

        _this.mobileInit = false;
    }

    Carousel.prototype.cleanupDesktop = function () {
        var _this = this;

        _this.desktopInit = false;
    }

    Carousel.prototype.rearrange = function () {
        var _this = this;
        var $container = _this.$container;
        var $items = _this.$items;

        if (_this.mode === 'desktop') {
            for (var i = 0; i < $items.length; i++) {
                if (i === $items.length - 1) {
                    var $item = $items.eq(i);

                    $container.prepend($item.prev());
                    $container.prepend($item);
                }
            }
        } else if (!_this.firstInit && _this.mode === 'mobile') {
            for (var i = 0; i < $items.length; i++) {
                if (i < 2) {
                    var $item = $items.eq(i);

                    $container.append($item);
                }
            }
        }

        _this.$items = $container.find('li');
    }

    Carousel.prototype.goToSlide = function (index) {
        var _this = this;
        var $items = _this.$items;

        _this.$items.each(function (i) {
            var $item = $(this);

            $item.attr('class', '');

            if (i === index - 2) {
                $item.addClass('carousel-item1');
            }

            if (i === index - 1) {
                $item.addClass('carousel-item2');
            }

            if (i === index) {
                $item.addClass('carousel-item3');
            }

            if (i === index + 1) {
                $item.addClass('carousel-item4');
            }

            if (i === index + 2) {
                $item.addClass('carousel-item5');
            }
        });
    }



    /* ================================
    ===  COUNT UP                  ====
    =================================== */

    function CountUp($item) {
        this.$item = $item;

        this.start = 0;
        this.end = $item.data('number');

        this.current = this.start;

        this.time = 1500;
        this.speed = this.end / this.time;

        this.int = null;
    }

    CountUp.prototype.init = function () {
        var _this = this;

        _this.int = setInterval(function () {
            _this.current++;

            _this.$item.text(_this.current);

            if (_this.current === _this.end) {
                clearInterval(_this.int);
            }
        }, this.speed);
    }



    /* ================================
    === CHECK IN VIEWPORT          ====
    =================================== */

    function inViewport($item) {
        if ($item.hasClass('slide-from-top') || $item.hasClass('slide-from-bottom')) {
            return winTop >= $item.offset().top - $item.height() / 2;
        } else {
            return winTop >= $item.offset().top;
        }
    }




    /* ================================
    ===  SCROLLSPY CORE FUNCTIONS  ====
    =================================== */
    var ScrollSpy = function (options) {
        var _spy = this;

        _spy.linksContainerSelector = options.linksContainerSelector;
        _spy.sectionSelector = options.sectionSelector;

        _spy.$linksContainer = $(_spy.linksContainerSelector);
        _spy.$links = _spy.$linksContainer.find('a');
        _spy.$sections = $(_spy.sectionSelector);
        _spy.headerOffset = options.headerOffset;

        _spy.current;
        _spy.data = {};
    };

    ScrollSpy.prototype.getPositions = function () {
        var _spy = this;
        var data = _spy.data;

        _spy.$links.each(function () {
            var $link = $(this);
            var $section = $($link.attr('href'));

            data[$section.attr('id')] = $section.offset().top;
        });
    };

    ScrollSpy.prototype.refreshPositions = function () {
        var _spy = this;
        var data = _spy.data;

        _spy.$links.each(function () {
            var $link = $(this);
            var $section = $($link.attr('href'));

            data[$section.attr('id')] = $section.offset().top;
        });
    };

    ScrollSpy.prototype.getCurrentSection = function () {
        var _spy = this;
        var data = _spy.data;
        var scrollTop = $(window).scrollTop();

        for (var section in data) {
            var $currentSection = $('#' + section);
            var $nextSection = $currentSection.next('.section');

            if (scrollTop >= $currentSection.offset().top - winH / 5 && $nextSection.length > 0 && $nextSection.offset().top >= scrollTop || scrollTop >= $currentSection.offset().top - winH / 5 && $nextSection.length === 0) {
                _spy.current = '#' + section;
            }
        }

        _spy.setCurrent();
    };

    ScrollSpy.prototype.setCurrent = function () {
        var _spy = this;

        _spy.$links.parents('ul:eq(0)').find('.active').removeClass('active');

        if (_spy.$linksContainer.find('a[href="' + _spy.current + '"]').length) {
            _spy.$linksContainer.find('a[href="' + _spy.current + '"]').addClass('active');
        }
    };

    ScrollSpy.prototype.scrollToCurrentSection = function () {
        var _spy = this;

        var $section = $(_spy.current);
        var newTop = $section.offset().top;

        if (winW < 768) {
            newTop += $('.header').height();
        } // else {
        // 	newTop -= 62;
        // }

        $('html, body').animate({
            scrollTop: newTop
        }, {
            duration: 700,
            queue: false
        });
    };

    ScrollSpy.prototype.bindEvents = function () {
        var _spy = this;

        _spy.$links
            .on('click.scrollSpy', function (e) {
                e.preventDefault();

                _spy.current = $(this).attr('href');
                _spy.scrollToCurrentSection();

                if ($('.navbar-collapse').hasClass('in')) {
                    $('.navbar-toggle').trigger('click');
                }
            });

        $win.on('scroll.scrollSpy', function () {
            _spy.getCurrentSection();
        });
    };

    ScrollSpy.prototype.init = function () {
        var _spy = this;

        _spy.getPositions();
        _spy.getCurrentSection();
        _spy.setCurrent();
        _spy.bindEvents();
    };


    /* ================================
	===  CONTACT FORM              ====
	=================================== */

    $("#contact-form").submit(function (e) {
        e.preventDefault();
        var name = $("#name").val();
        var email = $("#email").val();
        var message = $("#message").val();
        var dataString = 'name=' + name + '&email=' + email + '&message=' + message;

        function isValidEmail(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };

        if (isValidEmail(email) && (message.length > 1) && (name.length > 1)) {
            $.ajax({
                type: "POST",
                url: "sendmail.php",
                data: dataString,
                success: function () {
                    $('.success').fadeIn(1000);
                    $('.error').fadeOut(500);
                }
            });
        } else {
            $('.error').fadeIn(1000);
            $('.success').fadeOut(500);
        }

        return false;
    });

})(jQuery, window, document);