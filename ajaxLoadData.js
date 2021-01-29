$(document).ready(function() {
    var time_indicator = ''
    var vehicle_img = ""
    icon_type= ""
    var previousNode = {}
    var previousAction = ""
    var upComingAction = ""
    var upComingAction2 = ""
    var mymap = L.map('mapid').setView([57.467053 , 18.487117], 10);
    var t = new Date();
    var hour = t.getHours()
    var minutes = t.getMinutes()
    var seconds = t.getSeconds()
    var time = hour + ':' + minutes + ':' + seconds
    var chosenDo = ""

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYmVhdGF2b25nIiwiYSI6ImNrazg1OHp2MzBqOWUydm1oc2oxeTM2bTYifQ.VcuLIamxk3o81B6Y18HVzQ'
    }).addTo(mymap);

    var greenIcon = L.icon({
        iconUrl: 'images/sign-in-alt-solid.png',                
        iconSize:     [25, 19]
    });

    var redIcon = L.icon({
        iconUrl: 'images/sign-in-alt-solid-red.png',                
        iconSize:     [25, 19]
    });


    $.ajax({
        dataType: 'json',
        success: function(data) {
            $.each(data, function(key, value) {
                var previousHalfHour = []
                var nextHalfHour = []
                var currentposition = [value.lat, value.long]
                previousHalfHour.push(currentposition)
                nextHalfHour.push(currentposition)
                if (value.status === 'on-time') {
                    time_indicator = "<img src='images/green-oval.png' class='oval'>"
                    indicator_strong = "<img src='images/dark-green-oval.png' class='oval'>"
                }
                if (value.status === 'late') {
                    time_indicator = "<img src='images/pink-oval.png' class='oval'>"
                    indicator_strong = "<img src='images/red-oval.png' class='oval'>"
                }
                if (value.status === "") {
                    time_indicator = ""
                }
                if (value.vehicle_type === 'special') {
                    vehicle_img = "images/purple-car.png"
                    icon_type = "images/purple-marker.png"
                } else {
                    vehicle_img = "images/green-car.png"
                    icon_type = "images/green-marker.png"
                }
                if (value.upComingNodes[0].action = 'pickup') {
                    upComingAction = "images/sign-in-alt-solid-red.png"
                } 
                if (value.upComingNodes[0].action = 'dropoff') {
                    upComingAction = "images/sign-in-alt-solid.png"
                }
                if (value.upComingNodes[1].action = 'pickup') {
                    upComingAction2 = "images/sign-in-alt-solid-red.png"
                } 
                if (value.upComingNodes[1].action = 'dropoff') {
                    upComingAction2 = "images/sign-in-alt-solid.png"
                }

                $.each(value.previousNodes, function(x, y) {
                    var pos = [y.lat, y.long]
                    previousHalfHour.push(pos)
                    if (y.action === "dropoff") {
                        var dropoff = L.marker(pos, {icon: redIcon}).addTo(mymap)
                        $(dropoff._icon).addClass(value.car + 'marker polyline')
                    }
                    if (y.action === "pickup") {
                        var pickup = L.marker(pos, {icon: greenIcon}).addTo(mymap)
                        $(pickup._icon).addClass(value.car + 'marker polyline')

                    }
                    if (y.action !== 'coordinate') {
                        previousNode = y
                        if (y.action = 'dropoff') {
                            previousAction = "images/sign-in-alt-solid.png"
                        }
                        if (y.action = 'pickup') {
                            previousAction = "images/sign-in-alt-solid-red.png"
                        }
                        return false
                    }                   
                })

                $.each(value.upComingNodes, function(x, y) {
                    var pos = [y.lat, y.long]
                    nextHalfHour.push(pos) 
                    if (y.action === 'pickup') {
                        var pickup = L.marker(pos, {icon: greenIcon}).addTo(mymap)
                        $(pickup._icon).addClass(value.car + 'marker polyline')
                    }
                    if (y.action === 'dropoff') {
                        var dropoff = L.marker(pos, {icon: redIcon}).addTo(mymap)
                        $(dropoff._icon).addClass(value.car + 'marker polyline')
                    }            
                })

                var polylinePrevious = L.polyline(previousHalfHour, {className: value.car+'polyline polyline', color: 'green', weight: 7}).addTo(mymap);  
                var polylineNext = L.polyline(nextHalfHour, {className: value.car+'polyline polyline', color: 'green', weight: 7, dashArray: '3, 10', dashOffset: '0'}).addTo(mymap);    
                
                L.marker([value.lat, value.long], {icon: new L.DivIcon({
                    className: 'div-icon',
                    html: 
                    '<div class="hover-popup hide ' + value.car + '">' + 
                        '<div class="col-sm-12">' +
                            '<div class="row">' +
                                '<p class="col-sm-9 text-popup bold">Senast uppdaterad: </p><p class="col-sm-3 text-popup green bold">'+ value.previousNodes[0].time + '</p>' +
                            '</div>' +
                            '<div class="row col-sm-12 list">' +
                                '<div class="col-sm-1 time">' +
                                    indicator_strong +
                                '</div>' +
                                '<div class="col-sm-11">' +
                                    '<p class="text-popup indicator">'+ value.time +'</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row col-sm-12 list">' +
                                '<div class="col-sm-1 to-from">' +
                                    '<img src=' + previousAction + ' class="oval" alt="">' +
                                '</div>' +
                                '<div class="col-sm-11 node-info">' +
                                
                                    '<p class="text-popup indicator "><i class="fa fa-check-circle" aria-hidden="true"></i> ' + previousNode.time + '<br>' + previousNode.address + '</p>' +
                                '</div>' +                               
                            '</div>' +                         
                            '<div class="row col-sm-12 list">' +
                            '<p class=border></p>' +
                                '<div class="col-sm-1 to-from">' +
                                    '<img src=' + upComingAction + ' class="oval" alt="">' +
                                '</div>' +
                                '<div class="col-sm-11 node-info">' +
                                    '<p class="text-popup indicator">' + value.upComingNodes[0].time + '<br>' + value.upComingNodes[0].address + '</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row col-sm-12 list">' +
                                '<div class="col-sm-1 to-from">' +
                                    '<img src=' + upComingAction2 + ' class="oval" alt="">' +
                                '</div>' +
                                '<div class="col-sm-11 node-info">' +
                                    '<p class="text-popup indicator">' + value.upComingNodes[1].time + '<br>' + value.upComingNodes[1].address + '</p>' +
                                '</div>' +
                            '</div>' +

                            '<div class="row col-sm-12 list">' +
                                '<div class="col-sm-7 list">' +
                                    '<p class="text-popup bold">Antal personer: </p>' +
                                '</div>' +
                                '<div class="col-sm-1 alone list">' +
                                    '<p class="text-popup">1</p>' +
                                '</div>' +
                            '</div>' +                                               
                        '</div>' +
                    '</div>' +
                    '<div id="marker-div'+ value.car +'" class="marker" onmouseover="showPopup('+ value.car +'); showPolyline('+ value.car +')" onmouseout="removePolyline('+ value.car +'); removePopup('+ value.car +')";>' + 
                        '<img class="div-image" src=' + icon_type + '>' +
                            '<div class="icon-text">' + value.car + '</div>' + 
                        '</img>' + 
                    '</div>'
                })} ).addTo(mymap);

                var detail=document.getElementById('detail')
                
                $("#drive-order-list").append(
                    "<li onmouseover='showPopup("+ value.car +"); showPolyline("+ value.car +")' onmouseout='removePolyline("+ value.car +"); removePopup("+ value.car +")'; onclick='listClick(" + JSON.stringify(value) + ");' class='car listitem" + value.car + "'>" + 
                        "<div class='row'>" + 
                            "<div class='car-div col-xs-3'>" + 
                                "<img src=" + vehicle_img + " class='car-img'>" + 
                                    "<p class='car-number'>" + value.car + "</p>" + 
                            "</div>" +
                            "<div class='col-xs-2 info-div'>" + 
                                "<p class='text'>" + value.start + "</p>" + 
                            "</div>" + 
                            "<div class='col-xs-2 info-div'>" + 
                                "<p class='text'>" + value.stop + "</p>" +
                            "</div>" +
                            "<div class='col-xs-2 info-div'>" + 
                                "<p class='text'>" + value.nodes + "</p>" + 
                            "</div>" + 
                            "<div class='col-xs-3 car-div'>" + 
                                time_indicator + 
                                "<p class='minutes'>" +  
                                    value.time + 
                                "</p>" + 
                            "</div>" +
                        "</div>" + 
                    "</li>");

                    
         });


        },
        url: '/do.json'
    });
	// $().popover({container: 'body'});
})	


function showPolyline(carNumber) {
    var a = document.getElementsByClassName(carNumber.toString()+'polyline');
    for (i = 0; i < a.length; i++) {
        a[i].classList.remove('polyline')
    }
    var b = document.getElementsByClassName(carNumber.toString()+'marker');
    for (i = 0; i < b.length; i++) {
        b[i].classList.remove('polyline')
    }
    var c = document.getElementsByClassName('marker');
    for (i = 0; i < c.length; i++) {
        if (c[i].id !== 'marker-div' + carNumber.toString()) {
            c[i].classList.add('polyline')
        }
    }
}

function removePolyline(carNumber) {
    var a = document.getElementsByClassName(carNumber.toString()+'polyline');
    for (i = 0; i < a.length; i++) {
        a[i].classList.add('polyline')
    }
    var b = document.getElementsByClassName(carNumber.toString()+'marker');
    for (i = 0; i < b.length; i++) {
        b[i].classList.add('polyline')
    }
    var c = document.getElementsByClassName('marker');
    for (i = 0; i < c.length; i++) {
        if (c[i].id !== 'marker-div' + carNumber.toString()) {
            c[i].classList.remove('polyline')
        }
    }
}

function setActive(element, classname, activator) {
    var a = document.getElementsByClassName(classname);
    for (i = 0; i < a.length; i++) {
        a[i].classList.remove(activator)
    }
    element.classList.add(activator);
    chosenDo = ""    
}

function showPopup(carNumber) {
    var a = document.getElementsByClassName(carNumber.toString());
    var listobj = document.getElementsByClassName('listitem'+carNumber.toString());
    for (i = 0; i < a.length; i++) {
        a[i].classList.remove('hide')
    }  
    for (i = 0; i < listobj.length; i++) {
        listobj[i].classList.add('grey')
    }
}

function removePopup(carNumber) {
    var a = document.getElementsByClassName(carNumber.toString());
    var listobj = document.getElementsByClassName('listitem'+carNumber.toString());
    for (i = 0; i < a.length; i++) {
        a[i].classList.add('hide')
    }
    for (i = 0; i < listobj.length; i++) {
        listobj[i].classList.remove('grey')
    }
}

function listClick(carNumber) {
    setActive(document.getElementById('detail'), 'view', 'current')
    setActive(document.getElementById('second'), 'menu-item', 'active')
    setActive(document.getElementById('text-detail'), 'text-menu', 'text-active')
    chosenDo = carNumber.car.toString()
    var pickupIcon = ""
    console.log(chosenDo)
    $.ajax({
        dataType: 'json',
        success: function(data) {
            $.each(data, function(key, value) {
                if (value.car.toString() === chosenDo) {
                    $("#vehicle-info").append(
                        '<div class="row col-sm-12">' +
                            '<div class="col-sm-3 logo-div">' +
                                '<img src="images/green-car.png" class="car-logo">' +
                                '<p class="number-text">' + value.car + '</p>' +
                            '</div>' +
                            '<div class="col-sm-3 time-div">' +
                                '<p class="header-text z">Tider</p>' +
                                '<p class="text z">'+ value.startNode.time +' - '+ value.stopNode.time +'</p>' +
                                '<p class="header-text z">Senast uppdaterad:</p>' +
                                '<p class="text z"><i class="fa fa-check-circle" aria-hidden="true"></i> '+ value.last_update +'</p>' + 
                            '</div>' +
                            '<div class="col-sm-3 contact-div list">' +
                                '<p class="header-text z">Förare kontaktinfo</p>' +
                                '<p class="text z">'+ value.driver_phone +'</p>' +
                            '</div>' + 
                            '<div class="col-sm-3 services-div list">' +
                                '<p class="header-text z">Tillgängliga behov</p>' +
                                '<div id="services" class="row services">' +
                                    
                                '</div>' +
                            '</div>' +
                        '</div>'
                    )
                    
                    $.each(value.services, function(x, y) {
                        $("#services").append(
                            '<div class="service">' +
                                '<p class="service-text">'+ y.text +'</p>' +
                            '</div>'
                        )
                        }                   
                    )

                    $.each(value.nodes, function(x, y) {
                        if (y.action === 'pickup') {
                            pickupIcon = '<i class="fa fa-sign-in x pick" aria-hidden="true"></i>'
                        }
                        if (y.action === 'dropoff') {
                            pickupIcon = '<i class="fa fa-sign-out x drop" aria-hidden="true"></i>'
                        }
                        if (y.action !== 'coordinate') {
                            $("#drive-order-detail").append(
                                '<li class="row do ' + y.action + '">' +
                                    '<div class="col-xs-12 order">' +
                                        '<div class="col-xs-1 do-div do-text">1'+ pickupIcon +'</div>' +
                                        '<div class="col-xs-1 do-div do-text">'+ y.time +'</div>' +
                                        '<div class="col-xs-1 do-div do-text"></div>' +
                                        '<div class="col-xs-2 do-div do-text x">'+ y.address + '</div>' +
                                        '<div class="col-xs-2 do-div do-text"></div>' +
                                        '<div class="col-xs-2 do-div do-text"></div>' +
                                        '<div class="col-xs-1 do-div do-text x">'+ y.time + '</div>' +
                                        '<div class="col-xs-1 do-div do-text"></div>' +
                                    '</div>' +
                                '</li>'
                            )                           
                        }
                    })
                }
            });
        },
        url: '/do-info.json'
    });   

}        

	// DO GET
	// function specialVehicleAlertGet(){
    //     var t = new Date();
    //     var todayDate = t.toISOString().slice(0,10);
    //     var url = "/api/suti/v1/get-all-app-drive-orders?weekday=" + todayDate;
    //     localhosturl = false;
    //     if ($(location).attr('hostname').toLowerCase().search('localhost') != -1){
    //         localhosturl = true;
    //     }
    //     if (localhosturl){
    //         url = "http://localhost/suti/public/v1/get-all-app-drive-orders?weekday=" + todayDate;
    //     }
	// 	$.ajax({
	// 		type : "GET",
	// 		url : url,
	// 		success: function(result){
	// 			$.each(result.vehicles, function(i, alert){
	// 				graph_view = '';
					
	// 				$.each(alert.schedules, function(j, schedule){
	// 					mouse_over_html = '<table><tr><td>Starts: </td><td>' + schedule.start + '</td></tr>';
	// 					mouse_over_html += '<tr><td>Ends: </td><td>' + schedule.stop + '</td></tr></table>';
	// 					block_view = '';
	// 					$.each(schedule.blocks, function(k, block){
	// 						block_over_html = '';
	// 						if (block.type != 'schedule_span' && block.type != 'driveTo_span bordered'){
	// 							block_over_html = '<table><tr><td>Starts: </td><td>' + block.start + ' </td><td> ' + block.startNode + '</td></tr>';
	// 							block_over_html += '<tr><td>Ends: </td><td>' + block.stop + ' </td><td> ' + block.stopNode + '</td></tr></table>';
	// 							block_over_html = ' data-container="body" data-toggle="popover" data-placement="bottom" data-html="true" data-trigger="hover" title="Block" data-content="' + block_over_html + '" ';
	// 						}

	// 						extraStyle = '';
	// 						if (k === (schedule.blocks.length - 1) && block.type != 'schedule_span' && block.type != 'driveTo_span bordered') {
	// 							extraStyle = 'border-right: 1px solid #343434;';
	// 						} 
	// 						if (k === 0){
	// 							extraStyle = 'border-left: 1px solid rgb(210, 233, 205);';
	// 						}
	// 						block_view += '<span ' + block_over_html + 'style="width:' + block.length + 'px;' + extraStyle + '" class="' + block.type + '"></span>';
	// 					});
	// 					graph_view += '<div data-container="body" data-toggle="popover" data-placement="top" data-html="true" data-trigger="hover" title="Schedule" data-content="' + mouse_over_html + '"  style="margin-left:' + schedule.offset + 'px;width:' + schedule.width + 'px;" class="wrapper special">'+ block_view + '</div>'
	// 				});
	// 				if (alert.last_updated_time != ''){
	// 					var repNode = '<table>';
	// 					$.each(alert.reported_nodes, function(j, reported_node){
	// 						repNode += '<tr>'
	// 						repNode += '<td>' + reported_node.reported_time + '&nbsp; </td>';
	// 						repNode += '<td>' + reported_node.scheduled_time + '&nbsp; </td>';
	// 						repNode += '<td>' + reported_node.action + '</td>';
	// 						repNode += '</tr>';
	// 					});
	// 					repNode += '</table>';
	// 					var alertRow = '<tr >' +
	// 										'<td>' + i + '</td>' +
	// 										'<td>' + alert.last_report_time + '</td>' +
	// 										'<td>' + alert.last_updated_time + '</td>' +
	// 										'<td><p data-container="body" data-toggle="popover" data-placement="left" data-html="true" data-trigger="hover" title="Reported" data-content="' + repNode + '">' + alert.next_node_time + '</p></td>' +
	// 										'<td style="width:605px">' + graph_view + '</td>' +
	// 									'</tr>';
						
	// 					$('#specialVehicleTable tbody').append(alertRow);
	// 				}
	// 			});
	// 			$('#header_graph_view').empty();
	// 			$.each(result.timeLabels, function(i, alert){
	// 				var temp =  '<span class="timeLabel">' + alert + '</span>';
	// 				$('#header_graph_view').append(temp);
	// 			});
				
	// 			$(function () {
	// 				$('[data-toggle="popover"]').popover()
	// 			})

	// 			$( "#specialVehicleTable tbody tr:odd" ).addClass("info");
	// 			//$( "#specialVehicleTable tbody tr:even" ).addClass("success");
	// 		},
	// 		error : function(e) {
	// 			alert("ERROR: ", e);
	// 			console.log("ERROR: ", e);
	// 		}
	// 	});	
    // }


    // function norgesTaxiAlertGet(){
	// 	$( "#specialVehicleTable" ).hide();
	// 	$( "#specialVehicleDiv" ).hide();
        
    //     $("#heading").text("Manual alerts - Norges Taxi");
    //     $( "#norgesTaxiTable" ).show();
    //     $('#norgesTaxiTable').removeClass('hidden');
    //     var url = "/api/suti/v1/get-all-current-suti-trips";
    //     localhosturl = false;
    //     if ($(location).attr('hostname').toLowerCase().search('localhost') != -1){
    //         localhosturl = true;
    //     }
    //     if (localhosturl){
    //         url = "http://localhost/taby/public/getAllCurrentSUTITrips";
    //     }
    //     $('#norgesTaxiTable tbody').empty();
	// 	$.ajax({
	// 		type : "GET",
	// 		url : url,
	// 		success: function(result){
                
	// 			$.each(result, function(i, alert){
					
	// 				var alertRow = '<tr>' +
	// 									'<td>' + alert.vehicle_id + '</td>' +
	// 									'<td>' + alert.scheduled_pickup_time + '</td>' +
	// 									'<td>' + alert.sent_to_taxi + '</td>' +
    //                                     '<td>' + alert.accepted_from_taxi + '</td>' +
    //                                     '<td>' + alert.dispatched_from_taxi + '</td>' +
    //                                     '<td>' + alert.external_vehicle_id +  '</td>' +
    //                                     '<td>' + '</td>' +
	// 								  '</tr>';
					
	// 				$('#norgesTaxiTable tbody').append(alertRow);
					
	// 	        });
				
	// 			$( "#norgesTaxiTable tbody tr:odd" ).addClass("info");
	// 			//$( "#norgesTaxiTable tbody tr:even" ).addClass("success");
	// 		},
	// 		error : function(e) {
	// 			alert("ERROR: ", e);
	// 			console.log("ERROR: ", e);
	// 		}
	// 	});	
    // }

 
