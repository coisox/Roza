var prefix = 'ILIMS_';
var xxx;
var rozaCallLandingFile, rozaSetTaskbar, rozaSetPanel, rozaBindData, rozaBindLov, rozaGetParam, rozaModal, rozaResetData, rozaSubmitData;
var globalUserId = '999';

if(!localStorage.getItem(prefix+'Language')) localStorage.setItem(prefix+'Language', 'bm');
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
			breadcrumb: '',
			breadcrumbBuffer: '',
			sessionParam: {},
			menu: {
				level: 1,
				parentIndex: 0,
				list: []
			},
			module: '',
			activeItem: '',
			taskbar: {},
			panel: {
				leftPanel: {
					filterString: '',
					type: '',
					prop: {}
				},
				rightPanel: {
					filterString: '',
					type: '',
					prop: {}
				},
				fullPanel: {
					filterString: '',
					type: '',
					prop: {},
					show: false
				},
			},
			dropzoneAction: 'main.html',
			language: localStorage.getItem(prefix+'Language'),
			favourites: JSON.parse(localStorage.getItem(prefix+'Favourites'))
		},
		computed: {
			leftFilteredList: function() {
				return this.panel.leftPanel.prop[0].list.filter(item => {
					return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(this.panel.leftPanel.filterString.toLowerCase()) > -1
				})
			},
			rightFilteredList: function() {
				return this.panel.rightPanel.prop[0].list.filter(item => {
					return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(this.panel.rightPanel.filterString.toLowerCase()) > -1
				})
			},
			fullFilteredList: function() {
				return this.panel.fullPanel.prop[0].list.filter(item => {
					return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(this.panel.fullPanel.filterString.toLowerCase()) > -1
				})
			}
		},
		methods: {
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
			rozaModal: function(opt) {
				if(opt)  {
					$('#modalGeneral #btnCancel').toggle(opt.cancel);
					$('#modalGeneral .modal-body').html('').html(opt['label'+this.language]);
					$('#modalGeneral #btnOk').attr('onclick', opt.onclick?opt.onclick:'rozaModal()');
					$('#modalGeneral').modal('show');
				}
				else $('#modalGeneral').modal('hide');
			},
			rozaResetData: function(e) {
				console.log('rozaSubmitData');
				console.log(file);
				console.log(e);
			},
			rozaSubmitData: function(file, e) {
				console.log('rozaSubmitData');
				console.log(file);
				console.log(e);
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
					this.panel.fullPanel.show = (opt.panel=='fullPanel');

					$.getJSON('roza/ROZA_GetUi.php?ROZA_UIID='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							roza.panel[opt.panel].prop = data.prop;
							roza.panel[opt.panel].type = data.prop[0].element=='standardlist'?'standardlist':'ui';
							
							if(data.prop[0].element=='standardlist') roza.setBreadcrumbBuffer(3, data.prop[0]['label'+roza.language]);
							else if(opt.panel!='rightPanel'){
								for(var x=0; x<data.prop.length; x++) {
									if(data.prop[x].type=='title') roza.setBreadcrumbBuffer(3, data.prop[x]['label'+roza.language]);
								}
							}
							roza.breadcrumb = roza.breadcrumbBuffer;

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
									html += '<option value="'+lov[i].value+'" '+(target.attr('data-value')==lov[i].value?'selected':'')+'>'+lov[i]['label'+roza.language]+'</option>';
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
				xxx = event;
				if(event.key=='Enter' || event.type=='click') {
					roza.breadcrumb = '<li class="breadcrumb-item"><a>Search result for "'+this.globalSearchKeyword+'"</a></li>';
					roza.panel.fullPanel.type = 'searchresult';
					roza.panel.fullPanel.show = true;
					roza.panel.leftPanel.show = false;
					roza.panel.leftPanel.show = false;
					roza.panel.rightPanel.show = false;
					rozaSetTaskbar();
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
			rozaCallLandingFile = this.rozaCallLandingFile;
			rozaSetTaskbar = this.rozaSetTaskbar;
			rozaSetPanel = this.rozaSetPanel;
			rozaBindData = this.rozaBindData;
			rozaBindLov = this.rozaBindLov;
			rozaGetParam = this.rozaGetParam;
			rozaModal = this.rozaModal;
			rozaResetData = this.rozaResetData;
			rozaSubmitData = this.rozaSubmitData;
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