export default function html([first, ...strings], ...values) {
  // nhận vào mảng strings và các giá trị
  return values // duyệt qua các giá trị
    .reduce((acc, cur) => acc.concat(cur, strings.shift()), [first]) // nối các giá trị và chuỗi lại với nhau
    .filter((x) => (x && x !== true) || x === 0) // lọc ra các giá trị không phải là true
    .join(""); // chuyển mảng thành chuỗi
}

export function createStore(reducer) {
  let state = reducer(); // trạng thái ban đầu
  const roots = new Map(); // lưu trữ các component và root tương ứng
  function render() {
    // render lại trang
    for (const [root, component] of roots) {
      // duyệt qua các component và root
      const output = component(); // gọi hàm component để lấy ra template
      root.innerHTML = output; // gán template vào root
    }
  }
  return {
    // Nhận view rồi đẩy vào root
    attach(component, root) {
      // thêm component vào root
      roots.set(root, component); // thêm component và root tương ứng vào Map
      render(); // render lại trang
    },
    connect(selector = (state) => state) {
      // kết nối component với store
      return (
          component // trả về hàm component mới
        ) =>
        (
          props,
          ...args // nhận vào props và các tham số khác
        ) =>
          component({ ...props, ...selector(state), ...args }); // gọi hàm component với props, trạng thái và các tham số khác
    },
    dispatch(action, ...args) {
      // gửi action
      state = reducer(state, action, args); // cập nhật trạng thái mới
      render(); // render lại trang
    },
  };
}
