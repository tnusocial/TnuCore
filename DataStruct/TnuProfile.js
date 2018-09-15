module.exports = function (id, code, name, _class, major, academicYear, hedaotao) {
    this.Id = id || "";
    this.MaSinhVien = code || "";
    this.Ten = name || "";
    this.Lop = _class || "";
    this.Nganh = major || "";
    this.NamHoc = academicYear || "";
    this.HeDaoTao = hedaotao || "";
};
