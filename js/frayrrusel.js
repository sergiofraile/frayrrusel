Frayrrusel = function(){

    this.config = {
        initTransformFactor: 1,
        transformDelay: 0.1,
        initTop: 0,
        topDelay: 100,
        initRotation: -40,
        initMinRotation: -20,
        rotationDelay: 0,
        initWidth: 400,
        widthDelay: 0,
        initMarginLeft: 0,
        marginLeftDelay: 0,
        animatdMarginTop: -40,
        animationTime: 200
    };

    this.mains = {};

    this.setOptions = function(options) {
        this.setOption(options, 'initTransformFactor');
        this.setOption(options, 'transformDelay');
        this.setOption(options, 'initTop');
        this.setOption(options, 'topDelay');
        this.setOption(options, 'initRotation');
        this.setOption(options, 'rotationDelay');
        this.setOption(options, 'initWidth');
        this.setOption(options, 'widthDelay');
        this.setOption(options, 'initMarginLeft');
        this.setOption(options, 'marginLeftDelay');
        this.setOption(options, 'animationTime');
    };

    this.setOption = function(options, option) {
        this.config[option] = typeof options[option] !== 'undefined' ? this.config[option] : options[option];
    };

    this.init = function(){
        this.getPerspectives();
    };

    this.getPerspectives = function(context) {
        if (typeof context !== 'undefined') {
            this.mains = $(context).find('.frayrrusel-main');
        } else {
            this.mains = $('body').find('.frayrrusel-main');
        }
    };

    this.getPerspectiveFromMain = function(main) {
        return $(main).find('.frayrrusel-perspective:first');
    }

    this.initPerspective = function(perspective){
        var elements = this.getElementsFromPerspective(perspective);
        if (elements.length) {
            var transformFactor = this.config['initTransformFactor'];
            var top = this.config['initTop'];
            var rotation = this.config['initRotation'];
            var minRotation = this.config['initMinRotation'];
            var width = this.config['initWidth']
            var marginLeft = this.config['initMarginLeft'];
            var frayrrusel = this;

            elements.each(function(key, value){
                $(this).css('z-index', key);
                $(this).css('width', width);
                $(this).css('top', top + 'px');
                $(this).css('margin-left', marginLeft);
                if (key == 0) {
                    $(this).css('margin-top', '-50px');
                }
                $(this).css('transform', 'rotateX(' + rotation + 'deg)');
                $(this).css('-moz-transform', 'rotateX(' + rotation + 'deg)');
                $(this).css('-webkit-transform', 'rotateX(' + rotation + 'deg)');
                transformFactor += frayrrusel.config['transformDelay'];
                top += frayrrusel.config['topDelay'];
                rotation += frayrrusel.config['rotationDelay'];
                width += frayrrusel.config['widthDelay'];
                marginLeft -= frayrrusel.config['marginLeftDelay'];
            });
        }
        this.applyScrollAnimation(perspective.parent());
    };

    this.mainExist = function(main) {
        var i = this.mains.length;
        while (i--) {
            if ($(this.mains[i]).attr('id') == main.attr('id')) {
                return true;
            }
        }
        return false;
    };

    this.getElementsFromPerspective = function(perspective) {
        return perspective.find('.frayrrusel-page');
    };

    this.getPageFromPerspective = function(perspective, pageNumber) {
        return $(perspective).find('.frayrrusel-page:nth-child(' + pageNumber + ')');
    };

    this.applyScrollAnimation = function(main) {
        if (this.mainExist(main)) {
            var perspective         = this.getPerspectiveFromMain(main);
            var elements            = this.getElementsFromPerspective(perspective);
            var numElements         = elements.length;
            var scrollLength        = main[0].scrollHeight - main[0].clientHeight;
            var maxRotation         = this.config['initRotation'];
            var minRotation         = this.config['initMinRotation'];
            var animatdMarginTop    = this.config['animatdMarginTop'];
            var scrollPerctentage   = scrollLength / (numElements - 1);
            var frayrrusel          = this;
            var element             = 1;

            main.scroll(function(){
                var auxElement = Math.ceil(main[0].scrollTop / scrollPerctentage);
                auxElement++;
                if (auxElement != element) {

                    var oldPage = frayrrusel.getPageFromPerspective(perspective, element);
                    if (!oldPage.hasClass('frayrrusel-hidding')){
                        oldPage.addClass('frayrrusel-hidding');
                        oldPage.transition({
                            'marginTop': '0px',
                            rotateX: maxRotation + 'deg'
                        }, frayrrusel.config['animationTime'],
                        function(){
                            $(this).removeClass('frayrrusel-animated');
                            $(this).removeClass('frayrrusel-hidding');
                        });
                    }

                    element = auxElement;

                    var newPage = frayrrusel.getPageFromPerspective(perspective, element);
                    if (!newPage.hasClass('frayrrusel-showing')){
                        newPage.addClass('frayrrusel-showing');
                        frayrrusel.desactiveAnimatedPages(perspective);
                        newPage.transition({
                            marginTop:  animatdMarginTop + 'px',
                            rotateX: minRotation + 'deg'
                        }, frayrrusel.config['animationTime'],
                        function(){
                            $(this).addClass('frayrrusel-animated');
                            $(this).removeClass('frayrrusel-showing');
                        });
                    }
                }
            });
        }
    };

    this.desactiveAnimatedPages = function(perspective) {
        perspective.find('.frayrrusel-animated').each(function(){
            $(this).transition({
                'marginTop': '0px',
                rotateX: '-40deg'
            }, frayrrusel.config['animationTime'],
            function(){
                $(this).removeClass('frayrrusel-animated');
                $(this).removeClass('frayrrusel-hidding');
            });
        });
    };

    this.start = function(options){

        if (typeof options !== 'undefined') {
            this.setOptions(options);
        }

        this.init();

        var frayrrusel = this;

        this.mains.each(function(){
            frayrrusel.initPerspective(frayrrusel.getPerspectiveFromMain($(this)));
        });
    };
};