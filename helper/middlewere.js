const common = (massage, success, data, code) => {
  let obj = {};
  obj["message"] = massage;
  obj["success"] = success;
  obj["success_code"] = code;
  obj["data"] = data;
  return obj;
};
module.exports = { common };
