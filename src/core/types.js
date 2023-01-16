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

export function ThumbnailCollection(id, userId, totalThumbnail, firstImage, sharedWith = [], ruleOfShare = new Rule(), updatedAt) {
    this.id = id;
    this.userId = userId;
    this.totalThumbnail = totalThumbnail;
    this.firstImage = firstImage;
    this.sharedWith = sharedWith;
    this.ruleOfShared = [ruleOfShare]
    this.createdAt = new Date().getTime()
    this.updatedAt = updatedAt || new Date().getTime();
}

export function Query(path, cond, value) {
    this.path = path;
    this.cond = cond;
    this.value = value
}

export function Image(id, collectionId, uri, name, fileSize, lastUpdatedAt) {
    this.id = id
    this.collectionId = collectionId;
    this.uri = uri;
    this.name = name;
    this.fileSize = fileSize;
    this.lastUpdatedAt = lastUpdatedAt;
}
