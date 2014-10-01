/*jslint browser: true*/
/*global $, jQuery, alert, console, btoa*/

if (typeof window.cOtomasyon === 'undefined') {
    window.cOtomasyon = {};
}

window.cOtomasyon.modul = (function () {
    "use strict";
    
    var AjaxProcces, Otomasyon, Cihazlar,
        
        MIBUrl = "http://192.168.20.227/callback=",
        MIBAuthorization = btoa("admin:admin"),
        QueryOk = "Ok";
    
    function CihazSec(cihaz) {
        if (cihaz !== null) {
            MIBUrl = "http://" + cihaz.cihazIp + ":" + cihaz.cihazPort + "/callback=";
            MIBAuthorization = btoa(cihaz.cihazKullaniciAdi + ":" + cihaz.cihazSifre);
        }
    }
    
    function CihazTest(cihaz, succ) {
        $.ajax({url: "http://" + cihaz.cihazIp + ":" + cihaz.cihazPort + "/",
            type: "GET",
            timeout: 5000,
            headers: {
                "Authorization": "Basic " +  btoa(cihaz.cihazKullaniciAdi + ":" + cihaz.cihazSifre)
            },
            statusCode: {
                200: function (response) {
                    alert("200:" + response);
                    succ(true);
                },
                0: function (response) {
                    alert("0:" + response);
                    succ(false);
                }
            }
            });
        
        alert("1:");
    }
    
    AjaxProcces = (function () {
        
        function ajaxPostRetData(data, succ) {
            try {
                $.ajax({
                    url: MIBUrl,
                    timeout: 1000,
                    async: false,
                   // dataType: "json",
                    data: data,
                    headers: {
                        "Authorization": "Basic " +  btoa("admin:admin")
                    },
                    success: function (rtnFnc) {
                        var retData = rtnFnc.replace(",]", "]");
                        //alert(retData);
                        succ(jQuery.parseJSON(retData.slice(1, retData.length - 1)));
                    },
                    error: function (rtnFnc, error) {
                        succ(false);
                    }
                });
            } catch (err) {
                //alert(err);
                succ(false);
            }
        }

        function AjaxPostRetBool(data, succ) {
            ajaxPostRetData(data, function (data) {
                if (data !== false) {
                    succ((data.Durum === QueryOk));
                } else {
                    succ(false);
                }
                    
            });
        }

        function AjaxPostRetVal(data, succ) {
            var retVal = {
                Durum: false,
                RetVal: 0
            };

            ajaxPostRetData(data, function (data) {
                retVal.Durum = (data.Durum === QueryOk);
                if (retVal.Durum) {
                    retVal.RetVal = data.RetDt;
                }
                succ(retVal);
            });
        }
        
        return {
            AjaxPostRetData: ajaxPostRetData,
            AjaxPostRetBool: AjaxPostRetBool,
            AjaxPostRetVal: AjaxPostRetVal
            
        };
    }());
    
    
    function AyarlarLogin(UserName, Passw, succ) {
        AjaxProcces.AjaxPostRetBool({ user: UserName, pass: Passw }, succ);
    }

//>>>>>>>>> NETWORK AYARLARI >>>>>>>>>>>>>>>
    function NetworkSettingGet(succ) {
        AjaxProcces.AjaxPostRetData({Islem: "GetSetting"}, function (data) { succ(data); });
    }
    
    function NetworkSettingSave(objipAddr, objmskAddr, objgtwAddr, objprtNo, succ) {
        AjaxProcces.AjaxPostRetBool({Islem: "SaveSetting", ipAddr: objipAddr, gtwAddr: objgtwAddr, mskAddr: objmskAddr, prtNbr: objprtNo}, succ);
    }
//<<<<<<<< NETWORK AYARLARI <<<<<<<<<<<<<<<<
    
//>>>>>>>>> KULLANICI AYARLARI >>>>>>>>>>>>>>>
    function UserLoginSave(userp, newpass, succ) {
        AjaxProcces.AjaxPostRetBool({Islem: "SaveSetting", user: userp, pass: newpass, passtype: "user"}, succ);
    }
    
    function SettingLoginSave(userp, newpass, succ) {
        AjaxProcces.AjaxPostRetBool({Islem: "SaveSetting", user: userp, pass: newpass, passtype: "stng"}, succ);
    }
    
//<<<<<<<< KULLANICI AYARLARI <<<<<<<<<<<<<<<<    

//>>>>>>>>> SENARYO AYARLARI >>>>>>>>>>>>>>>    
    //>>>>>>>>> SENARYO KAT AYARLARI >>>>>>>>>>>>>>>
    Otomasyon = (function () {

        function KategoriGet(succ) {
            AjaxProcces.AjaxPostRetData(null, function (data) { succ(data); });
        }
    
        function CikislarGet(altKategoriId, succ) {
            AjaxProcces.AjaxPostRetData({"Kid" : altKategoriId}, function (data) { succ(data); });
        }
    
        function CikisSet(roleId, degeri, succ) {
            AjaxProcces.AjaxPostRetData({ RoleId: roleId, Degeri: degeri }, function (data) { succ(data); });
        }
    
        function CikisDegerGet(altKategoriId, succ) {
            AjaxProcces.AjaxPostRetData({Islem: "Refresh", Kid: altKategoriId}, function (data) { succ(data); });
        }

        return {
            SelectSenaryoKaT: null,
            KategoriGet: KategoriGet,
            CikislarGet: CikislarGet,
            CikisSet: CikisSet,
            CikisDegerGet: CikisDegerGet
        };
    }());
    //<<<<<<<<< SENARYO KAT AYARLARI <<<<<<<<<<<<<<<<       
    
    //>>>>>>>>> CİHAZLAR >>>>>>>>>>>>>>>
    Cihazlar = (function () {
       
        
        function Ekle(cihazId, cihazAdi, cihazIp, cihazPort, cihazKullaniciAdi, cihazSifre) {
            var CihazDataBase, tmpCihazlarStr;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                } else {
                    CihazDataBase  = [];
                }
            } catch (err) {
                CihazDataBase = [];
            }
            
            
            CihazDataBase.push({
                cihazId : cihazId,
                cihazAdi : cihazAdi,
                cihazIp : cihazIp,
                cihazPort : cihazPort,
                cihazKullaniciAdi : cihazKullaniciAdi,
                cihazSifre : cihazSifre
            });
         

            window.localStorage.setItem("cachedCihazlar", JSON.stringify(CihazDataBase));
        }
    
        function Sil(cihazId) {
            var CihazDataBase, tmpCihazlarStr, tmpCihazIndex = null;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                    $.each(CihazDataBase, function (i, cihaz) {
                        if (cihaz !== null) {
                            if (cihaz.cihazId === cihazId) {
                                tmpCihazIndex = i;
                            }
                        }
                    });
                      
                    if (tmpCihazIndex !== null) {
                        CihazDataBase.splice(tmpCihazIndex, 1);
                        window.localStorage.setItem("cachedCihazlar", JSON.stringify(CihazDataBase));
                    }
                }
            } catch (err) {
                alert(err);
            }
        }
     
        function Duzelt(cihazId, cihazAdi, cihazIp, cihazPort, cihazKullaniciAdi, cihazSifre) {
            var CihazDataBase, tmpCihazlarStr;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                    $.each(CihazDataBase, function (i, cihaz) {
                        if (cihaz !== null) {
                            if (cihaz.cihazId === cihazId) {
                                cihaz.cihazAdi = cihazAdi;
                                cihaz.cihazIp = cihazIp;
                                cihaz.cihazPort = cihazPort;
                                cihaz.cihazKullaniciAdi = cihazKullaniciAdi;
                                cihaz.cihazSifre = cihazSifre;
                                window.localStorage.setItem("cachedCihazlar", JSON.stringify(CihazDataBase));
                            }
                        }
                    });
                }
            } catch (err) {
               
            }
        }
    
        function CihazSayisi() {
            var CihazDataBase, tmpCihazlarStr;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                    return CihazDataBase.length;
                }
            } catch (err) {
            }
            return 0;
        }
    
        function Listele(succ) {
            var CihazDataBase, tmpCihazlarStr;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                } else {
                    CihazDataBase = null;
                }
                 
            } catch (err) {
                alert("1:" + err);
                CihazDataBase = null;
            }
            succ(CihazDataBase);
        }
    
        function Getir(cihazId, succ) {
            var CihazDataBase, tmpCihazlarStr, retCihaz = null;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                retCihaz = null;
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                    $.each(CihazDataBase, function (i, cihaz) {
                        if (cihaz !== null) {
                            if (cihaz.cihazId === cihazId) {
                                retCihaz = cihaz;
                            }
                        }
                    });
                }
            } catch (err) {
               
            }
            succ(retCihaz);
        }
    
        function GetirIndex(index, succ) {
            var CihazDataBase, tmpCihazlarStr, retCihaz = null;
            try {
                tmpCihazlarStr = window.localStorage.getItem("cachedCihazlar");
                retCihaz = null;
                if (typeof tmpCihazlarStr !== typeof null) {
                    CihazDataBase = JSON.parse(tmpCihazlarStr);
                    if (CihazDataBase.length > 0) {
                        if (index < CihazDataBase.length) {
                            retCihaz = CihazDataBase[index];
                        }
                    }
                }
            } catch (err) {
               
            }
            succ(retCihaz);
        }

        return {
            AktifCihazId: null,
            Ekle: Ekle,
            Sil: Sil,
            Duzelt: Duzelt,
            Listele: Listele,
            Getir: Getir,
            GetirIndex: GetirIndex,
            CihazSayisi: CihazSayisi
        };
    }());
    //<<<<<<<<< CİHAZLAR <<<<<<<<<<<<<<<<   
 
    
    return {
        CihazSec: CihazSec,
        CihazTest: CihazTest,
        AyarlarLogin: AyarlarLogin,
        NetworkSettingGet: NetworkSettingGet,
        NetworkSettingSave: NetworkSettingSave,
        UserLoginSave: UserLoginSave,
        SettingLoginSave: SettingLoginSave,
        Otomasyon: Otomasyon,
        Cihazlar: Cihazlar
    };

}());