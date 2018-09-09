module.exports = function (id, link, time, title, tomtat, content, files) {
    this.Id = id || "";
    this.Link = link || "";
    this.Time = time || "";
    this.Title = title || "";
    this.Tomtat = tomtat || "";
    this.Content = content || "";
    this.Files = files || [];
};
