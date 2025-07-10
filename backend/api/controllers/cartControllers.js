// const httpStatus = require("http-status");
// const Product = require("../models/Product");
// const Joi = require("joi");
// const CartItem = require("../models/CartItems");
// const Cart = require("../models/Carts");
// const userController = require("../controllers/userControllers");
// const User = require("../models/User");

// const orderValidationController = Joi.object({
//   item: Joi.string().required(),
//   quantity: Joi.number().required(),
// });

// const addToCart = async (req, res) => {
//   try {
//     let { item, quantity } = req.body;

//     const { error } = orderValidationController.validate(req.body);

//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         msg: error.message
//       });
//     }

//     //check product
//     const checkProduct = await Product.findOne({
//       _id: item
//     });

//     if (!checkProduct) {
//       return res.status(httpStatus.CONFLICT).json({
//         success: false,
//         msg: "Product Doesn't Exists!!"
//       });
//     }

//     //get my cart
//     const cart = await Cart.findOne({
//       user_id: req.user._id,
//       status: "CART"
//     });

//     //check if item exist in cart
//     let order = await CartItem.findOne({
//       cart: cart._id,
//       // variant: _variant.sku,
//       status: "CART"
//     });

//     if (order) {
//       order.quantity += quantity;
//       await order.save();
//     } else {
//       order = await CartItem.create({
//         item, quantity, price: checkProduct.price, cart: cart._id
//       });

//       if (!order) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//           success: false,
//           msg: "Something Went Wrong!!"
//         });
//       }
//     }

//     //handle cart info
//     cart.total += (checkProduct.price * quantity);
//     cart.grand_total = cart.total - cart.discount;
//     await cart.save();
//     await checkProduct.save();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Item Added to cart",
//       data: {
//         cart,
//         cartItem: order
//       }
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const getMyCart = async (req, res) => {
//   try {
//     //get my cart
//     const cart = await Cart.findOne({
//       user_id: req.user._id,
//       status: "CART"
//     }).select("_id cart_no user_id total discount grand_total status").populate({
//       path: "user_id",
//       select: "name email mobile_no"
//     });

//     const cartItems = await CartItem.find({
//       cart: cart._id,
//       status: "CART"
//     }).populate({
//       path: "item",
//       select: "name sku images price"
//     }).select("item price quantity").lean();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "My Cart!!",
//       data: {
//         cart,
//         cartItems
//       }
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const removeItems = async (req, res) => {
//   try {
//     const { cartitem, quantity } = req.body;
//     const cartItem = await CartItem.findOne({
//       _id: cartitem,
//       status: "CART"
//     });
//     if (!cartItem) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "Item Not Found!!"
//       });
//     }
//     cartItem.quantity += quantity;

//     if (cartItem.quantity === 0) {
//       cartItem.status = "REMOVED";
//     }

//     await cartItem.save();

//     //update Cart
//     const cart = await Cart.findOne({
//       _id: cartItem.cart
//     });
//     if (!cart) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "Cart Not Found!!"
//       });
//     }

//     //handle cart info
//     cart.total += (cartItem.price * quantity);
//     cart.grand_total = cart.total - cart.discount;
//     await cart.save();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Cart Item updated!!"
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something Went Wrong!!"
//     });
//   }
// };

// const checkout = async (req, res) => {
//   try {
//     const { purchase_order_id, purchase_order_name } = req.query;

//     const shipping_address = purchase_order_name;

//     // if (!shipping_address && shipping_address !== "") {
//     //     return res.status(httpStatus.BAD_REQUEST).json({
//     //         success: false,
//     //         msg: "Please Add Shipping Address!!"
//     //     });
//     // }

//     //Update CartItem Status
//     const cartItems = await CartItem.updateMany({
//       cart: purchase_order_id
//     },
//       {
//         status: "ORDER"
//       });

//     //Update Cart Status
//     const cart = await Cart.findOneAndUpdate({ _id: purchase_order_id }, {
//       status: "ORDER",
//       shipping_address: shipping_address
//     });

//     //create 
//     await userController.createCart(cart.user_id);

//     res.writeHead(302, {
//       Location: `http://localhost:3000/profile`,
//     });
//     res.end();
//     return null;

//   } catch (error) {
//     // return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//     //     success: false,
//     //     msg: "Something Went Wrong!!"
//     // });
//     res.writeHead(302, {
//       Location: `http://localhost:3000/profile`,
//     });
//     res.end();
//     return null;
//   }
// };

// const checkoutMobile = async (req, res) => {
//   try {
//     const { cart_id } = req.params;

//     const shipping_address = req.body.shipping_address;

//     // if (!shipping_address && shipping_address !== "") {
//     //     return res.status(httpStatus.BAD_REQUEST).json({
//     //         success: false,
//     //         msg: "Please Add Shipping Address!!"
//     //     });
//     // }

//     //Update CartItem Status
//     const cartItems = await CartItem.updateMany({
//       cart: cart_id
//     },
//       {
//         status: "ORDER"
//       });

//     //Update Cart Status
//     const cart = await Cart.findOneAndUpdate({ _id: cart_id }, {
//       status: "ORDER",
//       shipping_address: shipping_address
//     });

//     //create 
//     await userController.createCart(cart.user_id);

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Checkout Completed"
//     });

//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const cartStatusChange = async (req, res) => {
//   try {
//     const { cartItem, status } = req.body;

//     //FIND CART
//     const checkCartItem = await CartItem.findOne({
//       _id: cartItem
//     });

//     if (!checkCartItem) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "Cart Item not found."
//       });
//     }


//     checkCartItem.status = status;
//     await checkCartItem.save();

//     //check if cartitems left in cart to resolve the Cart status
//     const checkItemsLeft = CartItem.find({
//       cart: checkCartItem.cart,
//       status: { $nin: ["CART", "REMOVED", "DELIVERED", "CANCELLED"] }
//     });

//     if (!checkItemsLeft) {
//       await Cart.findByIdAndUpdate(checkCartItem.cart, { status: "COMPLETED" });
//     }

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Order Status Changed"
//     });

//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const myOrder = async (req, res) => {
//   try {
//     const { page = 1, size = 10, sort =
//       { _id: -1 } } = req.query;
//     //my carts
//     const carts = await Cart.distinct('_id', { user_id: req.user._id });

//     //my orders
//     const orders = await CartItem.find({
//       cart: { $in: carts },
//       status: { $nin: ["CART", "REMOVED"] }
//     }).populate({
//       path: "item",
//       select: "name description calorie_count sku price images"
//     }).skip((page - 1) * size).limit(size).lean();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "My Orders",
//       data: orders
//     });

//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const getOrders = async (req, res) => {
//   try {
//     let { page = 1, size = 10, sort = { _id: -1 } } = req.query;

//     let searchQuery = {
//       status: { $nin: ["CART", "REMOVED"] }
//     };

//     if (req.query.status) {
//       searchQuery = {
//         ...searchQuery,
//         status: req.query.status
//       };
//     }
//     if (req.query.email) {
//       const user = await userModel.findOne({
//         email: { $regex: req.query.email, $options: 'i' },
//         // is_deleted: false
//       });
//       let cart = [];
//       if (user) {
//         cart = await Cart.distinct('_id', { user_id: user._id });
//       }
//       searchQuery = {
//         ...searchQuery,
//         cart: { $in: cart }
//       };
//     }
//     if (req.query.cart_no) {
//       const cart = await Cart.distinct('_id', { cart_no: req.query.cart_no });
//       searchQuery = {
//         ...searchQuery,
//         cart: { $in: cart }
//       };
//     }

//     const orders = await CartItem.find(searchQuery).populate({
//       path: "cart",
//       select: "cart_no user_id total discount grand_total",
//       populate: {
//         path: "user_id",
//         select: "name email mobile_no"
//       }
//     }).populate({
//       path: "item",
//       select: "name description calorie_count sku price images"
//     }).skip((page - 1) * size).limit(size).lean();

//     const totalCount = await CartItem.countDocuments({
//       status: { $nin: ["CART", "REMOVED"] }
//     });

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Orders",
//       data: orders,
//       page,
//       size,
//       totalCount
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// module.exports = {
//   addToCart,
//   getMyCart,
//   checkout,
//   checkoutMobile,
//   removeItems,
//   cartStatusChange,
//   myOrder,
//   getOrders,

// };



const httpStatus = require("http-status");
const Property = require("../models/Product");  // Updated to Property
const Joi = require("joi");
const CartItem = require("../models/CartItems");
const Cart = require("../models/Carts");
const userController = require("../controllers/userControllers");
const User = require("../models/User");

const orderValidationController = Joi.object({
  item: Joi.string().required(),
  quantity: Joi.number().required(),
});

const addToCart = async (req, res) => {
  try {
    let { item, quantity } = req.body;

    const { error } = orderValidationController.validate(req.body);

    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }

    //check property
    const checkProperty = await Property.findOne({
      _id: item
    });

    if (!checkProperty) {
      return res.status(httpStatus.CONFLICT).json({
        success: false,
        msg: "Property Doesn't Exist!!"
      });
    }

    //get my cart
    const cart = await Cart.findOne({
      user_id: req.user._id,
      status: "CART"
    });

    //check if item exists in cart
    let order = await CartItem.findOne({
      cart: cart._id,
      status: "CART"
    });

    if (order) {
      order.quantity += quantity;
      await order.save();
    } else {
      order = await CartItem.create({
        item, quantity, price: checkProperty.price, cart: cart._id
      });

      if (!order) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          msg: "Something Went Wrong!!"
        });
      }
    }

    //handle cart info
    cart.total += (checkProperty.price * quantity);
    cart.grand_total = cart.total - cart.discount;
    await cart.save();
    await checkProperty.save();

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Item Added to cart",
      data: {
        cart,
        cartItem: order
      }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const getMyCart = async (req, res) => {
  try {
    //get my cart
    const cart = await Cart.findOne({
      user_id: req.user._id,
      status: "CART"
    }).select("_id cart_no user_id total discount grand_total status").populate({
      path: "user_id",
      select: "name email mobile_no"
    });

    const cartItems = await CartItem.find({
      cart: cart._id,
      status: "CART"
    }).populate({
      path: "item",
      select: "name sku images price location"  // Updated to include location
    }).select("item price quantity").lean();

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "My Cart!!",
      data: {
        cart,
        cartItems
      }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const removeItems = async (req, res) => {
  try {
    const { cartitem, quantity } = req.body;
    const cartItem = await CartItem.findOne({
      _id: cartitem,
      status: "CART"
    });
    if (!cartItem) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        msg: "Item Not Found!!"
      });
    }
    cartItem.quantity += quantity;

    if (cartItem.quantity === 0) {
      cartItem.status = "REMOVED";
    }

    await cartItem.save();

    //update Cart
    const cart = await Cart.findOne({
      _id: cartItem.cart
    });
    if (!cart) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        msg: "Cart Not Found!!"
      });
    }

    //handle cart info
    cart.total += (cartItem.price * quantity);
    cart.grand_total = cart.total - cart.discount;
    await cart.save();

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Cart Item updated!!"
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const checkout = async (req, res) => {
  try {
      const { purchase_order_id, purchase_order_name } = req.body;

      // Log received data
      console.log('Received order data:', req.body);

      // Ensure shipping address is provided
      if (!purchase_order_name || purchase_order_name === "") {
          return res.status(httpStatus.BAD_REQUEST).json({
              success: false,
              msg: "Please add a shipping address!"
          });
      }

      // Update CartItem Status
      const cartItems = await CartItem.updateMany({
          cart: purchase_order_id
      }, {
          status: "ORDER"
      });

      // Update Cart Status
      const cart = await Cart.findOneAndUpdate(
          { _id: purchase_order_id },
          { status: "ORDER", shipping_address: purchase_order_name },
          { new: true }
      );

      if (!cart) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              success: false,
              msg: "Failed to update the cart."
          });
      }

      // Optionally, create a new cart for the user after checkout if needed
      await userController.createCart(cart.user_id);

      console.log("Order placed successfully!");

      // Redirect user to profile after successful checkout
      res.writeHead(302, {
          Location: `http://localhost:3001/profile`
      });
      res.end();
      return null;

  } catch (error) {
      console.error("Error during checkout:", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          msg: "Something went wrong while placing the order."
      });
  }
};

const checkoutMobile = async (req, res) => {
  try {
    const { cart_id } = req.params;

    const shipping_address = req.body.shipping_address;

    // if (!shipping_address && shipping_address !== "") {
    //     return res.status(httpStatus.BAD_REQUEST).json({
    //         success: false,
    //         msg: "Please Add Shipping Address!!"
    //     });
    // }

    //Update CartItem Status
    const cartItems = await CartItem.updateMany({
      cart: cart_id
    },
      {
        status: "ORDER"
      });

    //Update Cart Status
    const cart = await Cart.findOneAndUpdate({ _id: cart_id }, {
      status: "ORDER",
      shipping_address: shipping_address
    });

    //create 
    await userController.createCart(cart.user_id);

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Checkout Completed"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const cartStatusChange = async (req, res) => {
  try {
    const { cartItem, status } = req.body;

    //FIND CART
    const checkCartItem = await CartItem.findOne({
      _id: cartItem
    });

    if (!checkCartItem) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        msg: "Cart Item not found."
      });
    }

    checkCartItem.status = status;
    await checkCartItem.save();

    //check if cartitems left in cart to resolve the Cart status
    const checkItemsLeft = await CartItem.find({
      cart: checkCartItem.cart,
      status: { $nin: ["CART", "REMOVED", "DELIVERED", "CANCELLED"] }
    });

    if (!checkItemsLeft.length) {
      await Cart.findByIdAndUpdate(checkCartItem.cart, { status: "COMPLETED" });
    }

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Order Status Changed"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const myOrder = async (req, res) => {
  try {
    const { page = 1, size = 10, sort =
      { _id: -1 } } = req.query;
    //my carts
    const carts = await Cart.distinct('_id', { user_id: req.user._id });

    //my orders
    const orders = await CartItem.find({
      cart: { $in: carts },
      status: { $nin: ["CART", "REMOVED"] }
    }).populate({
      path: "item",
      select: "name description sku price images location"  // Updated to include location
    }).skip((page - 1) * size).limit(size).lean();

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "My Orders",
      data: orders
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const getOrders = async (req, res) => {
  try {
    let { page = 1, size = 10, sort = { _id: -1 } } = req.query;

    let searchQuery = {
      status: { $nin: ["CART", "REMOVED"] }
    };

    if (req.query.status) {
      searchQuery = {
        ...searchQuery,
        status: req.query.status
      };
    }
    if (req.query.email) {
      const user = await User.findOne({
        email: { $regex: req.query.email, $options: 'i' },
        // is_deleted: false
      });
      let cart = [];
      if (user) {
        cart = await Cart.distinct('_id', { user_id: user._id });
      }
      searchQuery = {
        ...searchQuery,
        cart: { $in: cart }
      };
    }
    if (req.query.cart_no) {
      const cart = await Cart.distinct('_id', { cart_no: req.query.cart_no });
      searchQuery = {
        ...searchQuery,
        cart: { $in: cart }
      };
    }

    const orders = await CartItem.find(searchQuery).populate({
      path: "cart",
      select: "cart_no user_id total discount grand_total",
      populate: {
        path: "user_id",
        select: "name email mobile_no"
      }
    }).populate({
      path: "item",
      select: "name description sku price images location"  // Updated to include location
    }).skip((page - 1) * size).limit(size).lean();

    const totalCount = await CartItem.countDocuments({
      status: { $nin: ["CART", "REMOVED"] }
    });

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Orders",
      data: orders,
      page,
      size,
      totalCount
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

module.exports = {
  addToCart,
  getMyCart,
  checkout,
  checkoutMobile,
  removeItems,
  cartStatusChange,
  myOrder,
  getOrders,
};







// const httpStatus = require("http-status");
// const Property = require("../models/Product");  // Updated to Property
// const Joi = require("joi");
// const CartItem = require("../models/CartItems");
// const Cart = require("../models/Carts");
// const userController = require("../controllers/userControllers");
// const User = require("../models/User");

// const orderValidationController = Joi.object({
//   item: Joi.string().required(),
//   quantity: Joi.number().required(),
// });

// const addToCart = async (req, res) => {
//   try {
//     let { item, quantity } = req.body;

//     const { error } = orderValidationController.validate(req.body);
//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         msg: error.message
//       });
//     }

//     // 1) Check that the property (item) exists
//     const checkProperty = await Property.findById(item);
//     if (!checkProperty) {
//       return res.status(httpStatus.CONFLICT).json({
//         success: false,
//         msg: "Property Doesn't Exist!!"
//       });
//     }

//     // 2) Get or create the user's cart with status "CART"
//     let cart = await Cart.findOne({
//       user_id: req.user._id,
//       status: "CART"
//     });
//     // If there's no cart yet, create one (optional, if your logic needs it):
//     if (!cart) {
//       cart = await Cart.create({
//         user_id: req.user._id,
//         total: 0,
//         discount: 0,
//         grand_total: 0,
//         status: "CART"
//       });
//     }

//     // 3) Check if this specific item is already in the cart
//     let order = await CartItem.findOne({
//       cart: cart._id,
//       item: item,       // <-- Important: match on item ID
//       status: "CART"
//     });

//     // // 4) If so, increment quantity; otherwise create new cart item
//     // if (order) {
//     //   order.quantity += quantity;
//     //   await order.save();
//     // } else {
//     //   order = await CartItem.create({
//     //     item,
//     //     quantity,
//     //     price: checkProperty.price, // store the property price
//     //     cart: cart._id
//     //   });
//     //   if (!order) {
//     //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//     //       success: false,
//     //       msg: "Something Went Wrong!!"
//     //     });
//     //   }
//     // }

//     // 5) Update cart totals
//     // cart.total += (checkProperty.price * quantity);
//     cart.total +=(checkProperty.price*1);
//     cart.grand_total = cart.total - cart.discount;
//     await cart.save();

//     // If your property has a stock or other fields to update, do so here
//     // await checkProperty.save(); // (Only if you need to track property changes)

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Item Added to cart",
//       data: {
//         cart,
//         cartItem: order
//       }
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const getMyCart = async (req, res) => {
//   try {
//     // 1) Find the cart for this user
//     const cart = await Cart.findOne({
//       user_id: req.user._id,
//       status: "CART"
//     })
//       .select("_id cart_no user_id total discount grand_total status")
//       .populate({
//         path: "user_id",
//         select: "name email mobile_no"
//       });

//     // 2) Find all cart items in this cart, populating the property
//     const cartItems = await CartItem.find({
//       cart: cart._id,
//       status: "CART"
//     })
//       .populate({
//         path: "item",
//         select: "name sku images price location" // Make sure 'price' is in your schema
//       })
//       .select("item price quantity")
//       .lean();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "My Cart!!",
//       data: {
//         cart,
//         cartItems
//       }
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const removeItems = async (req, res) => {
//   try {
//     const { cartitem, quantity } = req.body;
//     const cartItem = await CartItem.findOne({
//       _id: cartitem,
//       status: "CART"
//     });
//     if (!cartItem) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "Item Not Found!!"
//       });
//     }

//     // Decrement quantity by the given amount
//     cartItem.quantity += quantity;
//     if (cartItem.quantity <= 0) {
//       cartItem.status = "REMOVED";
//     }
//     await cartItem.save();

//     // Update the Cart total
//     const cart = await Cart.findOne({ _id: cartItem.cart });
//     if (!cart) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "Cart Not Found!!"
//       });
//     }

//     // cart.total += (cartItem.price * quantity);
//     cart.total += (cartItem.price * 1);
//     cart.grand_total = cart.total - cart.discount;
//     await cart.save();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Cart Item updated!!"
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something Went Wrong!!"
//     });
//   }
// };

// const checkout = async (req, res) => {
//   try {
//     const { purchase_order_id, purchase_order_name } = req.body;

//     // Log received data
//     console.log("Received order data:", req.body);

//     if (!purchase_order_name || purchase_order_name === "") {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         msg: "Please add a shipping address!"
//       });
//     }

//     // Update CartItem status
//     await CartItem.updateMany(
//       { cart: purchase_order_id },
//       { status: "ORDER" }
//     );

//     // Update Cart status
//     const cart = await Cart.findOneAndUpdate(
//       { _id: purchase_order_id },
//       { status: "ORDER", shipping_address: purchase_order_name },
//       { new: true }
//     );
//     if (!cart) {
//       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         msg: "Failed to update the cart."
//       });
//     }

//     // Optionally create a new cart for the user
//     await userController.createCart(cart.user_id);

//     console.log("Order placed successfully!");
//     res.writeHead(302, {
//       Location: `http://localhost:3001/profile`
//     });
//     res.end();
//     return null;
//   } catch (error) {
//     console.error("Error during checkout:", error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something went wrong while placing the order."
//     });
//   }
// };

// const checkoutMobile = async (req, res) => {
//   try {
//     const { cart_id } = req.params;
//     const { shipping_address } = req.body;

//     // Update CartItem Status
//     await CartItem.updateMany(
//       { cart: cart_id },
//       { status: "ORDER" }
//     );

//     // Update Cart Status
//     const cart = await Cart.findOneAndUpdate(
//       { _id: cart_id },
//       { status: "ORDER", shipping_address: shipping_address }
//     );

//     // Create a new cart for the user
//     await userController.createCart(cart.user_id);

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Checkout Completed"
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const cartStatusChange = async (req, res) => {
//   try {
//     const { cartItem, status } = req.body;

//     // Find cart item
//     const checkCartItem = await CartItem.findOne({ _id: cartItem });
//     if (!checkCartItem) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "Cart Item not found."
//       });
//     }

//     // Update status
//     checkCartItem.status = status;
//     await checkCartItem.save();

//     // If no items are left in a "purchasable" state, mark cart completed
//     const checkItemsLeft = await CartItem.find({
//       cart: checkCartItem.cart,
//       status: { $nin: ["CART", "REMOVED", "DELIVERED", "CANCELLED"] }
//     });
//     if (!checkItemsLeft.length) {
//       await Cart.findByIdAndUpdate(checkCartItem.cart, { status: "COMPLETED" });
//     }

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Order Status Changed"
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const myOrder = async (req, res) => {
//   try {
//     const { page = 1, size = 10 } = req.query;

//     // 1) Find all cart IDs for this user
//     const carts = await Cart.distinct("_id", { user_id: req.user._id });

//     // 2) Get orders for these carts (exclude CART, REMOVED)
//     const orders = await CartItem.find({
//       cart: { $in: carts },
//       status: { $nin: ["CART", "REMOVED"] }
//     })
//       .populate({
//         path: "item",
//         select: "name description sku price images location"
//       })
//       .skip((page - 1) * size)
//       .limit(Number(size))
//       .lean();

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "My Orders",
//       data: orders
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const getOrders = async (req, res) => {
//   try {
//     let { page = 1, size = 10 } = req.query;
//     let searchQuery = {
//       status: { $nin: ["CART", "REMOVED"] }
//     };

//     // Filter by status if provided
//     if (req.query.status) {
//       searchQuery.status = req.query.status;
//     }

//     // Filter by user email if provided
//     if (req.query.email) {
//       const user = await User.findOne({
//         email: { $regex: req.query.email, $options: "i" }
//       });
//       let cart = [];
//       if (user) {
//         cart = await Cart.distinct("_id", { user_id: user._id });
//       }
//       searchQuery.cart = { $in: cart };
//     }

//     // Filter by cart_no if provided
//     if (req.query.cart_no) {
//       const cart = await Cart.distinct("_id", { cart_no: req.query.cart_no });
//       searchQuery.cart = { $in: cart };
//     }

//     // Fetch orders
//     const orders = await CartItem.find(searchQuery)
//       .populate({
//         path: "cart",
//         select: "cart_no user_id total discount grand_total",
//         populate: {
//           path: "user_id",
//           select: "name email mobile_no"
//         }
//       })
//       .populate({
//         path: "item",
//         select: "name description sku price images location"
//       })
//       .skip((page - 1) * size)
//       .limit(Number(size))
//       .lean();

//     // Count total
//     const totalCount = await CartItem.countDocuments(searchQuery);

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Orders",
//       data: orders,
//       page,
//       size,
//       totalCount
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// module.exports = {
//   addToCart,
//   getMyCart,
//   checkout,
//   checkoutMobile,
//   removeItems,
//   cartStatusChange,
//   myOrder,
//   getOrders,
// };
