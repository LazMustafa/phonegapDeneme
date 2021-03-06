/*jslint browser: true, plusplus: true, bitwise: true*/
/*global $, jQuery, alert, console*/

if (typeof window.cOtomasyon === 'undefined') {
    window.cOtomasyon = {};
}


window.cOtomasyon.UI = (function ($, modul, utils) {
	"use strict";
    var AgAyar, KullaniciAyar, Otomasyon, OtomasyonCikislar, Cihazlar, CihazEkle, CihazDuzelt;
// >------- TOOLS -------->
 
    
    // >------- MESSAGE --- BOX ------>
   
    function showYesNoMsg(popupHeader, msgHead, msg, succ) {
        var $pdiv = $("<div>", {
            "data-role" : "popup",
            "data-overlay-theme" : "b",
            "data-theme" : "b",
            "data-dismissible" : "false",
            "style" : "max-width:400px;"
        }),
            $pcontentdiv = $("<div>", {
                "role" : "main",
                "class" : "ui-content"
            }),
            $pnobtn = $("<a>", {
                "href" : "#",
                "class" : "ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b"
            }),
            $pyesbtn = $("<a>", {
                "href" : "#",
                "class" : "ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b",
                "data-transition" : "flow"
            });
        
        $pdiv.append("<div data-role=\"header\" data-theme=\"a\"><h1>" + popupHeader + "</h1></div>");
        
         
        $pcontentdiv.append("<h4>" + msgHead + "</h1>");
        $pcontentdiv.append("<h5 class=\"ui-title\">" + msg + "</h5>");
        
         
        $pnobtn.html("İptal");
        
        
        $pyesbtn.html("Tamam");
        
        $pcontentdiv.append($pnobtn);
        $pcontentdiv.append($pyesbtn);
        $pdiv.append($pcontentdiv);
        
        $pdiv.popup({
            afterclose: function (event, ui) {
                $(this).remove();
            }
        });
        
        $pnobtn.on('click', function () {
			succ(false);
            $pdiv.popup('close');
		});
        
        $pyesbtn.on('click', function () {
			succ(true);
            $pdiv.popup('close');
		});
        
       
        $pdiv.trigger("create");
        $pdiv.popup('open');
    }
    
    function showMsg(msg, timeout, succ) {
        
            //create content div - makes a nice jQM page structure.
        var $content = $("<div/>", {
            "data-role": "content",
            //change this any way you want- Im just adding the text from clicked link here.
            "html": "<p>" + msg + "</p>"
        }),
            $popupdiv = $("<div/>", {
                "data-role" : "popup",
                "data-theme" : "a",
                "data-transition": "pop"
            }).popup({
                afterclose: function (event, ui) {
                    console.log("showMsg afterclose");
                    $(this).remove();
                    $popupdiv = null;
                },
                afteropen: function (event, ui) {
                    if (typeof timeout === "number") {
                        console.log(timeout);
                        setTimeout(function () {
                            if ($popupdiv !== null) {
                                $popupdiv.popup('destroy');
                                if (succ instanceof Function) {
                                    succ();
                                }
                            }
                        }, timeout);
                    }
                }
            });

        $content.appendTo($popupdiv);



        //$(popupdiv).popup();
        $popupdiv.trigger('create');
        $popupdiv.popup('open');
    }
	
    // <------- MESSAGE --- BOX ------<   
// <------- TOOLS --------<
    
// >------- OTOMASYON --- INDEX ------>
    Otomasyon = (function () {
        
        function lstHederItemAdd(baslikAdi) {
            //"<ul id=\"Kategori" + index + "\" data-role=\"listview\" data-inset=\"true\"></ul>"
            var $katUl = $("<ul>", {
                "data-role" : "listview",
                "data-inset" : "true"
            }),  // "<li data-role=\"list-divider\">" + program.Kategori + "</li>"
                $katLi = $("<li>", {
                    "data-role" : "list-divider",
                    "html" : utils.decodeHTML(baslikAdi)
                });
            $katUl.append($katLi);
            $("#Kategori_Liste").append($katUl);
            return $katUl;
        }
        
        function lstItemAdd($HederItemUl, itemId, itemAdi) {
            //"<li><a id=\"" + program1.ID + "\" href=\"#\">" + program1.Adi + "</a></li>"
            var $katLi = $("<li>"),
                $katA = $("<a>", {
                    "href" : "#",
                    "altKaregoriId" : itemId,
                    "html" : utils.decodeHTML(itemAdi)
                });
            
            $katA.on('click', function () {
                sessionStorage.setItem("altKaregoriId", $(this).attr("altKaregoriId"));
                sessionStorage.setItem("altKaregoriAdi", $(this).html());
                utils.pageChange("#otomasyon-cikislar");
            });
            
            $katLi.append($katA);
            $HederItemUl.append($katLi);
        }

        function katergoriListele() {
            var $tmpHeader;
            
            modul.Otomasyon.KategoriGet(function (retData) {
                if (retData !== false) {
                    //$("#Otomasyon_Baslik").html(utils.decodeHTML(retData.Baslik));
                    $("#Kategori_Liste").empty();
                    $.each(retData.Cikislar, function (i, kategori) {
                        $tmpHeader = lstHederItemAdd(kategori.Kategori);
                        $.each(kategori.AltKategorId, function (i, altKaregori) {
                            lstItemAdd($tmpHeader, altKaregori.ID, altKaregori.Adi);
                        });
                        $tmpHeader.listview();
                    });
                }
                
            });
        }
        function PageInit() {

        }
        
        function PageBeforeShow() {
            $("#Kategori_Liste").empty();
            modul.Cihazlar.AktifCihazId = sessionStorage.getItem("aktifCihazId");
            if (modul.Cihazlar.AktifCihazId !== null) {
                //alert("ok");
                modul.Cihazlar.Getir(modul.Cihazlar.AktifCihazId, function (retCihaz) {
                    if (retCihaz !== null) {
                        modul.CihazTest(retCihaz, function (retVal) {
                            if (retVal) {
                                $("#Otomasyon_Baslik").html(utils.decodeHTML(retCihaz.cihazAdi));
                                modul.CihazSec(retCihaz);
                                katergoriListele();
                            } else {
                                setTimeout(function () {
                                    showMsg("Cihaz Bulunamadı !!!");
                                }, 10);
                            }
                        });
                    }
                });
            }
        }
        
        function PageShow() {
             
        }

        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow,
            PageShow: PageShow
        };
    }());

   
    
// <------- OTOMASYON --- INDEX ------<  
    OtomasyonCikislar = (function () {

        var timerObj;

        
        function ayarlarLoginMsg(msg) {
            $("#popupLoginMsg").text(msg);
            $("#popupLoginMsg").fadeIn("slow");

        }

        function ayarlarLogin(UserName, Passw) {
            window.console.log("login :" + UserName + " : " + Passw);
            if (utils.isNumberChar(UserName) && utils.isNumberChar(Passw)) {
                $('#giris_btn').addClass('ui-disabled');

                modul.AyarlarLogin(UserName, Passw, function (retVal) {
                    //alert(retVal);
                    if (retVal) {
                        ayarlarLoginMsg(utils.messages.BASARILI_GIRIS);
                        setTimeout(function () {$.mobile.changePage("#ayarlar", {allowSamePageTransition: true}); $('#giris_btn').removeClass('ui-disabled'); }, 1000);
                    } else { ayarlarLoginMsg("Giris Basarisiz"); $('#giris_btn').removeClass('ui-disabled'); }

                });
            } else { ayarlarLoginMsg(utils.messages.GECERSIZ_GIRIS); }
        }
        
        function cikisDegerGoster() {
            modul.Otomasyon.CikisDegerGet(sessionStorage.getItem("altKaregoriId"), function (retData) {
                $.each(retData.Cikis, function (i, cikis) {
                     
                    if (cikis !== null) {
                        
                        if (cikis.Tipi === 1) { // KONTAK
                            //alert(cikis.Degeri);
                            $("#flip-" + cikis.RoleId).val(cikis.Degeri);
                            $("#flip-" + cikis.RoleId).flipswitch('refresh');
                        }/*else if(cikis.Tipi==2) // DIMMER
                        {
                            $("#slider-fill-"+cikis.RoleId).val(cikis.Degeri);
                            $("#slider-fill-"+cikis.RoleId).slider("refresh");
                        }*/
                    }
                });
            });
        }
        
        function timerFunction() {
            cikisDegerGoster();
        }
        
        function startTimer() {
            if (timerObj !== null) {
                clearInterval(timerObj);
            }
            timerObj = setInterval(timerFunction, 2000);
        }
        
        
        
        function lstHederItemAdd() {
            //"<ul id=\"Kategori" + index + "\" data-role=\"listview\" data-inset=\"true\"></ul>"
            var $katUl = $("<ul>", {
                "data-role" : "listview",
                "data-inset" : "true"
            });
            $("#Cikis_Liste").append($katUl);
            return $katUl;
        }
        
        function lstItemAdd($HederItemUl, cikis) {
         
            var $cikisLi, $cikisDiv, $cikisLabel, $cikisSelect, $cikisInput, $cikisPanjurYukariA, $cikisPanjurAsagiA, $tmpControlDiv, $tmpLabelDiv, btnHtml, btnIconSol, btnIconSag;
            
            /*
                "1": // KONTAK -
                "2": // DIMMER -
                "3": // PANJUR -
                "4": // DİMMER BUTON -
                "5": // BUTON 
                "6": // BUTTON 2 Lİ kilit aç kapat-
                "7": // BUTTON 2 Lİ +- -
                "8": // BUTTON 1 Lİ senaryo -
            */
            if (cikis.Tipi === "1") {
                $cikisLi = $("<li>", {
                    "data-role" : "fieldcontain",
                    "data-icon" : "false"
                });
                    
                $tmpControlDiv = $("<div>", {
                    "style" : "float:right;"
                });
                    
                $tmpLabelDiv = $("<div>");
                    
                $cikisLabel = $("<label>", {
                    "for" : "flip-" + cikis.RoleId,
                    "style" : "white-space:normal;",
                    "html" : cikis.Adi
                });
                    
                $cikisSelect = $("<select>", {
                    "RoleID" : cikis.RoleId,
                    "name"  : "flip-" + cikis.RoleId,
                    "id" : "flip-" + cikis.RoleId,
                    //"data-mini" : "true",
                    "data-role" : "flipswitch",
                    "html" : "<option value=\"0\">Off</option><option value=\"1\">On</option>"
                });
                    
                $tmpControlDiv.append($cikisSelect);
                $tmpLabelDiv.append($cikisLabel);
                    
                
                
                $cikisLi.append($tmpControlDiv);
                $cikisLi.append($tmpLabelDiv);
                    
                
                 
                $cikisSelect.val(cikis.Degeri);
                
                $cikisSelect.flipswitch();
                
                $cikisSelect.on('change', function (event) {
                    var objt_tmp = $(this);
                    
                    startTimer();
                    
                    modul.Otomasyon.CikisSet($(this).attr("RoleID"), objt_tmp.val(), function (retVal) {
                        if (objt_tmp.val().toString() !== retVal.Degeri.toString()) {
                            //alert(retVal.Degeri);
                            objt_tmp.val(retVal.Degeri);
                        }
                    });
                });
                    
                $HederItemUl.append($cikisLi);
            } else if (cikis.Tipi === "2") {
                
                $cikisLi = $("<li>", {
                    "data-role" : "fieldcontain",
                    "data-icon" : "false"
                });
                    
                $cikisLabel = $("<label>", {
                    "for" : "slider-" + cikis.RoleId,
                    "style" : "white-space:normal;",
                    "html" : cikis.Adi
                });
                
                $cikisInput = $("<input>", {
                    "type" : "number",
                    "data-type" : "range",
                    "name" : "slider-" + cikis.RoleId,
                    "id" : "slider-" + cikis.RoleId,
                    "data-highlight" : "true",
                    "data-show-value" : "true",
                    //"data-popup-enabled" : "true",
                    //"data-mini" : "true", 
                    "min" : "0",
                    "max" : "100",
                    "value" : cikis.Degeri
                });
                
                /*$cikisInput.slider({
                    stop: function (event, ui) { alert("objt_tmp.val()"); }
                });*/
                
                 
                $cikisLi.append($cikisLabel);
                $cikisLi.append($cikisInput);
                $HederItemUl.append($cikisLi);
                
                $cikisInput.slider().textinput();
                
                $cikisInput.on('slidestop', function (event) {
                    var objt_tmp = $(this);
                    //console.log("ok");
                    //alert(objt_tmp.val());
                    startTimer();
                    
                    modul.Otomasyon.CikisSet($(this).attr("RoleID"), objt_tmp.val(), function (retVal) {
                        if (objt_tmp.val().toString() !== retVal.Degeri.toString()) {
                            //alert(retVal.Degeri);
                            objt_tmp.val(retVal.Degeri);
                        }
                    });
                });
                
                
            
            } else if ((cikis.Tipi === "3") || (cikis.Tipi === "4") || (cikis.Tipi === "6") || (cikis.Tipi === "7") || (cikis.Tipi === "8")) {
            
                if ((cikis.Tipi === "3") || (cikis.Tipi === "4")) {
                    btnIconSol = "ui-icon-arrow-u";
                    btnIconSag = "ui-icon-arrow-d";
                } else if (cikis.Tipi === "6") {
                    btnIconSol = "ui-icon-unlock";
                    btnIconSag = "ui-icon-lock";
                } else if (cikis.Tipi === "7") {
                    btnIconSol = "ui-icon-minus";
                    btnIconSag = "ui-icon-plus";
                } else if (cikis.Tipi === "8") {
                    btnIconSol = "ui-icon-eye";
                    btnIconSag = "";
                }
                
                if (cikis.Tipi === "8") {
                    btnHtml = "<a degeri=\"1\" class=\"ui-btn ui-corner-all " + btnIconSol + " ui-btn-icon-notext \">Y</a>";
                } else {
                    btnHtml = "<a degeri=\"1\" class=\"ui-btn ui-corner-all " + btnIconSol + " ui-btn-icon-notext \">Y</a><a degeri=\"2\" class=\"ui-btn ui-corner-all " + btnIconSag + " ui-btn-icon-notext\">A</a>";
                }
                    
                
                $cikisLi = $("<li>", {
                    "data-role" : "fieldcontain",
                    "data-icon" : "false"
                });
                    
                $tmpControlDiv = $("<div>", {
                    "style" : "float:right;"
                });
                    
                $tmpLabelDiv = $("<div>");
                    
                $cikisLabel = $("<label>", {
                    "for" : "panur-" + cikis.RoleId,
                    "html" : cikis.Adi
                });
                $cikisDiv = $("<div>", {
                    "id" : "panur-" + cikis.RoleId,
                    "RoleID" : cikis.RoleId,
                    "data-role" : "controlgroup",
                    "data-type" : "horizontal",
                    //"data-mini" : "true",
                    "html" : btnHtml
                });
                
                
                $tmpControlDiv.append($cikisDiv);
                $tmpLabelDiv.append($cikisLabel);

                $cikisLi.append($tmpControlDiv);
                $cikisLi.append($tmpLabelDiv);
                
                
                $cikisDiv.controlgroup();
                
                //if ((cikis.Tipi === "3") || (cikis.Tipi === "4") || (cikis.Tipi === "6") || (cikis.Tipi === "7") || (cikis.Tipi === "8")) {
                $cikisDiv.find("a").on('vmousedown', function () {

                    startTimer();
                    modul.Otomasyon.CikisSet($(this).parent().parent().attr("RoleID"), $(this).attr("degeri"), function (retVal) { });
                });
                //}
                if ((cikis.Tipi !== "7")) {
                    $cikisDiv.find("a").on('vmouseup', function () {

                        startTimer();
                        modul.Otomasyon.CikisSet($(this).parent().parent().attr("RoleID"), 0, function (retVal) { });
                    });
                }
                
                $HederItemUl.append($cikisLi);
            }
        }
        
        function cikisLislete(altKategoriId) {
            var $tmpHeader;
            modul.Otomasyon.CikislarGet(altKategoriId, function (retData) {
                $("#Cikis_Liste").empty();
                $tmpHeader = lstHederItemAdd();
                $.each(retData.Cikis, function (i, cikis) {
                    if (cikis !== null) {
                        //console.log(cikis);
                        lstItemAdd($tmpHeader, cikis);
                    }
                });
                $tmpHeader.listview();
                //$tmpHeader.trigger("create");
                cikisDegerGoster();
                startTimer();
            });
        }
        
        function PageInit() {
            $('#AltKategori_Baslik').on('click', function () {
                $('#popupLogin').popup('open');
            });

            $('#popupLogin').on('popupafteropen', function () {
                $('#giris_btn').removeClass('ui-disabled');
                $("#popupLoginMsg").hide();
                $("#us_txt").val("");
                $("#pw_txt").val("");

                $("#us_txt").focus();
            });

            $('#giris_btn').on('click', function () {
                ayarlarLogin($("#us_txt").val(), $("#pw_txt").val());
            });

            $("#us_txt,#pw_txt").keyup(function (event) {
                if (event.keyCode === 13) {
                    $("#giris_btn").click();
                }
            });
        }
        
        function PageBeforeShow() {
            var altKategoriId = sessionStorage.getItem("altKaregoriId"),
                altKategoriAdi = sessionStorage.getItem("altKaregoriAdi");
            $("#AltKategori_Baslik").html(altKategoriAdi);
            cikisLislete(altKategoriId);
        }
        
        function PageBeforeHide() {
            if (timerObj !== null) {
                clearInterval(timerObj);
                timerObj = null;
            }
        }
        
        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow,
            PageBeforeHide: PageBeforeHide
        };
    }());
    
    
    AgAyar = (function () {

        function networkAyarKaydet(objipAddr, objmskAddr, objgtwAddr, objprtNo) {
            console.log(objipAddr.val());
            if (utils.checkIPv4(objipAddr.val(), utils.ipRegex)) {
                if (utils.checkIPv4(objmskAddr.val(), utils.netmaskRegex)) {
                    if (utils.checkIPv4(objgtwAddr.val(), utils.ipRegex)) {
                        if ((utils.isNumber(objprtNo.val())) && ((objprtNo.val() > 0) && (objprtNo.val() < 65536))) {
                            showYesNoMsg(
                                "AG AYARLARI",
                                "Ağ ayarlarını değiştirmek istediğinizden eminmisiniz",
                                "",
                                function (retval) {
                                    console.log(retval);
                                    if (retval) {
                                        utils.showLoader("Lütfen Bekleyin");
                                        modul.NetworkSettingSave(
                                            objipAddr.val(),
                                            objmskAddr.val(),
                                            objgtwAddr.val(),
                                            objprtNo.val(),
                                            function (retVal) {
                                                if (retVal) {
                                                    setTimeout(function () { utils.pageChange("/"); }, 5000);
                                                } else { $.mobile.loading().fadeOut("fast", function () {showMsg("Hata", 1000); }); }
                                            }
                                        );
                                    }
                                }
                            );
                        } else { utils.txtHighlight(objprtNo); }
                    } else { utils.txtHighlight(objgtwAddr); }
                } else { utils.txtHighlight(objmskAddr); }
            } else { utils.txtHighlight(objipAddr); }
        }

        function PageInit() {
        }

        function PageBeforeShow() {
            $("#network_ayarlar input:text").removeAttr("style");
            modul.NetworkSettingGet(function (data) {
                if (data !== false) {
                    $("#network_ayarlar_ip_adres_txt").val(data.IpAddr);
                    $("#network_ayarlar_alt_ag_maskesi_txt").val(data.mskAddr);
                    $("#network_ayarlar_ag_gecidi_txt").val(data.gtwAddr);
                    $("#network_ayarlar_port_numarasi_txt").val(data.prtNbr);
                } else {
                    utils.pageChange("/");
                }
            });

            $('#network_ayarlar_kaydet_btn').on('click', function () {
                $("#network_ayarlar input:text").removeAttr("style");
                networkAyarKaydet($("#network_ayarlar_ip_adres_txt"),
                                  $("#network_ayarlar_alt_ag_maskesi_txt"),
                                  $("#network_ayarlar_ag_gecidi_txt"),
                                  $("#network_ayarlar_port_numarasi_txt"));
            });
        }
        
        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow
        };
    }());
    
    // >------- KULLANICI --- AYARLARI ------>
    KullaniciAyar = (function () {

        function userSave(username, newPass, newPassRep) {
            var retVal = utils.userPassCheck(username, newPass, newPassRep);
            if (retVal.ret) {
                $('#kullanici_kkaydet_btn').addClass('ui-disabled');
                modul.UserLoginSave(
                    username.val(),
                    newPass.val(),
                    function (retVal) {
                        if (retVal) {
                            showMsg(utils.messages.DEGISIKLIK_KAYDEDILDI, 1000);
                        } else {
                            showMsg(utils.messages.HATA_OLUSTU, 1000, function () {
                                utils.pageChange("/");
                            });
                        }
                        $('#kullanici_kkaydet_btn').removeClass('ui-disabled');
                    }
                );
            } else { showMsg(retVal.message, 1000); }
        }

        function settingUserSave(username, newPass, newPassRep) {
            var retVal = utils.userPassCheck(username, newPass, newPassRep);
            if (retVal.ret) {
                $('#kullanici_akaydet_btn').addClass('ui-disabled');
                modul.SettingLoginSave(
                    username.val(),
                    newPass.val(),
                    function (retVal) {
                        if (retVal) {
                            showMsg(utils.messages.DEGISIKLIK_KAYDEDILDI, 1000);
                        } else {
                            showMsg(utils.messages.HATA_OLUSTU, 1000, function () {
                                utils.pageChange("/");
                            });
                        }
                        $('#kullanici_akaydet_btn').removeClass('ui-disabled');
                    }
                );
            } else { showMsg(retVal.message, 1000); }
        }

        function PageInit() {

            $('#kullanici_kkaydet_btn').on('click', function () {
                 // KULLANICI GIRIS BILGILERI KAYDET
                $("#kullanici input:text, :password").removeAttr("style");
                userSave($("#kullanici_kkadi_txt"),
                          $("#kullanici_ksfr_txt"),
                          $("#kullanici_ksfrt_txt"));

            });

            $('#kullanici_akaydet_btn').on('click', function () {
                // AYARLAR GIRIS BILGILERI KAYDET
                $("#kullanici input:text, :password").removeAttr("style");
                settingUserSave($("#kullanici_akadi_txt"),
                                 $("#kullanici_asfr_txt"),
                                 $("#kullanici_asfrt_txt"));
            });
        }

        function PageBeforeShow() {
            $("#kullanici input:text, :password").removeAttr("style");
            $("#kullanici").find("input").val("");
        }
        
        
        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow
        };
    }());
    
    
    Cihazlar = (function () {
        
        var btnTimeOut;
        function lstHederItemAdd(baslikAdi) {
            var $katUl = $("<ul>", {
                "data-role" : "listview",
                "data-inset" : "true"
            }),  // "<li data-role=\"list-divider\">" + program.Kategori + "</li>"
                $katLi = $("<li>", {
                    "data-role" : "list-divider",
                    "html" : utils.decodeHTML(baslikAdi)
                });
            $katUl.append($katLi);
            $("#Cihaz_Liste").append($katUl);
            return $katUl;
        }
        
        function lstItemAdd($HederItemUl, itemCihaz) {
            /*
                cihazAdi : cihazAdi,
                cihazIp : cihazIp,
                cihazPort : cihazPort,
                cihazKullaniciAdi : cihazKullaniciAdi,
                cihazSifre : cihazSifre
            */
             
            var $katLi = $("<li>"),
                $katA = $("<a>", {
                    "href" : "#",
                    "cihazId" : itemCihaz.cihazId,
                    "html" : utils.decodeHTML(itemCihaz.cihazAdi)
                });
            
            $katA.on('click', function () {
               // sessionStorage.setItem("aktifCihazId", $(this).attr("cihazId"));
                //sessionStorage.setItem("altKaregoriAdi", $(this).html());
                
                utils.pageChange("#otomasyon");
                //window.localStorage.setItem("cachedCihazlar", null);
            });
                    
            $katA.on('vmousedown', function () {
                //alert("ok1");
                sessionStorage.setItem("aktifCihazId", $(this).attr("cihazId"));
                btnTimeOut = setTimeout(function () { utils.pageChange("#cihaz_duzelt"); }, 3000);
            });

            $katA.on('vmouseup', function () {
                if (btnTimeOut !== null) {
                    clearTimeout(btnTimeOut);
                    btnTimeOut = null;
                }
            });
            
            $katLi.append($katA);
            $HederItemUl.append($katLi);
        }
 
 
        
        function cihazListeleFn() {
            var $tmpHeader;
            
            modul.Cihazlar.Listele(function (retData) {
                $("#Cihaz_Liste").empty();
                if (retData !== null) {
                    //alert(retData);
                    $tmpHeader = lstHederItemAdd("Cihazlar");
                    $.each(retData, function (i, cihaz) {
                        if (cihaz !== null) {
                            lstItemAdd($tmpHeader, cihaz);
                        }
                    });
                    $tmpHeader.listview();
                } else {
                    setTimeout(function () {
                        showYesNoMsg("Cihazlar", "Sisteme cihaz tanıtmanız gerekiyor", "", function (retVal) {
                            if (retVal) {
                                setTimeout(function () { utils.pageChange("#cihaz_ekle"); }, 100);
                            }
                        });
                    }, 1000);
                }
            });
        }

        function PageInit() {
            if (modul.Cihazlar.CihazSayisi() === 1) {
                modul.Cihazlar.GetirIndex(0, function (retCihaz) {
                    if (retCihaz !== null) {
                        modul.Cihazlar.AktifCihazId = retCihaz.cihazId;
                        sessionStorage.setItem("aktifCihazId", retCihaz.cihazId);
                        utils.pageChange("#otomasyon");
                    }
                });
                
            }
                
           /*$('#cihaz_ekle_btn').on('click', function () {
               
                $("#cihaz_ekle input:text").removeAttr("style");
                cihazEkleFn($("#cihaz_ekle_adi_txt"),
                            $("#cihaz_ekle_ip_adres_txt"),
                            $("#cihaz_ekle_port_numarasi_txt"),
                            $("#cihaz_ekle_kullanici_adi_txt"),
                            $("#cihaz_ekle_sifre_txt"));
            });*/
        }

        function PageBeforeShow() {
            cihazListeleFn();
           // $("#cihaz_ekle input:text").removeAttr("style");
        }
        
        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow
        };
    }());
    
    
    CihazEkle = (function () {

        function cihazEkleFn(objadi, objipAddr, objprtNo, objkullaniciAdi, objsifre) {
            if (utils.checkIPv4(objipAddr.val(), utils.ipRegex)) {
                if ((utils.isNumber(objprtNo.val())) && ((objprtNo.val() > 0) && (objprtNo.val() < 65536))) {
                    if (utils.isNumberChar(objadi.val(), 20)) {
                        if (utils.isNumberChar(objkullaniciAdi.val(), 15)) {
                            if (utils.isNumberChar(objsifre.val(), 15)) {
                                utils.showLoader("Lütfen Bekleyin");
                                modul.Cihazlar.Ekle(
                                    utils.GuidGen(),
                                    objadi.val(),
                                    objipAddr.val(),
                                    objprtNo.val(),
                                    objkullaniciAdi.val(),
                                    objsifre.val()
                                );
                                $.mobile.loading().fadeOut("fast", function () {showMsg("Eklendi.", 1000); });
                            } else { utils.txtHighlight(objsifre); }
                        } else { utils.txtHighlight(objkullaniciAdi); }
                    } else { utils.txtHighlight(objadi); }
                } else { utils.txtHighlight(objprtNo); }
            } else { utils.txtHighlight(objipAddr); }
        }

        function PageInit() {

            $('#cihaz_ekle_btn').on('click', function () {
               
                $("#cihaz_ekle input:text").removeAttr("style");
                cihazEkleFn($("#cihaz_ekle_adi_txt"),
                            $("#cihaz_ekle_ip_adres_txt"),
                            $("#cihaz_ekle_port_numarasi_txt"),
                            $("#cihaz_ekle_kullanici_adi_txt"),
                            $("#cihaz_ekle_sifre_txt"));
            });
        }

        function PageBeforeShow() {
            $("#cihaz_ekle input:text").removeAttr("style");
        }
        
        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow
        };
    }());
    
    
    CihazDuzelt = (function () {

        function cihazDuzeltFn(objid, objadi, objipAddr, objprtNo, objkullaniciAdi, objsifre) {
            if (utils.checkIPv4(objipAddr.val(), utils.ipRegex)) {
                if ((utils.isNumber(objprtNo.val())) && ((objprtNo.val() > 0) && (objprtNo.val() < 65536))) {
                    if (utils.isNumberChar(objadi.val(), 20)) {
                        if (utils.isNumberChar(objkullaniciAdi.val(), 15)) {
                            if (utils.isNumberChar(objsifre.val(), 15)) {
                                utils.showLoader("Lütfen Bekleyin");
                                modul.Cihazlar.Duzelt(
                                    objid,
                                    objadi.val(),
                                    objipAddr.val(),
                                    objprtNo.val(),
                                    objkullaniciAdi.val(),
                                    objsifre.val()
                                );
                                $.mobile.loading().fadeOut("fast", function () {showMsg("Düzeltildi.", 1000); });
                            } else { utils.txtHighlight(objsifre); }
                        } else { utils.txtHighlight(objkullaniciAdi); }
                    } else { utils.txtHighlight(objadi); }
                } else { utils.txtHighlight(objprtNo); }
            } else { utils.txtHighlight(objipAddr); }
        }

        function PageInit() {

            $('#cihaz_duzelt_btn').on('click', function () {
               
                $("#cihaz_duzelt input:text").removeAttr("style");
                cihazDuzeltFn(modul.Cihazlar.AktifCihazId,
                            $("#cihaz_duzelt_adi_txt"),
                            $("#cihaz_duzelt_ip_adres_txt"),
                            $("#cihaz_duzelt_port_numarasi_txt"),
                            $("#cihaz_duzelt_kullanici_adi_txt"),
                            $("#cihaz_duzelt_sifre_txt"));
            });

            $('#cihaz_sil_btn').on('click', function () {
                showYesNoMsg("Cihaz Sil", "Scihazı silmek istediğinziden eminmisiniz?", "", function (retVal) {
                    if (retVal) {
                        modul.Cihazlar.Sil(modul.Cihazlar.AktifCihazId);
                        setTimeout(function () { utils.pageChange("#cihazlar"); }, 100);
                    }
                });
            });
            
            
        }

        function PageBeforeShow() {
            
            $("#cihaz_ekle input:text").removeAttr("style");
            modul.Cihazlar.AktifCihazId = sessionStorage.getItem("aktifCihazId");
            //alert("2:"); 
            if (modul.Cihazlar.AktifCihazId !== null) {
                modul.Cihazlar.Getir(modul.Cihazlar.AktifCihazId, function (retCihaz) {
                    
                /*
                    cihazAdi : cihazAdi,
                    cihazIp : cihazIp,
                    cihazPort : cihazPort,
                    cihazKullaniciAdi : cihazKullaniciAdi,
                    cihazSifre : cihazSifre
                */
                    $("#cihaz_duzelt_adi_txt").val(retCihaz.cihazAdi);
                    $("#cihaz_duzelt_ip_adres_txt").val(retCihaz.cihazIp);
                    $("#cihaz_duzelt_port_numarasi_txt").val(retCihaz.cihazPort);
                    $("#cihaz_duzelt_kullanici_adi_txt").val(retCihaz.cihazKullaniciAdi);
                    $("#cihaz_duzelt_sifre_txt").val(retCihaz.cihazSifre);
                });
            }
        }
        
        return {
            PageInit: PageInit,
            PageBeforeShow: PageBeforeShow
        };
    }());
// <------- KULLANICI --- AYARLARI ------<
    
	$(document).on('pageinit', '#otomasyon', Otomasyon.PageInit);
    $(document).on('pagebeforeshow', '#otomasyon', Otomasyon.PageBeforeShow);
    $(document).on('pageshow', '#otomasyon', Otomasyon.PageShow);
    

    $(document).on('pageinit', '#otomasyon-cikislar', OtomasyonCikislar.PageInit);
    $(document).on('pagebeforeshow', '#otomasyon-cikislar', OtomasyonCikislar.PageBeforeShow);
    $(document).on('pagebeforehide', '#otomasyon-cikislar', OtomasyonCikislar.PageBeforeHide);
    
    $(document).on('pageinit', '#network_ayarlar', AgAyar.PageInit);
    $(document).on('pagebeforeshow', '#network_ayarlar', AgAyar.PageBeforeShow);

    $(document).on('pageinit', '#kullanici', KullaniciAyar.PageInit);
    $(document).on('pagebeforeshow', '#kullanici', KullaniciAyar.PageBeforeShow);

    $(document).on('pageinit', '#cihazlar', Cihazlar.PageInit);
    $(document).on('pagebeforeshow', '#cihazlar', Cihazlar.PageBeforeShow);

    $(document).on('pageinit', '#cihaz_ekle', CihazEkle.PageInit);
    $(document).on('pagebeforeshow', 'cihaz_ekle', CihazEkle.PageBeforeShow);

    $(document).on('pageinit', '#cihaz_duzelt', CihazDuzelt.PageInit);
    $(document).on('pagebeforeshow', '#cihaz_duzelt', CihazDuzelt.PageBeforeShow);
    
    
}($, window.cOtomasyon.modul, window.cOtomasyon.utils));