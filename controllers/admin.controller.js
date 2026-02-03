import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

/*
 * @desc    Get admin dashboard overview stats
 * @route   GET /api/admin/overview
 * @access  Private/Admin
 */
export const getAdminOverview = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true });

    const totalSales = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalSales,
      orders: totalOrders,
      customers: totalCustomers,
      products: totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin overview",
      error: error.message,
    });
  }
};



/*
 * @desc    Get sales analytics (last 6 weeks)
 * @route   GET /api/admin/sales
 * @access  Private/Admin
 */
// export const getSalesAnalytics = async (req, res) => {
//   try {
//     const sales = await Order.aggregate([
//       { $match: { isPaid: true } },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//           },
//           sales: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//       { $limit: 6 },
//     ]);

//     const formatted = sales.map((s) => ({
//       date: s._id,
//       sales: s.sales,
//     }));

//     res.status(200).json(formatted);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch sales analytics",
//       error: error.message,
//     });
//   }
// };

export const getSalesAnalytics = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }, // last 6 months
    ]);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const formatted = sales.map((s) => ({
      date: monthNames[s._id.month - 1],
      sales: s.sales,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sales analytics",
      error: error.message,
    });
  }
};



/*
 * @desc    Get recent orders
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedOrders = orders.map((o) => ({
      _id: o._id,                 // ✅ REQUIRED (routing)
      orderNumber: o.orderNumber, // ✅ display only
      customer: o.user?.name || "Guest",
      total: o.totalPrice,
      status: o.orderStatus,
      isCancelled: o.isCancelled,
      isPaid: o.isPaid,
      isDelivered: o.isDelivered,
      date: o.createdAt.toISOString().split("T")[0],
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


/*
 * @desc    Get top products
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ stock: -1 })
      .limit(5);

    const formattedProducts = products.map((p) => ({
      id: p._id,
      title: p.name,
      stock: p.stock,
      price: p.price,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
