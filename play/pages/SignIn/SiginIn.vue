<template>
	<view class="content">
	<view class="top-bar">
		<view class="top-bar-right" @tap="toSignUp">
			<view class="text">注册</view>
		</view>
	</view>
	<view class="logo">
		<image src="../../static/logo1/Logo1.png"></image>
	</view>
	<view class="main">
		<view class="title">
			登录
		</view>
		<view class="slogan">
			您好，欢迎来到play
		</view>
		<view class="inputs">
			<input type="text" placeholder="用户名/邮箱" class="user" v-model="user" placeholder-style="color: #aaa; font-wight:400" />
			<input type="password" placeholder="密码" class="pwd" v-model="pwd" placeholder-style="color: #aaa; font-wight:400"/>
		</view>
		<view class="tips" :style="{display:mon}">
			输入用户名或密码错误！
		</view>
	</view>
	<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '',
				pwd: '',
				token:'',
				mon:'none',
			}
		},
		onLoad: function(e){
			if(e.user){
				this.user = e.user;
				uni.showToast({
					title:'注册成功请登录',
					icon:'none',
					duration: 1500
				});
			}else if(e.name){
				this.user = e.name;
				uni.showToast({
					title:'登录过期请重新登录',
					icon:'none',
					duration: 1500
				});
			}
		},
		methods: {
			toSignUp: function(){
				uni.navigateTo({
					url: '../SignUp/SignUp',
				})
			},
			login: function(){
				if(this.user && this.pwd){
					uni.request({
						url: this.serverUrl+'/signin/match',
						data:{
							data: this.user,
							pwd:this.pwd,
						},
						method:'POST',
						success:(data) =>{
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								//登录成功
								let res = data.data.back;
								this.mon = 'none';
								//本地存储用户信息
								try{
									uni.setStorageSync('user', {'id': res.id, 'name': res.name, 'imgurl': res.imgurl,'token':res.token});
								}catch(e){
									//error
									console.log('数据存储出错')
								}
								//跳转至首页
								uni.navigateTo({
									url: '../index/index'
								})
							}else if(status == 400){
								this.mon = 'block';
								this.pwd = '';
							}else if(status == 500){
								uni.showToast({
									title:'服务器请求失败',
									icon:'none',
									duration: 1500
								});
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
		@import "../../common/css/mycss.scss";
	.content {
		padding-top: var(--status-bar-height);
	}
/* 	.top-bar {
		position: fixed;
		z-index: 1001;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		background: $uni-bg-color;
		
		.top-bar-right{
			float: right;
			padding-right: 32rpx;
			.text{
				font-size: $uni-font-size-lg;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 88rpx;
			}
		}
	} */
	.logo {
		text-align: center;
		image{
			padding-top: 256rpx;
			width: 194rpx;
			height: 92rpx;
			margin: 0 auto;
		}
	}
	 
	.main {
		padding: 54rpx $uni-spacing-row-base 120rpx;
		.title {
			font-size: 56rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 88rpx;
		}
		.slogan{
			font-size: 40rpx;
			color: $uni-text-color-grey;
			line-height: 56rpx;
		}
		.inputs{
			padding-top: 8rpx;
			
			input {
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}
		}
		.tips{
			display: none;
			float:left;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 56rpx;
		}
	}
	.submit{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		box-shadow: 0px 50rpx 32rpx -36rpx rgba(255,288,49,0.4);
		border-radius: 48rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
	}
</style>
