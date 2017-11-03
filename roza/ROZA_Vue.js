var xxx;
var rozaCallLandingFile, rozaSetBreadcrumb, rozaSetPanel, rozaBindData, rozaBindLov, rozaGetParam, rozaModal;
var globalUserId = '999';

if(!localStorage.getItem('ILMS_Language')) localStorage.setItem('ILMS_Language', 'labelbm');

$(document).ready(function(){
	$('input.flat').iCheck({
		checkboxClass: 'icheckbox_flat-green',
		radioClass: 'iradio_flat-green'
	});
	
	$('#leftPanel').width(localStorage.getItem('ILMS_PanelSize')?localStorage.getItem('ILMS_PanelSize'):400);
	
	initVue();
});

function initVue() {
	roza = new Vue({
		el: '#roza',
		data: {
			breadcrumb: '',
			module: '',
			activeItem: '',
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
			language: localStorage.getItem('ILMS_Language')
		},
		computed: {
			leftFilteredList: function() {
				return this.panel.leftPanel.prop[0].list.filter(item => {
					return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(this.panel.leftPanel.filterString.toLowerCase()) > -1
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
					if(opt.title) $('#modalGeneral .modal-title').html(opt.title);
					else $('#modalGeneral .modal-header').hide();
					if(opt.cancel) $('#modalGeneral #btnCancel').show();
					else $('#modalGeneral #btnCancel').hide();
					$('#modalGeneral .modal-body').html('').html(opt.content);
					$('#modalGeneral #btnOk').attr('onclick', opt.action);

					$('#modalGeneral').modal('show');
				}
				else $('#modalGeneral').modal('hide');
			},
			rozaGetParam: function(param) {
				return localStorage.getItem('ROZA_param_'+param);
			},
			rozaCallLandingFile: function(opt) {
				this.module = opt.module; //kat sini leh bagi sub module terus. then aku manually search parent utk active

				//save param for next page
				//================================================================================================
				var param = opt.file.split(/[\?&]+/);
				for(var i=0; i<param.length; i++) localStorage.setItem('ROZA_param_'+param[i].split('=')[0], param[i].split('=')[1]);
				//================================================================================================
				
				$.getScript('dev/js/'+opt.file, function(data, textStatus, jqxhr) {}).fail(function(){
					if(arguments[1]=='error') roza.toast(opt.file+': Not found');
					else {
						roza.toast(opt.file+': '+arguments[2].toString().replace('ReferenceError: ', ''));
						$.ajax({
							crossDomain: true,
							dataType: "script",
							url: 'dev/js/'+opt.file
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
				this.panel.fullPanel.show = (opt.panel=='fullPanel');
				
				$.getJSON('roza/ROZA_GetUi.php?id='+opt.ui, function(data){
					if(data.status=='ok') {
						roza.panel[opt.panel].prop = data.prop;
						roza.panel[opt.panel].type = data.prop[0].type=='standardlist'?'standardlist':'ui';
						if(opt.callback) opt.callback(data);
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
									html += '<option value="'+lov[i].value+'" '+(target.attr('data-value')==lov[i].value?'selected':'')+'>'+lov[i][roza.language]+'</option>';
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
			rozaSetBreadcrumb: function(html) {
				this.breadcrumb = html;
			},
			bindDropzone: function() {	
				setTimeout(function(){
					$(".dropzone").dropzone({
						url: "main.html",
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
		created: function() {
			rozaCallLandingFile = this.rozaCallLandingFile;
			rozaSetBreadcrumb = this.rozaSetBreadcrumb;
			rozaSetPanel = this.rozaSetPanel;
			rozaBindData = this.rozaBindData;
			rozaBindLov = this.rozaBindLov;
			rozaGetParam = this.rozaGetParam;
			rozaModal = this.rozaModal;
		},
		mounted: function() {
			this.$nextTick(function () {
				//===========================================================Side Menu
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
				//====================================================================
				
				$('#leftPanel').resizable({
					handles: "e",
					resize: function(event, ui) {
						localStorage.setItem('ILMS_PanelSize', ui.size.width);
					}
				});
				
				$('.ui-resizable-handle').dblclick(function(){
					localStorage.removeItem('ILMS_PanelSize');
					$(this).parent('.ui-resizable').removeAttr('style');
				});
		
				$('#menu_toggle').click(function(){
					$('body').toggleClass('nav-md nav-sm');
				});

				this.rozaCallLandingFile({module:'Dashboard', file:'UI_Dashboard.js'});
			});
		}
	});
};

$('#globalSearch').devbridgeAutocomplete({
	lookup: [{value:'Khairul Bahar'}, {value:'Akta Merbahaya'}, {value:'Bahasa Melayu Teras Kejayaan'}],
	onSelect: function (suggestion) {
		$('#globalSearch').focus();
	}
});

$('#globalSearch').keyup(function(event){
	if(event.key=='Enter') {
		$('.secondnav span').not('#kegemaran').hide();
		$('.breadcrumb').html('');
		$('#ajax_contentMain').load('carian.html', function(){
			$('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
		});
	}
});






















function addFavourite_BAK() {
	$('#modalFavourite').modal('show');
}