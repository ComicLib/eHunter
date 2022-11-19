// a background script for background tasks
import NotificationService from './service/NotificationService'

// hack for test
if (typeof chrome === 'undefined') {
    var chrome = { extension: { getViews: () => { return [] } } };
}

/* eslint-disable no-undef */
const isActivedPopView = chrome ? (chrome.extension.getViews().length === 2) : false;

// If user open popupView, Chrome will run two background.js, so we need to avoid this.
if (!isActivedPopView) {
    let notificationService = new NotificationService();
    notificationService.run();
}
