<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div" >
				<image src="../../static/index/search.png" class="search-img"></image>
				<input type="search" placeholder="搜索用户/群" class="search" placeholder-style="color: #aaa; font-wight:400" @input="search"/>
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">用户</view>
				<view class="list user" v-for="(item, index) in userarr" :key='index'>
					<navigator url="../userhome/userhome?id=aaa" hover-class="none">
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip==1">发消息</view>
					<view class="right-bt add" v-if="item.tip==0">加好友</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../common/datas.js';
	import myfun from '../../common/myfun.js';
	export default{
		data(){
			return {
				userarr:[],
				uid:'',
				token:'',
				myname:'',
			};
		},
		onLoad:function(){
			this.getStroages();
		},
		methods: {
			//获取缓存数据
			getStroages: function(){
				try {
				    const value = uni.getStorageSync('user');
				    if (value) {
				       this.uid = value.id;
					   this.token = value.token;
					   this.myname = value.name;
				    }else{
						uni.navigateTo({
							url:'../SignIn/SiginIn',
						})
					}
				} catch (e) {
				    // error
				}
			},
			search: myfun.debounce(function(e){
				this.userarr = [];
				let searchval = e.detail.value;
				//console.log(searchval);
				if(searchval.length>0){
					this.searchUser(searchval);
				}
			},500),
			search1: function(e){
				this.userarr = [];
				let searchval = e.detail.value;
				if(searchval.length>0){
					this.searchUser(searchval);
				}
			},
			searchUser: function(e){
				uni.request({
					url: this.serverUrl+'/search/user',
					data:{
						data:e,
						token:this.token,
					},
					method:'POST',
					success:(data) =>{
						let status = data.data.status;
						//访问后端成功
						if(status == 200){
							let arr = data.data.result;
							// let exp = eval("/"+e+"/g");
							for(let i=0; i<arr.length; i++){
								if(arr[i].name.search(e)!= -1 || arr[i].email.search(e)!= -1){
									this.isFriend(arr[i],e);
									// arr[i].imgurl='../../static/img/' + arr[i].imgurl;
									// arr[i].name = arr[i].name.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>");
									// arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>");
									// this.userarr.push(arr[i]);
								}
							}
						}else if(status == 500){
							uni.showToast({
								title:'服务器请求失败',
								icon:'none',
								duration: 1500
							});
						}else if(status == 300){
							uni.navigateTo({
								url:'../SignIn/SiginIn?name='+this.myname,
							});
						}
					}
				})
			},
			isFriend: function(arr,e){
				let tip = 0;
				let exp = eval("/"+e+"/g");
				if(arr._id == this.uid){
					tip = 2;
					arr.tip = tip;
					arr.imgurl= this.serverUrl+'/data/'+arr.imgurl;
					arr.name = arr.name.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>");
					arr.email = arr.email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>");
					this.userarr.push(arr);
				}else{
					uni.request({
						url: this.serverUrl+'/search/isfriend',
						data:{
							uid: this.uid,
							fid:arr._id,
							token:this.token,
						},
						method:'POST',
						success:(data) =>{
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								tip = 1;
							}else if(status == 400){
								
							}else if(status == 500){
								uni.showToast({
									title:'服务器请求失败',
									icon:'none',
									duration: 1500
								});
							}else if(status == 300){
								uni.navigateTo({
									url:'../SignIn/SiginIn?name='+this.myname,
								});
							}
							arr.tip = tip;
							arr.imgurl= this.serverUrl+'/data/'+arr.imgurl;
							arr.name = arr.name.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>");
							arr.email = arr.email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>");
							this.userarr.push(arr);
						}
					})
				}
			},
			backOne: function(){
				uni.navigateTo({
					url: '../index/index',
				});
			}
			}
		}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	.top-bar{
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.1); 
		.search-div{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
			box-sizing: border-box;
			padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;
		}
		.search {
			padding: 0 80rpx 0 12rpx;
			height: 60rpx;
			background: $uni-bg-color-grey;
			border-radius: 10rpx;
		}
		.search-img {
			position: absolute;
			right: 130rpx;
			top: 22rpx;
			width: 40rpx;
			height: 40rpx;
		}
	}
	.main{
		padding: 88rpx $uni-spacing-col-base;
		.result{
			padding-top: $uni-spacing-col-base;
			.title{
				font-size: 44rpx;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 60rpx;
			}
		}
		.list{
			width: 100%;
			height: 100rpx;
			padding: 20rpx 0 ;
			image{
				float: left;
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
		}
		.names{
			float: left;
			padding-left: $uni-spacing-col-base;
		}
		.name{
			font-size: 36rpx;
			color: $uni-text-color;
			line-height: 50rpx;
		}
		.email {
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			line-height: 28rpx;
		}
		.right-bt{
			float: right;
			width: 120rpx;
			height: 48rpx;
			border-radius: 24rpx;
			font-size: $uni-font-size-sm;
			line-height: 48rpx;
			text-align: center;
			margin-top: 16rpx;
		}
		.send{
			background: $uni-color-primary;
			color: $uni-text-color;
		}
		.add{
			background: rgba(74, 170, 255, 0.1);
			color: $uni-color-success;
		}
	}
</style>
