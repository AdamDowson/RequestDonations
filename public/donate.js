/*!
* RequestNetworkDonations JavaScript
* @author  Adam Dowson
* @version 0.0.1
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.request = factory();
    }
}(this, function () {

    /* ----------------------------------------------------------- */
    /* == modal */
    /* ----------------------------------------------------------- */

    var transitionEvent = whichTransitionEvent();

    function Modal(options) {

        var defaults = {
            onClose: null,
            onOpen: null,
            beforeOpen: null,
            beforeClose: null,
            stickyFooter: false,
            footer: false,
            cssClass: [],
            closeLabel: 'Close',
            closeMethods: ['overlay', 'button', 'escape']
        };

        // extends config
        this.opts = extend({}, defaults, options);

        // init modal
        this.init();
    }

    Modal.prototype.init = function () {
        if (this.modal) {
            return;
        }

        _build.call(this);
        _bindEvents.call(this);

        // insert modal in dom
        document.body.insertBefore(this.modal, document.body.firstChild);

        if (this.opts.footer) {
            this.addFooter();
        }
    };

    Modal.prototype.destroy = function () {
        if (this.modal === null) {
            return;
        }

        // unbind all events
        _unbindEvents.call(this);

        // remove modal from dom
        this.modal.parentNode.removeChild(this.modal);

        this.modal = null;
    };


    Modal.prototype.open = function () {

        var self = this;

        // before open callback
        if (typeof self.opts.beforeOpen === 'function') {
            self.opts.beforeOpen();
        }

        if (this.modal.style.removeProperty) {
            this.modal.style.removeProperty('display');
        } else {
            this.modal.style.removeAttribute('display');
        }

        // prevent double scroll
        this._scrollPosition = window.pageYOffset;
        document.body.classList.add('request-enabled');
        document.body.style.top = -this._scrollPosition + 'px';

        // sticky footer
        this.setStickyFooter(this.opts.stickyFooter);

        // show modal
        this.modal.classList.add('request-modal--visible');

        if (transitionEvent) {
            this.modal.addEventListener(transitionEvent, function handler() {
                if (typeof self.opts.onOpen === 'function') {
                    self.opts.onOpen.call(self);
                }

                // detach event after transition end (so it doesn't fire multiple onOpen)
                self.modal.removeEventListener(transitionEvent, handler, false);

            }, false);
        } else {
            if (typeof self.opts.onOpen === 'function') {
                self.opts.onOpen.call(self);
            }
        }

        // check if modal is bigger than screen height
        this.checkOverflow();
    };

    Modal.prototype.isOpen = function () {
        return !!this.modal.classList.contains("request-modal--visible");
    };

    Modal.prototype.close = function () {

        //  before close
        if (typeof this.opts.beforeClose === "function") {
            var close = this.opts.beforeClose.call(this);
            if (!close) return;
        }

        document.body.classList.remove('request-enabled');
        window.scrollTo(0, this._scrollPosition);
        document.body.style.top = null;

        this.modal.classList.remove('request-modal--visible');

        //Using similar setup as onOpen
        //Reference to the Modal that's created
        var self = this;

        if (transitionEvent) {
            //Track when transition is happening then run onClose on complete
            this.modal.addEventListener(transitionEvent, function handler() {
                // detach event after transition end (so it doesn't fire multiple onClose)
                self.modal.removeEventListener(transitionEvent, handler, false);

                self.modal.style.display = 'none';

                // on close callback
                if (typeof self.opts.onClose === "function") {
                    self.opts.onClose.call(this);
                }

            }, false);
        } else {
            self.modal.style.display = 'none';
            // on close callback
            if (typeof self.opts.onClose === "function") {
                self.opts.onClose.call(this);
            }
        }
    };

    Modal.prototype.setContent = function (content) {
        // check type of content : String or Node
        if (typeof content === 'string') {
            this.modalBoxContent.innerHTML = content;
        } else {
            this.modalBoxContent.innerHTML = "";
            this.modalBoxContent.appendChild(content);
        }

        if (this.isOpen()) {
            // check if modal is bigger than screen height
            this.checkOverflow();
        }
    };

    Modal.prototype.getContent = function () {
        return this.modalBoxContent;
    };

    Modal.prototype.addFooter = function () {
        // add footer to modal
        _buildFooter.call(this);
    };

    Modal.prototype.setFooterContent = function (content) {
        // set footer content
        this.modalBoxFooter.innerHTML = content;
    };

    Modal.prototype.getFooterContent = function () {
        return this.modalBoxFooter;
    };

    Modal.prototype.setStickyFooter = function (isSticky) {
        // if the modal is smaller than the viewport height, we don't need sticky
        if (!this.isOverflow()) {
            isSticky = false;
        }

        if (isSticky) {
            if (this.modalBox.contains(this.modalBoxFooter)) {
                this.modalBox.removeChild(this.modalBoxFooter);
                this.modal.appendChild(this.modalBoxFooter);
                this.modalBoxFooter.classList.add('request-modal-box__footer--sticky');
                _recalculateFooterPosition.call(this);
                this.modalBoxContent.style['padding-bottom'] = this.modalBoxFooter.clientHeight + 20 + 'px';
            }
        } else if (this.modalBoxFooter) {
            if (!this.modalBox.contains(this.modalBoxFooter)) {
                this.modal.removeChild(this.modalBoxFooter);
                this.modalBox.appendChild(this.modalBoxFooter);
                this.modalBoxFooter.style.width = 'auto';
                this.modalBoxFooter.style.left = '';
                this.modalBoxContent.style['padding-bottom'] = '';
                this.modalBoxFooter.classList.remove('request-modal-box__footer--sticky');
            }
        }
    };


    Modal.prototype.addFooterBtn = function (label, cssClass, callback) {
        var btn = document.createElement("button");

        // set label
        btn.innerHTML = label;

        // bind callback
        btn.addEventListener('click', callback);

        if (typeof cssClass === 'string' && cssClass.length) {
            // add classes to btn
            cssClass.split(" ").forEach(function (item) {
                btn.classList.add(item);
            });
        }

        this.modalBoxFooter.appendChild(btn);

        return btn;
    };

    Modal.prototype.resize = function () {
        console.warn('Resize is deprecated and will be removed in version 1.0');
    };


    Modal.prototype.isOverflow = function () {
        var viewportHeight = window.innerHeight;
        var modalHeight = this.modalBox.clientHeight;

        return modalHeight >= viewportHeight;
    };

    Modal.prototype.checkOverflow = function () {
        // only if the modal is currently shown
        if (this.modal.classList.contains('request-modal--visible')) {
            if (this.isOverflow()) {
                this.modal.classList.add('request-modal--overflow');
            } else {
                this.modal.classList.remove('request-modal--overflow');
            }

            // TODO: remove offset
            //_offset.call(this);
            if (!this.isOverflow() && this.opts.stickyFooter) {
                this.setStickyFooter(false);
            } else if (this.isOverflow() && this.opts.stickyFooter) {
                _recalculateFooterPosition.call(this);
                this.setStickyFooter(true);
            }
        }
    }


    /* ----------------------------------------------------------- */
    /* == private methods */
    /* ----------------------------------------------------------- */

    function _recalculateFooterPosition() {
        if (!this.modalBoxFooter) {
            return;
        }
        this.modalBoxFooter.style.width = this.modalBox.clientWidth + 'px';
        this.modalBoxFooter.style.left = this.modalBox.offsetLeft + 'px';
    }

    function _build() {

        // wrapper
        this.modal = document.createElement('div');
        this.modal.classList.add('request-modal');

        // remove cusor if no overlay close method
        if (this.opts.closeMethods.length === 0 || this.opts.closeMethods.indexOf('overlay') === -1) {
            this.modal.classList.add('request-modal--noOverlayClose');
        }

        this.modal.style.display = 'none';

        // custom class
        this.opts.cssClass.forEach(function (item) {
            if (typeof item === 'string') {
                this.modal.classList.add(item);
            }
        }, this);

        // close btn
        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modalCloseBtn = document.createElement('button');
            this.modalCloseBtn.classList.add('request-modal__close');

            this.modalCloseBtnIcon = document.createElement('span');
            this.modalCloseBtnIcon.classList.add('request-modal__closeIcon');
            this.modalCloseBtnIcon.innerHTML = '×';

            this.modalCloseBtnLabel = document.createElement('span');
            this.modalCloseBtnLabel.classList.add('request-modal__closeLabel');
            this.modalCloseBtnLabel.innerHTML = this.opts.closeLabel;

            this.modalCloseBtn.appendChild(this.modalCloseBtnIcon);
            this.modalCloseBtn.appendChild(this.modalCloseBtnLabel);
        }

        // modal
        this.modalBox = document.createElement('div');
        this.modalBox.classList.add('request-modal-box');

        // modal box content
        this.modalBoxContent = document.createElement('div');
        this.modalBoxContent.classList.add('request-modal-box__content');

        this.modalBox.appendChild(this.modalBoxContent);

        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modal.appendChild(this.modalCloseBtn);
        }

        this.modal.appendChild(this.modalBox);

    }

    function _buildFooter() {
        this.modalBoxFooter = document.createElement('div');
        this.modalBoxFooter.classList.add('request-modal-box__footer');
        this.modalBox.appendChild(this.modalBoxFooter);
    }

    function _bindEvents() {

        this._events = {
            clickCloseBtn: this.close.bind(this),
            clickOverlay: _handleClickOutside.bind(this),
            resize: this.checkOverflow.bind(this),
            keyboardNav: _handleKeyboardNav.bind(this)
        };

        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modalCloseBtn.addEventListener('click', this._events.clickCloseBtn);
        }

        this.modal.addEventListener('mousedown', this._events.clickOverlay);
        window.addEventListener('resize', this._events.resize);
        document.addEventListener("keydown", this._events.keyboardNav);
    }

    function _handleKeyboardNav(event) {
        // escape key
        if (this.opts.closeMethods.indexOf('escape') !== -1 && event.which === 27 && this.isOpen()) {
            this.close();
        }
    }

    function _handleClickOutside(event) {
        // if click is outside the modal
        if (this.opts.closeMethods.indexOf('overlay') !== -1 && !_findAncestor(event.target, 'request-modal') &&
            event.clientX < this.modal.clientWidth) {
            this.close();
        }
    }

    function _findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    function _unbindEvents() {
        if (this.opts.closeMethods.indexOf('button') !== -1) {
            this.modalCloseBtn.removeEventListener('click', this._events.clickCloseBtn);
        }
        this.modal.removeEventListener('mousedown', this._events.clickOverlay);
        window.removeEventListener('resize', this._events.resize);
        document.removeEventListener("keydown", this._events.keyboardNav);
    }

    /* ----------------------------------------------------------- */
    /* == helpers */
    /* ----------------------------------------------------------- */

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    function whichTransitionEvent() {
        var t;
        var el = document.createElement('request-test-transition');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /* ----------------------------------------------------------- */
    /* == return */
    /* ----------------------------------------------------------- */

    return {
        modal: Modal
    };

}));

var triggerButton = document.getElementById('requestDonationTrigger');
var donationModal;
var amountTiles = document.getElementsByClassName('request-tile-amount');
var currencyTiles = document.getElementsByClassName('request-tile-currency');
var customAmountButton, customAmountInput, proceedButton, closeIcon, conversionRate, total;
var that;
var selectedAmount = '10', selectedCurrency = 'ETH', totalOwed;
var conversionRates = [];
var filteredCurrencies = [];
var address;
const PAYMENT_ROUND_AMOUNT = 6;

function requestNetworkDonations(opts) {
    opts = opts || {};

    var defaults = {};

    opts = Object.assign(defaults, opts);

    var rootUrl = "https://donations.wooreq.com/";
    that = this;

    var allCurrencies = {
        'ETH': 'Ethereum (ETH)',
        'OMG': 'OmiseGO (OMG)',
        'REQ': 'Request Network (REQ)',
        'KNC': 'Kyber Network (KNC)',
        'DAI': 'Dai (DAI)',
        'DGX': 'Digix Gold (DGX)'
    };

    if (opts.currencies != null && opts.currencies.length > 0) {
        for (var currency in opts.currencies) {
            var currCurrency = opts.currencies[currency];
            if (allCurrencies[currCurrency]) {
                filteredCurrencies[currCurrency] = allCurrencies[currCurrency];
            }
        }
    }
    else {
        filteredCurrencies = allCurrencies;
    }

    if (!filteredCurrencies || Object.keys(filteredCurrencies).length == 0) {
        alert('Incorrect currencies defined in parameters');
        triggerButton.classList.add('hidden');
        return;
    }

    if (!opts.address) {
        alert('Please enter an address');
        return;
    } else {
        address = opts.address;
    }

    /* ----------------------------------------------------------- */
    /* == helper functions */
    /* ----------------------------------------------------------- */
    this.loadCSS = function (href) {
        var link = document.createElement("link");
        link.href = href;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    this.initModal = function () {
        donationsModal = new request.modal({
            footer: true,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close"
        });

        var footerRequest = '<img class="request-footer-logo" src="' + rootUrl + 'img/request-logo.png"/><span class="request-footer-copy">Powered by Request</span>',
            footerButton = '<button id="proceed-button" class="request-btn request-btn--primary request-btn--pull-right">Proceed</button>';

        donationsModal.setFooterContent(footerRequest + footerButton);

        var btn = document.getElementById('requestDonationTrigger');
        btn.addEventListener('click', function () {
            donationsModal.open();
        });

        donationsModal.setContent(that.fetchContentHtml());

        proceedButton = document.getElementById('proceed-button');
        closeIcon = document.getElementsByClassName('request-modal__close');
        customAmountButton = document.getElementById('custom-amount-trigger');
        customAmountInput = document.getElementById('custom-amount-input');
        conversionRate = document.getElementById('request-donations-rate');
        total = document.getElementById('request-donations-total');
    }

    this.jsonToQueryString = function (json) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    this.generateRequest = function () {
        var xhr = new XMLHttpRequest();

        var redirectBaseUrl = 'https://donations.wooreq.com/thank-you';
        var url = [location.protocol, '//', location.host, location.pathname].join('');
        const redirectUrlParams = {
            'owed': totalOwed,
            'currency': selectedCurrency,
            'fiat': selectedAmount,
            'redirect': url,
            'txid': '' //given after app.request.network redirect
        }
        var fullRedirectUrl = redirectBaseUrl + that.jsonToQueryString(redirectUrlParams);

        const params = {
            'to_pay': totalOwed,
            'to_address': address,
            'redirect_url': fullRedirectUrl,
            'reason': 'Donation to MakerDAO',
            'network': 4,
            'currency': selectedCurrency
        }

        var signUrl = 'https://sign.wooreq.com/sign' + that.jsonToQueryString(params);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                proceedButton.classList.remove('disabled');
                closeIcon[0].classList.remove('hidden');
                window.location.href = xmlHttp.responseText;
            }
        }
        xmlHttp.open("GET", signUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    this.fetchRates = function () {
        var xhr = new XMLHttpRequest();

        const params = {
            'currency': selectedCurrency
        }

        if (conversionRates[selectedCurrency]) {
            var rate = conversionRates[selectedCurrency];
            conversionRate.innerHTML = rate;
            totalOwed = (rate * selectedAmount).toFixed(PAYMENT_ROUND_AMOUNT);
            total.innerHTML = totalOwed + ' ' + selectedCurrency;
        } else {
            var signUrl = 'https://sign.wooreq.com/rates' + that.jsonToQueryString(params);

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var parsedResponse = JSON.parse(xmlHttp.responseText);
                    conversionRate.innerHTML = parsedResponse.conversion_rate;
                    totalOwed = (parsedResponse.conversion_rate * selectedAmount).toFixed(PAYMENT_ROUND_AMOUNT);
                    total.innerHTML = totalOwed + ' ' + selectedCurrency;
                    conversionRates[selectedCurrency] = parsedResponse.conversion_rate;
                } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
                    alert('Error fetching conversion rates, this error has been logged');
                }
            }
            xmlHttp.open("GET", signUrl, true); // true for asynchronous 
            xmlHttp.send(null);
        }
    }

    this.wipeRates = function () {
        for (var rate in conversionRates) {
            conversionRates[rate] = '';
        }
    }

    this.addClickEvents = function () {
        // Amount click events
        for (var i = 0; i < amountTiles.length; i++) {
            amountTiles[i].addEventListener('click', function (element) {
                for (var i = 0; i < amountTiles.length; i++) {
                    if (amountTiles[i] != element) {
                        amountTiles[i].classList.remove('active');
                    }
                }

                selectedAmount = this.getAttribute('data-req-amount');
                that.fetchRates();
                that.clearCustomAmount();
                this.classList.toggle('active');
            });
        }

        // Currency click events
        for (var i = 0; i < currencyTiles.length; i++) {
            currencyTiles[i].addEventListener('click', function (element) {
                for (var i = 0; i < currencyTiles.length; i++) {
                    if (currencyTiles[i] != element) {
                        currencyTiles[i].classList.remove('active');
                    }

                }
                selectedCurrency = this.getAttribute('data-req-currency');
                that.fetchRates();
                this.classList.toggle('active');
            });
        }

        proceedButton.addEventListener('click', function () {
            if (selectedCurrency != 'ETH') {
                alert("ERC20 tokens are not available on Rinkeby, please select ETH");
            } else {
                proceedButton.classList.add('disabled');
                closeIcon[0].classList.add('hidden');
                that.generateRequest();
            }
        });

        customAmountButton.addEventListener('click', function () {
            this.classList.add('show-input');
            customAmountInput.focus();
        });

        customAmountInput.addEventListener('input', function (evt) {
            if (this.value) {
                var numericOnlyValue = this.value.replace(/\D/g, '');
                selectedAmount = numericOnlyValue;
                this.value = numericOnlyValue;
                customAmountButton.classList.add('active');
                for (var i = 0; i < amountTiles.length; i++) {
                    amountTiles[i].classList.remove('active');
                }
                that.fetchRates();
            }
        });
    }

    this.clearCustomAmount = function () {
        customAmountButton.classList.remove('show-input');
        customAmountButton.classList.remove('active');
        customAmountInput.value = '';
    }

    this.initCustomInput = function () {
        function resizable(el, factor) {
            var int = Number(factor);
            function resize() { el.style.width = ((el.value.length + 1) * int) + 'px' }
            var e = 'keyup,keypress,focus,blur,change'.split(',');
            for (var i in e) el.addEventListener(e[i], resize, false);
            resize();
        }
        resizable(customAmountInput, 20);
    }

    this.setRateClear = function () {
        // We store the rates from the API in the session, we refetch them every 2 minutes. 
        setInterval(function () {
            that.wipeRates();
        }, 60 * 2000); // 2 minutes
    }

    this.start = function () {
        this.loadCSS(rootUrl + 'request-donation-styles.css');
        this.loadCSS('https://fonts.googleapis.com/css?family=Montserrat:400,600,700,800|Raleway:400,500,600');
        this.initModal();
        this.addClickEvents();
        this.fetchRates();
        this.initCustomInput();
        this.setRateClear();

        //Debugging
        // donationsModal.open();
    }

    this.fetchContentHtml = function () {
        var first = true;

        var html = `<div>
        <span class="request-h1 request-modal-title">Make a donation today</span>
        <p class="request-subtitle">How much would you like to donate?</p>
        <div class="request-tile-container clearfix">

          <div class="request-tile-outer">
            <div class="request-tile request-tile-amount" data-req-amount="5">

              <div class="request-amount">
                <span class="request-dollar">$</span>5</div>
              <span class="request-tick"></span>
            </div>
          </div>

          <div class="request-tile-outer">
            <div class="request-tile request-tile-amount active" data-req-amount="10">

              <div class="request-amount">
                <span class="request-dollar">$</span>10</div>
              <span class="request-tick"></span>
            </div>
          </div>
          <div class="request-tile-outer">
            <div class="request-tile request-tile-amount" data-req-amount="25">

              <div class="request-amount">
                <span class="request-dollar">$</span>25</div>
              <span class="request-tick"></span>
            </div>
          </div>
          <div class="request-tile-outer">
            <div class="request-tile request-tile-amount" data-req-amount="50">

              <div class="request-amount">
                <span class="request-dollar">$</span>50</div>
              <span class="request-tick"></span>
            </div>
          </div>
          <div class="request-tile-outer">
            <div class="request-tile request-tile-amount" data-req-amount="100">

              <div class="request-amount">
                <span class="request-dollar">$</span>100</div>
              <span class="request-tick"></span>
            </div>
          </div>
          <div class="request-tile-outer">
            <div class="request-tile request-tile-amount" data-req-amount="250">

              <div class="request-amount">
                <span class="request-dollar">$</span>250</div>
              <span class="request-tick"></span>
            </div>
          </div>
          <div class="request-tile-outer request-tile-outer-large">
            <div id="custom-amount-trigger" class="request-tile">
              <span class="request-tile-button-label">
                Custom amount
              </span>
              <div class="custom-amount-input-container">
                  <span class="request-dollar">$</span>
                  <input id="custom-amount-input" type="text">
              </div>
              <span class="request-tick"></span>
            </div>
          </div>
        </div>
        <p class="request-subtitle">Select donation currency</p>
        <div class="request-tile-container clearfix">`;


        for (var currency in filteredCurrencies) {
            var activeClass = first ? 'active' : '';
            
            var currencyLower = currency.toLowerCase();
            html += `<div class="request-tile-outer">
              <div class="request-tile request-tile-currency ` + activeClass + `" data-req-currency="` + currency + `">
              <div class="request-tile-payment-icon">
                  <i class="request-payment-icon request-payment-icon--` + currencyLower + `"></i>
                  <span class="request-payment-icon-title">` + currency + `</span>
              </div>
              <span class="request-tick"></span>
              </div>
          </div>`;
          first = false;
        }


        html += `</div>
        <div class="request-transaction-info-block">
            <p class="mb-1">Conversion rate:
            <strong id="request-donations-rate"></strong>
            </p>
            <p class="mt-0 mb-0">Total owed:
            <strong id="request-donations-total"></strong>
            </p>
        </div>
        </div>`;

        return html;
    }
}
