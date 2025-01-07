import { useState, useEffect } from 'react';
import axios from 'axios';
const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

function App() {
  const [account, setAccount] = useState({
    username: 'example@test.com',
    password: 'example',
  }); //登入資訊
  const [isAuth, setIsAuth] = useState(false); //登入狀態
  const [products, setProducts] = useState([]); // 產品資料
  const [tempProduct, setTempProduct] = useState({}); // 單一產品資料

  const handleInputChange = (event) => {
    // 將點擊後觸發的 event 事件的 value 和 name 解構出來
    const { value, name } = event.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      // 登入成功後儲存 cookie
      // 並透過 axios 方法將 token 存在 headers
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      getProducts();
      // 顯是登入後的介面狀態
      setIsAuth(true);
    } catch (error) {
      alert('登入失敗');
    }
  };
  // 取得產品資料
  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v2/api/${apiPath}/admin/products`
      );
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      alert('使用者已登入');
    } catch (error) {
      console.error(error);
    }
  };

  // 判斷目前是否已是登入狀態，有儲存 token 在 cookie 中
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    if (token) {
      getProducts();
      setIsAuth(true);
    }
  }, []);

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col-6">
              <button
                type="button"
                className="btn btn-success mb-5"
                onClick={checkUserLogin}
              >
                檢查使用者是否登入
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td>
                        <button
                          onClick={() => setTempProduct(product)}
                          className="btn btn-primary"
                          type="button"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top img-fluid"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge text-bg-primary">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：</p>
                    <ul>
                      <li>
                        材質/內容物：{tempProduct.content.material_contents}
                      </li>
                      <li>保存期限：{tempProduct.content.expiration_date}</li>
                      <li>產地：{tempProduct.content.origin}</li>
                      <li>注意事項：{tempProduct.content.material_notes}</li>
                    </ul>

                    <p className="card-text">
                      <del>{tempProduct.origin_price} 元</del> /{' '}
                      {tempProduct.price} 元
                    </p>
                    <h5 className="card-title">更多圖片：</h5>
                    {tempProduct.imagesUrl?.map(
                      (image) =>
                        image && (
                          <img key={image} src={image} className="img-fluid" />
                        )
                    )}
                  </div>
                </div>
              ) : (
                <p>請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                name="username"
                placeholder="name@example.com"
                value={account.username}
                onChange={handleInputChange}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={account.password}
                onChange={handleInputChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
