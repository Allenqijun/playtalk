<template>
	<view class="content">
	<view class="top-bar">
		<view class="top-bar-left" @tap="toSignIn">
			<image src="../../static/logo1/back.png" class="back-img"></image>
		</view>
	</view>
	<view class="logo">
		<image src="../../static/logo1/Logo1.png"></image>
	</view>
	<view class="main">
		<view class="title">注册</view>
		<view class="inputs">
			<view class="inputs-div">
				<input type="text" placeholder="取个名字吧" @blur="matchUser" class="user" placeholder-style="color: #aaa; font-wight:400" />
				<view class="employ" v-if="useremploy">已占用</view>
				<image src="../../static/logo1/yes.png" class="yes" v-if="isuser"></image>
			</view>
			<view class="inputs-div">
				<input type="text" placeholder="请输入邮箱" @blur="isEmail" class="email" placeholder-style="color: #aaa; font-wight:400" />
				<view class="employ" v-if="emailemploy">已占用</view>
				<view class="invaild" v-if="invaild">邮箱无效</view>
				<image src="../../static/logo1/yes.png" class="yes" v-if="isemail"></image>
			</view>
			<view class="inputs-div">
				<input :type="type" placeholder="请输入密码" @input="getPwd" class="pwd" placeholder-style="color: #aaa; font-wight:400"/>
				<image :src="lookurl" class="look" @tap="looks"></image>
			</view>
		</view>
	</view>
	<view :class="[{submit: isok}, {submit1: !isok}]" @tap="signUp">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: "password",
				isuser: false,
				isemail: false,
				look: false,
				invaild: false,
				useremploy: false,
				emailemploy: false,
				lookurl: '../../static/logo1/biyan.png',
				email: '',
				user: '',
				pwd: '',
				isok: false,
			}
		},
		computed:{
			isOk: function(){
				if( this.isuser && this.isemail && this.pwd.length>5){
					this.isok = true;
				}else{
					this.isok = false;
				}
			}
		},
		methods: {
			toSignIn: function(){
				uni.navigateTo({
					url: '../SignIn/SiginIn',
				})
			},
			looks: function(){
				if(this.look){
					this.type = "password";
					this.look = !this.look;
					this.lookurl = '../../static/logo1/zhengyan.png';
				}else{
					this.type = "text";
					this.look = !this.look;
					this.lookurl = '../../static/logo1/biyan.png';
				}
			},
			isEmail: function(e) {
				let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				this.email = e.detail.value;
				if(this.email.length>0){
					if(reg.test(this.email)){
						this.invaild = false;
						//后端验证邮箱是否被占用
						this.matchMail()
					}else{
					this.invaild = true;
					this.emailemploy = false;
					this.isemail = false;
				  }
				}else{
					this.invaild = false;
					this.emailemploy = false;
					this.isemail = false;
					this.isOk;
				}
			},
			//匹配邮箱
			matchMail: function(){
					uni.request({
						url: this.serverUrl+'/signup/judge',
						data:{
							data: this.user,
							type: 'email',
						},
						method:'POST',
						success:(data) =>{
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								let res = data.data.result;
								if(res>0){
									//表示邮箱已存在
									this.emailemploy = true;
									this.isemail = false;
								}else{
									//表示邮箱不存在
									this.emailemploy = false;
									this.isemail = true;
								}
								this.isOk;
							}else if(status == 500){
								uni.showToast({
									title:'服务器请求失败',
									icon:'none',
									duration: 1500
								});
							}
						}
					})
			},
			
			//匹配用户名
			matchUser: function(e){
				this.user = e.detail.value;
				if(this.user.length>0){
					uni.request({
						url: this.serverUrl+'/signup/judge',
						data:{
							data: this.user,
							type: 'name',
						},
						method:'POST',
						success:(data) =>{
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								let res = data.data.result;
								if(res>0){
									//表示用户名已存在
									this.useremploy = true;
									this.isuser = false;
								}else{
									//表示用户名不存在
									this.useremploy = false;
									this.isuser = true;
								}
								this.isOk;
							}else if(status == 500){
								uni.showToast({
									title:'服务器请求失败',
									icon:'none',
									duration: 1500
								});
							}
						}
					})
				}else{
					this.useremploy = false;
					this.isuser = false;
					this.isOk;
				}
			},
			getPwd: function(e){
				this.pwd = e.detail.value;
				this.isOk;
			},
			signUp: function(){
				if(this.isok){
					uni.request({
						url: this.serverUrl+'/signup/add',
						data:{
							name: this.user,
							mail: this.email,
							pwd:this.pwd,
						},
						method:'POST',
						success:(data) =>{
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								console.log(status)
								//注册成功跳转至登录界面
								uni.navigateTo({
									url:'../SignIn/SiginIn?user='+this.user,
								});
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
	.content {
		padding-top: var(--status-bar-height);
	}
	.top-bar {
		position: fixed;
		z-index: 1001;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		background: $uni-bg-color;
		
		.top-bar-left{
			float:left;
			padding-left: 32rpx;
			width: 88rpx;
			height: 88rpx;
			.text{
				font-size: $uni-font-size-lg;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.back-img{
				margin-top: 21rpx;
				width: 36rpx;
				height: 46rpx;
			}
		}
	}
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
		.inputs-div{
			position: relative;
		}
		.employ , .invaild{
			position: absolute;
			right: 0;
			top: 40rpx;
			font-size: $uni-font-size-base;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
		.yes {
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 38rpx;
			height: 30rpx;
		}
		.look {
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 38rpx;
			height: 30rpx;
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
	.submit1{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: rgba(39, 40, 50, 0.2);
		border-radius: 48rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: $uni-text-color-inverse;
		line-height: 96rpx;
		text-align: center;
	}
</style>