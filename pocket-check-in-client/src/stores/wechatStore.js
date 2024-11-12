// src/stores/wechatStore.js
import { defineStore } from 'pinia';
import wx from 'weixin-js-sdk';
import { ref } from 'vue';
import axios from 'axios'
import { ElMessage } from 'element-plus';

export const useWeChatStore = defineStore('wechat', () => {
    const scanResult = ref('');

    // 获取微信配置
    const getWeChatConfig = async () => {
        try {
            const response = await axios.get('/wxapi/wx-config', {
                params: { url: window.location.href }
            });
            console.log('微信配置已收到:', response.data)
            // 返回微信配置
            return response.data
        } catch (error) {
            console.error('获取微信配置失败:', error)
        }
    };

    // 初始化微信配置
    const initWeChatConfig = (config) => {
        wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: ['scanQRCode'],
        });

        wx.error((error) => {
            console.error('微信配置错误:', error);
            ElMessage.error(JSON.stringify(error))
        });
    };

    // 调用微信扫码接口
    const scanQRCode = () => {
        return new Promise((resolve, reject) => {
            wx.scanQRCode({
                needResult: 1, // 扫码后直接返回结果
                scanType: ['qrCode', 'barCode'],
                success: (res) => {
                    resolve(res.resultStr);
                    scanResult.value = res.resultStr;
                },
                fail: (error) => {
                    console.error('Scan QR Code error:', error);
                    reject(error);
                },
            });
        });
    };

    return {
        scanResult,
        getWeChatConfig,
        initWeChatConfig,
        scanQRCode,
    };
});
