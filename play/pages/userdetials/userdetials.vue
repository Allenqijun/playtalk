<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/logo1/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center" >
				<view class="title">详细</view>
			</view>
			<view class="top-bar-right" >
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head">
						  <image-cropper  :src="tempFilePath" @confirm="confirm" @cancel="cancel" ></image-cropper>
						    <image :src="cropFilePath" @tap="upload"  class="user-img" ></image>
					</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
				<view class="row"  @tap="modify">
					<view class="title">签名</view>
					<view class="cont">很好好好好好哈手残党拆下来看看份额开发巴萨卡哈维是的哈首付款</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">2020-04-20 23:23:32</view>
				</view>
			</view>
			<view class="column">
				<view class="row">
					<view class="title">昵称</view>
					<view class="cont">好多课</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array">
						      <view class="uni-input">{{array[index]}}</view>
						 </picker>
					</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						      <view class="uni-input">{{date}}</view>
						 </picker>
					</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">电话</view>
					<view class="cont">15179138590</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">邮箱</view>
					<view class="cont">452926028@qq.com</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="column">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">******</view>
					<view class="more"><image src="../../static/userhome/offwhite.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="bt2">退出登录</view>
		</view>
		<view class="modify" :style="{bottom:-+modifyHeight+ 'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close"  @tap="modify">取消</view>
				<view class="title">签名</view>
				<view class="define"  @tap="modifysubmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="text"placeholder="密码" placeholder-style="color: #aaa; font-wight:400"  v-model="pwd" class="modify-pwd"/>
				<textarea v-model="data" class="modify-content"/>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default{
		data(){
			const currentDate = this.getDate({
			            format: true
			 })
			return {
				cropFilePath:'../../static/img/four.jpeg',
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				data:'修改的内容',
				pwd:'',
				animationData:{},
				isModify:false,
				modifyHeight:'',
			}
		},
		computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		 },
		 onReady: function(){
			 this.getElementStyle();
		 },
		components: {ImageCropper},
		methods: {
			backOne: function(){
				uni.navigateBack({
					dalta:1
				});
			},
			bindPickerChange: function(e) {
			            console.log('picker发送选择改变，携带值为', e.target.value)
			            this.index = e.target.value
			},
			bindDateChange: function(e) {
			             this.date = e.target.value
			},
			upload() {
			            uni.chooseImage({
			                count: 1, //默认9
			                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			                sourceType: ['album'], //从相册选择
			                success: (res) => {
			                    this.tempFilePath = res.tempFilePaths.shift()
			                }
			            });
			        },
			 confirm(e) {
			            this.tempFilePath = ''
			            this.cropFilePath = e.detail.tempFilePath
			        },
			 cancel() {
			            console.log('canceled')
			 },
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				
				if (type === 'start') {
				year = year - 60;
				} else if (type === 'end') {
				year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getElementStyle: function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  this.modifyHeight = data.height;
				}).exec();
			},
			modify: function(){
				this.isModify = !this.isModify;
				var animation = uni.createAnimation({
				     duration: 300,
				     timingFunction: 'ease',
				   })
				   
				   if(this.isModify){
					   animation.bottom(0).step()
				   }else{
					   animation.bottom(-this.modifyHeight).step()
				   }
				   this.animationData = animation.export()
			},
			modifysubmit:function(){
				this.modify();
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	
	.top-bar{
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.1); 
	}
	.main{
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;
		.column{
			display: flex;
			flex-direction: column;
			padding-top: 12rpx;
			border-bottom: 1px solid $uni-border-color;
			.row{
				display: flex;
				flex-direction: row;
			}
			.title{
				flex: none;
				padding:0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}
			.head{
				height: 148rpx;
				display: flex;
				align-items: center;
			}
			.user-img{
				width: $uni-img-size-lg;
				height: $uni-img-size-lg;
				border-radius: $uni-border-radius-base;
			}
			.user-head{
				flex: auto;
			}
			.cont{
				flex: auto;
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				line-height: 112rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.more{
				flex: none;
				height: 112rpx;
				display: flex;
				align-items: center;
				image{
					width: 80rpx;
					height: 28rpx;
				}
			}
		}
	}
	.bt2{
		margin-top: 160rpx;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
	}
	.modify{
		position: fixed;
		z-index: 1002;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
		.modify-header{
			display: flex;
			flex-direction: row;
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			align-items: center;
			box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.1); 
			.close{
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title{
				flex:auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define{
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				line-height: 44rpx;
				color: $uni-color-success;
			}
		}
		.modify-main{
			display: flex;
			padding: $uni-spacing-col-base;
			flex-direction: column;
			.modify-pwd{
				margin-bottom: $uni-spacing-col-base;
				padding: 0 20rpx;
				box-sizing: border-box;
				flex: auto;
				width: 100%;
				flex: auto;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modify-content{
				padding: 16rpx 20rpx;
				box-sizing: border-box;
				flex: auto;
				width: 100%;
				height: 386rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
	
</style>
