// Empty initial perunSession object
$(document).ready(function() {

    // Reaction on button click
    //
    $("#projectsLink").click(function() {
        $("#projects-table").html(Configuration.LOADER_IMAGE);

        var data = {};
        callPerunSync("usersManager", "getVosWhereUserIsMember", data, {user: user.id});

        var table = PerunTable.create();
        table.addColumn("name", "Name");
        table.add(data);
        var tableHtml = table.draw();
        $("#projects-table").html(tableHtml);
    });

    $("#sshkeysLink").click(function() {
        $("#sshkeys-table").html(Configuration.LOADER_IMAGE);

        var data = {};
        callPerunSync("attributesManager", "getAttribute", data, {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"});

        var table = PerunTable.create();
        table.addColumn("value", "SSH Keys");

        table.addList(data);

        var tableHtml = table.draw();
        $("#sshkeys-table").html(tableHtml);
    });

    /*
     $("#certsLink").click(function(){
     $("#certs-table").html(Configuration.LOADER_IMAGE);
     
     var data = {};
     callPerunSync("attributesManager", "getAttribute", data, { user : user.id, attributeName: "urn:perun:user:attribute-def:def:userCertDNs" });
     
     var table = PerunTable.create();
     table.addColumn("value.0", "X.509 Certificate DN");
     table.addColumn("value.1", "X.509 Certificate Issuer");
     
     table.addArray(data);
     
     var tableHtml = table.draw();
     $("#certs-table").html(tableHtml);
     }); 
     */

    $("#identitiesLink").click(function() {
        $("#identities-table-fed").html(Configuration.LOADER_IMAGE);

        var data = {};
        callPerunSync("usersManager", "getUserExtSources", data, {user: user.id});

        var orgs = [];
        orgs["https://idp.upce.cz/idp/shibboleth"] = "University in Pardubice";
        orgs["https://idp.slu.cz/idp/shibboleth"] = "University in Opava";
        orgs["https://login.feld.cvut.cz/idp/shibboleth"] = "Faculty of Electrical Engineering, Czech Technical University In Prague";
        orgs["https://www.vutbr.cz/SSO/saml2/idp"] = "Brno University of Technology";
        orgs["https://shibboleth.nkp.cz/idp/shibboleth"] = "The National Library of the Czech Republic";
        orgs["https://idp2.civ.cvut.cz/idp/shibboleth"] = "Czech Technical University In Prague";
        orgs["https://shibbo.tul.cz/idp/shibboleth"] = "Technical University of Liberec";
        orgs["https://idp.mendelu.cz/idp/shibboleth"] = "Mendel University in Brno";
        orgs["https://cas.cuni.cz/idp/shibboleth"] = "Charles University in Prague";
        orgs["https://wsso.vscht.cz/idp/shibboleth"] = "Institute of Chemical Technology Prague";
        orgs["https://idp.vsb.cz/idp/shibboleth"] = "VSB – Technical University of Ostrava";
        orgs["https://whoami.cesnet.cz/idp/shibboleth"] = "CESNET";
        orgs["https://helium.jcu.cz/idp/shibboleth"] = "University of South Bohemia";
        orgs["https://idp.ujep.cz/idp/shibboleth"] = "Jan Evangelista Purkyne University in Usti nad Labem";
        orgs["https://idp.amu.cz/idp/shibboleth"] = "Academy of Performing Arts in Prague";
        orgs["https://idp.lib.cas.cz/idp/shibboleth"] = "Academy of Sciences Library";
        orgs["https://shibboleth.mzk.cz/simplesaml/metadata.xml"] = "Moravian  Library";
        orgs["https://idp2.ics.muni.cz/idp/shibboleth"] = "Masaryk University";
        orgs["https://idp.upol.cz/idp/shibboleth"] = "Palacky University, Olomouc";
        orgs["https://idp.fnplzen.cz/idp/shibboleth"] = "FN Plzen";
        orgs["https://id.vse.cz/idp/shibboleth"] = "University of Economics, Prague";
        orgs["https://shib.zcu.cz/idp/shibboleth"] = "University of West Bohemia";
        orgs["https://idptoo.osu.cz/simplesaml/saml2/idp/metadata.php"] = "University of Ostrava";
        orgs["https://login.ics.muni.cz/idp/shibboleth"] = "MetaCentrum";
        orgs["https://idp.hostel.eduid.cz/idp/shibboleth"] = "eduID.cz Hostel";
        orgs["https://shibboleth.techlib.cz/idp/shibboleth"] = "National Library of Technology";

        var social = [];
        social["@google.extidp.cesnet.cz"] = "Google";
        social["@facebook.extidp.cesnet.cz"] = "Facebook";
        social["@mojeid.extidp.cesnet.cz"] = "mojeID";
        social["@linkedin.extidp.cesnet.cz"] = "LinkedIn";
        social["@twitter.extidp.cesnet.cz"] = "Twitter";
        social["@seznam.extidp.cesnet.cz"] = "Seznam";

        // Clean up extSources from the internal one
        var userExtSources = [];
        for (var i in data) {
            var obj = data[i];
            if (obj.extSource.type == 'cz.metacentrum.perun.core.impl.ExtSourceIdp') {
                if (obj.extSource.name == 'https://extidp.cesnet.cz/idp/shibboleth') {
                    var login = obj.login.split('@')[0];
                    for (var s in social) {
                        if (obj.login.search(s) >= 0) {
                            userExtSource = {login: login, extSource: social[s]};
                        }
                    }
                } else {
                    userExtSource = {login: obj.login, extSource: orgs[obj.extSource.name]};
                }
                userExtSources.push(userExtSource);
            }
        }

        var table = PerunTable.create();
        table.addColumn("login", "Identity");
        table.addColumn("extSource", "Issuer");

        table.add(userExtSources);

        var tableHtml = table.draw();
        $("#identities-table-fed").html(tableHtml);

        userExtSources = [];
        $("#identities-table-cert").html(Configuration.LOADER_IMAGE);
        for (var i in data) {
            var obj = data[i];
            if (obj.extSource.type == 'cz.metacentrum.perun.core.impl.ExtSourceX509') {
                userExtSource = {login: decodeURIComponent((obj.login).replace(/\\x/g, '%')), extSource: obj.extSource.name};
                userExtSources.push(userExtSource);
            }
        }

        var table = PerunTable.create();
        table.addColumn("login", "Identity");
        table.addColumn("extSource", "Issuer");

        table.add(userExtSources);

        var tableHtml = table.draw();
        $("#identities-table-cert").html(tableHtml);

    });


    // Adding new identity
    $("#new-identity").click(function() {

    });


    $("#addNewSSHKey").click(function() {

        // Get current SSH keys
        var sshKeyAttribute = {};
        callPerunSync("attributesManager", "getAttribute", sshKeyAttribute, {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"});

        sshKeyAttribute.value.push($("#newSSHKey")[0].value);

        // Store the new attribute
        var data = {};
        callPerunSyncPost("attributesManager", "setAttribute", data, {user: user.id, attribute: sshKeyAttribute});

        // Reload the table
        var elem = document.getElementById("sshkeysLink");
        if (typeof elem.onclick == "function") {
            elem.onclick.apply(elem);
        }
    });

    $("#languageChangeEn").click(function() {

        // Get current value of the attribute
        var langAttribute = {};
        callPerunSync("attributesManager", "getAttribute", langAttribute, {user: user.id, attributeName: "urn:perun:user:attribute-def:def:preferredLanguage"});

        langAttribute.value = "en";

        // Store the new attribute
        var data = {};
        callPerunSyncPost("attributesManager", "setAttribute", data, {user: user.id, attribute: langAttribute});

        // Show new value in GUI
        $("#user-preferredLanguage").text("en");
    });

    $("#languageChangeCs").click(function() {

        // Get current value of the attribute
        var langAttribute = {};
        callPerunSync("attributesManager", "getAttribute", langAttribute, {user: user.id, attributeName: "urn:perun:user:attribute-def:def:preferredLanguage"});

        langAttribute.value = "cs";

        // Store the new attribute
        var data = {};
        callPerunSyncPost("attributesManager", "setAttribute", data, {user: user.id, attribute: langAttribute});

        // Show new value in GUI
        $("#user-preferredLanguage").text("cs");
    });


    $("#user-timezone-list li").click(function() {
        // Get current value of the attribute
        var timezoneAttribute = {};
        callPerunSync("attributesManager", "getAttribute", timezoneAttribute, {user: user.id, attributeName: "urn:perun:user:attribute-def:def:timezone"});

        timezoneAttribute.value = $(this).text().trim();

        // Store the new attribute
        var data = {};
        callPerunSyncPost("attributesManager", "setAttribute", data, {user: user.id, attribute: timezoneAttribute});

        // Show new value in GUI
        $("#user-timezone").text($(this).text());
    });
});
