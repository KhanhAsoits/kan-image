import { configs } from "./configs";

export function User(id, username, email, password, avatar, createdAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.createdAt = createdAt;
}

export function Rule(read = true, write = false) {
    this.read = read;
    this.write = write;
}

export function ThumbnailCollection(id, userId, totalThumbnail, firstImage, sharedWith = [], ruleOfShare = new Rule(), updatedAt,state = true,size,name) {
    this.id = id;
    this.userId = userId;
    this.totalThumbnail = totalThumbnail;
    this.firstImage = firstImage;
    this.sharedWith = sharedWith;
    this.ruleOfShared = [ruleOfShare]
    this.state = state;
    this.size = size;
    this.name = name;
    this.createdAt = new Date().getTime()
    this.updatedAt = updatedAt || new Date().getTime();
}
export function DownloadingTask (id,collectionId,savedImage = [] , downloadImage = [],progress,done = false){
    this.id = id;
    this.collectionId = collectionId;
    this.savedImage = savedImage;
    this.downloadImage = downloadImage;
    this.progress = progress;
    this.done = done;
}

export function DownloadInfo(id,userId,collectionId,finish,imageSaved = [],downloadList = [],downloadProgress,pause){
    this.id = id;
    this.userId = userId;
    this.collectionId = collectionId;
    this.finish = finish;
    this.imageSaved = imageSaved;
    this.downloadProgress = downloadProgress
    this.downloadList = downloadList;
    this.pause = pause;
    this.downloadedAt = new Date().getTime()
}

export function Query(path, cond, value) {
    this.path = path;
    this.cond = cond;
    this.value = value;
}

export function Image(id, collectionId,uri, name, fileSize, lastUpdatedAt,width,height,caption,tag,state = true) {
    this.id = id
    this.width = width;
    this.height = height;
    this.collectionId = collectionId;
    this.uri = uri;
    this.name = name;
    this.state = state;
    this.tag = tag;
    this.caption = caption;
    this.fileSize = fileSize;
    this.lastUpdatedAt = lastUpdatedAt;
}
export function QrCodeRequest(action,dataRequest,expireAt,hashToken){
    this.action = action;
    this.dataRequest = dataRequest;
    this.expireAt = expireAt;
    this.hashToken = hashToken;
    this.createdAt = new Date().getTime(),
    this.appToken = configs.app_token
}

export const FileDisplayMode = {
    LIST : 1,
    GRID : 2
}
export const LogEntryActionConst  = {
    REMOVE : -1,
    UPDATE : 0,
    ADD :  1
}
export function LogEntryAction(type){
    this.type = type;
}
export function EntryLogDetail(message,dataChange){
    this.message = message;
    this.dataChange = dataChange;
}
export function LogEntry (id,userId,action,entryDetail){
    this.id = id;
    this.userId = userId;
    this.action = action;
    this.entryDetail = entryDetail;
}
export const QR_ACTION = {
    JOIN_COLLECTION:1
}
export const BARCODE_TYPE = {
    QR:'org.iso.QRCode'
}