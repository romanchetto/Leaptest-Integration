
function GetSch()
    {
        const address = document.getElementById("LeaptestControllerURL").value;
        const accessKey = document.getElementById("AccessKey").value;

        if(!address || !accessKey)
        {
            alert('"Address or Access Key field is empty! Cannot connect to server!"');
        }
        else
        {

            if(document.getElementById('container').innerHTML == "")
            {

                $j.ajax({
                   url: address + "/api/v1/runSchedules",
                   type: 'GET',
                   headers: { 'AccessKey': accessKey, 'Integration':'Teamcity-Integration' },
                   dataType:"json",
                   success: function(json)
                   {
                         let container = document.getElementById("container");
                         container.style.display='block';

                         let schName = new Array();
                         let schId = new Array();
                         let schProjectId = new Array();

                         for (let i = 0; i < json.length; i++) {
                             if (json[i].IsDisplayedInScheduleList == true) {
                                 schId.push(json[i].Id);
                                 schName.push(json[i].Title);
                                 schProjectId.push(json[i].ProjectId);
                             }
                         }

                         let projects = new Array();

                         $j.ajax({
                            url: address + "/api/v1/Projects",
                            type: 'GET',
                            headers: { 'AccessKey': accessKey, 'Integration':'Teamcity-Integration' },
                            dataType: "json",
                            success: function(projJson)
                            {
                                for(let i = 0; i < projJson.length; i++)
                                    projects.push(projJson[i].Title);

                                for(let i = 0; i < schProjectId.length; i++)
                                {
                                    for(let j = 0; j < projJson.length; j++)
                                    {

                                        if(schProjectId[i] == projJson[j].Id)
                                        {
                                            schProjectId[i] = projJson[j].Title;
                                        }
                                    }
                                }
                                projJson = null;

                                container.innerHTML += '<br>';

                                let drpdwn = document.createElement('ul');
                                drpdwn.className = 'ul-treefree ul-dropfree';

                                for(let i = 0; i < projects.length; i++)
                                {
                                    let projectli = document.createElement('li');

                                    let drop = document.createElement('div');
                                    drop.class = 'drop';
                                    drop.style = 'background-position: 0px 0px;';
                                    projectli.appendChild(drop);
                                    projectli.innerHTML+=projects[i];

                                    let schul = document.createElement('ul');
                                    schul.style = 'display:none; font-weight: normal;';

                                    for(let j = 0; j < schProjectId.length; j++)
                                    {
                                        if(projects[i] == schProjectId[j])
                                        {
                                            let schli = document.createElement('li');
                                            let chbx = document.createElement('input');
                                            chbx.type = 'checkbox';
                                            chbx.name = schName[j];
                                            chbx.id = i;
                                            chbx.value = schId[j];

                                            schli.appendChild(chbx);
                                            schli.innerHTML+=schName[j];
                                            schul.appendChild(schli);
                                        }
                                    }

                                    projectli.appendChild(schul);
                                    drpdwn.appendChild(projectli);
                                }

                                container.appendChild(drpdwn);
                                container.innerHTML += '<br>';

                                container.style.visibility = 'visible';

                                $j(".ul-dropfree").find("li:has(ul)").prepend('<div class="drop"></div>');
                                $j(".ul-dropfree div.drop").click(function()
                                {
                                    if ($j(this).nextAll("ul").css('display')=='none')
                                    {
                                        $j(this).nextAll("ul").slideDown(400);
                                        $j(this).css({'background-position':"-11px 0"});
                                    } else
                                    {
                                        $j(this).nextAll("ul").slideUp(400);
                                        $j(this).css({'background-position':"0 0"});
                                    }
                                });
                                $j(".ul-dropfree").find("ul").slideUp(400).parents("li").children("div.drop").css({'background-position':"0 0"});


                                let boxes = $j("#container input:checkbox");
                                let existingTests = new Array();
                                existingTests = ScheduleNames.value.split("\n");

                                if (ScheduleNames.value != null && ScheduleIds.value != null) {

                                    for (let i = 0; i < existingTests.length; i++) {
                                        for (j = 0; j < boxes.length; j++) {
                                            console.log(boxes[j].getAttributeNode('name').value)
                                            if (existingTests[i] == boxes[j].getAttributeNode('name').value)
                                                $j(boxes[j]).prop('checked', 'checked');
                                        }
                                    }
                                }

                                $j("#container input:checkbox").on("change", function ()
                                {
                                let NamesArray = new Array();
                                let IdsArray = new Array();

                                for (let i = 0; i < boxes.length; i++) {
                                    let box = boxes[i];
                                    if ($j(box).prop('checked')) {
                                        NamesArray[NamesArray.length] = $j(box).attr('name');
                                        IdsArray[IdsArray.length] = $j(box).val();
                                    }
                                }
                                ScheduleNames.value = NamesArray.join("\n");
                                ScheduleIds.value = IdsArray.join("\n");

                                });

                                $j(document).click(function (event) {
                                    if ($j(event.target).closest('#container').length == 0 && $j(event.target).attr('id') != 'selectButton')
                                    {
                                        $j("#container input:checkbox").remove();
                                        $j("#container li").remove();
                                        $j("#container ul").remove();
                                        $j("#container br").remove();

                                        container.style.display='none';
                                    }
                                });
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                alert(
                                "Error occurred! Cannot get the list of Projects!\n" +
                                "Status: " + textStatus + "\n" +
                                "Error: " + errorThrown + "\n" +
                                "This may occur because of the next reasons:\n" +
                                "1.Wrong Controller URL\n" +
                                "2.Controller is not running or updating now, check it in services\n" +
                                "3.Your Leaptest Controller port is blocked.\nUse 'netstat -na | find \"9000\"' command, The result should be:\n 0.0.0.0:9000  0.0.0.0:0  LISTENING\n" +
                                "4.You are using https in controller URL, which is not supported. HTTP only!\n" +
                                "5.Your browser has such a setting enabled that blocks any http requests from https\n" +
                                "If nothing helps, please contact support https://leaptest.com/support"
                                );
                            }
                         });

                   },
                   error: function(XMLHttpRequest, textStatus, errorThrown){
                                alert(
                                "Error occurred! Cannot get the list of Projects!\n" +
                                "Status: " + textStatus + "\n" +
                                "Error: " + errorThrown + "\n" +
                                "This may occur because of the next reasons:\n" +
                                "1.Wrong Controller URL\n" +
                                "2.Controller is not running or updating now, check it in services\n" +
                                "3.Your Leaptest Controller port is blocked.\nUse 'netstat -na | find \"9000\"' command, The result should be:\n 0.0.0.0:9000  0.0.0.0:0  LISTENING\n" +
                                "4.You are using https in controller URL, which is not supported. HTTP only!\n" +
                                "5.Your browser has such a setting enabled that blocks any http requests from https\n" +
                                "If nothing helps, please contact support https://leaptest.com/support"
                                );
                   }
                });
            }
            else
            {
                $j("#container input:checkbox").remove();
                $j("#container li").remove();
                $j("#container ul").remove();
                $j("#container br").remove();
                GetSch();
            }
        }
    }



