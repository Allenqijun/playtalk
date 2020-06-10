<template>
	<view class="">
	<view class="top-bar">
		<view class="top-bar-left" @tap="toSignIn">
			<image src="../../static/logo1/back.png" class="back-img"></image>
		</view>
			<view class="top-bar-right">
				<view class="more-img" v-if="relation == 0 || relation == 1">
					<image src="../../static/userhome/more.png"></image>
				</view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai" :animation="animationData4"></view>
			<image :src="user.imgurl" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background: sexBg}"  :animation="animationData3">
					<image :src="seximg" mode=""></image>
				</view>
				<image src="user.imgurl" mode="aspectFill" class="user-img" :animation="animationData2"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{markname}}</view>
				<view class="nick">昵称: {{user.name}}</view>
				<view class="intr">{{user.explain}}</view>
			</view>
		</view>
		<view class="buttom-bar">
			<view class="buttom-btn btn1" @tap="addFriendAnimate" v-if="relation==2">加好友</view>
			<view class="buttom-btn btn1"  v-if="relation==1">发消息</view>
		</view>
		<view class="add-misg" :style="{height: addHeight +'px', bottom: -+addHeight +'px' }" :animation="animationData">
			<view class="name">{{user.name}}</view>
			<textarea :value="myname+'请求加为好友~ '" maxlength="120" class="add-main" />
		</view>
		<view class="add-bt buttom-bar" :animation="animationData1">
			<view class="close btn1" @tap="addFriendAnimate">取消</view>
			<view class="send btn1">发送</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				id:'',
				uid:'',
				token:'',
				user:{},
				markname:'',
				myname:'',
				seximg:'../../static/userhome/性别.png',
				sexBg:'rgba(39, 40, 50,1)',
				relation:'',
				addHeight:'',
				animationData: {},
				animationData1: {},
				animationData2: {},
				animationData3: {},
				animationData4: {},
				isAdd: false,
			};
		},
		onLoad:function(e) {
			this.id = e.id;
			this.getStroages();
			this.getUser();
			this.judgeFriend();
		},
		onReady: function(){
			this.getElementStyle();
			
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
			//获取用户信息
			getUser:function(){
				uni.request({
					url: this.serverUrl+'/user/detail',
					data:{
						id: this.id,
						token: this.token,
					},
					method:'POST',
					success:(data) =>{
						let status = data.data.status;
						//访问后端成功
						if(status == 200){
							let res = data.data.result;
							//处理头像链接
							res.imgurl = this.serverUrl+'/data/'+ res.imgurl;
							console.log(res);
							if(typeof(res.explain)){
								res.explain = '这个人很懒，什么都没留下';
							}
							//处理markname方法
							if(this.markname.length==0){
								this.markname = res.name;
							}
							this.sexJudge(res.sex);
							this.user = res;
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
			//性别判断
			sexJudge: function(){
				if(e == 'female'){
					this.seximg = '../../static/userhome/女.png';
					this.sexBg = rgba(255, 93, 91,1);
				}else if(e == 'male'){
					this.seximg = '../../static/userhome/男.png';
					this.sexBg = rgba(87, 153, 255,1);
				}else{
					this.sexBg = rgba(39, 40, 50,1);
					this.seximg = '../../static/userhome/性别.png';
				}
			},
			//判断用户关系
			judgeFriend: function(){
				if(this.id == this.uid){
					this.relation =0;
				}else{
					//如果不是自己，向后台进行验证
					uni.request({
						url: this.serverUrl+'/search/isfriend',
						data:{
							uid: this.uid,
							fid:this.id,
							token: this.token,
						},
						method:'POST',
						success:(data) =>{
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								//好友
								this.relation =1;
								this.getMarkname();
							}else if(status == 400){
								//陌生人
								this.relation =2;
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
			},
			//获取好友昵称
			getMarkname:function(){
				uni.request({
					url: this.serverUrl+'/user/getmarkname',
					data:{
						uid: this.uid,
						fid:this.id,
						token: this.token,
					},
					method:'POST',
					success:(data) =>{
						let status = data.data.status;
						//访问后端成功
						if(status == 200){
							let res = data.data.result;
							if(!typeof(res.markname)){
								this.markname = res.markname;
							}
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
			toSignIn: function(){
				uni.navigateTo({
					url: '../SignUp/SignUp',
				});
			},
			getElementStyle: function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
				  this.addHeight = data.height-186;
				}).exec();
			},
			addFriendAnimate: function(){
				this.isAdd = !this.isAdd;
				 var animation = uni.createAnimation({
				      duration: 300,
				      timingFunction: 'ease',
				    })
					var animation1 = uni.createAnimation({
					   duration: 300,
					   timingFunction: 'ease',
					})
					var animation2 = uni.createAnimation({
					   duration: 300,
					   timingFunction: 'ease',
					})
					var animation3 = uni.createAnimation({
					   duration: 300,
					   timingFunction: 'ease',
					})
					var animation4 = uni.createAnimation({
					   duration: 300,
					   timingFunction: 'ease',
					})
					if(this.isAdd){
						 animation.bottom(0).step()
						 animation1.bottom(0).step()
						 animation2.width(120).height(120).step()
						 animation3.opacity(0).step()
						 animation4.backgroundColor('rgba(255,228,49,0.6)').step()
					}else{
						 animation.bottom(-this.addHeight).step()
						 animation1.bottom(-100).step()
						 animation2.width(200).height(200).step()
						 animation3.opacity(1).step()
						 animation4.backgroundColor('rgba(255,228,49,0)').step()
					}
				   
				    this.animationData = animation.export()
					this.animationData1 = animation1.export()
					this.animationData2 = animation2.export()
					this.animationData3 = animation3.export()
					this.animationData4 = animation4.export()
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	.bg{
		position: fixed;
		z-index: -2;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.bg-bai{
			width: 100%;
			height: 100%;
		}
		.bg-img{
			opacity: 0.4;
			position: absolute;
			z-index: -1;
			left: -10rpx;
			top: -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16px);
		}
	}
	.main{
		text-align: center;
		padding-top: 240rpx;
		.user-header{
			width: 412rpx;
			height: 412rpx;
			margin: 0 auto;
			position: relative;
			.sex{
				position: absolute;
				z-index: 11;
				bottom: 12rpx;
				right: 22rpx;
				width: 64rpx;
				height: 64rpx;
				border-radius: $uni-border-radius-circle;
				image{
					padding: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}
			.user-img{
				z-index: 10;
				top: 0;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255,255,255,1);
				box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39,40,50,0.1);
			}
		}
		.user-imf{
			padding-top: 42rpx;
			.name{
				color: $uni-text-color;
				font-size: 52rpx;
				line-height: 74rpx;
			}
			.nick{
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color;
			}
			.intr{
				padding: 20rpx 100rpx;
				font-size: $uni-font-size-base;
				font-weight: 300;
				color: $uni-text-color;
				line-height: 48rpx;
			}
		}
	}
	.buttom-bar{
		.buttom-btn{
			background-color: $uni-color-primary;
			margin: 0 $uni-spacing-col-base;
		}
	}
	.add-misg{
		position: fixed;
		box-sizing: border-box;
		width: 100%;
		padding: 0 56rpx;
		background: rgba(255,255,255,1);
		border-radius: 40rpx 40rpx 0px 0px;
		.name{
			padding: 168rpx 0 40rpx ;
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}
		.add-main{
			padding: 18rpx 22rpx;
			box-sizing: border-box;
			width: 100%;
			height: 420rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
	.add-bt{
		bottom: -200rpx;
		z-index: 100;
		display: flex;
		.close{
			width: 172rpx;
			background: $uni-bg-color-hover;
			border-radius: $uni-border-radius-sm;
			margin-left: $uni-spacing-col-base;
		}
		.send{
			margin:0 $uni-spacing-col-base;
			flex: auto;
			background: $uni-color-primary;
		}
	}
</style>
