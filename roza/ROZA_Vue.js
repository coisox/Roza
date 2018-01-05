var prefix = 'ILIMS_';
var currentVersion = 'v180104c';
var rozaCallLandingFile, rozaSetTaskbar, rozaSetPanel, rozaBindData, rozaBindLov, rozaGetParam, rozaModal, rozaClearData, rozaResetData, rozaHasRole, rozaVersion, rozaUserId, rozaUserName, rozaUserRole;

if(!localStorage.getItem(prefix+'rozaUserPic')) localStorage.setItem(prefix+'rozaUserPic', 'images/alien.png');
if(!localStorage.getItem(prefix+'conf')) localStorage.setItem(prefix+'conf', '{"theme":"theme-night-sky"}');
if(!localStorage.getItem(prefix+'rozaUserId')) localStorage.setItem(prefix+'rozaUserId', '-1');
if(!localStorage.getItem(prefix+'rozaUserName')) localStorage.setItem(prefix+'rozaUserName', 'Roza');
if(!localStorage.getItem(prefix+'rozaUserRole')) localStorage.setItem(prefix+'rozaUserRole', '');
if(!localStorage.getItem(prefix+'rozaLanguage')) localStorage.setItem(prefix+'rozaLanguage', 'bm');
if(!localStorage.getItem(prefix+'Favourites')) localStorage.setItem(prefix+'Favourites', '[{"label":"Test Global Search 123","keyword":"Test Global Search 123"},{"label":"Test Global Search 456","keyword":"Test Global Search 456"}]');

var rozaLanguage = localStorage.getItem(prefix+'rozaLanguage');

$(document).ready(function(){
	initVue();
});

Vue.use(VueTables.ClientTable, {
	compileTemplates: true,
	filterByColumn: true,
	texts: {
		filter: '',
		filterBy: '',
		filterPlaceholder: rozaLanguage=='bm'?'Carian...':'Search...',
		limit: rozaLanguage=='bm'?'Rekod: ':'Records: ',
		count: rozaLanguage=='bm'?"Menunjukkan {from} hingga {to} daripada {count} rekod|{count} rekod|Satu rekod":"Showing {from} to {to} of {count} records|{count} records|One record"
	}
});

function initVue() {
	roza = new Vue({
		el: '#roza',
		data: {
			conf: JSON.parse(localStorage.getItem(prefix+'conf')),
			globalSearchKeyword: '',
			rozaVersion: localStorage.getItem(prefix+'rozaVersion'),
			rozaUserPic: localStorage.getItem(prefix+'rozaUserPic'),
			rozaUserId: localStorage.getItem(prefix+'rozaUserId'),
			rozaUserName: localStorage.getItem(prefix+'rozaUserName'),
			rozaUserRole: localStorage.getItem(prefix+'rozaUserRole').split(','),
			rozaLanguage: localStorage.getItem(prefix+'rozaLanguage'),
			breadcrumb: '',
			breadcrumbBuffer: '',
			sessionParam: {},
			menu: {
				level: 1,
				parentIndex: 0,
				list: []
			},
			activeMetro: '',
			standardlist: {
				activeItem: '',
				sortBy: ''
			},
			taskbar: {},
			accordions: {},
			tabLevel1: {},
			tabLevel2: {},
			vueTable: [],
			panel: {
				leftPanel: {
					//initQueryBuilder: false,
					filterString: '',
					type: '',
					prop: [],
					show: true
				},
				rightPanel: {
					filterString: '',
					type: '',
					prop: [],
					show: true
				},
				fullPanel: {
					filterString: '',
					type: '',
					prop: [],
					show: false
				},
			},
			modalProp: [],
			dropzoneAction: 'main.html',
			favourites: JSON.parse(localStorage.getItem(prefix+'Favourites')),
			callbackQue: [],
			viewMode: true
		},
		methods: {
			metroClick: function(item, level, index) {
				if(level=='m1') {
					if(item.list) this.menu.level = 2;
					this.menu.parentIndex = index;
					this.activeMetro = index;
					this.setBreadcrumbBuffer(1, item['label'+this.rozaLanguage]);
				}
				else {
					this.activeMetro = this.menu.parentIndex+'>'+index;
					this.setBreadcrumbBuffer(2, item['label'+this.rozaLanguage]);
				}

				if(item.onclick) eval(item.onclick);
				else if(!item.list) {
					this.rozaSetPanel();
					this.rozaSetTaskbar();
					this.setBreadcrumbBuffer(3, '<b style="color:#E74C3C">'+(this.rozaLanguage=='bi'?'Module not ready!':'Modul belum disediakan')+'</b>');
					this.breadcrumb = this.breadcrumbBuffer;
				}
			},
			onclick: function(item) {
				eval(item.onclick);
			},
			onchange: function(item) {
				eval(item.onchange);
			},
			toast: function(html) {
				$.notify({message:html},{type:'danger', delay:4000});
			},
			sortList: function(panel, sort) {
				if(this.standardlist.sortBy == sort+'_ASC') this.standardlist.sortBy = sort+'_DESC';
				else this.standardlist.sortBy = sort+'_ASC';
				
				this.panel[panel].prop[0].list.sort(function(a, b){
					
					//EPOCH. only numbers can use minus operation
					if(roza.standardlist.sortBy == 'ROZA_EPOCH_ASC') return a[sort] - b[sort];
					else if(roza.standardlist.sortBy == 'ROZA_EPOCH_DESC') return b[sort] - a[sort];
					
					//TITLE. text can only use bigger smaller operation
					else if(roza.standardlist.sortBy == 'ROZA_TITLE_ASC') {
						if(a[sort]==b[sort]) return 0;
						else if(a[sort]<b[sort]) return -1;
						else if(a[sort]>b[sort]) return 1;
					}
					else {
						if(a[sort]==b[sort]) return 0;
						else if(a[sort]<b[sort]) return 1;
						else if(a[sort]>b[sort]) return -1;
					}
				});
			},
			filteredList: function(panel) {
				return this.panel[panel].prop[0].list.filter(function(item) {
					return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(roza.panel[panel].filterString.toLowerCase()) > -1
				})
			},
			accessControl: function(item, ac) {
				try {
					return eval(item[ac]);
				}
				catch(err) {
					$.getJSON('roza/ROZA_LogError.php?msg=Condition in '+ac+' problem: '+err.message, function(data) {
						roza.toast('System error occured and has been reported ('+data.log_id+')');
					});
				}
			},
			console: function(text) {
				console.log(text);
			},
			/*
			resetQueryBuilder: function(p) {
				$('#'+p+'QueryBuilder').queryBuilder('reset');
				this.panel[p].filterString = '';
			},
			submitQueryBuilder: function(p) {
				console.log("submitQueryBuilder");
				console.log($('#'+p+'QueryBuilder').queryBuilder('getRules'));
			},
			*/
			addFilterRow: function(p, e) {
				if(e==undefined) {
					$('#'+p+' .filterRow:last').after($('#'+p+' .filterRow:last').clone());
					$('#'+p+' .filterRow:last .adv1, #'+p+' .filterRow:last .adv2, #'+p+' .filterRow:last .adv3').val('');
					$('#'+p+' .filterRow:last').removeClass('bad');
				}
				else if($('#'+p+' .filterRow').size()==1){
					$('#'+p+' .filterRow:last .adv1, #'+p+' .filterRow:last .adv2, #'+p+' .filterRow:last .adv3').val('');
					$('#'+p+' .filterRow:last').removeClass('bad');
				}
				else {
					$(e).parents('.filterRow').remove();
				}
			},
			clearFilterRow: function(p) {
				$('#'+p+' .filterRow').not(':last').remove();
				$('#'+p+' .filterRow:last .adv1, #'+p+' .filterRow:last .adv2, #'+p+' .filterRow:last .adv3').val('');
				this.panel[p].filterString = '';
			},
			submitFilterRow: function(p) {
				$('#'+p+' .filterRow').each(function(){
					if($(this).find('.adv1').val()=='' || $(this).find('.adv2').val()=='' || $(this).find('.adv3').val()=='') {
						$(this).addClass('bad');
					}
					else {
						$(this).removeClass('bad');
					}
				});
				if($('#'+p+' .filterRow.bad').size()==0) {
					console.log(JSON.stringify($('#'+p+' .filterRow select, #'+p+' .filterRow input').serialize()));
				}
				/*
				this.rozaSetPanel({
					panel: p,
					ui: 'SampleStaff_Standardlist.json'
				});
				*/
			},
			rozaHasRole: function(array) {
				var match = 0;
				for(var x=0; x<this.rozaUserRole.length; x++) {
					if(array.indexOf(this.rozaUserRole[x])>-1) match++;
				}
				return match;
			},
			rozaModal: function(opt) {
				$('#modalGeneral').modal('hide');
				
				if(opt && opt.ui) {
					roza.modalProp = [];
					
					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
								
								if(data.prop[x].element=='table') {
									roza['vueTable'][data.prop[x].id] = [];
									roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
									roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
									roza['vueTable'][data.prop[x].id]['option'] = {
										columnsDisplay: {
											actiondelete: 'micro',
											actiondrag: 'micro',
											ac_remove: 'micro'
										},
										columnsClasses: {
											Action: 'actions_column',
											Tindakan: 'actions_column'
										}
									};
								}
								
								roza.modalProp = data.prop;
								
								$('#modalProp .modal-title').html('').html(opt['title'+this.rozaLanguage]);
								$('#modalProp .modal-header').toggle(opt['title'+this.rozaLanguage]?true:false);
								$('#modalProp #btnCancel').toggle(opt.cancel?true:false);
								$('#modalProp #btnOk').attr('onclick', opt.onclick?opt.onclick:'rozaModal()');
								$('#modalProp').modal({
									show: true,
									backdrop: 'static'
								});
							}
						}
						else roza.toast(data.status);
					});
				}
				else if(opt) {
					$('#modalGeneral .modal-title').html('').html(opt['title'+this.rozaLanguage]);
					$('#modalGeneral .modal-header').toggle(opt['title'+this.rozaLanguage]?true:false);
					$('#modalGeneral #btnCancel').toggle(opt.cancel?true:false);
					$('#modalGeneral .modal-body').html('').html(opt['content'+this.rozaLanguage]);
					$('#modalGeneral #btnOk').attr('onclick', opt.onclick?opt.onclick:'rozaModal()');
					$('#modalGeneral').modal({
						show: true,
						backdrop: 'static'
					});
				}
			},
			rozaClearData: function() {
				$('.x_content [data-default]').not('.ac_disable, .ac_hide').each(function(){
					$(this).val('');
				});
				$('div[contentEditable]').each(function(){
					$(this).html('');
				});
			},
			rozaResetData: function() {
				$('.x_content [data-default]').each(function(){
					$(this).val($(this).attr('data-default'));
				});
				$('div[contentEditable]').each(function(){
					$(this).html($(this).attr('data-default'));
				});
			},
			/*
			rozaSubmitData: function(opt) {
				if(!opt.file) {
					$.getJSON('roza/ROZA_LogError.php?msg=Property "file" not defined for rozaSubmitData()', function(data) {
						roza.toast('System error occured and has been reported ('+data.log_id+')');
					});
				}
				else {
					$.ajax({
						url: 'dev/php/'+opt.file+'?'+$('.x_content .formMain').serialize()+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)),
						dataType: 'json',
						success: function(data) {
							if(data.status=='ok') {
								roza.rozaModal({
									contentbm: 'Data telah dihantar',
									contentbi: 'Data has been sent'
								});
							}
							else roza.toast(data.status);
						},
						error: function(data) {
							if(data.status==404) {
								$.getJSON('roza/ROZA_LogError.php?msg=PHP file not found: '+opt.target, function(data) {
									roza.toast('System error occured and has been reported ('+data.log_id+')');
								});
							}
						}
					});
				}
			},
			*/
			rozaGetParam: function(param) {
				if(param=='rozaUserId') return this.rozaUserId;
				else if(param=='rozaUserName') return this.rozaUserName;
				else if(param=='rozaUserRole') return this.rozaUserRole;
				else if(param=='rozaLanguage') return this.rozaLanguage;
				else if(param=='rozaTimestamp') return Math.floor(new Date()/1000);
				return this.sessionParam[param];
			},
			rozaCallLandingFile: function(file) {
				//save param for next page
				//================================================================================================
				var param = file.split(/[\?&]+/);
				this.sessionParam = {};
				for(var i=1; i<param.length; i++) this.sessionParam[param[i].split('=')[0]] = param[i].split('=')[1];
				//================================================================================================
				
				$.getScript('dev/landing/'+file, function(data, textStatus, jqxhr) {}).fail(function(){
					if(arguments[1]=='error') {
						$.getJSON('roza/ROZA_LogError.php?msg=Landing file not found: '+file, function(data) {
							roza.toast('System error occured and has been reported ('+data.log_id+')');
						});
					}
					else {
						roza.toast(file+': '+arguments[2].toString().replace('ReferenceError: ', ''));
						$.ajax({
							crossDomain: true,
							dataType: "script",
							url: 'dev/landing/'+file
						});
					}
				});
			},
			rozaSetPanel: function(opt) {
				this.rozaModal();
				
				if(opt) {
					this.panel.leftPanel.show = !(opt.panel=='fullPanel');
					this.panel.rightPanel.show = !(opt.panel=='fullPanel');
					this.panel.fullPanel.show = (opt.panel=='fullPanel');
					
					if($('#'+opt.panel+'QueryBuilder.query-builder').size()) $('#'+opt.panel+'QueryBuilder').queryBuilder('reset');

					if(opt.panel!='rightPanel') {
						roza.panel.rightPanel.prop = {};
						roza.panel.rightPanel.type = '';
						//roza.taskbar = {}; Hari tu Masri mcm perlukan nie
					}

					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
								
								if(data.prop[x].element=='table') {
									roza['vueTable'][data.prop[x].id] = [];
									roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
									roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
									roza['vueTable'][data.prop[x].id]['option'] = {
										columnsDisplay: {
											actionview: 'micro',
											actionedit: 'micro',
											actiondelete: 'micro',
											actiondrag: 'micro',
											ac_remove: 'micro'
										},
										columnsClasses: {
											Action: 'actions_column',
											Tindakan: 'actions_column'
										}
									};
									
									if(data.prop[x].action_add) {
										roza['vueTable'][data.prop[x].id]['action_add'] = [];
										roza['vueTable'][data.prop[x].id]['action_add']['onclick'] = data.prop[x].action_add.onclick;
										roza['vueTable'][data.prop[x].id]['action_add']['ac_remove'] = roza.accessControl(data.prop[x].action_add, 'ac_remove');
										roza['vueTable'][data.prop[x].id]['action_add']['vueTableDualMode'] = roza.accessControl(data.prop[x].action_add, 'ac_dualmode')?'vueTableDualMode':'';
									}
								}
								
								//set default tab
								else if(data.prop[x].element=='tabs') {
									roza.rozaDefaultTab(data.prop[x].list, 1);
								}
								
								//set default accordion
								else if(data.prop[x].element=='accordion') {
									roza.rozaDefaultAccordion(data.prop[x].list);
								}
								
							}
							
							roza.panel[opt.panel].prop = data.prop;
							roza.panel[opt.panel].type = data.prop[0].element=='standardlist'?'standardlist':'ui';

							if(data.prop[0].element=='standardlist') {
								roza.setBreadcrumbBuffer(3, data.prop[0]['label'+roza.rozaLanguage]);
								//roza.panel.leftPanel.initQueryBuilder = true;
							}
							else if(opt.panel!='rightPanel'){
								for(var x=0; x<data.prop.length; x++) {
									if(data.prop[x].element=='title') roza.setBreadcrumbBuffer(3, data.prop[x]['label'+roza.rozaLanguage]);
								}
							}
							roza.breadcrumb = roza.breadcrumbBuffer;
						}
						else roza.toast(data.status);
					});
				}
				else {
					this.panel.leftPanel.show = false;
					this.panel.rightPanel.show = false;
					this.panel.fullPanel.show = false;
				}
			},
			rozaSetTaskbar: function(opt) {
				if(opt) {
					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+opt.ui, function(data){
						if(data.status=='ok') {
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
							}
							roza.taskbar = data.prop;
						}
						else roza.toast(data.status);
					});
				}
				else {
					roza.taskbar = {};
				}
			},
			rozaDefaultAccordion: function(list) {
				var hasDefault = false;
				
				for(var x=0; x<list.length; x++) {
					if(this.accessControl(list[x],'ac_default')) {
						hasDefault = true;
						setTimeout(function(){ roza.rozaSetAccordion(list[x]); }); //setTimeout tanpa number bertindak sebagai nextTick
						break;
					}
				}
				
				if(!hasDefault) setTimeout(function(){ roza.rozaSetAccordion(list[0]); }); //setTimeout tanpa number bertindak sebagai nextTick
			},
			rozaDefaultTab: function(list, level) {
				var activated = false;
				
				for(var x=0; x<list.length; x++) {
					if(this.accessControl(list[x],'ac_default')) {
						this.rozaSetTab(list[x], level);
						$('#'+list[x].id).addClass('active');
						activated = true;
					}
				}
				
				//if not set, activate first tab
				if(!activated) {
					this.rozaSetTab(list[0], level);
					setTimeout(function(){
						$('.nav.nav-tabs.level'+level+' li:first').addClass('active');
					}, 1);
				}
			},
			rozaSetAccordion: function(list) {
				$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+list.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
					if(data.status=='ok') {
						for(var x=0; x<data.prop.length; x++) {
							if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
							
							if(data.prop[x].element=='table') {
								roza['vueTable'][data.prop[x].id] = [];
								roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
								roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
								roza['vueTable'][data.prop[x].id]['option'] = {
									columnsDisplay: {
										actionview: 'micro',
										actionedit: 'micro',
										actiondelete: 'micro',
										actiondrag: 'micro',
										ac_remove: 'micro'
									},
									columnsClasses: {
										Action: 'actions_column',
										Tindakan: 'actions_column'
									}
								};
								
								if(data.prop[x].action_add) {
									roza['vueTable'][data.prop[x].id]['action_add'] = [];
									roza['vueTable'][data.prop[x].id]['action_add']['onclick'] = data.prop[x].action_add.onclick;
									roza['vueTable'][data.prop[x].id]['action_add']['ac_remove'] = roza.accessControl(data.prop[x].action_add, 'ac_remove');
									roza['vueTable'][data.prop[x].id]['action_add']['vueTableDualMode'] = roza.accessControl(data.prop[x].action_add, 'ac_dualmode')?'vueTableDualMode':'';
								}
							}
						}
							
						roza.accordions[list.id] = data.prop;
						roza.accordions = JSON.parse(JSON.stringify(roza.accordions));
						roza.$nextTick(function () {
							$('.panel-collapse.collapse').collapse('hide');
							$('.accordion-title').addClass('collapsed');
							$('#'+list.id).prev().removeClass('collapsed');
							$('#'+list.id).collapse('show');
						});
						
						//roza['accordions'] = JSON.stringify(roza['accordions']);
					}
					else roza.toast(data.status);
				});
			},
			rozaSetTab: function(list, level) {
				$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+list.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
					if(data.status=='ok') {
						for(var x=0; x<data.prop.length; x++) {
							if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
							
							if(data.prop[x].element=='table') {
								roza['vueTable'][data.prop[x].id] = [];
								roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
								roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
								roza['vueTable'][data.prop[x].id]['option'] = {
									columnsDisplay: {
										actionview: 'micro',
										actionedit: 'micro',
										actiondelete: 'micro',
										actiondrag: 'micro',
										ac_remove: 'micro'
									},
									columnsClasses: {
										Action: 'actions_column',
										Tindakan: 'actions_column'
									}
								};
								
								if(data.prop[x].action_add) {
									roza['vueTable'][data.prop[x].id]['action_add'] = [];
									roza['vueTable'][data.prop[x].id]['action_add']['onclick'] = data.prop[x].action_add.onclick;
									roza['vueTable'][data.prop[x].id]['action_add']['ac_remove'] = roza.accessControl(data.prop[x].action_add, 'ac_remove');
									roza['vueTable'][data.prop[x].id]['action_add']['vueTableDualMode'] = roza.accessControl(data.prop[x].action_add, 'ac_dualmode')?'vueTableDualMode':'';
								}
							}
							
							//set default tab in tab
							else if(level==1 && data.prop[x].element=='tabs') {
								roza.rozaDefaultTab(data.prop[x].list, 2);
							}
						}
							
						roza['tabLevel'+level] = data.prop;
					}
					else roza.toast(data.status);
				});
			},
			setBreadcrumbBuffer: function(level, module) {
				var b = this.breadcrumbBuffer.split('<br>');
				b.splice(level-1);
				b.push('<li class="breadcrumb-item"><a>'+module+'</a></li>');
				this.breadcrumbBuffer = b.join('<br>');
			},
			globalSearch: function(event) {
				if(event.key=='Enter' || event.type=='click') {
					this.breadcrumb = '<li class="breadcrumb-item"><a>Search result for "'+this.globalSearchKeyword+'"</a></li>';
					this.panel.fullPanel.type = 'custompage_searchresult';
					this.panel.fullPanel.show = true;
					this.panel.leftPanel.show = false;
					this.panel.leftPanel.show = false;
					this.panel.rightPanel.show = false;
					this.activeMetro = 'globalSearch';
					this.rozaSetTaskbar();
				}
			},
			getMenu: function() {
				$.getJSON('roza/ROZA_GetMenu.php', function(data){
					if(data.status=='ok') roza.menu.list = data.data;
					else if(data.status=='invalid session') window.location = './';
					else roza.toast(data.status);
				});
			},
			confTheme: function() {
				if($('#confTheme').val()==null) $('#confTheme').val('theme-night-sky');
				this.conf.theme = $('#confTheme').val();
				$('#theme').attr('href', 'css/'+this.conf.theme+'.css?'+currentVersion);
				localStorage.setItem(prefix+'conf', JSON.stringify(this.conf));
			}
		},
		events_BAK: {
			'vuetable:action': function(action, data) {
				if(action=='view-item') {
					alert('view clicked');
				}
			},
			'vuetable:load-error': function(response) {
				//console.log('Load Error: ', response);
			}
		},
		created: function() {
			
			//development only
			this.rozaUserRole = localStorage.getItem('ILIMS_rozaUserRole').split(',').map(function(role){ return role.trim() });
			
			rozaUserId = this.rozaUserId;
			rozaUserName = this.rozaUserName;
			rozaUserRole = this.rozaUserRole;
			rozaLanguage = this.rozaLanguage;
			rozaCallLandingFile = this.rozaCallLandingFile;
			rozaSetTaskbar = this.rozaSetTaskbar;
			rozaSetPanel = this.rozaSetPanel;
			rozaBindData = this.rozaBindData;
			rozaBindLov = this.rozaBindLov;
			rozaGetParam = this.rozaGetParam;
			rozaModal = this.rozaModal;
			rozaClearData = this.rozaClearData;
			rozaResetData = this.rozaResetData;
			//rozaSubmitData = this.rozaSubmitData;
			rozaHasRole = this.rozaHasRole;
		},
		updated: function() {
			$('input.flat').iCheck({
				checkboxClass: 'icheckbox_flat-green',
				radioClass: 'iradio_flat-green'
			});
			
			$('.date [data-style="single"]').daterangepicker({
				singleDatePicker: true,
				locale: {
					format: 'DD/MM/YYYY'
				}
			}, function(start, end, label) {
				//console.log(start.toISOString(), end.toISOString(), label);
			});
			
			$('.date [data-style="range"]').daterangepicker({
				locale: {
					format: 'DD/MM/YYYY'
				}
			}, function(start, end, label) {
				//console.log(start.toISOString(), end.toISOString(), label);
			});

			$('.dropzone').each(function(){
				if($(this).find('.dz-default').size()==0) {
					$(this).dropzone({
						url: 'main.html',
						createImageThumbnails: false,
						ignoreHiddenFiles: true,
						addRemoveLinks: true,
						dictRemoveFile: 'x',
						removedfile: function(file) {
							var _ref;
							return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
						}
					});
				}
			});
			
			while (this.callbackQue.length) {
				var callback = this.callbackQue.shift();
				if(typeof eval(callback.split('(')[0]) == 'function') eval(callback);
				else {
					$.getJSON('roza/ROZA_LogError.php?msg='+callback+' is not defined', function(data) {
						roza.toast('System error occured and has been reported ('+data.log_id+')');
					});
				}
			}

			$('.VueTables').each(function(){				
				var id = $(this).attr('id');
				$('#'+id+' .vueTableAdd').remove();
				if(roza['vueTable'][id]['action_add'] && !roza['vueTable'][id]['action_add']['ac_remove'] && !$('#'+id+' .vueTableAdd').size()) {
					$('#'+id+' .vueTableAddContainer').html('<button type="button" class="btn btn-success vueTableAdd '+roza['vueTable'][id]['action_add']['vueTableDualMode']+'" onclick="'+roza['vueTable'][id]['action_add']['onclick']+'"><i class="fa fa-plus"></i> '+(roza.rozaLanguage=='bm'?'Tambah':'Add')+'</button>');
				}
				
				Sortable.create(
					$('#'+id+' tbody')[0],
					{
						handle: ".fa-bars",
						onUpdate: function(event) {
							if(typeof rozaDragged == 'function') rozaDragged(event);
						}
					}
				);
			});
			
			
			/*
			if(this.panel.leftPanel.initQueryBuilder) {
				this.panel.leftPanel.initQueryBuilder = false;
				$('#leftPanelQueryBuilder').queryBuilder({
					filters: [
						{
							id: 'c1',
							label: 'Column 1',
							type: 'string'
						},
						{
							id: 'c2',
							label: 'Column 2',
							type: 'string'
						}
					]
				})
			}
			*/
		},
		mounted: function() {
			this.$nextTick(function () {
				//===========================================================Side Menu
				/*
				$('.side-menu a').click(function(){
					var level = $(this).attr('menu-level');
					var id = $(this).attr('menu-id');
					
					if($(this).parent().is('.active')) {
						$(this).parent().removeClass('active');
						$(this).parent().find('ul').slideUp();
					}
					else {
						$('[menu-level='+level+']').parent().removeClass('active');
						$('.side-menu li').not('.active').find('.active').removeClass('active');
						$('[menu-level='+level+']').parent().find('ul').slideUp();
						$(this).parent().addClass('active');
						$(this).parent().children('ul').slideDown();
					}
				});
				*/
				//====================================================================

				$('#leftPanel').width(localStorage.getItem(prefix+'PanelSize')?localStorage.getItem(prefix+'PanelSize'):400);
				
				$('#leftPanel').resizable({
					handles: "e",
					resize: function(event, ui) {
						localStorage.setItem(prefix+'PanelSize', ui.size.width);
					}
				});
				
				$('.ui-resizable-handle').dblclick(function(){
					localStorage.removeItem(prefix+'PanelSize');
					$(this).parent('.ui-resizable').removeAttr('style');
				});
				
				/*
				$('#menu_toggle').click(function(){
					$('body').toggleClass('nav-md nav-sm');
				});
				*/
				
				$('.metro-menu-opener').mouseenter(function(){
					$('.metro-menu-opener').addClass('active');
				});
				$('.metro-menu-closer').mouseenter(function(){
					$('.metro-menu-opener').removeClass('active');
				});
				
				$('#globalSearch').devbridgeAutocomplete({
					lookup: [{value:'Khairul Bahar'}, {value:'Akta Merbahaya'}, {value:'Bahasa Melayu Teras Kejayaan'}],
					onSelect: function (suggestion) {
						$('#globalSearch').focus();
					}
				});
				
				this.getMenu();
				
				$('#confTheme').val(this.conf.theme);
				this.confTheme();
				
				$('body').css('opacity',1);
				
				if(this.rozaVersion != currentVersion) {
					$('#fetchWhatsNew').load('manual', function(){
						roza.rozaVersion = currentVersion;
						localStorage.setItem(prefix+'rozaVersion', currentVersion);
						roza.rozaModal({
							contentbm: $('#fetchWhatsNew #fetchWhatsNew').html().replace(/<a /gi, '<span '),
							contentbm: $('#fetchWhatsNew #fetchWhatsNew').html().replace(/<a /gi, '<span ')
						});
						$('#modalGeneral h2').css('margin-top', '0');
						$('#fetchWhatsNew').html('');
					});
				}
			});
		}
	});
};

function advanceIsDatepicker(e) {
	if($(e).find(':selected').attr('element')=='datepicker') {
		$(e).parent().find('.adv3').val('');
		$(e).parent().find('.adv3').daterangepicker({
			singleDatePicker: true,
			locale: {
				format: 'DD/MM/YYYY'
			}
		}, function(start, end, label) {
			//console.log(start.toISOString(), end.toISOString(), label);
		});
	}
	else {
		if($(e).parent().find('.adv3').data('daterangepicker')) {
			$(e).parent().find('.adv3').data('daterangepicker').remove();
			console.log('destroyed');
		}
	}
}

/*
function addFavourite_BAK() {
	$('#modalFavourite').modal({
		show: true,
		backdrop: 'static'
	});
}

rozaChangeFilter_BAK: $.debounce(function(e) {
	roza[e].filterString = $('#'+e+' #rozaFilter').val();
}, 300)

rozaContain_BAK: function(string, key) {
	console.log(string);
	console.log(key);
	return string.toUpperCase().indexOf(key.toUpperCase())>-1;
}

matchArguments_BAK: function(a) {
	var result = true;
	if(a.callee.length != a.length) {
		result = false;
		this.toast('Expecting '+a.callee.length+' arguments for '+a.callee.toString().split(' {')[0].replace('function ', a.callee.name).replace(/ /g,''));
	}
	return result;
}
rozaBindData_BAK: function(panel, bl, callback) {
	$.getJSON('dev/php/'+bl, function(data){
			if(data.status=='ok') {
				$.each(JSON.parse(data.data), function(k, v) {
					$('[name="'+k+'"]').val(v);
					$('[name="'+k+'"]').attr('data-value', v);
				});
				if(callback) callback(data);
			}
			else roza.toast(data.status);
	}).fail(function(){
		roza.toast(bl+': Not found');
	});
}

rozaBindLov_BAK: function(selector, bl, callback) {
	$.getJSON('dev/php/'+bl, function(data){
			if(data.status=='ok') {
				var html = '';
				var target = $('[name="'+selector+'"]');
				if(target[0].tagName=='SELECT') {
					var lov = JSON.parse(data.data);
					for(var i=0; i<lov.length; i++) {
						html += '<option value="'+lov[i].value+'" '+(target.attr('data-value')==lov[i].value?'selected':'')+'>'+lov[i]['label'+roza.rozaLanguage]+'</option>';
					}
					$('[name="'+selector+'"]').html(html);
				}
				else {
					roza.toast('rozaBindLov: Element type '+target[0].tagName+' not supported');
				}
				if(callback) callback(data);
			}
			else roza.toast(data.status);
	}).fail(function(){
		roza.toast(bl+': Not found');
	});
}
*/