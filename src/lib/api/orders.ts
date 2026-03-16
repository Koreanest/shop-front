import api from "@/lib/api";
import type {
  OrderCreateRequest,
  OrderListItemResponse,
  OrderResponse,
} from "@/types/order";

export async function createOrder(
  payload: OrderCreateRequest
): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>("/orders", payload);
  return res.data;
}

export async function getMyOrders(): Promise<OrderListItemResponse[]> {
  const res = await api.get<OrderListItemResponse[]>("/orders");
  return res.data;
}

export async function getMyOrderDetail(
  orderId: number | string
): Promise<OrderResponse> {
  const res = await api.get<OrderResponse>(`/orders/${orderId}`);
  return res.data;
}

export async function cancelMyOrder(
  orderId: number | string
): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>(`/orders/${orderId}/cancel`);
  return res.data;
}

export async function payOrder(
  orderId: number | string
): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>(`/orders/${orderId}/pay`);
  return res.data;
}

export async function prepareOrder(
  orderId: number | string
): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>(`/orders/${orderId}/prepare`);
  return res.data;
}

export async function shipOrder(
  orderId: number | string
): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>(`/orders/${orderId}/ship`);
  return res.data;
}

export async function completeOrder(
  orderId: number | string
): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>(`/orders/${orderId}/complete`);
  return res.data;
}