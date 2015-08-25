Zepto(function($){
	var teacher = [
		{
			name:'胡波',
			img:'images/1.png'
		},
		{
			name:'董亚坡',
			img:'images/2.png'
		},
		{
			name:'王红',
			img:'images/3.png'
		},
		{
			name:'郭东',
			img:'images/4.png'
		},
		{
			name:'胡小',
			img:'images/5.png'
		},
		{
			name:'杨帆',
			img:'images/6.png'
		},
		{
			name:'李智',
			img:'images/7.png'
		},
		{
			name:'薛兴亚',
			img:'images/8.png'
		},
		{
			name:'汤志平',
			img:'images/9.png'
		},
		{
			name:'肖莎',
			img:'images/10.png'
		},
		{
			name:'媛媛',
			img:'images/11.png'
		}
	];
	var modal = false;
	var boxsVue;
	function creatComponent () {
		Vue.component('boxs-template',{
			template:'#boxs-template'
		})
	}
	creatComponent();
	function creatVue () {
		boxsVue = new Vue({
			el:'#boxList',
			data:{
				teacher:teacher,
				modal:modal
			},
			methods:{
				modalShow:function () {
					boxsVue.$data.modal = false;
				}
			}
		})
	}
	creatVue();
	function ceratStorage () {
		if(!window.localStorage.getItem('modal')){
			boxsVue.$data.modal = true;
			window.localStorage.setItem('modal',true);
		}
	}
	ceratStorage ();
});