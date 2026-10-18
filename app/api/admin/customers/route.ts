import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { getDbCustomers, getDbOrders } from "@/lib/server/store-db";

export async function GET(request: Request) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const registeredCustomers = getDbCustomers();
  const orders = getDbOrders();

  // Combine registered customers with guest order clients who placed orders
  const customerMap = new Map<string, any>();

  // Add registered customers
  registeredCustomers.forEach((c) => {
    customerMap.set(c.email.toLowerCase(), { ...c });
  });

  // Aggregate stats from real orders
  orders.forEach((o) => {
    if (!o.customer || !o.customer.email) return;
    const email = o.customer.email.toLowerCase();
    const existing = customerMap.get(email);

    if (existing) {
      // If order not yet counted
      if (!existing.calculatedFromOrders) {
        existing.calculatedFromOrders = true;
        // Count all orders for this email
        const userOrders = orders.filter((ord) => ord.customer.email.toLowerCase() === email);
        existing.ordersCount = userOrders.length;
        existing.totalSpend = userOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
      }
    } else {
      // Guest client who ordered
      const userOrders = orders.filter((ord) => ord.customer.email.toLowerCase() === email);
      const totalSpend = userOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);

      customerMap.set(email, {
        id: `guest-${email.replace(/[^a-z0-9]/g, "")}`,
        name: `${o.customer.firstName} ${o.customer.lastName}`,
        email: o.customer.email,
        phone: o.customer.phone,
        registrationDate: o.createdAt,
        ordersCount: userOrders.length,
        totalSpend,
        tier: totalSpend > 800 ? "Grand Connoisseur" : "Client Patron",
      });
    }
  });

  const customers = Array.from(customerMap.values()).map((c) => {
    const { calculatedFromOrders, ...clean } = c;
    return clean;
  });

  return NextResponse.json({
    customers,
    totalCustomers: customers.length,
  });
}
