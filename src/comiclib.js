import core from '../core'
import { BasePlatform } from './platform/base'
import { AlbumService } from '../core/service/AlbumService'

class AlbumServiceImpl extends AlbumService {

    constructor() {
        super();
        console.log('AlbumServiceImpl初始化');
    }

    async getAlbumId() {
        if (!this.albumId) {
            this.albumId = new URLSearchParams(location.search).get('id');
        }
        return this.albumId;
    }

    async getMetadata() {
        return await (await fetch(`/api/archives/${await this.getAlbumId()}/metadata`)).json();
    }

    async getPageCount() {
        if (!this.metadata) {
            this.metadata = await this.getMetadata();
        }
        return this.metadata.pagecount;
    }

    async getCurPageNum(){
        return 0;
    }

    async getTitle() {
        if (!this.metadata) {
            this.metadata = await this.getMetadata();
        }
        return this.metadata.title;
    }

    async getImgPageInfos() {
        let pages = (await (await fetch(`/api/archives/${await this.getAlbumId()}/files?force=false`)).json()).pages;
        const loadThumb = ThumbInfo => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = ThumbInfo.src;
        });
        let thumbs = await Promise.all((await this.getThumbInfos()).map(loadThumb))
        return Array.from(Array(await this.getPageCount()).keys(), (i) => {
            return {
                id: i,
                index: i,
                src: pages[i],
                heightOfWidth: thumbs[i].height / thumbs[i].width
            }
        });
    }

    async getImgPageInfo(index) {
        return (await this.getImgPageInfos())[index];
    }

    async getImgSrc(index, mode) {
        let s = (await this.getImgPageInfos());
        return s[index];
    }

    async getNewImgSrc(index, mode) {
        return await this.getImgSrc(index, mode);
    }

    async getThumbInfos(cache = true) {
        this.albumId = await this.getAlbumId();
        return Array.from(Array(await this.getPageCount()).keys(), (i) => {
            return {
                id: i,
                src: `/api/archives/${this.albumId}/thumbnail?page=${i+1}`,
                mode: 1
            }
        });
    }

    async getThumbInfo(index) {
        return (await this.getThumbInfos())[index];
    }

    async getPreviewThumbnailStyle(index, imgPageInfo, thumbInfo) {
        return {
            'background-image': `url(${thumbInfo.src})`,
            'background-position': `0% 0%`,
            'background-size': 'cover'
        };
    }

    supportOriginImg() {
        return false;
    }

    supportImgChangeSource() {
        return false;
    }

    supportThumbView() {
        return true;
    }
}

class CLApp extends BasePlatform {
    isAlbumViewPage() {
        return true;
    }

    initEHunter() {
        super.initEHunter();
        core.createAppView('vue-container', '#app',
            core.launcher
                .setAlbumService(new AlbumServiceImpl())
                .setEHunterService({
                    showEHunterView: this.showEHunterView
                })
                .instance());
    }

}

new CLApp().init();
