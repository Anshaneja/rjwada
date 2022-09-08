import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Toplist from "../components/Toplist";
import { auth, fs } from "../config/Config";
import "./Whishlist.css";
import { useNavigate } from "react-router-dom";
import { BsTrash } from "react-icons/bs";

const Whishlist = ({ userid, addToCart }) => {
  const navigate = useNavigate();

  function Getcurrentuser() {
    const [user, setuser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setuser(snapshot.data().Fullname);
            });
        } else {
          setuser(null);
        }
      });
    }, []);
    return user;
  }

  const user = Getcurrentuser();
  const [cartproducts, setcartproducts] = useState([]);

  const cart = fs.collection("whishlist");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        cart.onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setcartproducts(newCartProduct);
        });
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    });
  }, [userid]);
  const handleProductDelete = (p, userid, name, quantity, price, id) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("whishlist")
          .doc("USER_ID = " + userid + ` PRODUCT_ID = ${id}`)
          .delete()
          .then(() => {
            cartproducts = cartproducts.filter((item) => {
              return item.ID !== `USER_ID = ` + userid + ` PRODUCT_ID = ${id}`;
            });
            console.log("deleted item");
            // cartproducts.pop
          });
      } else {
        console.log("error");
      }
    });
  };
  let particularProductArray = [];
  console.log(cartproducts)
  
  return (
    <div>
      {/* <Toplist /> */}
      <center>
        <div className="wishlist-wrapperr">
          <h1 style={{ fontWeight: "100" }}>
            Wishlist Items
          </h1>
          {cartproducts.length < 1 && (
            <h5 style={{ padding: "10px", color: "black" }}>
              Add your favourites here
            </h5>
          )}
          {cartproducts.length >= 1 && (
            <div className="noproduct">
          <div
            className="cart-item-header"
            style={{
              // border: "1px solid red",
            }}
          >
            <div className="cart-prod">Product</div>
            <div className="cart-price">Price</div>
            {/* <div className="cart-quan">Quantity</div> */}
          </div>
              {cartproducts.map((data) => {
                const slicedid = data.ID.slice(10, 38);

                if (slicedid === userid) {
                  particularProductArray.push([data.name, userid]);
                  console.log(data)
                  return (
                    <>
                  <hr style={{width:"75vw"}}/>
                    <div className="wishlist-wrapper">
                      <div className="wish-img" style={{ width: "23%" }}>
                        <img
                          src={`http://api.rjwada.com/assets/${data.banner}`}
                          alt=""
                          className="cart-img"
                        />
                      </div>
                      <div
                        className="wish-name"
                        style={{ width: "20%", textAlign: "start" }}
                      >
                        <h4> {data.name}</h4>
                      </div>
                      <div className="wish-price" style={{ width: "20%" }}>
                        <h4>₹ {data.total_prod_price}</h4>
                      </div>
                      <div className="cart-btn" style={{ width: "20%",marginTop:"20px" }}>
                        <button
                          style={{ marginLeft: "30px",border:"0px" }}
                          onClick={() => {
                            console.log(data);
                            addToCart(data ,data.size);
                            setTimeout(() => {
                              fs.collection("whishlist")
                                .doc(
                                  "USER_ID = " +
                                    userid +
                                    ` PRODUCT_ID = ${data.id}`
                                )
                                .delete();
                              navigate("/cart");
                            }, 1000);
                          }}
                          className="product-button-cart"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <div className="wish-del" style={{ width: "20%",marginTop:"18px" }}>
                        <div
                          // className="product-button-cart"
                          onClick={() =>
                            handleProductDelete(
                              data,
                              userid,
                              data.name,
                              data.quantity,
                              data.price,
                              data.id
                            )
                          }
                          style={{
                            marginLeft: "50px",
                            fontSize:"30px",
                            color:"red"
                          }}
                          className="del-icon"
                        >
                          <BsTrash/>
                        </div>
                      </div>
                    </div>
                    </>
                  );
                }
              })}
            </div>
          )}
        </div>
      </center>
    </div>
  );
  
};

export default Whishlist;