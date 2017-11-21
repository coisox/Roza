var prefix = 'ILIMS_';
var xxx;
var rozaCallLandingFile, rozaSetTaskbar, rozaSetPanel, rozaBindData, rozaBindLov, rozaGetParam, rozaModal, rozaClearData, rozaResetData, rozaSubmitData, rozaHasRole;
var globalUserId, globalUserName, globalUserRole, globalLanguage;

if(!localStorage.getItem(prefix+'globalUserId')) localStorage.setItem(prefix+'globalUserId', '-1');
if(!localStorage.getItem(prefix+'globalUserName')) localStorage.setItem(prefix+'globalUserName', 'Roza');
if(!localStorage.getItem(prefix+'globalUserRole')) localStorage.setItem(prefix+'globalUserRole', '');
if(!localStorage.getItem(prefix+'globalLanguage')) localStorage.setItem(prefix+'globalLanguage', 'bm');
if(!localStorage.getItem(prefix+'Favourites')) localStorage.setItem(prefix+'Favourites', '[{"label":"Test Global Search 123","keyword":"Test Global Search 123"},{"label":"Test Global Search 456","keyword":"Test Global Search 456"}]');

$(document).ready(function(){
	$('input.flat').iCheck({
		checkboxClass: 'icheckbox_flat-green',
		radioClass: 'iradio_flat-green'
	});
	
	$('#leftPanel').width(localStorage.getItem(prefix+'PanelSize')?localStorage.getItem(prefix+'PanelSize'):400);
	
	initVue();
});

function initVue() {
	roza = new Vue({
		el: '#roza',
		data: {
			globalSearchKeyword: '',
			globalUserId: localStorage.getItem(prefix+'globalUserId'),
			globalUserName: localStorage.getItem(prefix+'globalUserName'),
			globalUserRole: localStorage.getItem(prefix+'globalUserRole').split(','),
			globalLanguage: localStorage.getItem(prefix+'globalLanguage'),
			breadcrumb: '',
			breadcrumbBuffer: '',
			sessionParam: {},
			menu: {
				level: 1,
				parentIndex: 0,
				list: []
			},
			activeMetro: '',
			activeStandardlist: '',
			taskbar: {},
			tab: {
				init: true,
				prop: {}
			},
			panel: {
				leftPanel: {
					filterString: '',
					type: '',
					prop: {},
					show: true
				},
				rightPanel: {
					filterString: '',
					type: '',
					prop: {},
					show: true
				},
				fullPanel: {
					filterString: '',
					type: '',
					prop: {},
					show: false
				},
			},
			dropzoneAction: 'main.html',
			favourites: JSON.parse(localStorage.getItem(prefix+'Favourites'))
		},
		methods: {
			metroClick: function(item, level, index) {
				if(level=='m1') {
					if(item.list) this.menu.level = 2;
					this.menu.parentIndex = index;
					this.activeMetro = index;
					this.setBreadcrumbBuffer(1, item['label'+this.globalLanguage]);
				}
				else {
					this.activeMetro = this.menu.parentIndex+'>'+index;
					this.setBreadcrumbBuffer(2, item['label'+this.globalLanguage]);
				}

				if(item.onclick) eval(item.onclick);
				else if(!item.list) {
					this.rozaSetPanel();
					this.rozaSetTaskbar();
					this.setBreadcrumbBuffer(3, '<b style="color:#E74C3C">'+(this.globalLanguage=='bi'?'Module not ready!':'Modul belum disediakan')+'</b>');
					this.breadcrumb = this.breadcrumbBuffer;
				}
			},
			onclick: function(item) {
				eval(item.onclick);
			},
			onchange: function(item) {
				eval(item.onchange);
			},
			matchArguments_BAK: function(a) {
				var result = true;
				if(a.callee.length != a.length) {
					result = false;
					this.toast('Expecting '+a.callee.length+' arguments for '+a.callee.toString().split(' {')[0].replace('function ', a.callee.name).replace(/ /g,''));
				}
				return result;
			},
			toast: function(html) {
				$.notify({message:html},{type:'danger', delay:4000});
			},
			filteredList: function(panel) {
				return this.panel[panel].prop[0].list.filter(function(item) {
					return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(roza.panel[panel].filterString.toLowerCase()) > -1
				})
			},
			loadTabContent: function(item) {
				
			},
			rozaHasRole: function(array) {
				var match = 0;
				for(var x=0; x<this.globalUserRole.length; x++) {
					if(array.indexOf(this.globalUserRole[x])>-1) match++;
				}
				return match;
			},
			accessControl: function(item, ac) {
				return eval(item[ac]);
			},
			rozaModal: function(opt) {
				if(opt)  {
					$('#modalGeneral #btnCancel').toggle(opt.cancel);
					$('#modalGeneral .modal-body').html('').html(opt['label'+this.globalLanguage]);
					$('#modalGeneral #btnOk').attr('onclick', opt.onclick?opt.onclick:'rozaModal()');
					$('#modalGeneral').modal('show');
				}
				else $('#modalGeneral').modal('hide');
			},
			rozaClearData: function() {
				$('.x_content [data-default]').not('.ac_disable, .ac_hide').each(function(){
					$(this).val('');
				});
			},
			rozaResetData: function() {
				$('.x_content [data-default]').each(function(){
					$(this).val($(this).attr('data-default'));
				});
			},
			rozaSubmitData: function(opt) {
				$.getJSON('dev/php/'+opt.target+'?'+$('.x_content .formMain').serialize()+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
					if(data.status=='ok') {
						roza.rozaModal({
							labelbm: 'Data telah dihantar',
							labelbi: 'Data has been sent'
						});
						if(opt.callback) opt.callback(data);
					}
					else roza.toast(data.status);
				});
			},
			rozaGetParam: function(param) {
				return this.sessionParam[param];
			},
			rozaCallLandingFile: function(file) {
				//save param for next page
				//================================================================================================
				var param = file.split(/[\?&]+/);
				this.sessionParam = {};
				for(var i=1; i<param.length; i++) this.sessionParam[param[i].split('=')[0]] = param[i].split('=')[1];
				//================================================================================================
				
				$.getScript('dev/js/'+file, function(data, textStatus, jqxhr) {}).fail(function(){
					if(arguments[1]=='error') roza.toast(file+': Not found');
					else {
						roza.toast(file+': '+arguments[2].toString().replace('ReferenceError: ', ''));
						$.ajax({
							crossDomain: true,
							dataType: "script",
							url: 'dev/js/'+file
						});
					}
				});
			},
			sortList: function(panel, sort) {
				this.panel[panel].prop[0].list.sort(function(a, b){
					if(sort=='epoch') return a[sort] - b[sort];
					else if(a[sort]==b[sort]) return 0;
					else if(a[sort]<b[sort]) return -1;
					else if(a[sort]>b[sort]) return 1;
				});
			},
			rozaChangeFilter_BAK: $.debounce(function(e) {
				roza[e].filterString = $('#'+e+' #rozaFilter').val();
			}, 300),
			rozaContain_BAK: function(string, key) {
				console.log(string);
				console.log(key);
				return string.toUpperCase().indexOf(key.toUpperCase())>-1;
			},
			rozaSetPanel: function(opt) {
				this.rozaModal();
				
				if(opt) {
					this.panel.leftPanel.show = !(opt.panel=='fullPanel');
					this.panel.rightPanel.show = !(opt.panel=='fullPanel');
					this.panel.fullPanel.show = (opt.panel=='fullPanel');
					
					if(opt.panel!='rightPanel') {
						roza.panel.rightPanel.prop = {};
						roza.taskbar = {};
					}

					$.getJSON('roza/ROZA_GetUi.php?ROZA_UIID='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							roza.panel[opt.panel].prop = data.prop;
							roza.panel[opt.panel].type = data.prop[0].element=='standardlist'?'standardlist':'ui';
							
							if(data.prop[0].element=='standardlist') roza.setBreadcrumbBuffer(3, data.prop[0]['label'+roza.globalLanguage]);
							else if(opt.panel!='rightPanel'){
								for(var x=0; x<data.prop.length; x++) {
									if(data.prop[x].type=='title') roza.setBreadcrumbBuffer(3, data.prop[x]['label'+roza.globalLanguage]);
								}
							}
							roza.breadcrumb = roza.breadcrumbBuffer;

							roza.tab.init = false;

							if(opt.callback) opt.callback(data);
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
					$.getJSON('roza/ROZA_GetUi.php?ROZA_UIID='+opt.ui, function(data){
						if(data.status=='ok') {
							roza.taskbar = data.prop;
							if(opt.callback) opt.callback(data);
						}
						else roza.toast(data.status);
					});
				}
				else {
					roza.taskbar = {};
				}
			},
			rozaSetTab: function(opt) {
				$.getJSON('roza/ROZA_GetUi.php?ROZA_UIID='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
					if(data.status=='ok') {
						roza.tab.prop = data.prop;
					}
					else roza.toast(data.status);
				});
			},
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
			},
			rozaBindLov_BAK: function(selector, bl, callback) {
				$.getJSON('dev/php/'+bl, function(data){
						if(data.status=='ok') {
							var html = '';
							var target = $('[name="'+selector+'"]');
							if(target[0].tagName=='SELECT') {
								var lov = JSON.parse(data.data);
								for(var i=0; i<lov.length; i++) {
									html += '<option value="'+lov[i].value+'" '+(target.attr('data-value')==lov[i].value?'selected':'')+'>'+lov[i]['label'+roza.globalLanguage]+'</option>';
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
			},
			setBreadcrumbBuffer: function(level, module) {
				var b = this.breadcrumbBuffer.split('<br>');
				b.splice(level-1);
				b.push('<li class="breadcrumb-item"><a>'+module+'</a></li>');
				this.breadcrumbBuffer = b.join('<br>');
			},
			bindDropzone: function(panel) {
				if($('#'+panel+' .dropzone').find('.dz-default').size()==0) {
					setTimeout(function(){
						$('#'+panel+' .dropzone').dropzone({
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
					}, 100);
				}
			},
			globalSearch: function(event) {
				if(event.key=='Enter' || event.type=='click') {
					this.breadcrumb = '<li class="breadcrumb-item"><a>Search result for "'+this.globalSearchKeyword+'"</a></li>';
					this.panel.fullPanel.type = 'searchresult';
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
					else roza.toast(data.status);
				});
			}
		},
		created: function() {
			
			//development only
			this.globalUserRole = localStorage.getItem('ILIMS_globalUserRole').split(',').map(function(role){ return role.trim() });
			
			globalUserId = this.globalUserId;
			globalUserName = this.globalUserName;
			globalUserRole = this.globalUserRole;
			globalLanguage = this.globalLanguage;
			rozaCallLandingFile = this.rozaCallLandingFile;
			rozaSetTaskbar = this.rozaSetTaskbar;
			rozaSetPanel = this.rozaSetPanel;
			rozaBindData = this.rozaBindData;
			rozaBindLov = this.rozaBindLov;
			rozaGetParam = this.rozaGetParam;
			rozaModal = this.rozaModal;
			rozaClearData = this.rozaClearData;
			rozaResetData = this.rozaResetData;
			rozaSubmitData = this.rozaSubmitData;
			rozaHasRole = this.rozaHasRole;
		},
		updated: function() {
			if(!this.tab.init) {
				this.tab.init = true;
				$('.bar_tabs li:nth-child(1)').click();
			}
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
				
				$('#menu_toggle').click(function(){
					$('body').toggleClass('nav-md nav-sm');
				});
				
				$('#globalSearch').devbridgeAutocomplete({
					lookup: [{value:'Khairul Bahar'}, {value:'Akta Merbahaya'}, {value:'Bahasa Melayu Teras Kejayaan'}],
					onSelect: function (suggestion) {
						$('#globalSearch').focus();
					}
				});
				
				this.getMenu();
			});
		}
	});
};


function addFavourite_BAK() {
	$('#modalFavourite').modal('show');
}