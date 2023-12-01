let javascript_obj = {}

function onPageFinished() {
    is_visible_shipping_button();
}

function hidingController(javascript_data) {
    javascript_obj = javascript_data;
    try {
        if (javascript_obj.hasOwnProperty('controller_hide')) {
            const controller_hide = javascript_obj['controller_hide'];
            for (let index in controller_hide) {
                let value = controller_hide[index]['value'];
                let type = controller_hide[index]['type'];
                let tag_type = controller_hide[index]['tag_type'];
                try {
                    switch(type) {
                        case "id":
                            elementHide(document.getElementById(value), tag_type);
                        break;
                        case "class":
                            elementHide(document.getElementsByClassName(value), tag_type);
                        break;
                        case "tag":
                            elementHide(document.getElementsByTagName(value), tag_type);
                        break;
                        case "name":
                            elementHide(document.getElementsByName(value), tag_type);
                        break;
                        case "xpath":
                            elementHide(document.evaluate(value, document, null, XPathResult.ANY_TYPE, null), tag_type);
                        break;
                        case "query":
                            elementHide(document.querySelector(value), tag_type);  
                        break;
                        case "other":
                        default:
                            value
                        break;
                    }
                }
                catch (e) {console.log(e)}
            }  
        }
        
    }
    catch (e) {
        console.log(e)
    }
}

function is_visible_shipping_button() {
    const currentUrl = window.location.href;
    var is_visible = 0;
    if (javascript_obj.hasOwnProperty('regex_selection')) {
        if (currentUrl != null) {
            try {
                const list_regex = javascript_obj['regex_selection'];
                console.log(list_regex)
                if (list_regex != null) {
                    for (let index in list_regex) {
                        var str = list_regex[index];
                        if (str != null && str != "") {
                            if(currentUrl.includes(str)) {
                                is_visible = 1;
                            }
                        }
                        if (is_visible) {
                            break;
                        }
                    }
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }
    if (is_visible == 0) {
        if (javascript_obj.hasOwnProperty('product_details')) {
            try {
                const list_product_details = javascript_obj['product_details'];
                for (let index in list_product_details) {
                    let value = list_product_details[index]['value'];
                    let type = list_product_details[index]['type'];
                    let tag_type = list_product_details[index]['tag_type'];
                    try {
                        switch(type) {
                            case "id":
                                if(document.getElementById(value).length > 0) {
                                    is_visible = 1;
                                };
                            break;
                            case "class":
                                if(document.getElementsByClassName(value).length > 0){ 
                                    is_visible = 1;
                                }
                            break;
                            case "tag":
                               if(document.getElementsByTagName(value).length > 0){ 
                                is_visible = 1;
                               }
                            break;
                            case "name":
                                if(document.getElementsByName(value).length > 0){ 
                                    is_visible = 1;
                                }
                            break;
                            case "xpath":
                                if(document.evaluate(value, document, null, XPathResult.ANY_TYPE, null).length > 0) {
                                    is_visible = 1;
                                }
                            break;
                            case "query":
                                if(document.querySelector(value).length > 0) {
                                    is_visible = 1;
                                }
                            break;
                            case "other":
                            default:
                                if(value.length > 0) {
                                    is_visible = 1;
                                }
                            break;
                        }
                    }
                    catch (e) {
                        console.log(e)
                    }
                }  
            }
            catch (e) {
                console.log(e)
            }
        }
    }
    

    try {
        if (is_visible == 1) {
            fetch_price();
            try {
                MyJavaScriptInterface.isVisibleShippingButton(1);
            } catch (err){}
            try {
                window.flutter_inappwebview.callHandler('isVisibleShippingButton', 1);
            } catch (err){}
        } else {
            try {
                MyJavaScriptInterface.isVisibleShippingButton(0);
            } catch (err){}
            try {
                window.flutter_inappwebview.callHandler('isVisibleShippingButton', 0);
            } catch (err){}
        }
   } catch(err) {
    try {
        MyJavaScriptInterface.isVisibleShippingButton(0);
    } catch (err){}
    try {
        window.flutter_inappwebview.callHandler('isVisibleShippingButton', 0);
    } catch (err){}
   }    
}

function transplant(price)
{
   return price.replace(/[,.]/g, function($1) { return $1 === ',' ? '.' : ',' })
}

function find_price(price)
{
    let re = /[-]?\d[\d,]*[.]?[\d{2}]*/g;
    return re.exec(price)[0];
}

function get_price(list_xpath)
{
    let price ='Not found'

    for (let index in list_xpath) {
        let xpath= list_xpath[index]['value']
        let price_filter= list_xpath[index]['price_filter']
        // console.log(xpath)
        try{
            const xpathArray = xpath.split(" ");
            if (xpath.charAt(xpath.length-1) != "]" && ((xpathArray[xpathArray.length - 1]).length > 0 && (xpathArray[xpathArray.length - 1].charAt(0) == "@" || xpathArray[xpathArray.length -1] == "()"))) {
                price = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim();
            } else {
                price = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim();
            }
        
            console.log(price_filter," ::old:: ", price)
            if (price_filter === true || price_filter  === 'true') {
                price = transplant(price)
            }

            price = find_price(price)
            break
        }
        catch (e) {}
    }

    price = price.replace(/[/"/',]/g, '')

    try {
        webkit.messageHandlers.priceAction.postMessage(
           price.replace(/[/"/',]/g, '')
        );
    } catch(err) {}

    return price;
}

function fetch_price_currency()
{
    
    let is_js_currency_unit_hide = false;

    if (javascript_obj.hasOwnProperty('is_js_currency_unit_hide')) {
        is_js_currency_unit_hide = javascript_obj["is_js_currency_unit_hide"];
    }
    
    let currency_code = "";

    if (javascript_obj.hasOwnProperty('currency_code') && !is_js_currency_unit_hide) {
        currency_code = javascript_obj["currency_code"];
    }

    if (javascript_obj.hasOwnProperty('product_price')) {
        if (javascript_obj.hasOwnProperty('currency_unit') && !is_js_currency_unit_hide) {
            get_price_currency(currency_code, javascript_obj["currency_unit"], javascript_obj["product_price"]);
        } else {
            get_price_currency(currency_code, [], javascript_obj["product_price"]);
        }
    }    
}

function fetch_price()
{
    if (javascript_obj.hasOwnProperty('product_price')) {
        let get_prices = get_price(javascript_obj["product_price"]);
        try {
            try {
                MyJavaScriptInterface.fetchPrice(get_prices);
            } catch (err){}
            try {
                window.flutter_inappwebview.callHandler('fetchPrice', get_prices);
            } catch (err){}
        } catch(err) {
            try {
                MyJavaScriptInterface.fetchPrice(0);
            } catch (err){}
            try {
                window.flutter_inappwebview.callHandler('fetchPrice', 0);
            } catch (err){}
        }
    }    
}

function fetch_currency()
{
    let is_js_currency_unit_hide = false;

    if (javascript_obj.hasOwnProperty('is_js_currency_unit_hide')) {
        is_js_currency_unit_hide = javascript_obj["is_js_currency_unit_hide"];
    }

    let currency_code = "";

    if (javascript_obj.hasOwnProperty('currency_code') && !is_js_currency_unit_hide) {
        currency_code = javascript_obj["currency_code"];
    }

    if (javascript_obj.hasOwnProperty('currency_unit') && !is_js_currency_unit_hide) {
        let currency = get_currency(javascript_obj["currency_unit"]);

        try {
            if ((currency == null || currency == "") && currency_code != null) {
                currency = currency_code
            }
            try {
                MyJavaScriptInterface.fetchCurrency(currency);
            } catch (err){}
            try {
                window.flutter_inappwebview.callHandler('fetchCurrency', currency);
            } catch (err){}

        } catch(err) {
            try {
                MyJavaScriptInterface.fetchCurrency(currency_code);
            } catch (err){}
            try {
                window.flutter_inappwebview.callHandler('fetchCurrency', currency_code);
            } catch (err){}

        }
    } else {
        try {
            MyJavaScriptInterface.fetchCurrency(currency_code);
        } catch (err){}
        try {
            window.flutter_inappwebview.callHandler('fetchCurrency', currency_code);
        } catch (err){}
    } 
}

function get_price_currency(default_currency, list_xpath_currency, list_xpath_price) {
    let currency = get_currency(list_xpath_currency);

    let get_prices = get_price(list_xpath_price);

    try {
        if ((currency == null || currency == "") && default_currency != null) {
            currency = default_currency
        }
        try {
            MyJavaScriptInterface.fetchPrice(get_prices);
            MyJavaScriptInterface.fetchCurrency(currency);
        } catch (err){}
        try {
            window.flutter_inappwebview.callHandler('fetchPrice', get_prices);
            window.flutter_inappwebview.callHandler('fetchCurrency', currency);
        } catch (err){}
    } catch(err) {}
}

function get_currency(list_xpath) {
    let currency = "";
    try {
        for (let index in list_xpath) {
            let xpath= list_xpath[index]['value']
            try{
                currency = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim();
                break
            }
            catch (e) {}
        }
    } catch (e) {
        console.log(e)
    }

    return currency;
}

function elementHide(element, tag_type) {
    if (element != null) {
        try {
            switch(tag_type) {
                case "hide":
                case "div":
                default:
                    element.style.display = "none";
                break;
                case "remove":
                    element.remove();
                break;
                case "click":
                    element.click();
                break;
            }
        }
        catch (e) {
            console.log(e)
        }       
    }
}

document.addEventListener('scroll', (e) => {
    try { MyJavaScriptInterface.scrollEvent() } catch (error) {}
    try {
        window.flutter_inappwebview.callHandler('scrollEvent', null);
    } catch (err){}
  });
  
function containsOnlyLettersOrParenthesis(str) {
    return /[a-zA-Z\u0600-\u06FF]/g.test(str);
}

function replaceListText(mapWords)
{
try {                
    // let format = /[ `!@#\$%^&*()_+\\-=\\[\\]{};':"\\|,.<>\\?~]/$/;
    for (let element of document.body.querySelectorAll( 'body *' )) {
        if (element.tagName !== "SCRIPT" && element.tagName !== "STYLE" && element.tagName !== "NOSCRIPT") {

            if (element.childNodes.length === 1 && element.childElementCount === 0) {

                if (!isNumeric(element.textContent.trim())) {
                    if (element.textContent.trim().length === 1 && !containsOnlyLettersOrParenthesis(element.textContent.trim()) || element.textContent.trim().length === 0) { } else {
                        if (element.textContent.trim().length !== 0 && containsOnlyLettersOrParenthesis(element.textContent.trim())) {
                            if (mapWords[element.textContent.trim()] !== undefined && mapWords[element.textContent.trim()] !== "" && element.textContent.trim() !== mapWords[element.textContent.trim()]) {
                                element.textContent = element.textContent.replace(element.textContent.trim(),mapWords[element.textContent.trim()])
                            }
                        }
                    }
                }
            } else {
                if(element.childNodes.length > element.childElementCount) {
                    for(let childNode of element.childNodes)
                    {
                        if (childNode.nodeType === 3)
                        {
                            if (!isNumeric(childNode.textContent.trim())) {
                                if (childNode.textContent.trim().length === 1 && !containsOnlyLettersOrParenthesis(childNode.textContent.trim()) || childNode.textContent.trim().length === 0)
                                {

                                }
                                else {
                                if(element.textContent.trim().length !== 0 && containsOnlyLettersOrParenthesis(childNode.textContent.trim()))
                                {
                                        if (mapWords[childNode.textContent.trim()] !== undefined  && mapWords[childNode.textContent.trim()] !== "" && childNode.textContent.trim() !== mapWords[childNode.textContent.trim()])
                                        {
                                        childNode.textContent = childNode.textContent.replace(childNode.textContent.trim(), mapWords[childNode.textContent.trim()])
                                        }
                                }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    }catch(e)
    {
    // alert("replace error :: ", e)
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getAllText(elements) {
    // let mapWords = new Map();
    
    let setWords = new Set();
    
    // let format = /[ `!@#\$%^&*()_+\\-=\\[\\]{};':"\\|,.<>\\?~]/$/;
    
    for (let element of elements) {
        if (element.tagName !== "SCRIPT" && element.tagName !== "STYLE" && element.tagName !== "NOSCRIPT") {
            if (element.childNodes.length === 1 && element.childElementCount === 0) {
            
                if (!isNumeric(element.textContent.trim())) {
                    if (element.textContent.trim().length === 1 && !containsOnlyLettersOrParenthesis(element.textContent.trim()) || element.textContent.trim().length === 0)
                    {

                    }
                    else {
                        if (element.textContent.trim() !== "" && element.textContent.trim() !== "TL" && containsOnlyLettersOrParenthesis(element.textContent.trim()))
                        {
                        //alert(element.textContent.trim());
                        setWords.add(element.textContent.trim())
                        }
                    }
                }
            } else {
                if(element.childNodes.length > element.childElementCount) {
                    for(let childNode of element.childNodes)
                    {
                        if (childNode.nodeType === 3)
                        {
                            if (!isNumeric(childNode.textContent.trim())) {
                                if (childNode.textContent.trim().length === 1 && !containsOnlyLettersOrParenthesis(childNode.textContent.trim()) || childNode.textContent.trim().length === 0)
                                {

                                }
                                else {
                                
                                    if (childNode.textContent.trim() !== "" && childNode.textContent.trim() !== "TL" && containsOnlyLettersOrParenthesis(childNode.textContent.trim()))
                                    {
                                    //alert(childNode.textContent.trim());
                                    setWords.add(childNode.textContent.trim())
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return Array.from(setWords)
    // return mapWords
}
                     
function applyTranslation() {
       try {         
         let listText = getAllText(document.body.querySelectorAll( 'body *' ));
         try {      
            MyJavaScriptInterface.allTextFetched(listText);
        } catch (err){}
         try {
            window.flutter_inappwebview.callHandler('allTextFetched', listText);
        } catch (err){}
       } catch(e) { }
}
 
function applyOriginalTranslation(callback)
{                             
    try{
        MyJavaScriptInterface.allTextFetched(null);
     }catch(e)
     {
        // alert("Try : ", e)
     }
     try {
        window.flutter_inappwebview.callHandler('allTextFetched', null);
    } catch (err){}
}

function hidePayCashAgent() {
    try {
        document.querySelector("#ui-id-3").style.display = 'none';
    } catch (error) {}
}

function openWallet() {
    try {
        if (document.querySelector("#ui-id-1").getAttribute("aria-selected") == 'false') {
            document.querySelector("#ui-id-1").click()
        }
        hidePayCashAgent()
    } catch (error) {}
}