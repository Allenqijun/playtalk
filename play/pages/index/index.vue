<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id='+uid" hover-class="none" class="top-bar-left">
				<image :src="imgurl" class="my-img"></image>
			</navigator>
			<view class="top-bar-center">
				<image src="../../static/index/Logo.png" class="logo"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="gotoSearch">
					<image src="../../static/index/search.png"></image>
				</view>
				<view class="add">
					<image src="../../static/index/add.png"></image>
				</view>
			</view>
		</view>
		<view class="main">
				<view class="friends">
					<view class="friend-list">
						<view class="friend-list-l">
							<text class="tip">1</text>
							<image src="../../static/index/nus.png"></image>
						</view>
						<view class="friend-list-r">
							<view class="top">
								<view class="name">好友申请</view>
								<view class="time">13:43</view>
							</view>
							<view class="news">你好，帅哥</view>
						</view>
					</view>
			</view>
			<view class="friends">
				<view class="friend-list" v-for="(item,index) in friends" :key="index">
					<view class="friend-list-l">
						<text class="tip">{{item.tip}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">
								{{item.name}}
							</view>
							<view class="time">
								{{changeTime(item.time)}}
							</view>
						</view>
						<view class="news">
							{{item.news}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../common/datas.js'
	import myfun from '../../common/myfun.js'
	export default {
		data() {
			return {
				friends:[],
				uid:'',
				imgurl:'',
				token:'',
			}
		},
		onLoad() {
			this.getFrineds();
			this.getStroages();
		},
		methods: {
			changeTime: function(Date){
				return myfun.dateTime(Date)
			},
			//获取缓存数据
			getStroages: function(){
				try {
				    const value = uni.getStorageSync('user');
				    if (value) {
				       this.uid = value.id;
					   this.imgurl = this.serverUrl+'/data/'+value.imgurl;
					   this.token = value.token;
				    }else{
						uni.navigateTo({
							url:'../SignIn/SiginIn',
						})
					}
				} catch (e) {
				    // error
				}
			},
			getFrineds: function(){
				this.friends = datas.friends();
				for(let i = 0; i<this.friends.length; i++){
					this.friends[i].imgurl = '../../static/img/'+this.friends[i].imgurl;
				}
			},
			gotoSearch: function(){
				uni.navigateTo({
					url: '../search/search'
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}
	.top-bar{
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.1); 
	}
	.main{
		padding-top: 104rpx;
	}
	.friend-list{
		height: 96rpx;
		padding: 16rpx $uni-spacing-col-base;
		&:active{
			background-color: $uni-bg-color-grey;
		}
		.friend-list-l{
			position: relative;
			float: left;
			image{
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-primary;
			}
			.tip{
				position: absolute;
				z-index: 10;
				top: -6rpx;
				left: 68rpx;
				min-width: 36rpx;
				height: 36rpx;
				background: $uni-color-warning;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				line-height: 36rpx;
				text-align: center;
			}
		}
		.friend-list-r{
			padding-left: 128rpx;
			.top{
				height: 50rpx;
				.name{
					float: left;
					font-size: 36rpx;
					color: $uni-text-color;
					font-weight: 400;
					color: $uni-text-color;
					line-height: 50rpx;
				}
				.time{
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 50rpx;
				}
			}
		}
		.news{
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
	}
</style>
