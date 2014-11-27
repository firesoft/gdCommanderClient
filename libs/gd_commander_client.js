'use strict';

var os = require('os');
var functions = require('./functions.js');

function gdCommanderClient(params) {
	this._id = functions.randomString(32);
	this._serviceName = params.serviceName;
	this._gdRabbit = params.gdRabbit;
	this._pingTime = params.pingTime || 30*1000;

	this._bindPing();
	this._bindCommands();
	this._ping();
}

gdCommanderClient.prototype._bindPing = function() {
	setInterval(this._ping.bind(this), this._pingTime);
}

gdCommanderClient.prototype._ping = function() {
	var info = this._getInfo();
	this._gdRabbit.sendMessage('commander.ping', info);
}

gdCommanderClient.prototype._getInfo = function() {
	var info = {};
	info.id = this._id;
	info.serviceName = this._serviceName;
	info.process = this._getProcessInfo();
	info.os = this._getOsInfo();
	return info;
}

gdCommanderClient.prototype._getProcessInfo = function() {
	var info = {};
	info.uptime = process.uptime();
	info.pid = process.pid;
	info.memoryUsage = process.memoryUsage();
	return info;
}

gdCommanderClient.prototype._getOsInfo = function() {
	var info = {};
	info.hostname = os.hostname();
	info.uptime = os.uptime();
	info.loadavg = os.loadavg();
	info.freemem = os.freemem();
	info.totalmem = os.totalmem();
	return info;
}


gdCommanderClient.prototype._bindCommands = function() {
	this._gdRabbit.registerMessageHandler('commander.' + this._id +'.restart', this._restartAction.bind(this));
}

gdCommanderClient.prototype._restartAction = function(message) {
	if (!message.data) {
		this._restartProcess();
	} else {
		var timeout = parseInt(message.data);
		setTimeout(this._restartProcess.bind(this), timeout*1000);
	}
}

gdCommanderClient.prototype._restartProcess = function() {
	process.exit();
}

module.exports = gdCommanderClient;