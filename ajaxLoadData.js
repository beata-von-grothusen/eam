$(document).ready(function() {
	$().popover({container: 'body'});
})	
	// DO GET
	function specialVehicleAlertGet(){
        $( "#norgesTaxiTable" ).hide();
        $("#heading").text("Manual alerts - Special Vehicle");
        $( "#specialVehicleTable" ).show();
        $( "#specialVehicleDiv" ).show();
        $('#specialVehicleTable').removeClass('hidden');
        var t = new Date();
        var todayDate = t.toISOString().slice(0,10);
        var url = "/api/suti/v1/get-all-app-drive-orders?weekday=" + todayDate;
        localhosturl = false;
        if ($(location).attr('hostname').toLowerCase().search('localhost') != -1){
            localhosturl = true;
        }
        if (localhosturl){
            url = "http://localhost/suti/public/v1/get-all-app-drive-orders?weekday=" + todayDate;
        }
        $('#specialVehicleTable tbody').empty();
		$.ajax({
			type : "GET",
			url : url,
			success: function(result){
				$.each(result.vehicles, function(i, alert){
					graph_view = '';
					
					$.each(alert.schedules, function(j, schedule){
						mouse_over_html = '<table><tr><td>Starts: </td><td>' + schedule.start + '</td></tr>';
						mouse_over_html += '<tr><td>Ends: </td><td>' + schedule.stop + '</td></tr></table>';
						block_view = '';
						$.each(schedule.blocks, function(k, block){
							block_over_html = '';
							if (block.type != 'schedule_span' && block.type != 'driveTo_span bordered'){
								block_over_html = '<table><tr><td>Starts: </td><td>' + block.start + ' </td><td> ' + block.startNode + '</td></tr>';
								block_over_html += '<tr><td>Ends: </td><td>' + block.stop + ' </td><td> ' + block.stopNode + '</td></tr></table>';
								block_over_html = ' data-container="body" data-toggle="popover" data-placement="bottom" data-html="true" data-trigger="hover" title="Block" data-content="' + block_over_html + '" ';
							}

							extraStyle = '';
							if (k === (schedule.blocks.length - 1) && block.type != 'schedule_span' && block.type != 'driveTo_span bordered') {
								extraStyle = 'border-right: 1px solid #343434;';
							} 
							if (k === 0){
								extraStyle = 'border-left: 1px solid rgb(210, 233, 205);';
							}
							block_view += '<span ' + block_over_html + 'style="width:' + block.length + 'px;' + extraStyle + '" class="' + block.type + '"></span>';
						});
						graph_view += '<div data-container="body" data-toggle="popover" data-placement="top" data-html="true" data-trigger="hover" title="Schedule" data-content="' + mouse_over_html + '"  style="margin-left:' + schedule.offset + 'px;width:' + schedule.width + 'px;" class="wrapper special">'+ block_view + '</div>'
					});
					if (alert.last_updated_time != ''){
						var repNode = '<table>';
						$.each(alert.reported_nodes, function(j, reported_node){
							repNode += '<tr>'
							repNode += '<td>' + reported_node.reported_time + '&nbsp; </td>';
							repNode += '<td>' + reported_node.scheduled_time + '&nbsp; </td>';
							repNode += '<td>' + reported_node.action + '</td>';
							repNode += '</tr>';
						});
						repNode += '</table>';
						var alertRow = '<tr >' +
											'<td>' + i + '</td>' +
											'<td>' + alert.last_report_time + '</td>' +
											'<td>' + alert.last_updated_time + '</td>' +
											'<td><p data-container="body" data-toggle="popover" data-placement="left" data-html="true" data-trigger="hover" title="Reported" data-content="' + repNode + '">' + alert.next_node_time + '</p></td>' +
											'<td style="width:605px">' + graph_view + '</td>' +
										'</tr>';
						
						$('#specialVehicleTable tbody').append(alertRow);
					}
				});
				$('#header_graph_view').empty();
				$.each(result.timeLabels, function(i, alert){
					var temp =  '<span class="timeLabel">' + alert + '</span>';
					$('#header_graph_view').append(temp);
				});
				
				$(function () {
					$('[data-toggle="popover"]').popover()
				})

				$( "#specialVehicleTable tbody tr:odd" ).addClass("info");
				//$( "#specialVehicleTable tbody tr:even" ).addClass("success");
			},
			error : function(e) {
				alert("ERROR: ", e);
				console.log("ERROR: ", e);
			}
		});	
    }
    function norgesTaxiAlertGet(){
		$( "#specialVehicleTable" ).hide();
		$( "#specialVehicleDiv" ).hide();
        
        $("#heading").text("Manual alerts - Norges Taxi");
        $( "#norgesTaxiTable" ).show();
        $('#norgesTaxiTable').removeClass('hidden');
        var url = "/api/suti/v1/get-all-current-suti-trips";
        localhosturl = false;
        if ($(location).attr('hostname').toLowerCase().search('localhost') != -1){
            localhosturl = true;
        }
        if (localhosturl){
            url = "http://localhost/taby/public/getAllCurrentSUTITrips";
        }
        $('#norgesTaxiTable tbody').empty();
		$.ajax({
			type : "GET",
			url : url,
			success: function(result){
                
				$.each(result, function(i, alert){
					
					var alertRow = '<tr>' +
										'<td>' + alert.vehicle_id + '</td>' +
										'<td>' + alert.scheduled_pickup_time + '</td>' +
										'<td>' + alert.sent_to_taxi + '</td>' +
                                        '<td>' + alert.accepted_from_taxi + '</td>' +
                                        '<td>' + alert.dispatched_from_taxi + '</td>' +
                                        '<td>' + alert.external_vehicle_id +  '</td>' +
                                        '<td>' + '</td>' +
									  '</tr>';
					
					$('#norgesTaxiTable tbody').append(alertRow);
					
		        });
				
				$( "#norgesTaxiTable tbody tr:odd" ).addClass("info");
				//$( "#norgesTaxiTable tbody tr:even" ).addClass("success");
			},
			error : function(e) {
				alert("ERROR: ", e);
				console.log("ERROR: ", e);
			}
		});	
    }

    function setActive(elem) {
        var a = document.getElementsByClassName('menu-item');
        for (i = 0; i < a.length; i++) {
            a[i].classList.remove('active')
        }
        elem.classList.add('active');
    }

    function setCurrent(elem) {
        var a = document.getElementsByClassName('view');
        for (i = 0; i < a.length; i++) {
            a[i].classList.remove('current')
        }
        elem.classList.add('current');
    }