/*jslint browser: true, plusplus: true, bitwise: true*/
/*global $, jQuery, alert, console*/

if (typeof window.cOtomasyon === 'undefined') {
    window.cOtomasyon = {};
}

window.cOtomasyon.utils = (function () {
	"use strict";
    
	var numberCharRegExp = new RegExp("[^a-z0-9]", "i"),
        numberCharSpaceRegExp = new RegExp("[^a-z 0-9]", "i"),
        numberRegExp = /\D+/,
        messages = {
            SIFRE_TEKRARI_ESLEMIYOR: "Şifre Tekrarı Eşleşmiyor.",
            GECERSIZ_SIFRE: "Geçersiz Şifre.",
            GECERSIZ_KULLANICI_ADI: "Geçersiz Kullnıcı Adı.",
            GECERSIZ_GIRIS: "Gecersiz Giris",
            BASARILI_GIRIS: "Giris Basarili",
            DEGISIKLIK_KAYDEDILDI: "Değişiklik Kaydedildi.",
            HATA_OLUSTU: "Hata Oluştu.",
            ESKI_SIFRE_HATALI: "Eski Sifre Hatalı."
        };
    
    function isNumberCharSpace(data, maxLen) {
        numberCharSpaceRegExp.lastIndex = 0;
        if (maxLen !== null) { if (data.length > maxLen) { return false; } }
        if (data.length > 0) {
            return !numberCharSpaceRegExp.test(data);
        } else { return false; }
    }
    
        
    function isNumberChar(data, maxLen) {
        numberCharRegExp.lastIndex = 0;
        if (maxLen !== null) { if (data.length > maxLen) { return false; } }
        if (data.length > 0) {
            return !numberCharRegExp.test(data);
        } else { return false; }
    }
    
    function isNumber(data, maxLen) {
        numberRegExp.lastIndex = 0;
        if (maxLen !== null) { if (data.length > maxLen) {return false; } }
        if (data.length > 0) {
            return !numberRegExp.test(data);
        } else { return false; }
	}
    
    /******* Validate IP Address IPv4 *********/
	function checkIPv4(ipaddr, Regex) {
        
        var re, parts, i;
		//Remember, this function will validate only Class C IP.
		//change to other IP Classes as you need
		ipaddr = ipaddr.replace(/\s/g, ""); //remove spaces for checking
		re = new RegExp(Regex); //regex. check for digits and in
											  //all 4 quadrants of the IP
		if (re.test(ipaddr)) {
			//split into units with dots "."
			parts = ipaddr.split(".");
			//if the first unit/quadrant of the IP is zero
			if (parseInt(parseFloat(parts[0]), 10) === 0) {
				return false;
			}
			//if any part is greater than 255
			for (i = 0; i < parts.length; i += 1) {
				if (parseInt(parseFloat(parts[i]), 10) > 255) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
    
    function pageChange(addr) {
        window.location.href = addr;
        /*$.mobile.changePage( addr, {
            transition: "slideup", 
            changeHash: false,
            reloadPage : true
        });*/
    }
    
    function txtHighlight(obj) {
        obj.css("box-shadow", "0 0 12px #dd2271");
    }
    
    function showLoader(msg) {
        $.mobile.loading('show', {
            text: msg,
            textVisible: true,
            theme: 'a',
            html: ""
        }).show();
    }
    
    function userPassCheck(username, newPass, newPassRep) {
        var retObj =
            {
                ret: false,
                message: ""
            };
        
        
        if (isNumberChar(username.val(), 15)) {
            if (isNumberChar(newPass.val(), 15)) {
                if (isNumberChar(newPassRep.val(), 15)) {
                    if (newPass.val() === newPassRep.val()) {
                        retObj.ret = true;
                    } else { txtHighlight(newPassRep); retObj.message = messages.SIFRE_TEKRARI_ESLEMIYOR; }
                } else { txtHighlight(newPassRep); retObj.message = messages.GECERSIZ_SIFRE; }
            } else { txtHighlight(newPass); retObj.message = messages.GECERSIZ_SIFRE; }
        } else { txtHighlight(username); retObj.message = messages.GECERSIZ_KULLANICI_ADI; }
        
        return retObj;
    }
    
    function decodeHTML(data) {
        return decodeURIComponent(data.replace(/\+/g,  " "));
    }
    
    function txtChange(obj, newString) {
        obj.animate({ opacity: 0 }, {duration: 1000,
              complete : function () {
                obj.html(newString);
                obj.animate({ opacity: 1 }, 1000);
            }});
    }
    
    function itemFadeOut(obj, succ) {
        obj.animate({ opacity: 0 }, 1000, succ);
    }
    
    function itemFadeIn(obj, succ) {
        obj.animate({ opacity: 1 }, 1000);
    }
    
    function scroolDown() {
        $("html, body").animate({ scrollTop: (typeof window.outerHeight !== 'undefined') ? Math.max(window.outerHeight, $(window).height()) : $(window).height()}, 600);
    }
    
    function GuidGen() {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    }
    
	return {
        netmaskRegex : "^((255\\.255\\.255\\.(0|128|192|224|240|248|252))|(255\\.255\\.(0|128|192|224|240|248|252|254|255)\\.0)|(255\\.(0|128|192|224|240|248|252|254|255)\\.0\\.0))$",
        ipRegex : "^(([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\\.)(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\\.)){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$",
        messages: messages,
		isNumberChar: isNumberChar,
        isNumberCharSpace: isNumberCharSpace,
        isNumber: isNumber,
        checkIPv4: checkIPv4,
        pageChange: pageChange,
        txtHighlight: txtHighlight,
        showLoader: showLoader,
        userPassCheck: userPassCheck,
        decodeHTML: decodeHTML,
        txtChange: txtChange,
        scroolDown: scroolDown,
        itemFadeOut: itemFadeOut,
        itemFadeIn: itemFadeIn,
        GuidGen: GuidGen
        
	};
	
}());